<template>
  <div>
    <Message v-if="error" severity="error" size="small" variant="simple">
      {{ t('errors.request', { error }) }}
    </Message>
    <Skeleton v-else-if="!calendar" height="30rem" />
    <template v-else>
      <!-- La altura va en el contenedor: vue-echarts inyecta `x-vue-echarts { height: 100% }`
           fuera de capa y eso gana a las clases de Tailwind (que van en @layer utilities) -->
      <div class="h-[30rem] w-full">
        <VChart :option="option" :loading="loading" autoresize />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import VChart from 'vue-echarts'
import Message from 'primevue/message'
import Skeleton from 'primevue/skeleton'
import type { Calendar } from '@/api/types'
import { useTheme } from '@/composables/useTheme'
import { FIRE_RAMP, chartColors, monthLabels } from './echarts'

const props = defineProps<{
  calendar: Calendar | null
  /** Año resaltado */
  year: number
  loading?: boolean
  error?: string | null
}>()

const { t, locale } = useI18n()
const { isDark } = useTheme()

const option = computed(() => {
  const cal = props.calendar
  if (!cal) return {}
  const c = chartColors(isDark.value)
  const months = monthLabels(locale.value)
  const number = new Intl.NumberFormat(locale.value, { maximumFractionDigits: 0 })

  // Celdas en cero no se pintan (queda el fondo), así se distingue "sin fuego" de "poco fuego"
  const data = cal.years.flatMap((year, yi) =>
    (cal.values[yi] ?? []).map((v, mi) => ({
      value: [mi, yi, v > 0 ? v : null],
      itemStyle:
        year === props.year ? { borderColor: c.highlight, borderWidth: 1.5 } : { borderWidth: 0 },
    })),
  )

  return {
    backgroundColor: 'transparent',
    textStyle: { color: c.text },
    grid: { top: 8, right: 12, bottom: 56, left: 56 },
    tooltip: {
      formatter: (p: { value: [number, number, number | null] }) => {
        const [mi, yi, v] = p.value
        const year = cal.years[yi] ?? 0
        return `${months[mi]} ${year}<br/>${t('charts.activity')}: <b>${number.format(v ?? 0)}</b>`
      },
    },
    xAxis: {
      type: 'category',
      data: months,
      splitArea: { show: true, areaStyle: { color: [c.empty, c.empty] } },
      axisLine: { lineStyle: { color: c.axis } },
      axisLabel: { color: c.muted },
    },
    yAxis: {
      type: 'category',
      data: cal.years,
      inverse: true, // el año más antiguo arriba
      splitArea: { show: true, areaStyle: { color: [c.empty, c.empty] } },
      axisLine: { lineStyle: { color: c.axis } },
      axisLabel: {
        color: c.muted,
        formatter: (y: string) => (Number(y) === props.year ? `{sel|${y}}` : y),
        rich: { sel: { fontWeight: 'bold', color: c.highlight } },
      },
    },
    visualMap: {
      min: 0,
      max: Math.max(cal.max, 1),
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      itemWidth: 12,
      itemHeight: 160,
      calculable: false,
      text: ['', ''],
      textStyle: { color: c.muted },
      formatter: (v: number) => number.format(v),
      inRange: { color: FIRE_RAMP },
    },
    series: [
      {
        type: 'heatmap',
        data,
        emphasis: { itemStyle: { borderColor: c.highlight, borderWidth: 1 } },
      },
    ],
  }
})
</script>
