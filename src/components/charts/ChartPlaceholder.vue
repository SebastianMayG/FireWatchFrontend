<template>
  <!-- Lugar reservado de una gráfica que todavía no tiene datos (p. ej. falta seleccionar un área) -->
  <div
    class="flex min-h-64 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-surface-300 p-4 text-center text-sm text-surface-500 dark:border-surface-600 dark:text-surface-400"
  >
    <i :class="['pi', icon ?? 'pi-th-large', 'text-2xl']" />
    <p class="max-w-sm">{{ text }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string; icon?: string }>()
</script>
