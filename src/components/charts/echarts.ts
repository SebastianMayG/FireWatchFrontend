// Registro único de ECharts con solo los módulos que se usan (reduce el tamaño del bundle)
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, HeatmapChart } from 'echarts/charts'
import {
  GridComponent,
  MarkLineComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  HeatmapChart,
  GridComponent,
  MarkLineComponent,
  TooltipComponent,
  VisualMapComponent,
])

// Rampa secuencial YlOrRd (ColorBrewer), la misma del mapa: legible en claro y oscuro (RNF-06)
export const FIRE_RAMP = [
  '#ffffcc',
  '#ffeda0',
  '#fed976',
  '#feb24c',
  '#fd8d3c',
  '#f03b20',
  '#bd0026',
]

/** Colores de texto, ejes y fondos según el tema */
export function chartColors(dark: boolean) {
  return dark
    ? {
        text: '#d4d4d4',
        muted: '#a3a3a3',
        axis: '#404040',
        split: '#262626',
        empty: '#171717',
        highlight: '#ffffff',
      }
    : {
        text: '#334155',
        muted: '#64748b',
        axis: '#cbd5e1',
        split: '#e2e8f0',
        empty: '#f1f5f9',
        highlight: '#0f172a',
      }
}

/** Nombres cortos de los meses en el idioma actual */
export function monthLabels(locale: string): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { month: 'short' })
  return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(2000, i, 1)))
}
