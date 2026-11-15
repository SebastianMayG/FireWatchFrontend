import { useI18n } from 'vue-i18n';
import Card from 'primevue/card';
const { defineProps, } = {};
const __VLS_props = defineProps();
const { t } = useI18n();
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
    let __VLS_0;
    /** @ts-ignore @type { | typeof Card | typeof Card} */
    Card;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        // @ts-ignore
        ...{ class: "h-full" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "h-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    /** @type {__VLS_StyleScopedClasses['h-full']} */ ;
    var __VLS_3;
    const { default: __VLS_5 } = __VLS_nonNull(__VLS_3.slots);
    {
        const { title: __VLS_6 } = __VLS_nonNull(__VLS_3.slots);
        (__VLS_ctx.title);
        // @ts-ignore
        [title,];
    }
    {
        const { subtitle: __VLS_7 } = __VLS_nonNull(__VLS_3.slots);
        (__VLS_ctx.hint);
        // @ts-ignore
        [hint,];
    }
    {
        const { content: __VLS_8 } = __VLS_nonNull(__VLS_3.slots);
        var __VLS_9 = {};
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex h-64 items-center justify-center rounded-md border border-dashed border-surface-300 text-center text-sm text-surface-500 dark:border-surface-600 dark:text-surface-400" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['h-64']} */ ;
        /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-dashed']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-surface-300']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-surface-500']} */ ;
        /** @type {__VLS_StyleScopedClasses['dark:border-surface-600']} */ ;
        /** @type {__VLS_StyleScopedClasses['dark:text-surface-400']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
            ...{ class: "pi pi-th-large mr-2" },
        });
        /** @type {__VLS_StyleScopedClasses['pi']} */ ;
        /** @type {__VLS_StyleScopedClasses['pi-th-large']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
        (__VLS_ctx.emptyText ?? __VLS_unwrap(t, {})('charts.pending'));
        // @ts-ignore
        [emptyText, t,];
    }
    // @ts-ignore
    [];
    var __VLS_10 = __VLS_9;
    // @ts-ignore
    [];
    return {
        __VLS_Slots: {},
    };
};
void [__VLS_template, {}];
const __VLS_base = (await import('vue')).defineComponent({
    __typeProps: {},
});
const __VLS_export = {};
export default {};
