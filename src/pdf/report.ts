// Reporte PDF de FireWatch (se genera en el navegador con jsPDF).
// Usa solo datos que ya están en el store: no hace consultas extra al backend.
import type { jsPDF as JsPDF } from 'jspdf'
import type { BBox, Calendar, Compare, Indicators, Trend } from '@/api/types'
import { calendarOption, trendOption } from '@/components/charts/options'
import { renderChartImage } from '@/components/charts/echarts'
import logoUrl from '@/assets/logo.png'
import {
  areaInterpretation,
  compareInterpretation,
  monthNames,
  type MedianPeriod,
} from './interpretation'
import type { MapImage, Translate } from './types'

const ATTRIBUTION =
  "We acknowledge the use of data and/or imagery from NASA's Fire Information for Resource Management System (FIRMS) (https://earthdata.nasa.gov/firms), part of NASA's Land, Atmosphere Near real-time Capability for EO (LANCE) and NASA's Earth Science Data and Information System (ESDIS)."

const MARGIN = 15
const FOOTER_SPACE = 22
const PRIMARY: [number, number, number] = [20, 36, 84] // navy del tema
const MUTED: [number, number, number] = [100, 116, 139]
const TEXT: [number, number, number] = [30, 41, 59]

// Tamaño en px con que se dibujan las gráficas (proporción calendario 6:5, tendencia 2:1)
const CALENDAR_PX = { w: 900, h: 760 }
const TREND_PX = { w: 900, h: 450 }

/** jsPDF con Helvetica solo admite Latin-1: se reemplazan los caracteres fuera de ese rango */
function latin1(s: string): string {
  return s
    .replace(/[   ]/g, ' ')
    .replace(/[‐-―−]/g, '-')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\x00-\xff]/g, '?')
}

async function loadImage(url: string): Promise<string> {
  const blob = await (await fetch(url)).blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

function formatBBox(bbox: BBox, t: Translate): string {
  const [w, s, e, n] = bbox
  const lat = (v: number) => `${Math.abs(v).toFixed(2)}° ${v >= 0 ? 'N' : 'S'}`
  const lon = (v: number) => `${Math.abs(v).toFixed(2)}° ${v >= 0 ? 'E' : t('pdf.westAbbr')}`
  return `${lat(s)} - ${lat(n)}, ${lon(w)} - ${lon(e)}`
}

function pct(v: number | null | undefined, locale: string): string {
  if (v === null || v === undefined) return '-'
  const sign = v > 0 ? '+' : v < 0 ? '-' : ''
  return `${sign}${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(Math.abs(v))} %`
}

function today(locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date())
}

function fileDate(): string {
  return new Date().toISOString().slice(0, 10)
}

/** Pequeña capa sobre jsPDF: cursor vertical, saltos de página, encabezado y pie */
class Report {
  readonly pageW: number
  readonly pageH: number
  readonly contentW: number
  y = MARGIN

  constructor(
    readonly doc: JsPDF,
    readonly t: Translate,
  ) {
    this.pageW = doc.internal.pageSize.getWidth()
    this.pageH = doc.internal.pageSize.getHeight()
    this.contentW = this.pageW - MARGIN * 2
  }

  ensure(height: number) {
    if (this.y + height > this.pageH - FOOTER_SPACE) this.newPage()
  }

  newPage() {
    this.doc.addPage()
    this.y = MARGIN
  }

  header(logo: string, title: string, subtitle: string) {
    const d = this.doc
    d.addImage(logo, 'PNG', MARGIN, this.y, 14, 14)
    d.setFont('helvetica', 'bold')
      .setFontSize(18)
      .setTextColor(...PRIMARY)
    d.text('FireWatch', MARGIN + 17, this.y + 6)
    d.setFont('helvetica', 'normal')
      .setFontSize(11)
      .setTextColor(...TEXT)
    d.text(latin1(title), MARGIN + 17, this.y + 11.5)
    d.setFontSize(8).setTextColor(...MUTED)
    d.text(latin1(subtitle), this.pageW - MARGIN, this.y + 6, { align: 'right' })
    this.y += 17
    d.setDrawColor(...PRIMARY).setLineWidth(0.6)
    d.line(MARGIN, this.y, this.pageW - MARGIN, this.y)
    this.y += 6
  }

  section(title: string) {
    this.ensure(12)
    this.doc
      .setFont('helvetica', 'bold')
      .setFontSize(12)
      .setTextColor(...PRIMARY)
    this.doc.text(latin1(title), MARGIN, this.y + 4)
    this.y += 8
  }

  paragraph(text: string, size = 10, color: [number, number, number] = TEXT) {
    const d = this.doc
    d.setFont('helvetica', 'normal')
      .setFontSize(size)
      .setTextColor(...color)
    const lines: string[] = d.splitTextToSize(latin1(text), this.contentW)
    const lineH = size * 0.42
    for (const line of lines) {
      this.ensure(lineH)
      d.text(line, MARGIN, this.y + lineH * 0.8)
      this.y += lineH
    }
    this.y += 2
  }

  /** Filas etiqueta / valor */
  keyValues(rows: [string, string][]) {
    const d = this.doc
    const labelW = 72
    for (const [label, value] of rows) {
      d.setFontSize(10)
      const valueLines: string[] = d.splitTextToSize(latin1(value), this.contentW - labelW)
      const h = Math.max(1, valueLines.length) * 4.6 + 1.6
      this.ensure(h)
      d.setFont('helvetica', 'normal').setTextColor(...MUTED)
      d.text(latin1(label), MARGIN, this.y + 4)
      d.setFont('helvetica', 'bold').setTextColor(...TEXT)
      d.text(valueLines, MARGIN + labelW, this.y + 4)
      this.y += h
      d.setDrawColor(226, 232, 240).setLineWidth(0.2)
      d.line(MARGIN, this.y - 0.8, this.pageW - MARGIN, this.y - 0.8)
    }
    this.y += 3
  }

  /** Tabla de 3 columnas: etiqueta | año A | año B */
  compareTable(headers: [string, string, string], rows: [string, string, string][]) {
    const d = this.doc
    const col = [MARGIN, MARGIN + 72, MARGIN + 72 + (this.contentW - 72) / 2]
    const colW = (this.contentW - 72) / 2 - 2
    this.ensure(8)
    d.setFont('helvetica', 'bold')
      .setFontSize(10)
      .setTextColor(...PRIMARY)
    headers.forEach((h, i) => d.text(latin1(h), col[i]!, this.y + 4))
    this.y += 6.5
    for (const row of rows) {
      d.setFontSize(10)
      const cells = row.map((c, i) =>
        i === 0 ? [latin1(c)] : (d.splitTextToSize(latin1(c), colW) as string[]),
      )
      const h = Math.max(...cells.map((c) => c.length)) * 4.6 + 1.6
      this.ensure(h)
      cells.forEach((lines, i) => {
        d.setFont('helvetica', i === 0 ? 'normal' : 'bold').setTextColor(
          ...(i === 0 ? MUTED : TEXT),
        )
        d.text(lines, col[i]!, this.y + 4)
      })
      this.y += h
      d.setDrawColor(226, 232, 240).setLineWidth(0.2)
      d.line(MARGIN, this.y - 0.8, this.pageW - MARGIN, this.y - 0.8)
    }
    this.y += 3
  }

  /** Imagen ajustada al ancho (y alto máximo); devuelve el alto usado */
  image(dataUrl: string, pxW: number, pxH: number, maxW: number, maxH: number, x = MARGIN) {
    const ratio = pxH / pxW
    let w = maxW
    let h = w * ratio
    if (h > maxH) {
      h = maxH
      w = h / ratio
    }
    const format = dataUrl.startsWith('data:image/jpeg') ? 'JPEG' : 'PNG'
    this.doc.addImage(dataUrl, format, x + (maxW - w) / 2, this.y, w, h)
    this.doc.setDrawColor(203, 213, 225).setLineWidth(0.2)
    this.doc.rect(x + (maxW - w) / 2, this.y, w, h)
    return h
  }

  /** Pie en todas las páginas: atribución de NASA FIRMS y número de página */
  footers() {
    const d = this.doc
    const total = d.getNumberOfPages()
    for (let n = 1; n <= total; n++) {
      d.setPage(n)
      const top = this.pageH - FOOTER_SPACE + 6
      d.setDrawColor(226, 232, 240).setLineWidth(0.2)
      d.line(MARGIN, top - 3, this.pageW - MARGIN, top - 3)
      d.setFont('helvetica', 'normal')
        .setFontSize(6.5)
        .setTextColor(...MUTED)
      const lines: string[] = d.splitTextToSize(
        latin1(`${this.t('pdf.attribution')}: ${ATTRIBUTION}`),
        this.contentW - 28,
      )
      d.text(lines, MARGIN, top)
      d.text(latin1(this.t('pdf.page', { n, total })), this.pageW - MARGIN, top, { align: 'right' })
    }
  }
}

async function newReport(t: Translate) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true })
  return { report: new Report(doc, t), logo: await loadImage(logoUrl) }
}

/** Calendario y tendencia (tema claro) + nota metodológica */
function chartsAndMethodology(
  r: Report,
  args: { calendar: Calendar; trend: Trend; years: number[]; t: Translate; locale: string },
) {
  const { calendar, trend, years, t, locale } = args
  const base = { highlightYears: years, dark: false, locale, t }
  const cal = renderChartImage(calendarOption({ ...base, calendar }), CALENDAR_PX.w, CALENDAR_PX.h)
  const tr = renderChartImage(trendOption({ ...base, trend }), TREND_PX.w, TREND_PX.h)

  r.newPage()
  r.section(t('charts.calendar'))
  r.paragraph(t('charts.calendarHint'), 8.5, MUTED)
  const calH = Math.min(r.contentW * (CALENDAR_PX.h / CALENDAR_PX.w), 140)
  r.ensure(calH)
  r.y += r.image(cal, CALENDAR_PX.w, CALENDAR_PX.h, r.contentW, calH) + 5

  r.section(t('charts.trend'))
  const trH = Math.min(r.contentW * (TREND_PX.h / TREND_PX.w), 80)
  r.ensure(trH)
  r.y += r.image(tr, TREND_PX.w, TREND_PX.h, r.contentW, trH) + 5

  r.section(t('pdf.methodology'))
  r.paragraph(t('pdf.methodologyText'), 8.5, MUTED)
}

function topMonths(d: Indicators, locale: string): string {
  return d.top_months.length
    ? monthNames(
        d.top_months.map((m) => m.month),
        locale,
      ).join(', ')
    : '-'
}

// ---------------------------------------------------------------- Dashboard

export async function downloadAreaReport(args: {
  year: number
  bbox: BBox
  indicators: Indicators
  calendar: Calendar
  trend: Trend
  map: MapImage | null
  median: MedianPeriod
  t: Translate
  locale: string
}) {
  const { year, bbox, indicators: d, calendar, trend, map, median, t, locale } = args
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 })
  const { report: r, logo } = await newReport(t)

  r.header(logo, t('pdf.titleArea'), t('pdf.generated', { date: today(locale) }))

  r.section(t('pdf.summary'))
  r.keyValues([
    [t('pdf.region'), formatBBox(bbox, t)],
    [t('pdf.period'), String(year)],
    [t('indicators.hotspots'), number.format(d.activity)],
    [t('pdf.satellitePoints'), number.format(d.detections)],
    [t('indicators.peakYear'), d.peak_year ? String(d.peak_year) : '-'],
    [t('indicators.peakMonths'), topMonths(d, locale)],
    [
      t('indicators.vsMedianPeriod', { ...median }),
      `${pct(d.vs_median_pct, locale)}  (${number.format(d.activity)} vs. ${number.format(d.median_activity)})`,
    ],
  ])

  if (map) {
    r.section(t('pdf.map'))
    const h = Math.min(r.contentW * (map.height / map.width), 95)
    r.ensure(h + 10)
    r.y += r.image(map.dataUrl, map.width, map.height, r.contentW, h) + 2
    r.paragraph(t('pdf.legendNote'), 7.5, MUTED)
  }

  r.section(t('pdf.interpretation'))
  r.paragraph(areaInterpretation({ indicators: d, trend, median, t, locale }))

  chartsAndMethodology(r, { calendar, trend, years: [year], t, locale })
  r.footers()
  r.doc.save(`firewatch_${year}_${fileDate()}.pdf`)
}

// ---------------------------------------------------------------- Compare

export async function downloadCompareReport(args: {
  bbox: BBox
  compare: Compare
  calendar: Calendar
  trend: Trend
  maps: [MapImage | null, MapImage | null]
  median: MedianPeriod
  t: Translate
  locale: string
}) {
  const { bbox, compare: c, calendar, trend, maps, median, t, locale } = args
  const { a, b, basis } = c
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 })
  const { report: r, logo } = await newReport(t)

  r.header(
    logo,
    `${t('pdf.titleCompare')}: ${a.year} vs. ${b.year}`,
    t('pdf.generated', { date: today(locale) }),
  )

  r.section(t('pdf.summary'))
  r.keyValues([
    [t('pdf.region'), formatBBox(bbox, t)],
    [t('pdf.period'), `${a.year} vs. ${b.year}`],
    [t('indicators.peakYearOfTwo'), basis.peak_years.length ? basis.peak_years.join(' / ') : '-'],
  ])

  // Los dos mapas lado a lado
  if (maps[0] || maps[1]) {
    r.section(t('pdf.maps'))
    const gap = 4
    const colW = (r.contentW - gap) / 2
    const heights = maps.map((m) => (m ? Math.min(colW * (m.height / m.width), 70) : 0))
    const h = Math.max(...heights)
    r.ensure(h + 16)
    r.doc
      .setFont('helvetica', 'bold')
      .setFontSize(10)
      .setTextColor(...TEXT)
    r.doc.text(String(a.year), MARGIN, r.y + 3.5)
    r.doc.text(String(b.year), MARGIN + colW + gap, r.y + 3.5)
    r.y += 5.5
    maps.forEach((m, i) => {
      if (m) r.image(m.dataUrl, m.width, m.height, colW, h, MARGIN + i * (colW + gap))
    })
    r.y += h + 2
    r.paragraph(t('pdf.legendNote'), 7.5, MUTED)
  }

  r.section(t('pdf.comparison'))
  r.compareTable(
    ['', String(a.year), String(b.year)],
    [
      [t('indicators.hotspots'), number.format(a.activity), number.format(b.activity)],
      [t('pdf.satellitePoints'), number.format(a.detections), number.format(b.detections)],
      [t('indicators.peakMonths'), topMonths(a, locale), topMonths(b, locale)],
      [
        t('indicators.vsMedianPeriod', { ...median }),
        `${pct(a.vs_median_pct, locale)} (${number.format(a.activity)} vs. ${number.format(a.median_activity)})`,
        `${pct(b.vs_median_pct, locale)} (${number.format(b.activity)} vs. ${number.format(b.median_activity)})`,
      ],
      [
        t('indicators.vsOther'),
        `${pct(basis.pct_a_vs_b, locale)} (${number.format(basis.a)} vs. ${number.format(basis.b)})`,
        `${pct(basis.pct_b_vs_a, locale)} (${number.format(basis.b)} vs. ${number.format(basis.a)})`,
      ],
    ],
  )

  r.section(t('pdf.interpretation'))
  r.paragraph(compareInterpretation({ compare: c, t, locale }))

  chartsAndMethodology(r, { calendar, trend, years: [a.year, b.year], t, locale })
  r.footers()
  r.doc.save(`firewatch_${a.year}_vs_${b.year}_${fileDate()}.pdf`)
}
