export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000').replace(/\/$/, '');
export class ApiError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}
/** true si el error viene de cancelar una petición (no hay que mostrarlo) */
export function isAbort(e) {
    return e instanceof DOMException && e.name === 'AbortError';
}
export function buildUrl(path, params = {}) {
    const url = new URL(API_URL + path);
    for (const [key, value] of Object.entries(params)) {
        if (value === null || value === undefined)
            continue;
        url.searchParams.set(key, Array.isArray(value) ? value.join(',') : String(value));
    }
    return url.toString();
}
async function apiGet(path, params, signal) {
    const res = await fetch(buildUrl(path, params), { signal });
    if (!res.ok) {
        let detail = res.statusText;
        try {
            const body = await res.json();
            if (typeof body?.detail === 'string')
                detail = body.detail;
        }
        catch {
            // respuesta sin JSON
        }
        throw new ApiError(detail, res.status);
    }
    return res.json();
}
export const api = {
    meta: (signal) => apiGet('/meta', {}, signal),
    indicators: (year, bbox, signal) => apiGet('/indicators', { year, bbox }, signal),
    calendar: (bbox, signal) => apiGet('/calendar', { bbox }, signal),
    trend: (bbox, signal) => apiGet('/trend', { bbox }, signal),
    compare: (yearA, yearB, bbox, signal) => apiGet('/compare', { year_a: yearA, year_b: yearB, bbox }, signal),
    hotspots: (year, bbox, minConf = 'low', signal) => apiGet('/hotspots', { year, bbox, min_conf: minConf }, signal),
    recurrentZones: (signal) => apiGet('/recurrent-zones', {}, signal),
};
/** URL de descarga del CSV (el navegador la abre directamente) */
export function csvUrl(year, bbox) {
    return buildUrl('/export/csv', { year, bbox });
}
