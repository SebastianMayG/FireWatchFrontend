// Cliente HTTP del backend de FireWatch (FastAPI). Contrato: FireWatchBackend/docs/api.md
import type {
  BBox,
  Calendar,
  Compare,
  HotspotsResponse,
  Indicators,
  Meta,
  MinConf,
  RecurrentZones,
  Trend,
} from './types'

export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000').replace(/\/$/, '')

type Params = Record<string, string | number | BBox | null | undefined>

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/** true si el error viene de cancelar una petición (no hay que mostrarlo) */
export function isAbort(e: unknown): boolean {
  return e instanceof DOMException && e.name === 'AbortError'
}

export function buildUrl(path: string, params: Params = {}): string {
  const url = new URL(API_URL + path)
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue
    url.searchParams.set(key, Array.isArray(value) ? value.join(',') : String(value))
  }
  return url.toString()
}

async function apiGet<T>(path: string, params?: Params, signal?: AbortSignal): Promise<T> {
  const res = await fetch(buildUrl(path, params), { signal })
  if (!res.ok) {
    let detail = res.statusText
    try {
      const body = await res.json()
      if (typeof body?.detail === 'string') detail = body.detail
    } catch {
      // respuesta sin JSON
    }
    throw new ApiError(detail, res.status)
  }
  return res.json() as Promise<T>
}

export const api = {
  meta: (signal?: AbortSignal) => apiGet<Meta>('/meta', {}, signal),

  indicators: (year: number, bbox: BBox | null, signal?: AbortSignal) =>
    apiGet<Indicators>('/indicators', { year, bbox }, signal),

  calendar: (bbox: BBox | null, signal?: AbortSignal) =>
    apiGet<Calendar>('/calendar', { bbox }, signal),

  trend: (bbox: BBox | null, signal?: AbortSignal) => apiGet<Trend>('/trend', { bbox }, signal),

  compare: (yearA: number, yearB: number, bbox: BBox | null, signal?: AbortSignal) =>
    apiGet<Compare>('/compare', { year_a: yearA, year_b: yearB, bbox }, signal),

  hotspots: (year: number, bbox: BBox | null, minConf: MinConf = 'low', signal?: AbortSignal) =>
    apiGet<HotspotsResponse>('/hotspots', { year, bbox, min_conf: minConf }, signal),

  recurrentZones: (signal?: AbortSignal) => apiGet<RecurrentZones>('/recurrent-zones', {}, signal),
}

/** URL de descarga del CSV (el navegador la abre directamente) */
export function csvUrl(year: number, bbox: BBox | null): string {
  return buildUrl('/export/csv', { year, bbox })
}
