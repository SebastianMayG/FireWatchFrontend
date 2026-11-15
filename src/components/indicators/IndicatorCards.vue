<template>
  <div class="flex flex-col gap-2">
    <!-- De qué área son los datos: el rectángulo seleccionado o México completo -->
    <p class="flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400">
      <i :class="['pi text-[10px]', store.bbox ? 'pi-expand' : 'pi-globe']" />
      {{
        t('indicators.scope', {
          area: t(store.bbox ? 'indicators.scopeArea' : 'indicators.scopeMexico'),
        })
      }}
    </p>
    <!-- Compare: una card debajo de otra (filas: etiqueta a la izquierda, valor a la derecha) -->
    <div v-if="mode === 'compare'" class="flex flex-col gap-2">
      <Card v-for="item in items" :key="item.key" :pt="{ body: { class: 'p-3' } }">
        <template #content>
          <div class="flex items-center justify-between gap-4" :title="item.title">
            <div class="flex min-w-0 items-center gap-2.5">
              <i :class="['pi', item.icon, 'text-base text-primary']" />
              <p class="text-sm text-surface-600 dark:text-surface-300">{{ item.label }}</p>
            </div>
            <Skeleton v-if="loading && !data" height="1.5rem" width="5rem" />
            <div v-else class="shrink-0 text-right">
              <p :class="['text-lg font-semibold', item.tone]">{{ item.value }}</p>
              <p v-if="item.detail" class="text-xs text-surface-500 dark:text-surface-400">
                {{ item.detail }}
              </p>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <div v-else class="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      <Card v-for="item in items" :key="item.key">
        <template #content>
          <div class="flex items-start gap-2.5" :title="item.title">
            <i :class="['pi', item.icon, 'mt-0.5 text-base text-primary']" />
            <div class="min-w-0">
              <p class="text-xs text-surface-500 dark:text-surface-400">{{ item.label }}</p>
              <Skeleton v-if="loading && !data" height="1.5rem" width="5rem" class="mt-1" />
              <template v-else>
                <p :class="['text-lg font-semibold break-words', item.tone]">
                  {{ item.value }}
                </p>
                <!-- Valores comparados, para que se vea de dónde sale el porcentaje -->
                <p v-if="item.detail" class="text-xs text-surface-500 dark:text-surface-400">
                  {{ item.detail }}
                </p>
              </template>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <Message v-if="error" severity="error" size="small" variant="simple">
      {{ t('errors.request', { error }) }}
    </Message>
    <template v-else>
      <Message v-if="lowData" severity="warn" size="small" icon="pi pi-exclamation-triangle">
        {{ lowData }}
      </Message>
      <p v-if="basisNote" class="text-xs text-surface-500 dark:text-surface-400">
        <i class="pi pi-info-circle mr-1 text-[10px]" />{{ basisNote }}
      </p>
      <p v-if="note" class="text-xs text-surface-500 dark:text-surface-400">
        <i class="pi pi-info-circle mr-1 text-[10px]" />{{ note }}
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Message from 'primevue/message'
import Skeleton from 'primevue/skeleton'
import type { Indicators } from '@/api/types'
import { useAnalysisStore } from '@/stores/analysis'

// mode="compare": el año pico es el mayor de los dos comparados y la última card es "vs. {otro año}"
const props = defineProps<{
  data: Indicators | null
  loading?: boolean
  error?: string | null
  mode?: 'dashboard' | 'compare'
  /** Compare: año (o años, si empatan) con mayor actividad entre los dos comparados */
  peakOfTwo?: number[] | null
  /** Compare: año del otro periodo */
  otherYear?: number
  /** Compare: valor de este periodo y del otro en la métrica común (basis) */
  selfValue?: number | null
  otherValue?: number | null
  /** Compare: % de cambio de este periodo respecto del otro (en la métrica común) */
  otherPct?: number | null
  /** Compare: explicación de la métrica común usada */
  basisNote?: string | null
  /** Compare: pocas detecciones, comparación poco confiable */
  lowData?: string | null
}>()
const { t, locale } = useI18n()
const store = useAnalysisStore()

interface Item {
  key: string
  label: string
  icon: string
  value: string | number
  tone?: string
  title?: string
  detail?: string
}

const noData = computed(() => t('common.noData'))
// useGrouping 'always': en español Intl no separa miles en números de 4 cifras ("2024" parecería un año).
// El cast es porque los tipos de TS del proyecto aún no incluyen el valor 'always' (ES2023).
const NUMBER_OPTIONS = {
  maximumFractionDigits: 0,
  useGrouping: 'always',
} as unknown as Intl.NumberFormatOptions
const number = computed(() => new Intl.NumberFormat(locale.value, NUMBER_OPTIONS))
const monthName = computed(() => new Intl.DateTimeFormat(locale.value, { month: 'short' }))

// Periodo de la mediana (años completos), p. ej. 2001-2025
const medianPeriod = computed(() => {
  const years = store.meta?.complete_years ?? []
  return { from: years[0] ?? 2001, to: years[years.length - 1] ?? 2025 }
})

function formatPct(v: number | null | undefined): string {
  if (v === null || v === undefined) return noData.value
  const sign = v > 0 ? '+' : ''
  return `${sign}${new Intl.NumberFormat(locale.value, { maximumFractionDigits: 1 }).format(v)} %`
}

// Más actividad = peor (rojo); menos = verde
function tone(v: number | null | undefined): string {
  if (v === null || v === undefined || v === 0) return ''
  return v > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-700 dark:text-green-400'
}

function detailVs(value: number, ref: number | null | undefined): string | undefined {
  if (ref === null || ref === undefined) return undefined
  return t('indicators.detailVs', {
    value: number.value.format(value),
    ref: number.value.format(ref),
  })
}

const items = computed<Item[]>(() => {
  const d = props.data
  const compare = props.mode === 'compare'
  const months = d?.top_months.length
    ? d.top_months.map((m) => monthName.value.format(new Date(2000, m.month - 1, 1))).join(', ')
    : noData.value
  const peak = compare
    ? props.peakOfTwo?.length
      ? props.peakOfTwo.join(' / ')
      : noData.value
    : (d?.peak_year ?? noData.value)

  const list: Item[] = [
    {
      key: 'hotspots',
      label: t('indicators.hotspots'),
      icon: 'pi-map-marker',
      value: d ? number.value.format(d.detections) : noData.value,
      title: d
        ? t('indicators.activityHint', { value: number.value.format(d.activity) })
        : undefined,
    },
    {
      key: 'peakYear',
      label: t(compare ? 'indicators.peakYearOfTwo' : 'indicators.peakYear'),
      icon: 'pi-calendar',
      value: peak,
    },
    {
      key: 'peakMonths',
      label: t('indicators.peakMonths'),
      icon: 'pi-chart-bar',
      value: months,
    },
    {
      key: 'vsMedian',
      label: t('indicators.vsMedianPeriod', medianPeriod.value),
      icon: 'pi-arrow-right-arrow-left',
      value: formatPct(d?.vs_median_pct),
      tone: tone(d?.vs_median_pct),
      title: t('indicators.activityUnit'),
      detail: d ? detailVs(d.activity, d.median_activity) : undefined,
    },
  ]

  list.push(
    compare
      ? {
          key: 'vsOther',
          label: props.otherYear
            ? t('indicators.vsOtherYear', { year: props.otherYear })
            : t('indicators.vsOther'),
          icon: 'pi-sort-alt',
          value: formatPct(props.otherPct),
          tone: tone(props.otherPct),
          title: props.basisNote ?? t('indicators.activityUnit'),
          detail:
            props.selfValue !== null && props.selfValue !== undefined
              ? detailVs(props.selfValue, props.otherValue)
              : undefined,
        }
      : {
          key: 'yearsAnalyzed',
          label: t('indicators.yearsAnalyzed'),
          icon: 'pi-history',
          value: d?.years_analyzed ?? noData.value,
        },
  )
  return list
})

// Solo se avisa del año parcial (2000); los años 2000-2011 están armonizados y no se marcan
const note = computed(() => (props.data?.partial ? t('indicators.partialNote') : null))
</script>
