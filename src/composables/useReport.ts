// Estado compartido para generar el PDF desde Dashboard o Compare
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAnalysisStore } from '@/stores/analysis'
import type { Translate } from '@/pdf/types'

export function useReport() {
  const { t, locale } = useI18n()
  const store = useAnalysisStore()
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Periodo de la mediana histórica (años completos), p. ej. 2001-2025
  const median = computed(() => {
    const years = store.meta?.complete_years ?? []
    return { from: years[0] ?? 2001, to: years[years.length - 1] ?? 2025 }
  })

  const translate: Translate = (key, params) => (params ? t(key, params) : t(key))

  async function run(task: () => Promise<void>) {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      await task()
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      loading.value = false
    }
  }

  return { loading, error, median, translate, locale, run }
}
