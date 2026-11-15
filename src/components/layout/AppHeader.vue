<template>
  <header
    class="flex items-center justify-between gap-2 border-b border-surface-200 bg-surface-0 px-3 py-2 sm:gap-4 sm:px-4 sm:py-3 dark:border-surface-700 dark:bg-surface-900"
  >
    <RouterLink
      to="/"
      class="flex min-w-0 items-center gap-2 text-lg font-bold text-primary sm:text-xl"
    >
      <img :src="logoUrl" alt="" class="h-10 w-10 shrink-0 sm:h-15 sm:w-15" />
      <span class="truncate">{{ t('app.name') }}</span>
    </RouterLink>

    <nav class="flex shrink-0 items-center gap-1 sm:gap-2">
      <!-- En About el botón cambia a "Volver". En celular solo el ícono; el texto aparece desde sm (640px) -->
      <Button
        as="router-link"
        :to="aboutLink.to"
        text
        size="small"
        :aria-label="t(aboutLink.label)"
      >
        <i :class="['pi', aboutLink.icon]" />
        <span class="hidden sm:inline">{{ t(aboutLink.label) }}</span>
      </Button>

      <SelectButton
        v-model="locale"
        :options="languages"
        :allow-empty="false"
        size="small"
        :aria-label="t('header.language')"
      />

      <Button
        :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
        :aria-label="t('header.darkMode')"
        text
        rounded
        @click="toggleDark"
      />
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import SelectButton from 'primevue/selectbutton'
import { useTheme } from '@/composables/useTheme'
import logoUrl from '@/assets/logo.png'

const { t, locale } = useI18n()
const { isDark, toggleDark } = useTheme()

const languages = ['en', 'es']

const route = useRoute()
const aboutLink = computed(() => {
  if (route.name !== 'about') {
    return { to: '/about', label: 'header.about', icon: 'pi-info-circle' }
  }
  // Regresa a la vista de donde vino (Dashboard o Compare); si entró directo a /about, al Dashboard
  const previous = window.history.state?.back
  return { to: typeof previous === 'string' ? previous : '/', label: 'header.back', icon: 'pi-arrow-left' }
})

watch(
  locale,
  (value) => {
    localStorage.setItem('lang', value)
    document.documentElement.lang = value
  },
  { immediate: true },
)
</script>
