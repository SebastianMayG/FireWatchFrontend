import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Message from 'primevue/message';
import FireMap from '@/components/map/FireMap.vue';
import MapControls from '@/components/map/MapControls.vue';
import IndicatorCards from '@/components/indicators/IndicatorCards.vue';
import ChartCard from '@/components/charts/ChartCard.vue';
import ChartPlaceholder from '@/components/charts/ChartPlaceholder.vue';
import CalendarHeatmap from '@/components/charts/CalendarHeatmap.vue';
import { useAnalysisStore } from '@/stores/analysis';
import { useReport } from '@/composables/useReport';
const { t } = useI18n();
const store = useAnalysisStore();
const report = useReport();
const mapRefs = {};
function setMapRef(key, el) {
    mapRefs[key] = el ?? null;
}
const pdfReady = computed(() => !!store.bbox &&
    !!store.compare.data &&
    !!store.calendar.data &&
    !!store.trend.data &&
    !store.compare.loading &&
    !store.calendar.loading &&
    !store.trend.loading);
function downloadPdf() {
    void report.run(async () => {
        const { bbox, compare, calendar, trend } = store;
        if (!bbox || !compare.data || !calendar.data || !trend.data)
            return;
        // Uno después del otro: cada captura espera a que su mapa termine de dibujar
        const mapA = (await mapRefs.main?.capture()) ?? null;
        const mapB = (await mapRefs.compare?.capture()) ?? null;
        const { downloadCompareReport } = await import('@/pdf/report');
        await downloadCompareReport({
            bbox,
            compare: compare.data,
            calendar: calendar.data,
            trend: trend.data,
            maps: [mapA, mapB],
            median: report.median.value,
            t: report.translate,
            locale: report.locale.value,
        });
    });
}
// /compare solo se pide mientras esta vista está abierta
onMounted(() => (store.compareActive = true));
onBeforeUnmount(() => (store.compareActive = false));
// La comparación entre los dos años usa la métrica común que calcula el backend (basis):
// si algún año es anterior a 2012 no se usa la actividad escalada, para que el factor
// de calibración no decida cuál año "tuvo más" fuego.
const basis = computed(() => store.compare.data?.basis ?? null);
// Año con mayor actividad entre los dos comparados (si empatan, ambos)
const peakOfTwo = computed(() => basis.value?.peak_years ?? null);
const lowData = computed(() => {
    const b = basis.value;
    return b?.low_data ? t('indicators.lowData', { n: b.low_data_threshold }) : null;
});
const sides = [
    {
        key: 'main',
        label: 'map.mainPeriod',
        yearKey: 'selectedYear',
        indicators: computed(() => store.compare.data?.a ?? null),
        other: computed(() => store.compare.data?.b ?? null),
        selfValue: computed(() => basis.value?.a ?? null),
        otherValue: computed(() => basis.value?.b ?? null),
        otherPct: computed(() => basis.value?.pct_a_vs_b ?? null),
    },
    {
        key: 'compare',
        label: 'map.comparePeriod',
        yearKey: 'compareYear',
        indicators: computed(() => store.compare.data?.b ?? null),
        other: computed(() => store.compare.data?.a ?? null),
        selfValue: computed(() => basis.value?.b ?? null),
        otherValue: computed(() => basis.value?.a ?? null),
        otherPct: computed(() => basis.value?.pct_b_vs_a ?? null),
    },
];
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
void __VLS_ctx, __VLS_components, __VLS_intrinsics, __VLS_directives;
const __VLS_template = () => {
    __VLS_withDotValue(report, {});
    __VLS_withDotValue(pdfReady, {});
    __VLS_withDotValue(store, {});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-col gap-3 p-3 sm:gap-4 sm:p-4" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:gap-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:p-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-wrap items-center justify-between gap-2" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    let __VLS_0;
    /** @ts-ignore @type { | typeof Button} */
    Button;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        // @ts-ignore
        as: "router-link", to: "/", label: (__VLS_unwrap(t, {})('map.exitCompare')), icon: "pi pi-arrow-left", text: true, size: "small",
    }));
    const __VLS_2 = __VLS_1({
        as: "router-link",
        to: "/",
        label: (__VLS_unwrap(t, {})('map.exitCompare')),
        icon: "pi pi-arrow-left",
        text: true,
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_5;
    /** @ts-ignore @type { | typeof Button} */
    Button;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
        // @ts-ignore
        ...{ 'onClick': {} }, label: (__VLS_unwrap(t, {})(report.value.loading.value ? 'pdf.generating' : 'pdf.download')), icon: (report.value.loading.value ? 'pi pi-spin pi-spinner' : 'pi pi-file-pdf'), size: "small", severity: "secondary", disabled: (!pdfReady.value || report.value.loading.value),
    }));
    const __VLS_7 = __VLS_6({
        ...{ 'onClick': {} },
        label: (__VLS_unwrap(t, {})(report.value.loading.value ? 'pdf.generating' : 'pdf.download')),
        icon: (report.value.loading.value ? 'pi pi-spin pi-spinner' : 'pi pi-file-pdf'),
        size: "small",
        severity: "secondary",
        disabled: (!pdfReady.value || report.value.loading.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    let __VLS_10;
    const __VLS_11 = {
        /** @type {typeof __VLS_10.click} */
        onClick: (downloadPdf),
    };
    void __VLS_11;
    var __VLS_8;
    var __VLS_9;
    if (report.value.error.value) {
        let __VLS_12;
        /** @ts-ignore @type { | typeof Message | typeof Message} */
        Message;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
            // @ts-ignore
            ...{ 'onClose': {} }, severity: "error", closable: true,
        }));
        const __VLS_14 = __VLS_13({
            ...{ 'onClose': {} },
            severity: "error",
            closable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        let __VLS_17;
        const __VLS_18 = {
            /** @type {typeof __VLS_17.close} */
            onClose: (...[$event]) => {
                void $event;
                if (!(report.value.error.value))
                    throw 0;
                return (report.value.error.value = null);
                // @ts-ignore
                [t, t, report, report, report, report, report, pdfReady,];
            },
        };
        void __VLS_18;
        var __VLS_15;
        var __VLS_16;
        const { default: __VLS_19 } = __VLS_nonNull(__VLS_15.slots);
        (__VLS_unwrap(t, {})('pdf.error', { error: report.value.error.value }));
        // @ts-ignore
        [t, report,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "grid gap-4 lg:grid-cols-2" },
    });
    /** @type {__VLS_StyleScopedClasses['grid']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['lg:grid-cols-2']} */ ;
    const __VLS_20 = __VLS_tryAsConstant((__VLS_unwrap(sides, {})));
    for (const [side] of __VLS_vFor(__VLS_nonNull(__VLS_20))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)({
            key: (side.key),
            ...{ class: "flex flex-col gap-4" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
            ...{ class: "text-lg font-semibold" },
        });
        /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
        (__VLS_unwrap(t, {})(side.label));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "h-[50vh] min-h-[350px]" },
        });
        /** @type {__VLS_StyleScopedClasses['h-[50vh]']} */ ;
        /** @type {__VLS_StyleScopedClasses['min-h-[350px]']} */ ;
        const __VLS_21 = FireMap || FireMap;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
            // @ts-ignore
            ref: ((el) => setMapRef(side.key, el)), year: (store.value[side.yearKey]),
        }));
        const __VLS_23 = __VLS_22({
            ref: ((el) => setMapRef(side.key, el)),
            year: (store.value[side.yearKey]),
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
        var __VLS_24;
        const { default: __VLS_26 } = __VLS_nonNull(__VLS_24.slots);
        {
            const { controls: __VLS_27 } = __VLS_nonNull(__VLS_24.slots);
            const __VLS_28 = MapControls;
            // @ts-ignore
            const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
                // @ts-ignore
                ...{ 'onUpdate:modelValue': {} }, modelValue: (store.value[side.yearKey]), hideActions: true,
            }));
            const __VLS_30 = __VLS_29({
                ...{ 'onUpdate:modelValue': {} },
                modelValue: (store.value[side.yearKey]),
                hideActions: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_29));
            let __VLS_33;
            const __VLS_34 = {
                /** @type {typeof __VLS_33.'update:modelValue'} */
                'onUpdate:modelValue': ((y) => (store.value[side.yearKey] = y)),
            };
            void __VLS_34;
            var __VLS_31;
            var __VLS_32;
            // @ts-ignore
            [t, sides, store, store, store,];
        }
        // @ts-ignore
        [];
        const __VLS_35 = ChartCard || ChartCard;
        // @ts-ignore
        const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
            // @ts-ignore
            title: (__VLS_unwrap(t, {})('charts.calendar')), hint: (__VLS_unwrap(t, {})('charts.calendarHint')),
        }));
        const __VLS_37 = __VLS_36({
            title: (__VLS_unwrap(t, {})('charts.calendar')),
            hint: (__VLS_unwrap(t, {})('charts.calendarHint')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_36));
        var __VLS_38;
        const { default: __VLS_40 } = __VLS_nonNull(__VLS_38.slots);
        if (store.value.bbox) {
            const __VLS_41 = CalendarHeatmap;
            // @ts-ignore
            const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
                // @ts-ignore
                calendar: (store.value.calendar.data), year: (store.value[side.yearKey]), loading: (store.value.calendar.loading), error: (store.value.calendar.error),
            }));
            const __VLS_43 = __VLS_42({
                calendar: (store.value.calendar.data),
                year: (store.value[side.yearKey]),
                loading: (store.value.calendar.loading),
                error: (store.value.calendar.error),
            }, ...__VLS_functionalComponentArgsRest(__VLS_42));
        }
        else {
            const __VLS_46 = ChartPlaceholder || ChartPlaceholder;
            // @ts-ignore
            const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
                // @ts-ignore
                text: (__VLS_unwrap(t, {})('charts.selectAreaInDashboard')), icon: "pi-th-large",
            }));
            const __VLS_48 = __VLS_47({
                text: (__VLS_unwrap(t, {})('charts.selectAreaInDashboard')),
                icon: "pi-th-large",
            }, ...__VLS_functionalComponentArgsRest(__VLS_47));
            var __VLS_49;
            const { default: __VLS_51 } = __VLS_nonNull(__VLS_49.slots);
            let __VLS_52;
            /** @ts-ignore @type { | typeof Button} */
            Button;
            // @ts-ignore
            const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
                // @ts-ignore
                as: "router-link", to: "/", label: (__VLS_unwrap(t, {})('charts.goToDashboard')), icon: "pi pi-arrow-left", size: "small", severity: "secondary",
            }));
            const __VLS_54 = __VLS_53({
                as: "router-link",
                to: "/",
                label: (__VLS_unwrap(t, {})('charts.goToDashboard')),
                icon: "pi pi-arrow-left",
                size: "small",
                severity: "secondary",
            }, ...__VLS_functionalComponentArgsRest(__VLS_53));
            // @ts-ignore
            [t, t, t, t, store, store, store, store, store,];
        }
        // @ts-ignore
        [];
        const __VLS_57 = IndicatorCards;
        // @ts-ignore
        const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
            // @ts-ignore
            mode: "compare", data: (side.indicators.value), peakOfTwo: (__VLS_unwrap(peakOfTwo, {})), otherYear: (side.other.value?.year), selfValue: (side.selfValue.value), otherValue: (side.otherValue.value), otherPct: (side.otherPct.value), lowData: (__VLS_unwrap(lowData, {})), loading: (store.value.compare.loading), error: (store.value.compare.error),
        }));
        const __VLS_59 = __VLS_58({
            mode: "compare",
            data: (side.indicators.value),
            peakOfTwo: (__VLS_unwrap(peakOfTwo, {})),
            otherYear: (side.other.value?.year),
            selfValue: (side.selfValue.value),
            otherValue: (side.otherValue.value),
            otherPct: (side.otherPct.value),
            lowData: (__VLS_unwrap(lowData, {})),
            loading: (store.value.compare.loading),
            error: (store.value.compare.error),
        }, ...__VLS_functionalComponentArgsRest(__VLS_58));
        // @ts-ignore
        [store, store, peakOfTwo, lowData,];
    }
    // @ts-ignore
    [];
    return {};
};
void [__VLS_template];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
