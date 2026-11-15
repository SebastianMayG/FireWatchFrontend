// Párrafos de interpretación para el PDF, armados con plantillas i18n a partir de los datos.
// Funciones puras: no tocan el DOM ni el store, así se pueden probar aisladas.
import type { Compare, Indicators, Trend } from '@/api/types'
import type { Translate } from './types'

/** Diferencias menores a esto (en %) se describen como "similar" */
const NEAR_PCT = 5
/** Cambio de la tendencia de 5 años por debajo de esto (en %) se considera estable */
const STABLE_PCT = 10

export interface MedianPeriod {
  from: number
  to: number
}

function pctText(v: number, locale: string): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(Math.abs(v))
}

export function monthNames(months: number[], locale: string, style: 'long' | 'short' = 'long') {
  const fmt = new Intl.DateTimeFormat(locale, { month: style })
  return months.map((m) => fmt.format(new Date(2000, m - 1, 1)))
}

/** "a, b y c" / "a, b and c" según el idioma */
function listText(items: string[], locale: string): string {
  return new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' }).format(items)
}

/** Actividad de los últimos 5 años completos frente a los 5 anteriores */
function fiveYearTrend(trend: Trend) {
  const complete = trend.series.filter((p) => !p.partial)
  if (complete.length < 10) return null
  const last = complete.slice(-5)
  const prev = complete.slice(-10, -5)
  const sum = (xs: typeof complete) => xs.reduce((acc, p) => acc + p.activity, 0)
  const a = sum(last)
  const b = sum(prev)
  if (b <= 0) return null
  return { pct: ((a - b) / b) * 100, from: last[0]!.year, to: last[last.length - 1]!.year }
}

export function areaInterpretation(args: {
  indicators: Indicators
  trend: Trend | null
  median: MedianPeriod
  t: Translate
  locale: string
}): string {
  const { indicators: d, trend, median, t, locale } = args
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 })
  const parts: string[] = []

  if (d.activity <= 0 && d.detections === 0) {
    parts.push(t('pdf.interp.noActivity', { year: d.year }))
  } else {
    parts.push(
      t('pdf.interp.detections', {
        year: d.year,
        n: number.format(d.activity),
        points: number.format(d.detections),
      }),
    )
    const v = d.vs_median_pct
    if (v !== null) {
      const key = Math.abs(v) < NEAR_PCT ? 'near' : v > 0 ? 'above' : 'below'
      parts.push(t(`pdf.interp.${key}`, { pct: pctText(v, locale), ...median }))
    }
    if (d.top_months.length) {
      const names = monthNames(
        d.top_months.map((m) => m.month),
        locale,
      )
      parts.push(t('pdf.interp.months', { months: listText(names, locale) }))
    }
  }

  if (d.peak_year !== null) {
    parts.push(
      d.peak_year === d.year
        ? t('pdf.interp.peakSame', { year: d.year })
        : t('pdf.interp.peakOther', { peak: d.peak_year }),
    )
  }

  const tr = trend ? fiveYearTrend(trend) : null
  if (tr) {
    const key = Math.abs(tr.pct) < STABLE_PCT ? 'trendStable' : tr.pct > 0 ? 'trendUp' : 'trendDown'
    parts.push(t(`pdf.interp.${key}`, { pct: pctText(tr.pct, locale), from: tr.from, to: tr.to }))
  }

  if (d.partial) parts.push(t('pdf.interp.partial', { year: d.year }))
  return parts.join(' ')
}

export function compareInterpretation(args: {
  compare: Compare
  t: Translate
  locale: string
}): string {
  const { compare: c, t, locale } = args
  const { a, b, basis } = c
  const parts: string[] = []

  // Qué año tuvo más actividad (métrica común del backend, ver /compare.basis)
  if (basis.a <= 0 && basis.b <= 0) {
    parts.push(t('pdf.interp.cmpNone'))
  } else if (basis.peak_years.length !== 1) {
    parts.push(t('pdf.interp.cmpEqual'))
  } else {
    const aWins = basis.peak_years[0] === a.year
    const pct = aWins ? basis.pct_a_vs_b : basis.pct_b_vs_a
    parts.push(
      t('pdf.interp.cmpMore', {
        more: aWins ? a.year : b.year,
        less: aWins ? b.year : a.year,
        pct: pct === null ? '-' : pctText(pct, locale),
      }),
    )
  }

  // Cada año frente a la mediana
  for (const d of [a, b]) {
    const v = d.vs_median_pct
    if (v === null) continue
    const key =
      Math.abs(v) < NEAR_PCT ? 'cmpMedianNear' : v > 0 ? 'cmpMedianAbove' : 'cmpMedianBelow'
    parts.push(t(`pdf.interp.${key}`, { year: d.year, pct: pctText(v, locale) }))
  }

  // Mes más crítico de cada año
  const ma = a.top_months[0]?.month
  const mb = b.top_months[0]?.month
  if (ma && mb) {
    const [na, nb] = monthNames([ma, mb], locale)
    parts.push(
      ma === mb
        ? t('pdf.interp.cmpMonthsSame', { month: na })
        : t('pdf.interp.cmpMonthsDiff', { a: na, b: nb, yearA: a.year, yearB: b.year }),
    )
  }

  if (basis.low_data) parts.push(t('indicators.lowData', { n: basis.low_data_threshold }))
  return parts.join(' ')
}
