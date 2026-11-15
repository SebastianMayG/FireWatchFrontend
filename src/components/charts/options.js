import { FIRE_RAMP, chartColors, monthLabels } from './echarts';
// Barras en naranja, años resaltados en rojo oscuro
export const BAR = '#fd8d3c';
export const BAR_SELECTED = '#bd0026';
export function calendarOption({ calendar: cal, highlightYears, dark, locale, t, }) {
    const c = chartColors(dark);
    const months = monthLabels(locale);
    const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
    const highlight = new Set(highlightYears);
    // Celdas en cero no se pintan (queda el fondo), así se distingue "sin fuego" de "poco fuego"
    const data = cal.years.flatMap((year, yi) => (cal.values[yi] ?? []).map((v, mi) => ({
        value: [mi, yi, v > 0 ? v : null],
        itemStyle: highlight.has(year)
            ? { borderColor: c.highlight, borderWidth: 1.5 }
            : { borderWidth: 0 },
    })));
    return {
        backgroundColor: 'transparent',
        textStyle: { color: c.text },
        grid: { top: 8, right: 12, bottom: 56, left: 56 },
        tooltip: {
            formatter: (p) => {
                const [mi, yi, v] = p.value;
                const year = cal.years[yi] ?? 0;
                return `${months[mi]} ${year}<br/>${t('charts.activity')}: <b>${number.format(v ?? 0)}</b>`;
            },
        },
        xAxis: {
            type: 'category',
            data: months,
            splitArea: { show: true, areaStyle: { color: [c.empty, c.empty] } },
            axisLine: { lineStyle: { color: c.axis } },
            axisLabel: { color: c.muted },
        },
        yAxis: {
            type: 'category',
            data: cal.years,
            inverse: true, // el año más antiguo arriba
            splitArea: { show: true, areaStyle: { color: [c.empty, c.empty] } },
            axisLine: { lineStyle: { color: c.axis } },
            axisLabel: {
                color: c.muted,
                formatter: (y) => (highlight.has(Number(y)) ? `{sel|${y}}` : y),
                rich: { sel: { fontWeight: 'bold', color: c.highlight } },
            },
        },
        visualMap: {
            min: 0,
            max: Math.max(cal.max, 1),
            orient: 'horizontal',
            left: 'center',
            bottom: 0,
            itemWidth: 12,
            itemHeight: 160,
            calculable: false,
            text: ['', ''],
            textStyle: { color: c.muted },
            formatter: (v) => number.format(v),
            inRange: { color: FIRE_RAMP },
        },
        series: [
            {
                type: 'heatmap',
                data,
                emphasis: { itemStyle: { borderColor: c.highlight, borderWidth: 1 } },
            },
        ],
    };
}
export function trendOption({ trend: tr, highlightYears, dark, locale, t, }) {
    const c = chartColors(dark);
    const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
    const byYear = new Map(tr.series.map((p) => [p.year, p]));
    const highlight = new Set(highlightYears);
    return {
        backgroundColor: 'transparent',
        textStyle: { color: c.text },
        grid: { top: 24, right: 12, bottom: 32, left: 64 },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: (params) => {
                const p = byYear.get(Number(params[0]?.name));
                if (!p)
                    return '';
                const peak = p.year === tr.peak_year ? ` (${t('charts.peak')})` : '';
                return [
                    `<b>${p.year}</b>${peak}`,
                    `${t('charts.activity')}: <b>${number.format(p.activity)}</b>`,
                    `${t('charts.detections')}: ${number.format(p.detections)}`,
                ].join('<br/>');
            },
        },
        xAxis: {
            type: 'category',
            data: tr.series.map((p) => String(p.year)),
            axisLine: { lineStyle: { color: c.axis } },
            axisLabel: {
                color: c.muted,
                formatter: (y) => (highlight.has(Number(y)) ? `{sel|${y}}` : y),
                rich: { sel: { fontWeight: 'bold', color: c.highlight } },
            },
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: c.muted, formatter: (v) => number.format(v) },
            splitLine: { lineStyle: { color: c.split } },
        },
        series: [
            {
                type: 'bar',
                name: t('charts.activity'),
                barMaxWidth: 28,
                data: tr.series.map((p) => ({
                    value: p.activity,
                    itemStyle: {
                        color: highlight.has(p.year) ? BAR_SELECTED : BAR,
                        borderRadius: [3, 3, 0, 0],
                    },
                })),
                markLine: {
                    silent: true,
                    symbol: 'none',
                    lineStyle: { color: c.muted, type: 'dashed', width: 1.5 },
                    label: {
                        color: c.muted,
                        formatter: () => `${t('charts.median')}: ${number.format(tr.median_activity)}`,
                        position: 'insideEndTop',
                    },
                    data: [{ yAxis: tr.median_activity }],
                },
            },
        ],
    };
}
