import { ref } from 'vue'
import { defineStore } from 'pinia'

/** [minLon, minLat, maxLon, maxLat] — así se enviará el área al backend */
export type BBox = [number, number, number, number]

export const useAnalysisStore = defineStore('analysis', () => {
  // TODO(backend): reemplazar por GET /years (años disponibles en el dataset)
  const currentYear = new Date().getFullYear()
  const availableYears = ref<number[]>(
    Array.from({ length: currentYear - 2000 + 1 }, (_, i) => currentYear - i),
  )

  // Por defecto: año más reciente disponible (RF-07)
  const selectedYear = ref<number>(availableYears.value[0] ?? currentYear)
  const compareYear = ref<number>(availableYears.value[1] ?? currentYear - 1)

  // Área seleccionada en el mapa; la comparten Dashboard y Compare
  const bbox = ref<BBox | null>(null)

  // Modo "Seleccionar área": mientras está activo, arrastrar dibuja un rectángulo en vez de mover el mapa
  const isSelecting = ref(false)

  function setBBox(value: BBox | null) {
    bbox.value = value
    // TODO(backend): al cambiar el área, pedir indicadores, calendario y tendencia
  }

  return { availableYears, selectedYear, compareYear, bbox, isSelecting, setBBox }
})
