<template>
  <div class="min-h-screen bg-surface-50 text-surface-900 dark:bg-surface-950 dark:text-surface-0">
    <AppHeader />
    <!-- Aviso si el backend no responde (sin él no hay años ni datos) -->
    <div v-if="store.metaError" class="px-3 pt-3 sm:px-4 sm:pt-4">
      <Message severity="error" icon="pi pi-exclamation-triangle">
        <div class="flex flex-wrap items-center gap-3">
          <span>{{ t('errors.backend', { url: API_URL }) }}</span>
          <Button
            :label="t('common.retry')"
            icon="pi pi-refresh"
            size="small"
            severity="secondary"
            :loading="store.metaLoading"
            @click="store.loadMeta()"
          />
        </div>
      </Message>
    </div>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Message from 'primevue/message'
import AppHeader from '@/components/layout/AppHeader.vue'
import { API_URL } from '@/api/client'
import { useAnalysisStore } from '@/stores/analysis'

const { t } = useI18n()
const store = useAnalysisStore()

onMounted(() => store.loadMeta())
</script>
