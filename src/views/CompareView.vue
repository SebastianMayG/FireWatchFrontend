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
          <FireMap>
            <template #controls>
              <MapControls
                :model-value="store[side.yearKey]"
                hide-actions
                @update:model-value="(y: number) => (store[side.yearKey] = y)"
              />
            </template>
          </FireMap>
        </div>
        <ChartCard
          :title="t('charts.calendar')"
          :hint="t('charts.calendarHint')"
          :empty-text="store.bbox ? undefined : t('charts.emptyArea')"
        />
        <IndicatorCards mode="compare" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import FireMap from '@/components/map/FireMap.vue'
import MapControls from '@/components/map/MapControls.vue'
import IndicatorCards from '@/components/indicators/IndicatorCards.vue'
import ChartCard from '@/components/charts/ChartCard.vue'
import { useAnalysisStore } from '@/stores/analysis'

const { t } = useI18n()
const store = useAnalysisStore()

const sides = [
  { key: 'main', label: 'map.mainPeriod', yearKey: 'selectedYear' },
  { key: 'compare', label: 'map.comparePeriod', yearKey: 'compareYear' },
] as const
</script>
