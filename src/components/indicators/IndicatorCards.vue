<template>
  <div class="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
    <Card v-for="item in items" :key="item.key">
      <template #content>
        <div class="flex items-start gap-3">
          <i :class="['pi', item.icon, 'mt-1 text-xl text-primary']" />
          <div class="min-w-0">
            <p class="text-sm text-surface-500 dark:text-surface-400">{{ t(item.label) }}</p>
            <!-- TODO(backend): valores reales desde el store -->
            <p class="text-2xl font-semibold">{{ t('common.noData') }}</p>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'

// mode="compare" cambia "vs. mediana" por "vs. el otro periodo" además de la mediana
const props = defineProps<{ mode?: 'dashboard' | 'compare' }>()
const { t } = useI18n()

const items = computed(() => {
  const base = [
    { key: 'hotspots', label: 'indicators.hotspots', icon: 'pi-map-marker' },
    { key: 'peakYear', label: 'indicators.peakYear', icon: 'pi-calendar' },
    { key: 'peakMonths', label: 'indicators.peakMonths', icon: 'pi-chart-bar' },
    { key: 'vsMedian', label: 'indicators.vsMedian', icon: 'pi-arrow-right-arrow-left' },
  ]
  return props.mode === 'compare'
    ? [...base, { key: 'vsOther', label: 'indicators.vsOther', icon: 'pi-sort-alt' }]
    : [...base, { key: 'yearsAnalyzed', label: 'indicators.yearsAnalyzed', icon: 'pi-history' }]
})
</script>
