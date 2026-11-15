<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-3 p-3 sm:gap-4 sm:p-4">
    <h1 class="text-2xl font-bold sm:text-3xl">{{ t('about.title') }}</h1>

    <Card v-for="section in sections" :key="section">
      <template #title>{{ t(`about.${section}.title`) }}</template>
      <template #content>
        <p class="leading-relaxed">{{ t(`about.${section}.body`) }}</p>
      </template>
    </Card>

    <!-- Atribución obligatoria NASA FIRMS (texto oficial en inglés en ambos idiomas) -->
    <Message severity="secondary">
      <p class="font-semibold">{{ t('about.acknowledgement.title') }}</p>
      <p class="text-sm">{{ t('about.acknowledgement.body') }}</p>
    </Message>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Card from 'primevue/card'
import Message from 'primevue/message'

const { t } = useI18n()

const sections = [
  'whatIs',
  'sensors',
  'hotspots',
  'dataFlow',
  'methodology',
  'limitations',
  'usefulness',
] as const
</script>
