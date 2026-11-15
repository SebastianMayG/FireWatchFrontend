<template>
  <div class="relative h-full w-full overflow-hidden rounded-lg">
    <div ref="container" class="h-full w-full" />

    <!-- Rectángulo que se dibuja mientras el usuario arrastra -->
    <div
      v-if="draft"
      class="pointer-events-none absolute z-10 border-2 border-primary bg-primary/20"
      :style="{
        left: `${draft.x}px`,
        top: `${draft.y}px`,
        width: `${draft.w}px`,
        height: `${draft.h}px`,
      }"
    />

    <!-- Aviso mientras el modo selección está activo -->
    <div
      v-if="selectionActive"
      class="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-md bg-surface-900/85 px-3 py-1.5 text-center text-sm text-surface-0"
    >
      {{ t('map.selectAreaHint') }}
    </div>

    <!-- Controles (año, Compare, CSV, PDF) alineados a la derecha sobre el mapa -->
    <div class="absolute top-3 right-3 z-10">
      <slot name="controls" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import * as maplibregl from 'maplibre-gl'
import type { FeatureCollection } from 'geojson'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import { useTheme } from '@/composables/useTheme'
import { useAnalysisStore, type BBox } from '@/stores/analysis'

// Vite pre-empaqueta maplibre-gl y el worker no queda junto a él (404).
// Con ?url Vite sirve el worker en dev y lo copia a dist/ en el build.
maplibregl.setWorkerUrl(workerUrl)

// selectable: este mapa permite dibujar el área (Dashboard). En Compare solo muestra la que ya existe.
const props = defineProps<{ selectable?: boolean }>()

// Mapa base sin API key (OpenFreeMap). Se puede cambiar más adelante.
const STYLES = {
  // Mapa a color (estilo OpenStreetMap) en ambos modos.
  // Alternativas en escala de grises: 'positron' (claro) y 'dark' (oscuro).
  light: 'https://tiles.openfreemap.org/styles/liberty',
  dark: 'https://tiles.openfreemap.org/styles/liberty',
}

const MEXICO_CENTER: [number, number] = [-102, 23.6]
const MEXICO_MAX_BOUNDS: [number, number, number, number] = [-125, 8, -78, 38]

const SELECTION_SOURCE = 'selection'
const SELECTION_COLOR = '#142454' // primary.800 (navy)
const MIN_DRAG_PX = 6 // arrastres más cortos se toman como clic y no crean área

const { t } = useI18n()
const { isDark } = useTheme()
const store = useAnalysisStore()

const container = ref<HTMLDivElement>()
let map: maplibregl.Map | null = null

const selectionActive = computed(() => !!props.selectable && store.isSelecting)

// ---------- Capa del área seleccionada ----------

function selectionData(bbox: BBox | null): FeatureCollection {
  if (!bbox) return { type: 'FeatureCollection', features: [] }
  const [w, s, e, n] = bbox
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
  }
}

// setStyle() borra las capas propias, por eso se vuelven a agregar en cada 'style.load'
function addSelectionLayer() {
  if (!map || map.getSource(SELECTION_SOURCE)) return
  map.addSource(SELECTION_SOURCE, { type: 'geojson', data: selectionData(store.bbox) })
  map.addLayer({
    id: 'selection-fill',
    type: 'fill',
    source: SELECTION_SOURCE,
    paint: { 'fill-color': SELECTION_COLOR, 'fill-opacity': 0.12 },
  })
  map.addLayer({
    id: 'selection-line',
    type: 'line',
    source: SELECTION_SOURCE,
    paint: { 'line-color': SELECTION_COLOR, 'line-width': 2 },
  })
}

function fitToBBox(bbox: BBox, duration = 600) {
  const [w, s, e, n] = bbox
  map?.fitBounds(
    [
      [w, s],
      [e, n],
    ],
    { padding: 48, duration },
  )
}

// ---------- Dibujo del rectángulo (modo selección) ----------

const draft = ref<{ x: number; y: number; w: number; h: number } | null>(null)
let start: { x: number; y: number } | null = null

function localPoint(e: PointerEvent): { x: number; y: number } {
  const rect = container.value!.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

function onPointerDown(e: PointerEvent) {
  if (!selectionActive.value || e.button !== 0) return
  e.preventDefault()
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  start = localPoint(e)
  draft.value = { ...start, w: 0, h: 0 }
}

function onPointerMove(e: PointerEvent) {
  if (!start) return
  const p = localPoint(e)
  draft.value = {
    x: Math.min(start.x, p.x),
    y: Math.min(start.y, p.y),
    w: Math.abs(p.x - start.x),
    h: Math.abs(p.y - start.y),
  }
}

function onPointerUp() {
  if (!start || !draft.value || !map) return
  const { x, y, w, h } = draft.value
  start = null
  draft.value = null
  if (w < MIN_DRAG_PX || h < MIN_DRAG_PX) return

  // El mapa no rota ni se inclina, así que el rectángulo en pantalla es un rectángulo en lon/lat
  const sw = map.unproject([x, y + h])
  const ne = map.unproject([x + w, y])
  const round = (v: number) => Math.round(v * 10_000) / 10_000
  store.setBBox([round(sw.lng), round(sw.lat), round(ne.lng), round(ne.lat)])
  store.isSelecting = false
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && selectionActive.value) {
    start = null
    draft.value = null
    store.isSelecting = false
  }
}

// Al entrar al modo selección se pausa el pan/zoom con gestos; al salir se restaura
watch(selectionActive, (active) => {
  if (!map) return
  const handlers = [map.dragPan, map.touchZoomRotate, map.doubleClickZoom, map.boxZoom]
  handlers.forEach((h) => (active ? h.disable() : h.enable()))
  map.getCanvasContainer().style.cursor = active ? 'crosshair' : ''
})

// ---------- Ciclo de vida ----------

onMounted(() => {
  if (!container.value) return
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
  })
  map.touchZoomRotate.disableRotation()
  map.keyboard.disableRotation()
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left')

  map.on('style.load', addSelectionLayer)
  // Si ya hay un área (p. ej. al entrar a Compare), centrar el mapa en ella
  map.once('load', () => store.bbox && fitToBBox(store.bbox, 0))

  const canvas = map.getCanvasContainer()
  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointercancel', onPointerUp)
  window.addEventListener('keydown', onKeyDown)

  // TODO: capa de puntos calientes (GeoJSON del backend)
  // TODO: capa de zonas recurrentes (polígonos) con tooltip t('map.recurrentZone')
})

watch(
  () => store.bbox,
  (bbox) => {
    const source = map?.getSource<maplibregl.GeoJSONSource>(SELECTION_SOURCE)
    source?.setData(selectionData(bbox))
    if (bbox) fitToBBox(bbox)
  },
)

watch(isDark, (dark) => map?.setStyle(dark ? STYLES.dark : STYLES.light))

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  if (props.selectable) store.isSelecting = false
  map?.remove()
  map = null
})
</script>
