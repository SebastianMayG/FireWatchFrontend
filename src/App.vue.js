import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Message from 'primevue/message';
import AppHeader from '@/components/layout/AppHeader.vue';
import { API_URL } from '@/api/client';
import { useAnalysisStore } from '@/stores/analysis';
const { t } = useI18n();
const store = useAnalysisStore();
onMounted(() => store.loadMeta());
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
void __VLS_ctx, __VLS_components, __VLS_intrinsics, __VLS_directives;
const __VLS_template = () => {
    __VLS_withDotValue(store, {});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "min-h-screen bg-surface-50 text-surface-900 dark:bg-surface-950 dark:text-surface-0" },
    });
    /** @type {__VLS_StyleScopedClasses['min-h-screen']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-surface-50']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-surface-900']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-surface-950']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:text-surface-0']} */ ;
    const __VLS_0 = AppHeader;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    // @ts-ignore
    }));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
    if (store.value.metaError) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "px-3 pt-3 sm:px-4 sm:pt-4" },
        });
        /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['pt-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['sm:px-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['sm:pt-4']} */ ;
        let __VLS_5;
        /** @ts-ignore @type { | typeof Message | typeof Message} */
        Message;
        // @ts-ignore
        const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
            // @ts-ignore
            severity: "error", icon: "pi pi-exclamation-triangle",
        }));
        const __VLS_7 = __VLS_6({
            severity: "error",
            icon: "pi pi-exclamation-triangle",
        }, ...__VLS_functionalComponentArgsRest(__VLS_6));
        var __VLS_8;
        const { default: __VLS_10 } = __VLS_nonNull(__VLS_8.slots);
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex flex-wrap items-center gap-3" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_unwrap(t, {})('errors.backend', { url: __VLS_unwrap(API_URL, {}) }));
        let __VLS_11;
        /** @ts-ignore @type { | typeof Button} */
        Button;
        // @ts-ignore
        const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
            // @ts-ignore
            ...{ 'onClick': {} }, label: (__VLS_unwrap(t, {})('common.retry')), icon: "pi pi-refresh", size: "small", severity: "secondary", loading: (store.value.metaLoading),
        }));
        const __VLS_13 = __VLS_12({
            ...{ 'onClick': {} },
            label: (__VLS_unwrap(t, {})('common.retry')),
            icon: "pi pi-refresh",
            size: "small",
            severity: "secondary",
            loading: (store.value.metaLoading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_12));
        let __VLS_16;
        const __VLS_17 = {
            /** @type {typeof __VLS_16.click} */
            onClick: (...[$event]) => {
                void $event;
                if (!(store.value.metaError))
                    throw 0;
                return (store.value.loadMeta());
                // @ts-ignore
                [store, store, store, t, t, API_URL,];
            },
        };
        void __VLS_17;
        var __VLS_14;
        var __VLS_15;
        // @ts-ignore
        [];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)({});
    let __VLS_18;
    /** @ts-ignore @type { | typeof __VLS_components.RouterView} */
    RouterView;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    // @ts-ignore
    }));
    const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
    // @ts-ignore
    [];
    return {};
};
void [__VLS_template];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
