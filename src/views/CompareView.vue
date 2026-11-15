<template>
  <div class="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
    <div>
      <Button
        as="router-link"
        to="/"
        :label="t('map.exitCompare')"
        icon="pi pi-arrow-left"
        text
        size="small"
      />
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <section v-for="side in sides" :key="side.key" class="flex flex-col gap-4">
        <h2 class="text-lg font-semibold">{{ t(side.label) }}</h2>
        <div class="h-[50vh] min-h-[350px]">
          <!-- Ambos mapas usan el mismo store.bbox; solo cambia el año -->
          <FireMap :year="store[side.yearKey]">
            <template #controls>
              <MapControls
                :model-value="store[side.yearKey]"
                hide-actions
                @update:model-value="(y: number) => (store[side.yearKey] = y)"
              />
            </template>
          </FireMap>
        </div>
        <ChartCard :title="t('charts.calendar')" :hint="t('charts.calendarHint')">
          <CalendarHeatmap
            v-if="store.bbox"
            :calendar="store.calendar.data"
            :year="store[side.yearKey]"
            :loading="store.calendar.loading"
            :error="store.calendar.error"
          />
          <!-- En Compare no se dibuja el área: se elige en el panel principal -->
          <ChartPlaceholder v-else :text="t('charts.selectAreaInDashboard')" icon="pi-th-large">
            <Button
              as="router-link"
              to="/"
              :label="t('charts.goToDashboard')"
              icon="pi pi-arrow-left"
              size="small"
              severity="secondary"
            />
          </ChartPlaceholder>
        </ChartCard>
        <IndicatorCards
          mode="compare"
          :data="side.indicators.value"
          :peak-of-two="peakOfTwo"
          :other-year="side.other.value?.year"
          :self-value="side.selfValue.value"
          :other-value="side.otherValue.value"
          :other-pct="side.otherPct.value"
          :basis-note="basisNote"
          :low-data="lowData"
          :loading="store.compare.loading"
          :error="store.compare.error"
        />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import FireMap from '@/components/map/FireMap.vue'
import MapControls from '@/components/map/MapControls.vue'
import IndicatorCards from '@/components/indicators/IndicatorCards.vue'
import ChartCard from '@/components/charts/ChartCard.vue'
import ChartPlaceholder from '@/components/charts/ChartPlaceholder.vue'
import CalendarHeatmap from '@/components/charts/CalendarHeatmap.vue'
import { useAnalysisStore } from '@/stores/analysis'

const { t } = useI18n()
const store = useAnalysisStore()

// /compare solo se pide mientras esta vista está abierta
onMounted(() => (store.compareActive = true))
onBeforeUnmount(() => (store.compareActive = false))

// La comparación entre los dos años usa la métrica común que calcula el backend (basis):
// si algún año es anterior a 2012 no se usa la actividad escalada, para que el factor
// de calibración no decida cuál año "tuvo más" fuego.
const basis = computed(() => store.compare.data?.basis ?? null)

// Año con mayor actividad entre los dos comparados (si empatan, ambos)
const peakOfTwo = computed<number[] | null>(() => basis.value?.peak_years ?? null)

const basisNote = computed(() => {
  const b = basis.value
  if (!b || b.metric === 'activity') return null
  return t(`indicators.basis.${b.metric}`)
})

const lowData = computed(() => {
  const b = basis.value
  return b?.low_data ? t('indicators.lowData', { n: b.low_data_threshold }) : null
})

const sides = [
  {
    key: 'main',
    label: 'map.mainPeriod',
    yearKey: 'selectedYear',
    indicators: computed(() => store.compare.data?.a ?? null),
    other: computed(() => store.compare.data?.b ?? null),
    selfValue: computed(() => basis.value?.a ?? null),
    otherValue: computed(() => basis.value?.b ?? null),
    otherPct: computed(() => basis.value?.pct_a_vs_b ?? null),
  },
  {
    key: 'compare',
    label: 'map.comparePeriod',
    yearKey: 'compareYear',
    indicators: computed(() => store.compare.data?.b ?? null),
    other: computed(() => store.compare.data?.a ?? null),
    selfValue: computed(() => basis.value?.b ?? null),
    otherValue: computed(() => basis.value?.a ?? null),
    otherPct: computed(() => basis.value?.pct_b_vs_a ?? null),
  },
] as const
</script>
