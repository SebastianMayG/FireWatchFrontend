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
import { BAR, BAR_SELECTED, trendOption } from './options'

const props = defineProps<{
  trend: Trend | null
  /** Año resaltado */
  year: number
  loading?: boolean
  error?: string | null
}>()

const { t, locale } = useI18n()
const { isDark } = useTheme()

const option = computed(() =>
  props.trend
    ? trendOption({
        trend: props.trend,
        highlightYears: [props.year],
        dark: isDark.value,
        locale: locale.value,
        t,
      })
    : {},
)
</script>
