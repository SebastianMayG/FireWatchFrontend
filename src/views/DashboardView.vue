<template>
  <div class="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
    <section ref="mapSection" class="h-[60vh] min-h-[360px] sm:min-h-[400px]">
      <FireMap ref="fireMap" selectable :year="store.selectedYear">
        <template #controls>
          <MapControls
            v-model="store.selectedYear"
            :pdf-ready="pdfReady"
            :pdf-loading="report.loading.value"
            @pdf="downloadPdf"
          />
        </template>
      </FireMap>
    </section>

    <Message v-if="report.error.value" severity="error" closable @close="report.error.value = null">
      {{ t('pdf.error', { error: report.error.value }) }}
    </Message>

    <!-- Sin área seleccionada los indicadores son de México completo -->
    <IndicatorCards
      :data="store.indicators.data"
      :loading="store.indicators.loading"
      :error="store.indicators.error"
    />

    <!-- Calendario y tendencia se calculan para el área seleccionada; sin área se explica cómo obtenerlos -->
    <section class="grid gap-4 lg:grid-cols-2">
      <ChartCard :title="t('charts.calendar')" :hint="t('charts.calendarHint')">
        <CalendarHeatmap
          v-if="store.bbox"
          :calendar="store.calendar.data"
          :year="store.selectedYear"
          :loading="store.calendar.loading"
          :error="store.calendar.error"
        />
        <ChartPlaceholder v-else :text="t('charts.selectAreaToSee')" icon="pi-th-large">
          <Button
            :label="t('map.selectArea')"
            icon="pi pi-expand"
            size="small"
            @click="startSelection"
          />
        </ChartPlaceholder>
      </ChartCard>
      <ChartCard :title="t('charts.trend')" :hint="t('charts.trendHint')">
        <TrendChart
          v-if="store.bbox"
          :trend="store.trend.data"
          :year="store.selectedYear"
          :loading="store.trend.loading"
          :error="store.trend.error"
        />
        <ChartPlaceholder v-else :text="t('charts.selectAreaToSeeTrend')" icon="pi-chart-bar">
          <Button
            :label="t('map.selectArea')"
            icon="pi pi-expand"
            size="small"
            @click="startSelection"
          />
        </ChartPlaceholder>
      </ChartCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Message from 'primevue/message'
import FireMap from '@/components/map/FireMap.vue'
import MapControls from '@/components/map/MapControls.vue'
import IndicatorCards from '@/components/indicators/IndicatorCards.vue'
import ChartCard from '@/components/charts/ChartCard.vue'
import ChartPlaceholder from '@/components/charts/ChartPlaceholder.vue'
import CalendarHeatmap from '@/components/charts/CalendarHeatmap.vue'
import TrendChart from '@/components/charts/TrendChart.vue'
import { useAnalysisStore } from '@/stores/analysis'
import { useReport } from '@/composables/useReport'

const { t } = useI18n()
const store = useAnalysisStore()
const mapSection = ref<HTMLElement>()
const fireMap = ref<InstanceType<typeof FireMap>>()
const report = useReport()

// El PDF usa los datos ya cargados en el store (no hace consultas extra)
const pdfReady = computed(
  () =>
    !!store.bbox &&
    !!store.indicators.data &&
    !!store.calendar.data &&
    !!store.trend.data &&
    !store.indicators.loading &&
    !store.calendar.loading &&
    !store.trend.loading,
)

function downloadPdf() {
  void report.run(async () => {
    const { bbox, indicators, calendar, trend } = store
    if (!bbox || !indicators.data || !calendar.data || !trend.data) return
    const map = (await fireMap.value?.capture()) ?? null
    const { downloadAreaReport } = await import('@/pdf/report')
    await downloadAreaReport({
      year: store.selectedYear,
      bbox,
      indicators: indicators.data,
      calendar: calendar.data,
      trend: trend.data,
      map,
      median: report.median.value,
      t: report.translate,
      locale: report.locale.value,
    })
  })
}

// Activa el modo selección y sube al mapa para que el usuario dibuje el área
function startSelection() {
  store.isSelecting = true
  mapSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>
