<template>
  <div
    class="flex flex-wrap items-center justify-end gap-1 rounded-lg bg-surface-0/90 p-1.5 shadow-md backdrop-blur sm:gap-2 sm:p-2 dark:bg-surface-900/90"
  >
    <Select
      v-model="year"
      :options="store.availableYears"
      :aria-label="t('map.year')"
      size="small"
      class="w-24 sm:w-28"
    />
    <!-- En celular los botones muestran solo el ícono; el texto aparece desde sm (640px) -->
    <template v-if="!hideActions">
      <Button
        size="small"
        :severity="store.isSelecting ? 'primary' : 'secondary'"
        :aria-label="t(store.isSelecting ? 'map.cancelSelection' : 'map.selectArea')"
        :aria-pressed="store.isSelecting"
        @click="store.isSelecting = !store.isSelecting"
      >
        <i :class="['pi', store.isSelecting ? 'pi-times' : 'pi-expand']" />
        <span class="hidden sm:inline">
          {{ t(store.isSelecting ? 'map.cancelSelection' : 'map.selectArea') }}
        </span>
      </Button>
      <Button
        v-if="store.bbox && !store.isSelecting"
        size="small"
        severity="secondary"
        text
        :aria-label="t('map.clearSelection')"
        v-tooltip.bottom="t('map.clearSelection')"
        @click="store.setBBox(null)"
      >
        <i class="pi pi-eraser" />
      </Button>
      <Button
        as="router-link"
        to="/compare"
        size="small"
        severity="secondary"
        :aria-label="t('map.compare')"
      >
        <i class="pi pi-clone" />
        <span class="hidden sm:inline">{{ t('map.compare') }}</span>
      </Button>
      <!-- TODO(backend): abrir /export/csv?year=&bbox= -->
      <Button size="small" severity="secondary" :aria-label="t('map.csv')" disabled>
        <i class="pi pi-download" />
        <span class="hidden sm:inline">{{ t('map.csv') }}</span>
      </Button>
      <!-- TODO: generar PDF con jspdf + html-to-image -->
      <Button size="small" severity="secondary" :aria-label="t('map.pdf')" disabled>
        <i class="pi pi-file-pdf" />
        <span class="hidden sm:inline">{{ t('map.pdf') }}</span>
      </Button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Select from 'primevue/select'
import vTooltip from 'primevue/tooltip'
import { useAnalysisStore } from '@/stores/analysis'

defineProps<{ hideActions?: boolean }>()
const year = defineModel<number>({ required: true })

const { t } = useI18n()
const store = useAnalysisStore()
</script>
