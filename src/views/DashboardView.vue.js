import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Message from 'primevue/message';
import FireMap from '@/components/map/FireMap.vue';
import MapControls from '@/components/map/MapControls.vue';
import IndicatorCards from '@/components/indicators/IndicatorCards.vue';
import ChartCard from '@/components/charts/ChartCard.vue';
import ChartPlaceholder from '@/components/charts/ChartPlaceholder.vue';
import CalendarHeatmap from '@/components/charts/CalendarHeatmap.vue';
import TrendChart from '@/components/charts/TrendChart.vue';
import { useAnalysisStore } from '@/stores/analysis';
import { useReport } from '@/composables/useReport';
const { t } = useI18n();
const store = useAnalysisStore();
const mapSection = ref();
const fireMap = ref();
const report = useReport();
// El PDF usa los datos ya cargados en el store (no hace consultas extra)
const pdfReady = computed(() => !!store.bbox &&
    !!store.indicators.data &&
    !!store.calendar.data &&
    !!store.trend.data &&
    !store.indicators.loading &&
    !store.calendar.loading &&
    !store.trend.loading);
function downloadPdf() {
    void report.run(async () => {
        const { bbox, indicators, calendar, trend } = store;
        if (!bbox || !indicators.data || !calendar.data || !trend.data)
            return;
        const map = (await fireMap.value?.capture()) ?? null;
        const { downloadAreaReport } = await import('@/pdf/report');
        await downloadAreaReport({
            year: store.selectedYear,
            bbox,
            indicators: indicators.data,
            calendar: calendar.data,
            trend: trend.data,
            map,
            median: report.median.value,
            t: report.translate,
            locale: report.locale.value,
        });
    });
}
// Activa el modo selección y sube al mapa para que el usuario dibuje el área
function startSelection() {
    store.isSelecting = true;
    mapSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
void __VLS_ctx, __VLS_components, __VLS_intrinsics, __VLS_directives;
const __VLS_template = () => {
    __VLS_withDotValue(store, {});
    __VLS_withDotValue(report, {});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-col gap-3 p-3 sm:gap-4 sm:p-4" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:gap-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:p-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
        ref: "mapSection",
        ...{ class: "h-[60vh] min-h-[360px] sm:min-h-[400px]" },
    });
    /** @type {__VLS_StyleScopedClasses['h-[60vh]']} */ ;
    /** @type {__VLS_StyleScopedClasses['min-h-[360px]']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:min-h-[400px]']} */ ;
    const __VLS_0 = FireMap || FireMap;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        // @ts-ignore
        ref: "fireMap", selectable: true, year: (store.value.selectedYear),
    }));
    const __VLS_2 = __VLS_1({
        ref: "fireMap",
        selectable: true,
        year: (store.value.selectedYear),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_3;
    const { default: __VLS_5 } = __VLS_nonNull(__VLS_3.slots);
    {
        const { controls: __VLS_6 } = __VLS_nonNull(__VLS_3.slots);
        const __VLS_7 = MapControls;
        // @ts-ignore
        const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
            // @ts-ignore
            ...{ 'onPdf': {} }, modelValue: (store.value.selectedYear), pdfReady: (__VLS_unwrap(pdfReady, {})), pdfLoading: (report.value.loading.value),
        }));
        const __VLS_9 = __VLS_8({
            ...{ 'onPdf': {} },
            modelValue: (store.value.selectedYear),
            pdfReady: (__VLS_unwrap(pdfReady, {})),
            pdfLoading: (report.value.loading.value),
        }, ...__VLS_functionalComponentArgsRest(__VLS_8));
        let __VLS_12;
        const __VLS_13 = {
            /** @type {typeof __VLS_12.pdf} */
            onPdf: (downloadPdf),
        };
        void __VLS_13;
        var __VLS_10;
        var __VLS_11;
        // @ts-ignore
        [store, store, pdfReady, report,];
    }
    // @ts-ignore
    [];
    if (report.value.error.value) {
        let __VLS_14;
        /** @ts-ignore @type { | typeof Message | typeof Message} */
        Message;
        // @ts-ignore
        const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
            // @ts-ignore
            ...{ 'onClose': {} }, severity: "error", closable: true,
        }));
        const __VLS_16 = __VLS_15({
            ...{ 'onClose': {} },
            severity: "error",
            closable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_15));
        let __VLS_19;
        const __VLS_20 = {
            /** @type {typeof __VLS_19.close} */
            onClose: (...[$event]) => {
                void $event;
                if (!(report.value.error.value))
                    throw 0;
                return (report.value.error.value = null);
                // @ts-ignore
                [report, report,];
            },
        };
        void __VLS_20;
        var __VLS_17;
        var __VLS_18;
        const { default: __VLS_21 } = __VLS_nonNull(__VLS_17.slots);
        (__VLS_unwrap(t, {})('pdf.error', { error: report.value.error.value }));
        // @ts-ignore
        [report, t,];
    }
    const __VLS_22 = IndicatorCards;
    // @ts-ignore
    const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
        // @ts-ignore
        data: (store.value.indicators.data), loading: (store.value.indicators.loading), error: (store.value.indicators.error),
    }));
    const __VLS_24 = __VLS_23({
        data: (store.value.indicators.data),
        loading: (store.value.indicators.loading),
        error: (store.value.indicators.error),
    }, ...__VLS_functionalComponentArgsRest(__VLS_23));
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
        ...{ class: "grid gap-4 lg:grid-cols-2" },
    });
    /** @type {__VLS_StyleScopedClasses['grid']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['lg:grid-cols-2']} */ ;
    const __VLS_27 = ChartCard || ChartCard;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
        // @ts-ignore
        title: (__VLS_unwrap(t, {})('charts.calendar')), hint: (__VLS_unwrap(t, {})('charts.calendarHint')),
    }));
    const __VLS_29 = __VLS_28({
        title: (__VLS_unwrap(t, {})('charts.calendar')),
        hint: (__VLS_unwrap(t, {})('charts.calendarHint')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    var __VLS_30;
    const { default: __VLS_32 } = __VLS_nonNull(__VLS_30.slots);
    if (store.value.bbox) {
        const __VLS_33 = CalendarHeatmap;
        // @ts-ignore
        const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
            // @ts-ignore
            calendar: (store.value.calendar.data), year: (store.value.selectedYear), loading: (store.value.calendar.loading), error: (store.value.calendar.error),
        }));
        const __VLS_35 = __VLS_34({
            calendar: (store.value.calendar.data),
            year: (store.value.selectedYear),
            loading: (store.value.calendar.loading),
            error: (store.value.calendar.error),
        }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    }
    else {
        const __VLS_38 = ChartPlaceholder || ChartPlaceholder;
        // @ts-ignore
        const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
            // @ts-ignore
            text: (__VLS_unwrap(t, {})('charts.selectAreaToSee')), icon: "pi-th-large",
        }));
        const __VLS_40 = __VLS_39({
            text: (__VLS_unwrap(t, {})('charts.selectAreaToSee')),
            icon: "pi-th-large",
        }, ...__VLS_functionalComponentArgsRest(__VLS_39));
        var __VLS_41;
        const { default: __VLS_43 } = __VLS_nonNull(__VLS_41.slots);
        let __VLS_44;
        /** @ts-ignore @type { | typeof Button} */
        Button;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
            // @ts-ignore
            ...{ 'onClick': {} }, label: (__VLS_unwrap(t, {})('map.selectArea')), icon: "pi pi-expand", size: "small",
        }));
        const __VLS_46 = __VLS_45({
            ...{ 'onClick': {} },
            label: (__VLS_unwrap(t, {})('map.selectArea')),
            icon: "pi pi-expand",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_45));
        let __VLS_49;
        const __VLS_50 = {
            /** @type {typeof __VLS_49.click} */
            onClick: (startSelection),
        };
        void __VLS_50;
        var __VLS_47;
        var __VLS_48;
        // @ts-ignore
        [store, store, store, store, store, store, store, store, t, t, t, t,];
    }
    // @ts-ignore
    [];
    const __VLS_51 = ChartCard || ChartCard;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        // @ts-ignore
        title: (__VLS_unwrap(t, {})('charts.trend')), hint: (__VLS_unwrap(t, {})('charts.trendHint')),
    }));
    const __VLS_53 = __VLS_52({
        title: (__VLS_unwrap(t, {})('charts.trend')),
        hint: (__VLS_unwrap(t, {})('charts.trendHint')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    var __VLS_54;
    const { default: __VLS_56 } = __VLS_nonNull(__VLS_54.slots);
    if (store.value.bbox) {
        const __VLS_57 = TrendChart;
        // @ts-ignore
        const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
            // @ts-ignore
            trend: (store.value.trend.data), year: (store.value.selectedYear), loading: (store.value.trend.loading), error: (store.value.trend.error),
        }));
        const __VLS_59 = __VLS_58({
            trend: (store.value.trend.data),
            year: (store.value.selectedYear),
            loading: (store.value.trend.loading),
            error: (store.value.trend.error),
        }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    }
    else {
        const __VLS_62 = ChartPlaceholder || ChartPlaceholder;
        // @ts-ignore
        const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
            // @ts-ignore
            text: (__VLS_unwrap(t, {})('charts.selectAreaToSeeTrend')), icon: "pi-chart-bar",
        }));
        const __VLS_64 = __VLS_63({
            text: (__VLS_unwrap(t, {})('charts.selectAreaToSeeTrend')),
            icon: "pi-chart-bar",
        }, ...__VLS_functionalComponentArgsRest(__VLS_63));
        var __VLS_65;
        const { default: __VLS_67 } = __VLS_nonNull(__VLS_65.slots);
        let __VLS_68;
        /** @ts-ignore @type { | typeof Button} */
        Button;
        // @ts-ignore
        const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
            // @ts-ignore
            ...{ 'onClick': {} }, label: (__VLS_unwrap(t, {})('map.selectArea')), icon: "pi pi-expand", size: "small",
        }));
        const __VLS_70 = __VLS_69({
            ...{ 'onClick': {} },
            label: (__VLS_unwrap(t, {})('map.selectArea')),
            icon: "pi pi-expand",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_69));
        let __VLS_73;
        const __VLS_74 = {
            /** @type {typeof __VLS_73.click} */
            onClick: (startSelection),
        };
        void __VLS_74;
        var __VLS_71;
        var __VLS_72;
        // @ts-ignore
        [store, store, store, store, store, t, t, t, t,];
    }
    // @ts-ignore
    [];
    // @ts-ignore
    [];
    return {};
};
void [__VLS_template];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
