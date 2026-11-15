<template>
  <Card class="h-full">
    <template #title>{{ title }}</template>
    <template #subtitle>{{ hint }}</template>
    <template #content>
      <slot>
        <div
          class="flex h-64 items-center justify-center rounded-md border border-dashed border-surface-300 text-center text-sm text-surface-500 dark:border-surface-600 dark:text-surface-400"
        >
          <span><i class="pi pi-th-large mr-2" />{{ emptyText ?? t('charts.pending') }}</span>
        </div>
      </slot>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'

defineProps<{ title: string; hint: string; emptyText?: string }>()
const { t } = useI18n()
</script>
