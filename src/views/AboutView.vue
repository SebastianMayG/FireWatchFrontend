<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-3 p-3 sm:gap-4 sm:p-4">
    <h1 class="text-2xl font-bold sm:text-3xl">{{ t('about.title') }}</h1>

    <Card v-for="section in sections" :key="section">
      <template #title>{{ t(`about.${section}.title`) }}</template>
      <template #content>
        <!-- Cada sección puede tener varios párrafos, separados por una línea en blanco en el texto -->
        <div class="flex flex-col gap-3">
          <p
            v-for="(paragraph, i) in paragraphs(`about.${section}.body`)"
            :key="i"
            class="leading-relaxed"
          >
            {{ paragraph }}
          </p>
        </div>
      </template>
    </Card>

    <!-- Equipo: integrantes del proyecto (usuarios de GitHub) -->
    <Card>
      <template #title>{{ t('about.team.title') }}</template>
      <template #content>
        <p class="leading-relaxed">{{ t('about.team.body') }}</p>
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <a
            v-for="user in TEAM"
            :key="user"
            :href="`https://github.com/${user}`"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 rounded-lg border border-surface-200 p-3 transition-colors hover:bg-surface-100 dark:border-surface-700 dark:hover:bg-surface-800"
          >
            <img
              v-if="!brokenAvatars.has(user)"
              :src="`https://github.com/${user}.png?size=96`"
              :alt="user"
              class="h-12 w-12 shrink-0 rounded-full"
              loading="lazy"
              @error="brokenAvatars.add(user)"
            />
            <span
              v-else
              class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-200 dark:bg-surface-700"
            >
              <i class="pi pi-user text-lg" />
            </span>
            <span class="min-w-0">
              <span class="block truncate font-semibold">{{ user }}</span>
              <span class="flex items-center gap-1 text-sm text-surface-500 dark:text-surface-400">
                <i class="pi pi-github text-xs" />github.com/{{ user }}
              </span>
            </span>
          </a>
        </div>

        <p class="mt-4 text-sm font-semibold">{{ t('about.team.repos') }}</p>
        <ul class="mt-1 flex flex-col gap-1 text-sm">
          <li v-for="repo in REPOS" :key="repo">
            <a
              :href="`https://github.com/${repo}`"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary hover:underline"
            >
              <i class="pi pi-github mr-1 text-xs" />github.com/{{ repo }}
            </a>
          </li>
        </ul>
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
import { reactive } from 'vue'
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

// Integrantes del proyecto (usuarios de GitHub) y repositorios
const TEAM = ['SebastianMayG', 'SantiagoGMG'] as const
const REPOS = ['SebastianMayG/FireWatchFrontend', 'SebastianMayG/FireWatchBackend'] as const

// Si un avatar no carga (p. ej. sin internet) se muestra un ícono en su lugar
const brokenAvatars = reactive(new Set<string>())

function paragraphs(key: string): string[] {
  return t(key)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}
</script>
