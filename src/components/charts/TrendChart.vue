<template>
  <div>
    <Message v-if="error" severity="error" size="small" variant="simple">
      {{ t('errors.request', { error }) }}
    </Message>
    <Skeleton v-else-if="!trend" height="30rem" />
    <template v-else>
      <!-- La altura va en el contenedor (ver CalendarHeatmap.vue) -->
      <div class="h-[30rem] w-full">
        <VChart :option="option" :loading="loading" autoresize />
      </div>
      <div
        class="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-surface-500 dark:text-surface-400"
      >
        <span class="flex items-center gap-1.5">
          <span class="inline-block h-2.5 w-2.5 rounded-sm" :style="{ background: BAR }" />
          {{ t('charts.activity') }}
        </span>
        <span class="flex items-center gap-1.5">
          <span class="inline-block h-2.5 w-2.5 rounded-sm" :style="{ background: BAR_SELECTED }" />
          {{ t('charts.selected') }}
        </span>
        <span class="flex items-center gap-1.5">
          <span class="inline-block h-0 w-4 border-t-2 border-dashed border-surface-400" />
          {{ t('charts.median') }}
        </span>
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
import type { Trend } from '@/api/types'
import { useTheme } from '@/composables/useTheme'
import { chartColors } from './echarts'

const props = defineProps<{
  trend: Trend | null
  /** Año resaltado */
  year: number
  loading?: boolean
  error?: string | null
}>()

// Barras en naranja, año seleccionado en rojo oscuro
const BAR = '#fd8d3c'
const BAR_SELECTED = '#bd0026'

const { t, locale } = useI18n()
const { isDark } = useTheme()

const option = computed(() => {
  const tr = props.trend
  if (!tr) return {}
  const c = chartColors(isDark.value)
  const number = new Intl.NumberFormat(locale.value, { maximumFractionDigits: 0 })
  const byYear = new Map(tr.series.map((p) => [p.year, p]))

  return {
    backgroundColor: 'transparent',
    textStyle: { color: c.text },
    grid: { top: 24, right: 12, bottom: 32, left: 64 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: { name: string }[]) => {
        const p = byYear.get(Number(params[0]?.name))
        if (!p) return ''
        const peak = p.year === tr.peak_year ? ` (${t('charts.peak')})` : ''
        return [
          `<b>${p.year}</b>${peak}`,
          `${t('charts.activity')}: <b>${number.format(p.activity)}</b>`,
          `${t('charts.detections')}: ${number.format(p.detections)}`,
        ].join('<br/>')
      },
    },
    xAxis: {
      type: 'category',
      data: tr.series.map((p) => String(p.year)),
      axisLine: { lineStyle: { color: c.axis } },
      axisLabel: {
        color: c.muted,
        formatter: (y: string) => (Number(y) === props.year ? `{sel|${y}}` : y),
        rich: { sel: { fontWeight: 'bold', color: c.highlight } },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: c.muted, formatter: (v: number) => number.format(v) },
      splitLine: { lineStyle: { color: c.split } },
    },
    series: [
      {
        type: 'bar',
        name: t('charts.activity'),
        barMaxWidth: 28,
        data: tr.series.map((p) => ({
          value: p.activity,
          itemStyle: {
            color: p.year === props.year ? BAR_SELECTED : BAR,
            borderRadius: [3, 3, 0, 0],
          },
        })),
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { color: c.muted, type: 'dashed', width: 1.5 },
          label: {
            color: c.muted,
            formatter: () => `${t('charts.median')}: ${number.format(tr.median_activity)}`,
            position: 'insideEndTop',
          },
          data: [{ yAxis: tr.median_activity }],
        },
      },
    ],
  }
})
</script>
