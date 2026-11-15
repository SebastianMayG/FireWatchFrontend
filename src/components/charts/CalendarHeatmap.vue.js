import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import VChart from 'vue-echarts';
import Message from 'primevue/message';
import Skeleton from 'primevue/skeleton';
import { useTheme } from '@/composables/useTheme';
import { calendarOption } from './options';
const { defineProps, } = {};
const props = defineProps();
const { t, locale } = useI18n();
const { isDark } = useTheme();
const option = computed(() => props.calendar
    ? calendarOption({
        calendar: props.calendar,
        highlightYears: [props.year],
        dark: isDark.value,
        locale: locale.value,
        t,
    })
    : {});
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
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    if (__VLS_ctx.error) {
        let __VLS_0;
        /** @ts-ignore @type { | typeof Message | typeof Message} */
        Message;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
            // @ts-ignore
            severity: "error", size: "small", variant: "simple",
        }));
        const __VLS_2 = __VLS_1({
            severity: "error",
            size: "small",
            variant: "simple",
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        var __VLS_3;
        const { default: __VLS_5 } = __VLS_nonNull(__VLS_3.slots);
        (__VLS_unwrap(t, {})('errors.request', { error: __VLS_ctx.error }));
        // @ts-ignore
        [error, error, t,];
    }
    else if (!__VLS_ctx.calendar) {
        let __VLS_6;
        /** @ts-ignore @type { | typeof Skeleton} */
        Skeleton;
        // @ts-ignore
        const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
            // @ts-ignore
            height: "30rem",
        }));
        const __VLS_8 = __VLS_7({
            height: "30rem",
        }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "h-[30rem] w-full" },
        });
        /** @type {__VLS_StyleScopedClasses['h-[30rem]']} */ ;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        let __VLS_11;
        /** @ts-ignore @type { | typeof VChart} */
        VChart;
        // @ts-ignore
        const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
            // @ts-ignore
            option: (__VLS_unwrap(option, {})), loading: (__VLS_ctx.loading), autoresize: true,
        }));
        const __VLS_13 = __VLS_12({
            option: (__VLS_unwrap(option, {})),
            loading: (__VLS_ctx.loading),
            autoresize: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    }
    // @ts-ignore
    [calendar, option, loading,];
    return {};
};
void [__VLS_template];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
