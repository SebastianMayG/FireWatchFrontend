import { computed, ref, shallowReactive, shallowRef, watch } from 'vue'
import { defineStore } from 'pinia'
import { api, isAbort } from '@/api/client'
import type { BBox, Calendar, Compare, Indicators, Meta, RecurrentZones, Trend } from '@/api/types'

export type { BBox } from '@/api/types'

/**
 * Datos que vienen del backend con su estado de carga.
 * run() cancela la petición anterior, así una respuesta vieja nunca pisa a una nueva.
 * shallowReactive: los datos (GeoJSON grandes) no se convierten en proxies profundos.
 */
function createResource<T>() {
  let controller: AbortController | null = null
  const state = shallowReactive({
    data: null as T | null,
    loading: false,
    error: null as string | null,
    async run(fetcher: (signal: AbortSignal) => Promise<T>) {
      controller?.abort()
      const current = new AbortController()
      controller = current
      state.loading = true
      state.error = null
      try {
        const result = await fetcher(current.signal)
        if (controller === current) state.data = result
      } catch (e) {
        if (!isAbort(e) && controller === current) {
          state.error = e instanceof Error ? e.message : String(e)
        }
      } finally {
        if (controller === current) state.loading = false
      }
    },
    clear() {
      controller?.abort()
      controller = null
      state.data = null
      state.loading = false
      state.error = null
    },
  })
  return state
}

export const useAnalysisStore = defineStore('analysis', () => {
  // ---------- Metadatos (años disponibles, etc.) ----------
  const meta = shallowRef<Meta | null>(null)
  const metaError = ref<string | null>(null)
  const metaLoading = ref(false)
  const ready = computed(() => meta.value !== null)

  // Años de más reciente a más antiguo, para el selector
  const availableYears = computed(() => [...(meta.value?.years ?? [])].sort((a, b) => b - a))

  // Se reemplazan por los valores del backend en loadMeta()
  const selectedYear = ref<number>(new Date().getFullYear() - 1)
  const compareYear = ref<number>(new Date().getFullYear() - 2)

  async function loadMeta() {
    metaLoading.value = true
    metaError.value = null
    try {
      const m = await api.meta()
      // Por defecto: año más reciente disponible (RF-07)
      selectedYear.value = m.default_year
      compareYear.value = m.years.includes(m.default_year - 1) ? m.default_year - 1 : m.default_year
      meta.value = m
      void recurrentZones.run((signal) => api.recurrentZones(signal))
    } catch (e) {
      metaError.value = e instanceof Error ? e.message : String(e)
    } finally {
      metaLoading.value = false
    }
  }

  function isEstimated(year: number) {
    return meta.value?.estimated_years.includes(year) ?? false
  }

  // ---------- Área seleccionada (la comparten Dashboard y Compare) ----------
  const bbox = ref<BBox | null>(null)

  // Modo "Seleccionar área": mientras está activo, arrastrar dibuja un rectángulo en vez de mover el mapa
  const isSelecting = ref(false)

  function setBBox(value: BBox | null) {
    bbox.value = value
  }

  // ---------- Datos de análisis ----------
  const indicators = createResource<Indicators>()
  const calendar = createResource<Calendar>()
  const trend = createResource<Trend>()
  const compare = createResource<Compare>()
  const recurrentZones = createResource<RecurrentZones>()

  // CompareView lo activa mientras está abierta, para no pedir /compare desde el Dashboard
  const compareActive = ref(false)

  // Indicadores: siempre (sin área = México completo)
  watch(
    [ready, bbox, selectedYear],
    () => {
      if (!ready.value) return
      void indicators.run((signal) => api.indicators(selectedYear.value, bbox.value, signal))
    },
    { immediate: true },
  )

  // Calendario y tendencia: solo cuando hay un área seleccionada
  watch(
    [ready, bbox],
    () => {
      if (!ready.value) return
      if (!bbox.value) {
        calendar.clear()
        trend.clear()
        return
      }
      const area = bbox.value
      void calendar.run((signal) => api.calendar(area, signal))
      void trend.run((signal) => api.trend(area, signal))
    },
    { immediate: true },
  )

  // Comparación: solo con la vista Compare abierta
  watch(
    [ready, compareActive, bbox, selectedYear, compareYear],
    () => {
      if (!ready.value || !compareActive.value) return
      void compare.run((signal) =>
        api.compare(selectedYear.value, compareYear.value, bbox.value, signal),
      )
    },
    { immediate: true },
  )

  return {
    meta,
    metaError,
    metaLoading,
    ready,
    loadMeta,
    isEstimated,
    availableYears,
    selectedYear,
    compareYear,
    bbox,
    isSelecting,
    setBBox,
    indicators,
    calendar,
    trend,
    compare,
    compareActive,
    recurrentZones,
  }
})
