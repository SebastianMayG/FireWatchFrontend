import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Card from 'primevue/card';
import Message from 'primevue/message';
import Skeleton from 'primevue/skeleton';
import { useAnalysisStore } from '@/stores/analysis';
const { defineProps, } = {};
const props = defineProps();
const { t, locale } = useI18n();
const store = useAnalysisStore();
const noData = computed(() => t('common.noData'));
// useGrouping 'always': en español Intl no separa miles en números de 4 cifras ("2024" parecería un año).
// El cast es porque los tipos de TS del proyecto aún no incluyen el valor 'always' (ES2023).
const NUMBER_OPTIONS = {
    maximumFractionDigits: 0,
    useGrouping: 'always',
};
const number = computed(() => new Intl.NumberFormat(locale.value, NUMBER_OPTIONS));
const monthName = computed(() => new Intl.DateTimeFormat(locale.value, { month: 'short' }));
// Periodo de la mediana (años completos), p. ej. 2001-2025
const medianPeriod = computed(() => {
    const years = store.meta?.complete_years ?? [];
    return { from: years[0] ?? 2001, to: years[years.length - 1] ?? 2025 };
});
function formatPct(v) {
    if (v === null || v === undefined)
        return noData.value;
    const sign = v > 0 ? '+' : '';
    return `${sign}${new Intl.NumberFormat(locale.value, { maximumFractionDigits: 1 }).format(v)} %`;
}
// Más actividad = peor (rojo); menos = verde
function tone(v) {
    if (v === null || v === undefined || v === 0)
        return '';
    return v > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-700 dark:text-green-400';
}
function detailVs(value, ref) {
    if (ref === null || ref === undefined)
        return undefined;
    return t('indicators.detailVs', {
        value: number.value.format(value),
        ref: number.value.format(ref),
    });
}
const items = computed(() => {
    const d = props.data;
    const compare = props.mode === 'compare';
    const months = d?.top_months.length
        ? d.top_months.map((m) => monthName.value.format(new Date(2000, m.month - 1, 1))).join(', ')
        : noData.value;
    const peak = compare
        ? props.peakOfTwo?.length
            ? props.peakOfTwo.join(' / ')
            : noData.value
        : (d?.peak_year ?? noData.value);
    const list = [
        {
            key: 'hotspots',
            label: t('indicators.hotspots'),
            icon: 'pi-map-marker',
            // Actividad de fuego (cuadritos de 1 km con fuego por día): es lo que suma el calendario.
            // Los puntos de satélite van como dato secundario porque dependen de cuántos satélites había.
            value: d ? number.value.format(d.activity) : noData.value,
            detail: d
                ? t('indicators.satellitePoints', { n: number.value.format(d.detections) })
                : undefined,
            title: t('indicators.activityUnit'),
        },
        {
            key: 'peakYear',
            label: t(compare ? 'indicators.peakYearOfTwo' : 'indicators.peakYear'),
            icon: 'pi-calendar',
            value: peak,
        },
        {
            key: 'peakMonths',
            label: t('indicators.peakMonths'),
            icon: 'pi-chart-bar',
            value: months,
        },
        {
            key: 'vsMedian',
            label: t('indicators.vsMedianPeriod', medianPeriod.value),
            icon: 'pi-arrow-right-arrow-left',
            value: formatPct(d?.vs_median_pct),
            tone: tone(d?.vs_median_pct),
            title: t('indicators.activityUnit'),
            detail: d ? detailVs(d.activity, d.median_activity) : undefined,
        },
    ];
    list.push(compare
        ? {
            key: 'vsOther',
            label: props.otherYear
                ? t('indicators.vsOtherYear', { year: props.otherYear })
                : t('indicators.vsOther'),
            icon: 'pi-sort-alt',
            value: formatPct(props.otherPct),
            tone: tone(props.otherPct),
            title: t('indicators.activityUnit'),
            detail: props.selfValue !== null && props.selfValue !== undefined
                ? detailVs(props.selfValue, props.otherValue)
                : undefined,
        }
        : {
            key: 'yearsAnalyzed',
            label: t('indicators.yearsAnalyzed'),
            icon: 'pi-history',
            value: d?.years_analyzed ?? noData.value,
        });
    return list;
});
// Solo se avisa del año parcial (2000); los años 2000-2011 están armonizados y no se marcan
const note = computed(() => (props.data?.partial ? t('indicators.partialNote') : null));
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
void __VLS_ctx, __VLS_components, __VLS_intrinsics, __VLS_directives;
const __VLS_template = () => {
    __VLS_withDotValue(store, {});
    __VLS_withDotValue(note, {});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-col gap-2" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-1.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-surface-500']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:text-surface-400']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
        ...{ class: (['pi text-[10px]', store.value.bbox ? 'pi-expand' : 'pi-globe']) },
    });
    /** @type {__VLS_StyleScopedClasses['pi']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
    (__VLS_unwrap(t, {})('indicators.scope', {
        area: __VLS_unwrap(t, {})(store.value.bbox ? 'indicators.scopeArea' : 'indicators.scopeMexico'),
    }));
    if (__VLS_ctx.mode === 'compare') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex flex-col gap-2" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
        const __VLS_0 = __VLS_tryAsConstant((__VLS_unwrap(items, {})));
        for (const [item] of __VLS_vFor(__VLS_nonNull(__VLS_0))) {
            let __VLS_1;
            /** @ts-ignore @type { | typeof Card | typeof Card} */
            Card;
            // @ts-ignore
            const __VLS_2 = __VLS_asFunctionalComponent1(__VLS_1, new __VLS_1({
                // @ts-ignore
                key: (item.key), pt: ({ body: { class: 'p-3' } }),
            }));
            const __VLS_3 = __VLS_2({
                key: (item.key),
                pt: ({ body: { class: 'p-3' } }),
            }, ...__VLS_functionalComponentArgsRest(__VLS_2));
            var __VLS_4;
            const { default: __VLS_6 } = __VLS_nonNull(__VLS_4.slots);
            {
                const { content: __VLS_7 } = __VLS_nonNull(__VLS_4.slots);
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "flex items-center justify-between gap-4" },
                    title: (item.title),
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
                /** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "flex min-w-0 items-center gap-2.5" },
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
                /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['gap-2.5']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
                    ...{ class: (['pi', item.icon, 'text-base text-primary']) },
                });
                /** @type {__VLS_StyleScopedClasses['pi']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-base']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                    ...{ class: "text-sm text-surface-600 dark:text-surface-300" },
                });
                /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-surface-600']} */ ;
                /** @type {__VLS_StyleScopedClasses['dark:text-surface-300']} */ ;
                (item.label);
                if (__VLS_ctx.loading && !__VLS_ctx.data) {
                    let __VLS_8;
                    /** @ts-ignore @type { | typeof Skeleton} */
                    Skeleton;
                    // @ts-ignore
                    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
                        // @ts-ignore
                        height: "1.5rem", width: "5rem",
                    }));
                    const __VLS_10 = __VLS_9({
                        height: "1.5rem",
                        width: "5rem",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
                }
                else {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        ...{ class: "shrink-0 text-right" },
                    });
                    /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
                    /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                        ...{ class: (['text-lg font-semibold', item.tone]) },
                    });
                    /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
                    /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
                    (item.value);
                    if (item.detail) {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                            ...{ class: "text-xs text-surface-500 dark:text-surface-400" },
                        });
                        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
                        /** @type {__VLS_StyleScopedClasses['text-surface-500']} */ ;
                        /** @type {__VLS_StyleScopedClasses['dark:text-surface-400']} */ ;
                        (item.detail);
                    }
                }
                // @ts-ignore
                [store, store, t, t, mode, items, loading, data,];
            }
            // @ts-ignore
            [];
            // @ts-ignore
            [];
        }
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5" },
        });
        /** @type {__VLS_StyleScopedClasses['grid']} */ ;
        /** @type {__VLS_StyleScopedClasses['grid-cols-2']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['md:grid-cols-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['xl:grid-cols-5']} */ ;
        const __VLS_13 = __VLS_tryAsConstant((__VLS_unwrap(items, {})));
        for (const [item] of __VLS_vFor(__VLS_nonNull(__VLS_13))) {
            let __VLS_14;
            /** @ts-ignore @type { | typeof Card | typeof Card} */
            Card;
            // @ts-ignore
            const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
                // @ts-ignore
                key: (item.key),
            }));
            const __VLS_16 = __VLS_15({
                key: (item.key),
            }, ...__VLS_functionalComponentArgsRest(__VLS_15));
            var __VLS_17;
            const { default: __VLS_19 } = __VLS_nonNull(__VLS_17.slots);
            {
                const { content: __VLS_20 } = __VLS_nonNull(__VLS_17.slots);
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "flex items-start gap-2.5" },
                    title: (item.title),
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['items-start']} */ ;
                /** @type {__VLS_StyleScopedClasses['gap-2.5']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
                    ...{ class: (['pi', item.icon, 'mt-0.5 text-base text-primary']) },
                });
                /** @type {__VLS_StyleScopedClasses['pi']} */ ;
                /** @type {__VLS_StyleScopedClasses['mt-0.5']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-base']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "min-w-0" },
                });
                /** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                    ...{ class: "text-xs text-surface-500 dark:text-surface-400" },
                });
                /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-surface-500']} */ ;
                /** @type {__VLS_StyleScopedClasses['dark:text-surface-400']} */ ;
                (item.label);
                if (__VLS_ctx.loading && !__VLS_ctx.data) {
                    let __VLS_21;
                    /** @ts-ignore @type { | typeof Skeleton} */
                    Skeleton;
                    // @ts-ignore
                    const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
                        // @ts-ignore
                        height: "1.5rem", width: "5rem", ...{ class: "mt-1" },
                    }));
                    const __VLS_23 = __VLS_22({
                        height: "1.5rem",
                        width: "5rem",
                        ...{ class: "mt-1" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
                    /** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
                }
                else {
                    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                        ...{ class: (['text-lg font-semibold break-words', item.tone]) },
                    });
                    /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
                    /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
                    /** @type {__VLS_StyleScopedClasses['break-words']} */ ;
                    (item.value);
                    if (item.detail) {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                            ...{ class: "text-xs text-surface-500 dark:text-surface-400" },
                        });
                        /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
                        /** @type {__VLS_StyleScopedClasses['text-surface-500']} */ ;
                        /** @type {__VLS_StyleScopedClasses['dark:text-surface-400']} */ ;
                        (item.detail);
                    }
                }
                // @ts-ignore
                [items, loading, data,];
            }
            // @ts-ignore
            [];
            // @ts-ignore
            [];
        }
    }
    if (__VLS_ctx.error) {
        let __VLS_26;
        /** @ts-ignore @type { | typeof Message | typeof Message} */
        Message;
        // @ts-ignore
        const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
            // @ts-ignore
            severity: "error", size: "small", variant: "simple",
        }));
        const __VLS_28 = __VLS_27({
            severity: "error",
            size: "small",
            variant: "simple",
        }, ...__VLS_functionalComponentArgsRest(__VLS_27));
        var __VLS_29;
        const { default: __VLS_31 } = __VLS_nonNull(__VLS_29.slots);
        (__VLS_unwrap(t, {})('errors.request', { error: __VLS_ctx.error }));
        // @ts-ignore
        [t, error, error,];
    }
    else {
        if (__VLS_ctx.lowData) {
            let __VLS_32;
            /** @ts-ignore @type { | typeof Message | typeof Message} */
            Message;
            // @ts-ignore
            const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
                // @ts-ignore
                severity: "warn", size: "small", icon: "pi pi-exclamation-triangle",
            }));
            const __VLS_34 = __VLS_33({
                severity: "warn",
                size: "small",
                icon: "pi pi-exclamation-triangle",
            }, ...__VLS_functionalComponentArgsRest(__VLS_33));
            var __VLS_35;
            const { default: __VLS_37 } = __VLS_nonNull(__VLS_35.slots);
            (__VLS_ctx.lowData);
            // @ts-ignore
            [lowData, lowData,];
        }
        if (note.value) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                ...{ class: "text-xs text-surface-500 dark:text-surface-400" },
            });
            /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-surface-500']} */ ;
            /** @type {__VLS_StyleScopedClasses['dark:text-surface-400']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
                ...{ class: "pi pi-info-circle mr-1 text-[10px]" },
            });
            /** @type {__VLS_StyleScopedClasses['pi']} */ ;
            /** @type {__VLS_StyleScopedClasses['pi-info-circle']} */ ;
            /** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-[10px]']} */ ;
            (note.value);
        }
    }
    // @ts-ignore
    [note, note,];
    return {};
};
void [__VLS_template];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
