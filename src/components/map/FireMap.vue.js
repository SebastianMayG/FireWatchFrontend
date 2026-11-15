import { computed, onBeforeUnmount, onMounted, ref, toRaw, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import * as maplibregl from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import { useTheme } from '@/composables/useTheme';
import { useAnalysisStore } from '@/stores/analysis';
import { api, isAbort } from '@/api/client';
const { defineProps, defineExpose, } = {};
// Vite pre-empaqueta maplibre-gl y el worker no queda junto a él (404).
// Con ?url Vite sirve el worker en dev y lo copia a dist/ en el build.
maplibregl.setWorkerUrl(workerUrl);
const props = defineProps();
// Mapa base sin API key (OpenFreeMap). Se puede cambiar más adelante.
const STYLES = {
    // Mapa a color (estilo OpenStreetMap) en ambos modos.
    // Alternativas en escala de grises: 'positron' (claro) y 'dark' (oscuro).
    light: 'https://tiles.openfreemap.org/styles/liberty',
    dark: 'https://tiles.openfreemap.org/styles/liberty',
};
const MEXICO_CENTER = [-102, 23.6];
const MEXICO_MAX_BOUNDS = [-125, 8, -78, 38];
const SELECTION_SOURCE = 'selection';
const SELECTION_COLOR = '#142454'; // primary.800 (navy)
const MIN_DRAG_PX = 6; // arrastres más cortos se toman como clic y no crean área
const HOTSPOTS_SOURCE = 'hotspots';
const ZONES_SOURCE = 'recurrent-zones';
const ZONE_COLOR = '#7c3aed'; // violeta: se distingue de la rampa de fuego (amarillo-rojo)
const MOVE_DEBOUNCE_MS = 300;
// Rampa secuencial YlOrRd (ColorBrewer): legible para daltonismo común y sobre mapa claro u oscuro
const RAMP = ['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#f03b20', '#bd0026'];
const rampCss = `linear-gradient(to right, ${RAMP.join(', ')})`;
const zoneSwatch = { borderColor: ZONE_COLOR, background: `${ZONE_COLOR}40` };
const { t, locale } = useI18n();
const { isDark } = useTheme();
const store = useAnalysisStore();
const numberFormat = computed(() => new Intl.NumberFormat(locale.value));
const container = ref();
let map = null;
const selectionActive = computed(() => !!props.selectable && store.isSelecting);
// ---------- Capa del área seleccionada ----------
function selectionData(bbox) {
    if (!bbox)
        return { type: 'FeatureCollection', features: [] };
    const [w, s, e, n] = bbox;
    return {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [w, s],
                            [e, s],
                            [e, n],
                            [w, n],
                            [w, s],
                        ],
                    ],
                },
            },
        ],
    };
}
function fitToBBox(bbox, duration = 600) {
    const [w, s, e, n] = bbox;
    map?.fitBounds([
        [w, s],
        [e, n],
    ], { padding: 48, duration });
}
// ---------- Puntos calientes (del backend) ----------
const EMPTY = { type: 'FeatureCollection', features: [] };
let hotspotsData = EMPTY;
const hotspotMode = ref(null);
const totalInView = ref(null);
const loadingHotspots = ref(false);
const hotspotsError = ref(null);
let hotspotsController = null;
let moveTimer;
/** Convierte la respuesta en puntos para MapLibre; kind decide qué capa los pinta */
function toFeatures(res) {
    if (res.mode === 'points') {
        return {
            type: 'FeatureCollection',
            features: res.points.features.map((f) => ({
                ...f,
                properties: { ...f.properties, kind: 'point' },
            })),
        };
    }
    const max = res.grid.max_count || 1;
    const features = res.grid.cells.map(([lat, lon, count]) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lon, lat] },
        properties: { kind: 'grid', count, w: count / max },
    }));
    return { type: 'FeatureCollection', features };
}
/** Área visible recortada a México (la API no tiene datos fuera) */
function visibleBBox() {
    if (!map)
        return null;
    const b = map.getBounds();
    const [minLon, minLat, maxLon, maxLat] = store.meta?.default_bbox ?? [-118.5, 14, -86, 33.5];
    const r = (v) => Math.round(v * 1000) / 1000;
    const w = Math.max(b.getWest(), minLon);
    const s = Math.max(b.getSouth(), minLat);
    const e = Math.min(b.getEast(), maxLon);
    const n = Math.min(b.getNorth(), maxLat);
    return w < e && s < n ? [r(w), r(s), r(e), r(n)] : null;
}
async function refreshHotspots() {
    if (!map || !store.ready)
        return;
    hotspotsController?.abort();
    const area = visibleBBox();
    if (!area) {
        setHotspots(EMPTY, null, 0);
        return;
    }
    const controller = new AbortController();
    hotspotsController = controller;
    loadingHotspots.value = true;
    hotspotsError.value = null;
    try {
        const res = await api.hotspots(props.year, area, 'low', controller.signal);
        if (hotspotsController === controller)
            setHotspots(toFeatures(res), res.mode, res.total_detections);
    }
    catch (e) {
        if (!isAbort(e) && hotspotsController === controller) {
            hotspotsError.value = e instanceof Error ? e.message : String(e);
        }
    }
    finally {
        if (hotspotsController === controller)
            loadingHotspots.value = false;
    }
}
function setHotspots(data, mode, total) {
    hotspotsData = data;
    hotspotMode.value = mode;
    totalInView.value = total;
    map?.getSource(HOTSPOTS_SOURCE)?.setData(data);
}
function scheduleRefresh() {
    clearTimeout(moveTimer);
    moveTimer = setTimeout(refreshHotspots, MOVE_DEBOUNCE_MS);
}
// ---------- Captura para el PDF ----------
function waitIdle() {
    return new Promise((resolve) => {
        if (!map)
            return resolve();
        map.once('idle', () => resolve());
        map.triggerRepaint();
    });
}
/**
 * Imagen del mapa centrado en el área seleccionada, con sus capas (área, puntos, zonas).
 * Funciona porque el mapa se crea con preserveDrawingBuffer: true.
 */
async function capture() {
    if (!map)
        return null;
    onZoneLeave();
    if (store.bbox) {
        const [w, s, e, n] = store.bbox;
        map.fitBounds([
            [w, s],
            [e, n],
        ], { padding: 32, animate: false });
    }
    // Pedir los puntos de la vista final sin esperar el debounce y dejar que el mapa termine de dibujar
    clearTimeout(moveTimer);
    await waitIdle();
    await refreshHotspots();
    await waitIdle();
    const canvas = map.getCanvas();
    // JPEG: el PDF pesa mucho menos que con PNG y el mapa no tiene transparencias
    return {
        dataUrl: canvas.toDataURL('image/jpeg', 0.92),
        width: canvas.width,
        height: canvas.height,
    };
}
const __VLS_exposed = { capture };
defineExpose(__VLS_exposed);
// ---------- Capas ----------
function rampStops(stops) {
    return stops.flatMap((s, i) => [s, RAMP[i] ?? RAMP[RAMP.length - 1]]);
}
// setStyle() borra las capas propias, por eso se vuelven a agregar en cada 'style.load'
function addDataLayers() {
    if (!map || map.getSource(SELECTION_SOURCE))
        return;
    // Zonas recurrentes (debajo de los puntos)
    map.addSource(ZONES_SOURCE, {
        type: 'geojson',
        data: toRaw(store.recurrentZones.data) ?? EMPTY,
    });
    map.addLayer({
        id: 'zones-fill',
        type: 'fill',
        source: ZONES_SOURCE,
        paint: { 'fill-color': ZONE_COLOR, 'fill-opacity': 0.25 },
    });
    map.addLayer({
        id: 'zones-line',
        type: 'line',
        source: ZONES_SOURCE,
        paint: { 'line-color': ZONE_COLOR, 'line-width': 1.2, 'line-opacity': 0.9 },
    });
    // Puntos calientes: rejilla agregada como heatmap, puntos reales como círculos
    map.addSource(HOTSPOTS_SOURCE, { type: 'geojson', data: hotspotsData });
    map.addLayer({
        id: 'hotspots-heat',
        type: 'heatmap',
        source: HOTSPOTS_SOURCE,
        filter: ['==', ['get', 'kind'], 'grid'],
        paint: {
            'heatmap-weight': ['interpolate', ['linear'], ['get', 'w'], 0, 0.15, 1, 1],
            'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 3, 1, 9, 2.5],
            'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 3, 4, 6, 10, 9, 22],
            'heatmap-opacity': 0.85,
            'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,
                'rgba(255,255,178,0)',
                ...rampStops([0.1, 0.3, 0.5, 0.7, 0.85, 1]),
            ],
        },
    });
    map.addLayer({
        id: 'hotspots-points',
        type: 'circle',
        source: HOTSPOTS_SOURCE,
        filter: ['==', ['get', 'kind'], 'point'],
        paint: {
            'circle-radius': ['interpolate', ['linear'], ['get', 'frp'], 0, 3, 10, 4.5, 50, 7, 200, 10],
            'circle-color': [
                'interpolate',
                ['linear'],
                ['get', 'frp'],
                ...rampStops([0, 3, 8, 20, 50, 150]),
            ],
            'circle-stroke-width': 0.6,
            'circle-stroke-color': '#3f0d12',
            'circle-opacity': 0.9,
        },
    });
    // Área seleccionada (arriba de todo)
    map.addSource(SELECTION_SOURCE, { type: 'geojson', data: selectionData(store.bbox) });
    map.addLayer({
        id: 'selection-fill',
        type: 'fill',
        source: SELECTION_SOURCE,
        paint: { 'fill-color': SELECTION_COLOR, 'fill-opacity': 0.12 },
    });
    map.addLayer({
        id: 'selection-line',
        type: 'line',
        source: SELECTION_SOURCE,
        paint: { 'line-color': SELECTION_COLOR, 'line-width': 2 },
    });
}
// ---------- Tooltip de zonas recurrentes ----------
const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 8 });
let hoveredZone = null;
function renderZonePopup() {
    if (!hoveredZone)
        return;
    const el = document.createElement('div');
    el.className = 'text-sm text-surface-900';
    const title = document.createElement('p');
    title.className = 'font-semibold';
    title.textContent = t('map.recurrentZone');
    const detail = document.createElement('p');
    const period = store.meta?.recurrent_zones.period ?? [2001, 2025];
    detail.textContent = t('map.recurrentZoneYears', {
        n: hoveredZone.years_active_max,
        total: period[1] - period[0] + 1,
    });
    el.append(title, detail);
    popup.setDOMContent(el);
}
function onZoneMove(e) {
    if (!map || selectionActive.value)
        return;
    const feature = e.features?.[0];
    if (!feature)
        return;
    map.getCanvas().style.cursor = 'pointer';
    hoveredZone = feature.properties;
    renderZonePopup();
    popup.setLngLat(e.lngLat).addTo(map);
}
function onZoneLeave() {
    if (!map)
        return;
    if (!selectionActive.value)
        map.getCanvas().style.cursor = '';
    hoveredZone = null;
    popup.remove();
}
watch(locale, renderZonePopup);
// ---------- Dibujo del rectángulo (modo selección) ----------
const draft = ref(null);
let start = null;
function localPoint(e) {
    const rect = container.value.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}
function onPointerDown(e) {
    if (!selectionActive.value || e.button !== 0)
        return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    start = localPoint(e);
    draft.value = { ...start, w: 0, h: 0 };
}
function onPointerMove(e) {
    if (!start)
        return;
    const p = localPoint(e);
    draft.value = {
        x: Math.min(start.x, p.x),
        y: Math.min(start.y, p.y),
        w: Math.abs(p.x - start.x),
        h: Math.abs(p.y - start.y),
    };
}
function onPointerUp() {
    if (!start || !draft.value || !map)
        return;
    const { x, y, w, h } = draft.value;
    start = null;
    draft.value = null;
    if (w < MIN_DRAG_PX || h < MIN_DRAG_PX)
        return;
    // El mapa no rota ni se inclina, así que el rectángulo en pantalla es un rectángulo en lon/lat
    const sw = map.unproject([x, y + h]);
    const ne = map.unproject([x + w, y]);
    const round = (v) => Math.round(v * 10_000) / 10_000;
    store.setBBox([round(sw.lng), round(sw.lat), round(ne.lng), round(ne.lat)]);
    store.isSelecting = false;
}
function onKeyDown(e) {
    if (e.key === 'Escape' && selectionActive.value) {
        start = null;
        draft.value = null;
        store.isSelecting = false;
    }
}
// Al entrar al modo selección se pausa el pan/zoom con gestos; al salir se restaura
watch(selectionActive, (active) => {
    if (!map)
        return;
    const handlers = [map.dragPan, map.touchZoomRotate, map.doubleClickZoom, map.boxZoom];
    handlers.forEach((h) => (active ? h.disable() : h.enable()));
    map.getCanvasContainer().style.cursor = active ? 'crosshair' : '';
    if (active)
        onZoneLeave();
});
// ---------- Ciclo de vida ----------
onMounted(() => {
    if (!container.value)
        return;
    map = new maplibregl.Map({
        container: container.value,
        style: isDark.value ? STYLES.dark : STYLES.light,
        center: MEXICO_CENTER,
        zoom: 4.3,
        maxBounds: MEXICO_MAX_BOUNDS,
        // Sin rotación ni inclinación: el área seleccionada siempre es un bbox rectangular
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        maxPitch: 0,
        // Necesario para capturar el canvas en el PDF
        canvasContextAttributes: { preserveDrawingBuffer: true },
    });
    map.touchZoomRotate.disableRotation();
    map.keyboard.disableRotation();
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');
    map.on('style.load', addDataLayers);
    map.once('load', () => {
        // Si ya hay un área (p. ej. al entrar a Compare), centrar el mapa en ella
        if (store.bbox)
            fitToBBox(store.bbox, 0);
        refreshHotspots();
    });
    map.on('moveend', scheduleRefresh);
    map.on('mousemove', 'zones-fill', onZoneMove);
    map.on('mouseleave', 'zones-fill', onZoneLeave);
    const canvas = map.getCanvasContainer();
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('keydown', onKeyDown);
});
watch(() => store.bbox, (bbox) => {
    const source = map?.getSource(SELECTION_SOURCE);
    source?.setData(selectionData(bbox));
    if (bbox)
        fitToBBox(bbox);
});
// Nuevo año o metadatos listos -> volver a pedir los puntos
watch([() => props.year, () => store.ready], () => {
    if (map?.loaded())
        refreshHotspots();
});
watch(() => store.recurrentZones.data, (data) => {
    map
        ?.getSource(ZONES_SOURCE)
        ?.setData(toRaw(data) ?? EMPTY);
});
// diff: false fuerza una recarga completa, así 'style.load' vuelve a agregar las capas propias
watch(isDark, (dark) => map?.setStyle(dark ? STYLES.dark : STYLES.light, { diff: false }));
onBeforeUnmount(() => {
    clearTimeout(moveTimer);
    hotspotsController?.abort();
    popup.remove();
    window.removeEventListener('keydown', onKeyDown);
    if (props.selectable)
        store.isSelecting = false;
    map?.remove();
    map = null;
});
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
void __VLS_ctx, __VLS_components, __VLS_intrinsics, __VLS_directives;
const __VLS_template = () => {
    __VLS_withDotValue(draft, {});
    __VLS_withDotValue(selectionActive, {});
    __VLS_withDotValue(hotspotMode, {});
    __VLS_withDotValue(RAMP, {});
    __VLS_withDotValue(loadingHotspots, {});
    __VLS_withDotValue(hotspotsError, {});
    __VLS_withDotValue(totalInView, {});
    __VLS_withDotValue(numberFormat, {});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "relative h-full w-full overflow-hidden rounded-lg" },
    });
    /** @type {__VLS_StyleScopedClasses['relative']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div)({
        ref: "container",
        ...{ class: "h-full w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    if (draft.value) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div)({
            ...{ class: "pointer-events-none absolute z-10 border-2 border-primary bg-primary/20" },
            ...{ style: ({
                    left: `${draft.value.x}px`,
                    top: `${draft.value.y}px`,
                    width: `${draft.value.w}px`,
                    height: `${draft.value.h}px`,
                }) },
        });
        /** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
        /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
        /** @type {__VLS_StyleScopedClasses['z-10']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-primary']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-primary/20']} */ ;
    }
    if (selectionActive.value) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-md bg-surface-900/85 px-3 py-1.5 text-center text-sm text-surface-0" },
        });
        /** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
        /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
        /** @type {__VLS_StyleScopedClasses['bottom-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['left-1/2']} */ ;
        /** @type {__VLS_StyleScopedClasses['z-10']} */ ;
        /** @type {__VLS_StyleScopedClasses['-translate-x-1/2']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
        /** @type {__VLS_StyleScopedClasses['bg-surface-900/85']} */ ;
        /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-surface-0']} */ ;
        (__VLS_unwrap(t, {})('map.selectAreaHint'));
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "absolute top-3 right-3 z-10" },
    });
    /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
    /** @type {__VLS_StyleScopedClasses['top-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['right-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['z-10']} */ ;
    var __VLS_0 = {};
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "pointer-events-none absolute bottom-2 left-2 z-10 flex max-w-[calc(100%-1rem)] flex-col gap-1 rounded-md bg-surface-0/90 px-2.5 py-2 text-xs shadow-md backdrop-blur sm:max-w-xs dark:bg-surface-900/90" },
    });
    /** @type {__VLS_StyleScopedClasses['pointer-events-none']} */ ;
    /** @type {__VLS_StyleScopedClasses['absolute']} */ ;
    /** @type {__VLS_StyleScopedClasses['bottom-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['left-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['z-10']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['max-w-[calc(100%-1rem)]']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-surface-0/90']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-2.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
    /** @type {__VLS_StyleScopedClasses['backdrop-blur']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:max-w-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-surface-900/90']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex items-center gap-2" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
        ...{ class: "inline-block h-3 w-4 shrink-0 rounded-sm border-2" },
        ...{ style: (__VLS_unwrap(zoneSwatch, {})) },
    });
    /** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
    /** @type {__VLS_StyleScopedClasses['h-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-sm']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_unwrap(t, {})('map.legend.recurrent'));
    if (hotspotMode.value === 'grid') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex items-center gap-2" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
            ...{ class: "inline-block h-3 w-10 shrink-0 rounded-sm" },
            ...{ style: ({ background: __VLS_unwrap(rampCss, {}) }) },
        });
        /** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-10']} */ ;
        /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-sm']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_unwrap(t, {})('map.legend.density'));
    }
    else if (hotspotMode.value === 'points') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex items-center gap-2" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "flex shrink-0 items-end gap-0.5" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-end']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-0.5']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
            ...{ class: "inline-block h-1.5 w-1.5 rounded-full" },
            ...{ style: ({ background: RAMP.value[1] }) },
        });
        /** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-1.5']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-1.5']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
            ...{ class: "inline-block h-2.5 w-2.5 rounded-full" },
            ...{ style: ({ background: RAMP.value[3] }) },
        });
        /** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-2.5']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-2.5']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
            ...{ class: "inline-block h-3.5 w-3.5 rounded-full" },
            ...{ style: ({ background: RAMP.value[5] }) },
        });
        /** @type {__VLS_StyleScopedClasses['inline-block']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-3.5']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-3.5']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_unwrap(t, {})('map.legend.points'));
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-surface-500 dark:text-surface-400" },
    });
    /** @type {__VLS_StyleScopedClasses['text-surface-500']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:text-surface-400']} */ ;
    if (loadingHotspots.value) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
            ...{ class: "pi pi-spin pi-spinner mr-1 text-[10px]" },
        });
        /** @type {__VLS_StyleScopedClasses['pi']} */ ;
        /** @type {__VLS_StyleScopedClasses['pi-spin']} */ ;
        /** @type {__VLS_StyleScopedClasses['pi-spinner']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
        (__VLS_unwrap(t, {})('map.loadingHotspots'));
    }
    else if (hotspotsError.value) {
        (__VLS_unwrap(t, {})('errors.request', { error: hotspotsError.value }));
    }
    else if (totalInView.value !== null) {
        (__VLS_unwrap(t, {})('map.detectionsInView', { n: numberFormat.value.format(totalInView.value) }));
        (__VLS_ctx.year);
    }
    var __VLS_1 = __VLS_0;
    // @ts-ignore
    [draft, draft, draft, draft, draft, selectionActive, t, t, t, t, t, t, t, zoneSwatch, hotspotMode, hotspotMode, rampCss, RAMP, RAMP, RAMP, loadingHotspots, hotspotsError, hotspotsError, totalInView, totalInView, numberFormat, year,];
    return {
        __VLS_Slots: {},
    };
};
void [__VLS_template, {}];
const __VLS_base = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeProps: {},
});
const __VLS_export = {};
export default {};
