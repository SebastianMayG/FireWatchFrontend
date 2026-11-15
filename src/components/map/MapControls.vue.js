import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Select from 'primevue/select';
import vTooltip from 'primevue/tooltip';
import { useAnalysisStore } from '@/stores/analysis';
import { csvUrl } from '@/api/client';
const { defineProps, defineEmits, defineModel, } = {};
const __VLS_props = defineProps();
const emit = defineEmits();
const year = defineModel({ required: true });
const { t } = useI18n();
const store = useAnalysisStore();
const hasArea = computed(() => store.ready && store.bbox !== null);
// Sin área: tooltip explicando por qué están deshabilitados. Con área: sin tooltip.
const needAreaTip = computed(() => (hasArea.value ? undefined : t('map.needArea')));
const csvHref = computed(() => csvUrl(year.value, store.bbox));
let __VLS_modelEmit;
const __VLS_ctx = {
    ...{},
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
    __VLS_withDotValue(hasArea, {});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex flex-wrap items-center justify-end gap-1 rounded-lg bg-surface-0/90 p-1.5 shadow-md backdrop-blur sm:gap-2 sm:p-2 dark:bg-surface-900/90" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-end']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-surface-0/90']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-1.5']} */ ;
    /** @type {__VLS_StyleScopedClasses['shadow-md']} */ ;
    /** @type {__VLS_StyleScopedClasses['backdrop-blur']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:gap-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:p-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-surface-900/90']} */ ;
    let __VLS_0;
    /** @ts-ignore @type { | typeof Select} */
    Select;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        // @ts-ignore
        modelValue: (__VLS_unwrap(year, {})), options: (store.value.availableYears), 'aria-label': (__VLS_unwrap(t, {})('map.year')), size: "small", ...{ class: "w-24 sm:w-28" },
    }));
    const __VLS_2 = __VLS_1({
        modelValue: (__VLS_unwrap(year, {})),
        options: (store.value.availableYears),
        'aria-label': (__VLS_unwrap(t, {})('map.year')),
        size: "small",
        ...{ class: "w-24 sm:w-28" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    /** @type {__VLS_StyleScopedClasses['w-24']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:w-28']} */ ;
    if (!__VLS_ctx.hideActions) {
        let __VLS_5;
        /** @ts-ignore @type { | typeof Button | typeof Button} */
        Button;
        // @ts-ignore
        const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
            // @ts-ignore
            ...{ 'onClick': {} }, size: "small", severity: (store.value.isSelecting ? 'primary' : 'secondary'), 'aria-label': (__VLS_unwrap(t, {})(store.value.isSelecting ? 'map.cancelSelection' : 'map.selectArea')), 'aria-pressed': (store.value.isSelecting),
        }));
        const __VLS_7 = __VLS_6({
            ...{ 'onClick': {} },
            size: "small",
            severity: (store.value.isSelecting ? 'primary' : 'secondary'),
            'aria-label': (__VLS_unwrap(t, {})(store.value.isSelecting ? 'map.cancelSelection' : 'map.selectArea')),
            'aria-pressed': (store.value.isSelecting),
        }, ...__VLS_functionalComponentArgsRest(__VLS_6));
        let __VLS_10;
        const __VLS_11 = {
            /** @type {typeof __VLS_10.click} */
            onClick: (...[$event]) => {
                void $event;
                if (!(!__VLS_ctx.hideActions))
                    throw 0;
                return (store.value.isSelecting = !store.value.isSelecting);
                // @ts-ignore
                [year, store, store, store, store, store, store, t, t, hideActions,];
            },
        };
        void __VLS_11;
        var __VLS_8;
        var __VLS_9;
        const { default: __VLS_12 } = __VLS_nonNull(__VLS_8.slots);
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
            ...{ class: (['pi', store.value.isSelecting ? 'pi-times' : 'pi-expand']) },
        });
        /** @type {__VLS_StyleScopedClasses['pi']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "hidden sm:inline" },
        });
        /** @type {__VLS_StyleScopedClasses['hidden']} */ ;
        /** @type {__VLS_StyleScopedClasses['sm:inline']} */ ;
        (__VLS_unwrap(t, {})(store.value.isSelecting ? 'map.cancelSelection' : 'map.selectArea'));
        // @ts-ignore
        [store, store, t,];
        if (store.value.bbox && !store.value.isSelecting) {
            let __VLS_13;
            /** @ts-ignore @type { | typeof Button | typeof Button} */
            Button;
            // @ts-ignore
            const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
                // @ts-ignore
                ...{ 'onClick': {} }, size: "small", severity: "secondary", text: true, 'aria-label': (__VLS_unwrap(t, {})('map.clearSelection')),
            }));
            const __VLS_15 = __VLS_14({
                ...{ 'onClick': {} },
                size: "small",
                severity: "secondary",
                text: true,
                'aria-label': (__VLS_unwrap(t, {})('map.clearSelection')),
            }, ...__VLS_functionalComponentArgsRest(__VLS_14));
            let __VLS_18;
            const __VLS_19 = {
                /** @type {typeof __VLS_18.click} */
                onClick: (...[$event]) => {
                    void $event;
                    if (!(!__VLS_ctx.hideActions))
                        throw 0;
                    if (!(store.value.bbox && !store.value.isSelecting))
                        throw 0;
                    return (store.value.setBBox(null));
                    // @ts-ignore
                    [store, store, store, t,];
                },
            };
            void __VLS_19;
            const __VLS_20 = __VLS_asFunctionalDirective(__VLS_directives.vTooltip, {});
            __VLS_20(__VLS_nonNull(null), { ...__VLS_directiveBindingRestFields, modifiers: { bottom: true, }, value: (__VLS_unwrap(t, {})('map.clearSelection')), }, ...__VLS_directiveHookArgsRest(__VLS_20));
            var __VLS_16;
            var __VLS_17;
            const { default: __VLS_21 } = __VLS_nonNull(__VLS_16.slots);
            __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
                ...{ class: "pi pi-eraser" },
            });
            /** @type {__VLS_StyleScopedClasses['pi']} */ ;
            /** @type {__VLS_StyleScopedClasses['pi-eraser']} */ ;
            // @ts-ignore
            [t, vTooltip,];
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        const __VLS_22 = __VLS_asFunctionalDirective(__VLS_directives.vTooltip, {});
        __VLS_22(__VLS_nonNull(null), { ...__VLS_directiveBindingRestFields, modifiers: { bottom: true, }, value: (__VLS_unwrap(needAreaTip, {})), }, ...__VLS_directiveHookArgsRest(__VLS_22));
        if (hasArea.value) {
            let __VLS_23;
            /** @ts-ignore @type { | typeof Button | typeof Button} */
            Button;
            // @ts-ignore
            const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
                // @ts-ignore
                as: "router-link", to: "/compare", size: "small", severity: "secondary", 'aria-label': (__VLS_unwrap(t, {})('map.compare')),
            }));
            const __VLS_25 = __VLS_24({
                as: "router-link",
                to: "/compare",
                size: "small",
                severity: "secondary",
                'aria-label': (__VLS_unwrap(t, {})('map.compare')),
            }, ...__VLS_functionalComponentArgsRest(__VLS_24));
            var __VLS_26;
            const { default: __VLS_28 } = __VLS_nonNull(__VLS_26.slots);
            __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
                ...{ class: "pi pi-clone" },
            });
            /** @type {__VLS_StyleScopedClasses['pi']} */ ;
            /** @type {__VLS_StyleScopedClasses['pi-clone']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "hidden sm:inline" },
            });
            /** @type {__VLS_StyleScopedClasses['hidden']} */ ;
            /** @type {__VLS_StyleScopedClasses['sm:inline']} */ ;
            (__VLS_unwrap(t, {})('map.compare'));
            // @ts-ignore
            [t, t, vTooltip, needAreaTip, hasArea,];
        }
        else {
            let __VLS_29;
            /** @ts-ignore @type { | typeof Button | typeof Button} */
            Button;
            // @ts-ignore
            const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
                // @ts-ignore
                size: "small", severity: "secondary", 'aria-label': (__VLS_unwrap(t, {})('map.compare')), disabled: true,
            }));
            const __VLS_31 = __VLS_30({
                size: "small",
                severity: "secondary",
                'aria-label': (__VLS_unwrap(t, {})('map.compare')),
                disabled: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_30));
            var __VLS_32;
            const { default: __VLS_34 } = __VLS_nonNull(__VLS_32.slots);
            __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
                ...{ class: "pi pi-clone" },
            });
            /** @type {__VLS_StyleScopedClasses['pi']} */ ;
            /** @type {__VLS_StyleScopedClasses['pi-clone']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "hidden sm:inline" },
            });
            /** @type {__VLS_StyleScopedClasses['hidden']} */ ;
            /** @type {__VLS_StyleScopedClasses['sm:inline']} */ ;
            (__VLS_unwrap(t, {})('map.compare'));
            // @ts-ignore
            [t, t,];
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        const __VLS_35 = __VLS_asFunctionalDirective(__VLS_directives.vTooltip, {});
        __VLS_35(__VLS_nonNull(null), { ...__VLS_directiveBindingRestFields, modifiers: { bottom: true, }, value: (__VLS_unwrap(needAreaTip, {})), }, ...__VLS_directiveHookArgsRest(__VLS_35));
        if (hasArea.value) {
            let __VLS_36;
            /** @ts-ignore @type { | typeof Button | typeof Button} */
            Button;
            // @ts-ignore
            const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
                // @ts-ignore
                as: "a", href: (__VLS_unwrap(csvHref, {})), download: true, size: "small", severity: "secondary", 'aria-label': (__VLS_unwrap(t, {})('map.csv')),
            }));
            const __VLS_38 = __VLS_37({
                as: "a",
                href: (__VLS_unwrap(csvHref, {})),
                download: true,
                size: "small",
                severity: "secondary",
                'aria-label': (__VLS_unwrap(t, {})('map.csv')),
            }, ...__VLS_functionalComponentArgsRest(__VLS_37));
            var __VLS_39;
            const { default: __VLS_41 } = __VLS_nonNull(__VLS_39.slots);
            __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
                ...{ class: "pi pi-download" },
            });
            /** @type {__VLS_StyleScopedClasses['pi']} */ ;
            /** @type {__VLS_StyleScopedClasses['pi-download']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "hidden sm:inline" },
            });
            /** @type {__VLS_StyleScopedClasses['hidden']} */ ;
            /** @type {__VLS_StyleScopedClasses['sm:inline']} */ ;
            (__VLS_unwrap(t, {})('map.csv'));
            // @ts-ignore
            [t, t, vTooltip, needAreaTip, hasArea, csvHref,];
        }
        else {
            let __VLS_42;
            /** @ts-ignore @type { | typeof Button | typeof Button} */
            Button;
            // @ts-ignore
            const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
                // @ts-ignore
                size: "small", severity: "secondary", 'aria-label': (__VLS_unwrap(t, {})('map.csv')), disabled: true,
            }));
            const __VLS_44 = __VLS_43({
                size: "small",
                severity: "secondary",
                'aria-label': (__VLS_unwrap(t, {})('map.csv')),
                disabled: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_43));
            var __VLS_45;
            const { default: __VLS_47 } = __VLS_nonNull(__VLS_45.slots);
            __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
                ...{ class: "pi pi-download" },
            });
            /** @type {__VLS_StyleScopedClasses['pi']} */ ;
            /** @type {__VLS_StyleScopedClasses['pi-download']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "hidden sm:inline" },
            });
            /** @type {__VLS_StyleScopedClasses['hidden']} */ ;
            /** @type {__VLS_StyleScopedClasses['sm:inline']} */ ;
            (__VLS_unwrap(t, {})('map.csv'));
            // @ts-ignore
            [t, t,];
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        const __VLS_48 = __VLS_asFunctionalDirective(__VLS_directives.vTooltip, {});
        __VLS_48(__VLS_nonNull(null), { ...__VLS_directiveBindingRestFields, modifiers: { bottom: true, }, value: (__VLS_unwrap(needAreaTip, {})), }, ...__VLS_directiveHookArgsRest(__VLS_48));
        let __VLS_49;
        /** @ts-ignore @type { | typeof Button | typeof Button} */
        Button;
        // @ts-ignore
        const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
            // @ts-ignore
            ...{ 'onClick': {} }, size: "small", severity: "secondary", 'aria-label': (__VLS_unwrap(t, {})('map.pdf')), disabled: (!hasArea.value || !__VLS_ctx.pdfReady || __VLS_ctx.pdfLoading),
        }));
        const __VLS_51 = __VLS_50({
            ...{ 'onClick': {} },
            size: "small",
            severity: "secondary",
            'aria-label': (__VLS_unwrap(t, {})('map.pdf')),
            disabled: (!hasArea.value || !__VLS_ctx.pdfReady || __VLS_ctx.pdfLoading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_50));
        let __VLS_54;
        const __VLS_55 = {
            /** @type {typeof __VLS_54.click} */
            onClick: (...[$event]) => {
                void $event;
                if (!(!__VLS_ctx.hideActions))
                    throw 0;
                return (__VLS_unwrap(emit, {})('pdf'));
                // @ts-ignore
                [t, vTooltip, needAreaTip, hasArea, pdfReady, pdfLoading, emit,];
            },
        };
        void __VLS_55;
        var __VLS_52;
        var __VLS_53;
        const { default: __VLS_56 } = __VLS_nonNull(__VLS_52.slots);
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
            ...{ class: (['pi', __VLS_ctx.pdfLoading ? 'pi-spin pi-spinner' : 'pi-file-pdf']) },
        });
        /** @type {__VLS_StyleScopedClasses['pi']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "hidden sm:inline" },
        });
        /** @type {__VLS_StyleScopedClasses['hidden']} */ ;
        /** @type {__VLS_StyleScopedClasses['sm:inline']} */ ;
        (__VLS_unwrap(t, {})('map.pdf'));
        // @ts-ignore
        [t, pdfLoading,];
    }
    // @ts-ignore
    [];
    return {};
};
void [__VLS_template];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
