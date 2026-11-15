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

      <!-- Compare, CSV y PDF requieren un área. El <span> lleva el tooltip porque
           un botón deshabilitado no recibe eventos del mouse. -->
      <span v-tooltip.bottom="needAreaTip">
        <Button
          v-if="hasArea"
          as="router-link"
          to="/compare"
          size="small"
          severity="secondary"
          :aria-label="t('map.compare')"
        >
          <i class="pi pi-clone" />
          <span class="hidden sm:inline">{{ t('map.compare') }}</span>
        </Button>
        <Button v-else size="small" severity="secondary" :aria-label="t('map.compare')" disabled>
          <i class="pi pi-clone" />
          <span class="hidden sm:inline">{{ t('map.compare') }}</span>
        </Button>
      </span>

      <span v-tooltip.bottom="needAreaTip">
        <Button
          v-if="hasArea"
          as="a"
          :href="csvHref"
          download
          size="small"
          severity="secondary"
          :aria-label="t('map.csv')"
        >
          <i class="pi pi-download" />
          <span class="hidden sm:inline">{{ t('map.csv') }}</span>
        </Button>
        <Button v-else size="small" severity="secondary" :aria-label="t('map.csv')" disabled>
          <i class="pi pi-download" />
          <span class="hidden sm:inline">{{ t('map.csv') }}</span>
        </Button>
      </span>

      <span v-tooltip.bottom="needAreaTip">
        <Button
          size="small"
          severity="secondary"
          :aria-label="t('map.pdf')"
          :disabled="!hasArea || !pdfReady || pdfLoading"
          @click="emit('pdf')"
        >
          <i :class="['pi', pdfLoading ? 'pi-spin pi-spinner' : 'pi-file-pdf']" />
          <span class="hidden sm:inline">{{ t('map.pdf') }}</span>
        </Button>
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Select from 'primevue/select'
import vTooltip from 'primevue/tooltip'
import { useAnalysisStore } from '@/stores/analysis'
import { csvUrl } from '@/api/client'

defineProps<{
  hideActions?: boolean
  /** Hay datos suficientes para el PDF (indicadores, calendario y tendencia cargados) */
  pdfReady?: boolean
  /** El PDF se está generando */
  pdfLoading?: boolean
}>()
const emit = defineEmits<{ pdf: [] }>()
const year = defineModel<number>({ required: true })

const { t } = useI18n()
const store = useAnalysisStore()

const hasArea = computed(() => store.ready && store.bbox !== null)
// Sin área: tooltip explicando por qué están deshabilitados. Con área: sin tooltip.
const needAreaTip = computed(() => (hasArea.value ? undefined : t('map.needArea')))
const csvHref = computed(() => csvUrl(year.value, store.bbox))
</script>
