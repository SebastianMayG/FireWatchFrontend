<template>
  <div class="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
    <section class="h-[60vh] min-h-[360px] sm:min-h-[400px]">
      <FireMap selectable>
        <template #controls>
          <MapControls v-model="store.selectedYear" />
        </template>
      </FireMap>
    </section>

    <IndicatorCards />

    <!-- Calendario y tendencia solo aparecen al seleccionar un área -->
    <section v-if="store.bbox" class="grid gap-4 lg:grid-cols-2">
      <ChartCard :title="t('charts.calendar')" :hint="t('charts.calendarHint')" />
      <ChartCard :title="t('charts.trend')" :hint="t('charts.trendHint')" />
    </section>
    <Message v-else severity="info" icon="pi pi-expand">
      {{ t('charts.emptyArea') }}
    </Message>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Message from 'primevue/message'
import FireMap from '@/components/map/FireMap.vue'
import MapControls from '@/components/map/MapControls.vue'
import IndicatorCards from '@/components/indicators/IndicatorCards.vue'
import ChartCard from '@/components/charts/ChartCard.vue'
import { useAnalysisStore } from '@/stores/analysis'

const { t } = useI18n()
const store = useAnalysisStore()
</script>
