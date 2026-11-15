import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import { FireWatchPreset } from './theme/preset';
import 'primeicons/primeicons.css';
import './assets/main.css';
import App from './App.vue';
import router from './router';
import { i18n } from './i18n';
createApp(App)
    .use(createPinia())
    .use(router)
    .use(i18n)
    .use(PrimeVue, { theme: { preset: FireWatchPreset, options: { darkModeSelector: '.app-dark' } } })
    .mount('#app');
