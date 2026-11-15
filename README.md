# FireWatch Frontend

Aplicación web (Vue 3 + TypeScript + PrimeVue + Tailwind + MapLibre + ECharts) para analizar la actividad histórica de puntos calientes en México con datos armonizados de MODIS y VIIRS (NASA FIRMS). Proyecto del NASA Space Apps Challenge.

Consume la API de `FireWatchBackend` (FastAPI). Contrato: `FireWatchBackend/docs/api.md`.

## Requisitos

- Node `^22.18.0` o `>=24.12.0`
- El backend corriendo (por defecto en http://127.0.0.1:8000)

## Configuración

Si el backend corre en otra URL, copia `.env.example` a `.env` y ajusta:

```
VITE_API_URL=http://127.0.0.1:8000
```

El backend debe permitir el origen del frontend en CORS (`CORS_ORIGINS`; por defecto acepta http://localhost:5173).

## Desarrollo

```sh
npm install

# Terminal 1: backend
cd ../FireWatchBackend
..venvScriptsActivate.ps1
uvicorn app.main:app --reload

# Terminal 2: frontend
npm run dev
```

Abre http://localhost:5173.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga |
| `npm run type-check` | Revisión de tipos (vue-tsc) |
| `npm run build` | Revisión de tipos + build de producción en `dist/` |
| `npm run format` | Formato con Prettier |

## Estructura

```
src/
  api/          cliente HTTP y tipos de la API
  stores/       estado (Pinia): año, área, datos del backend
  components/
    map/        mapa (puntos, heatmap, zonas recurrentes, selección de área) y controles
    indicators/ cards de indicadores
    charts/     calendario (heatmap) y tendencia (ECharts)
  views/        Dashboard, Compare, About
  i18n/         textos ES/EN
```
