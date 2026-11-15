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
import { calendarOption } from './options'

const props = defineProps<{
  calendar: Calendar | null
  /** Año resaltado */
  year: number
  loading?: boolean
  error?: string | null
}>()

const { t, locale } = useI18n()
const { isDark } = useTheme()

const option = computed(() =>
  props.calendar
    ? calendarOption({
        calendar: props.calendar,
        highlightYears: [props.year],
        dark: isDark.value,
        locale: locale.value,
        t,
      })
    : {},
)
</script>
