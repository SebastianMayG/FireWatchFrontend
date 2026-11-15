import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import { useTheme } from '@/composables/useTheme';
import logoUrl from '@/assets/logo.png';
const { t, locale } = useI18n();
const { isDark, toggleDark } = useTheme();
const languages = ['en', 'es'];
const route = useRoute();
const aboutLink = computed(() => {
    if (route.name !== 'about') {
        return { to: '/about', label: 'header.about', icon: 'pi-info-circle' };
    }
    // Regresa a la vista de donde vino (Dashboard o Compare); si entró directo a /about, al Dashboard
    const previous = window.history.state?.back;
    return { to: typeof previous === 'string' ? previous : '/', label: 'header.back', icon: 'pi-arrow-left' };
});
watch(locale, (value) => {
    localStorage.setItem('lang', value);
    document.documentElement.lang = value;
}, { immediate: true });
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
void __VLS_ctx, __VLS_components, __VLS_intrinsics, __VLS_directives;
const __VLS_template = () => {
    __VLS_withDotValue(aboutLink, {});
    __VLS_withDotValue(isDark, {});
    __VLS_asFunctionalElement1(__VLS_intrinsics.header, __VLS_intrinsics.header)({
        ...{ class: "flex items-center justify-between gap-2 border-b border-surface-200 bg-surface-0 px-3 py-2 sm:gap-4 sm:px-4 sm:py-3 dark:border-surface-700 dark:bg-surface-900" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-b']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-surface-200']} */ ;
    /** @type {__VLS_StyleScopedClasses['bg-surface-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['px-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['py-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:gap-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:px-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:py-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:border-surface-700']} */ ;
    /** @type {__VLS_StyleScopedClasses['dark:bg-surface-900']} */ ;
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.RouterLink | typeof __VLS_components.RouterLink} */
    RouterLink;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        // @ts-ignore
        to: "/", ...{ class: "flex min-w-0 items-center gap-2 text-lg font-bold text-primary sm:text-xl" },
    }));
    const __VLS_2 = __VLS_1({
        to: "/",
        ...{ class: "flex min-w-0 items-center gap-2 text-lg font-bold text-primary sm:text-xl" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:text-xl']} */ ;
    var __VLS_3;
    const { default: __VLS_5 } = __VLS_nonNull(__VLS_3.slots);
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_unwrap(logoUrl, {})),
        alt: "",
        ...{ class: "h-10 w-10 shrink-0 sm:h-15 sm:w-15" },
    });
    /** @type {__VLS_StyleScopedClasses['h-10']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-10']} */ ;
    /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:h-15']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:w-15']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "truncate" },
    });
    /** @type {__VLS_StyleScopedClasses['truncate']} */ ;
    (__VLS_unwrap(t, {})('app.name'));
    // @ts-ignore
    [logoUrl, t,];
    __VLS_asFunctionalElement1(__VLS_intrinsics.nav, __VLS_intrinsics.nav)({
        ...{ class: "flex shrink-0 items-center gap-1 sm:gap-2" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
    /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:gap-2']} */ ;
    let __VLS_6;
    /** @ts-ignore @type { | typeof Button | typeof Button} */
    Button;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        // @ts-ignore
        as: "router-link", to: (aboutLink.value.to), text: true, size: "small", 'aria-label': (__VLS_unwrap(t, {})(aboutLink.value.label)),
    }));
    const __VLS_8 = __VLS_7({
        as: "router-link",
        to: (aboutLink.value.to),
        text: true,
        size: "small",
        'aria-label': (__VLS_unwrap(t, {})(aboutLink.value.label)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    var __VLS_9;
    const { default: __VLS_11 } = __VLS_nonNull(__VLS_9.slots);
    __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
        ...{ class: (['pi', aboutLink.value.icon]) },
    });
    /** @type {__VLS_StyleScopedClasses['pi']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "hidden sm:inline" },
    });
    /** @type {__VLS_StyleScopedClasses['hidden']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:inline']} */ ;
    (__VLS_unwrap(t, {})(aboutLink.value.label));
    // @ts-ignore
    [t, t, aboutLink, aboutLink, aboutLink, aboutLink,];
    let __VLS_12;
    /** @ts-ignore @type { | typeof SelectButton} */
    SelectButton;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        // @ts-ignore
        modelValue: (__VLS_unwrap(locale, {})), options: (__VLS_unwrap(languages, {})), allowEmpty: (false), size: "small", 'aria-label': (__VLS_unwrap(t, {})('header.language')),
    }));
    const __VLS_14 = __VLS_13({
        modelValue: (__VLS_unwrap(locale, {})),
        options: (__VLS_unwrap(languages, {})),
        allowEmpty: (false),
        size: "small",
        'aria-label': (__VLS_unwrap(t, {})('header.language')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_17;
    /** @ts-ignore @type { | typeof Button} */
    Button;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
        // @ts-ignore
        ...{ 'onClick': {} }, icon: (isDark.value ? 'pi pi-sun' : 'pi pi-moon'), 'aria-label': (__VLS_unwrap(t, {})('header.darkMode')), text: true, rounded: true,
    }));
    const __VLS_19 = __VLS_18({
        ...{ 'onClick': {} },
        icon: (isDark.value ? 'pi pi-sun' : 'pi pi-moon'),
        'aria-label': (__VLS_unwrap(t, {})('header.darkMode')),
        text: true,
        rounded: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    let __VLS_22;
    const __VLS_23 = {
        /** @type {typeof __VLS_22.click} */
        onClick: (__VLS_unwrap(toggleDark, {})),
    };
    void __VLS_23;
    var __VLS_20;
    var __VLS_21;
    // @ts-ignore
    [t, t, locale, languages, isDark, toggleDark,];
    return {};
};
void [__VLS_template];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
