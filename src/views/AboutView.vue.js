import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import Card from 'primevue/card';
import Message from 'primevue/message';
const { t } = useI18n();
const sections = [
    'whatIs',
    'sensors',
    'hotspots',
    'dataFlow',
    'methodology',
    'limitations',
    'usefulness',
];
// Integrantes del proyecto (usuarios de GitHub) y repositorios
const TEAM = ['SebastianMayG', 'SantiagoGMG'];
const REPOS = ['SebastianMayG/FireWatchFrontend', 'SebastianMayG/FireWatchBackend'];
// Si un avatar no carga (p. ej. sin internet) se muestra un ícono en su lugar
const brokenAvatars = reactive(new Set());
function paragraphs(key) {
    return t(key)
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
}
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
void __VLS_ctx, __VLS_components, __VLS_intrinsics, __VLS_directives;
const __VLS_template = () => {
    __VLS_withDotValue(brokenAvatars, {});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mx-auto flex max-w-3xl flex-col gap-3 p-3 sm:gap-4 sm:p-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mx-auto']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['max-w-3xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
    /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-3']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:gap-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:p-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
        ...{ class: "text-2xl font-bold sm:text-3xl" },
    });
    /** @type {__VLS_StyleScopedClasses['text-2xl']} */ ;
    /** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
    /** @type {__VLS_StyleScopedClasses['sm:text-3xl']} */ ;
    (__VLS_unwrap(t, {})('about.title'));
    const __VLS_0 = __VLS_tryAsConstant((__VLS_unwrap(sections, {})));
    for (const [section] of __VLS_vFor(__VLS_nonNull(__VLS_0))) {
        let __VLS_1;
        /** @ts-ignore @type { | typeof Card | typeof Card} */
        Card;
        // @ts-ignore
        const __VLS_2 = __VLS_asFunctionalComponent1(__VLS_1, new __VLS_1({
            // @ts-ignore
            key: (section),
        }));
        const __VLS_3 = __VLS_2({
            key: (section),
        }, ...__VLS_functionalComponentArgsRest(__VLS_2));
        var __VLS_4;
        const { default: __VLS_6 } = __VLS_nonNull(__VLS_4.slots);
        {
            const { title: __VLS_7 } = __VLS_nonNull(__VLS_4.slots);
            (__VLS_unwrap(t, {})(`about.${section}.title`));
            // @ts-ignore
            [t, t, sections,];
        }
        {
            const { content: __VLS_8 } = __VLS_nonNull(__VLS_4.slots);
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex flex-col gap-3" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
            /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
            const __VLS_9 = __VLS_tryAsConstant((paragraphs(`about.${section}.body`)));
            for (const [paragraph, i] of __VLS_vFor(__VLS_nonNull(__VLS_9))) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
                    key: (i),
                    ...{ class: "leading-relaxed" },
                });
                /** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
                (paragraph);
                // @ts-ignore
                [];
            }
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        // @ts-ignore
        [];
    }
    let __VLS_10;
    /** @ts-ignore @type { | typeof Card | typeof Card} */
    Card;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
    // @ts-ignore
    }));
    const __VLS_12 = __VLS_11({}, ...__VLS_functionalComponentArgsRest(__VLS_11));
    var __VLS_13;
    const { default: __VLS_15 } = __VLS_nonNull(__VLS_13.slots);
    {
        const { title: __VLS_16 } = __VLS_nonNull(__VLS_13.slots);
        (__VLS_unwrap(t, {})('about.team.title'));
        // @ts-ignore
        [t,];
    }
    {
        const { content: __VLS_17 } = __VLS_nonNull(__VLS_13.slots);
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "leading-relaxed" },
        });
        /** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
        (__VLS_unwrap(t, {})('about.team.body'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mt-4 grid gap-3 sm:grid-cols-2" },
        });
        /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['grid']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
        /** @type {__VLS_StyleScopedClasses['sm:grid-cols-2']} */ ;
        const __VLS_18 = __VLS_tryAsConstant((__VLS_unwrap(TEAM, {})));
        for (const [user] of __VLS_vFor(__VLS_nonNull(__VLS_18))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
                key: (user),
                href: (`https://github.com/${user}`),
                target: "_blank",
                rel: "noopener noreferrer",
                ...{ class: "flex items-center gap-3 rounded-lg border border-surface-200 p-3 transition-colors hover:bg-surface-100 dark:border-surface-700 dark:hover:bg-surface-800" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['gap-3']} */ ;
            /** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
            /** @type {__VLS_StyleScopedClasses['border']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-surface-200']} */ ;
            /** @type {__VLS_StyleScopedClasses['p-3']} */ ;
            /** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
            /** @type {__VLS_StyleScopedClasses['hover:bg-surface-100']} */ ;
            /** @type {__VLS_StyleScopedClasses['dark:border-surface-700']} */ ;
            /** @type {__VLS_StyleScopedClasses['dark:hover:bg-surface-800']} */ ;
            if (!brokenAvatars.value.has(user)) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    ...{ onError: (...[$event]) => {
                            void $event;
                            if (!(!brokenAvatars.value.has(user)))
                                throw 0;
                            return (brokenAvatars.value.add(user));
                            // @ts-ignore
                            [t, TEAM, brokenAvatars, brokenAvatars,];
                        } },
                    src: (`https://github.com/${user}.png?size=96`),
                    alt: (user),
                    ...{ class: "h-12 w-12 shrink-0 rounded-full" },
                    loading: "lazy",
                });
                /** @type {__VLS_StyleScopedClasses['h-12']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-12']} */ ;
                /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
            }
            else {
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-200 dark:bg-surface-700" },
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['h-12']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-12']} */ ;
                /** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
                /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
                /** @type {__VLS_StyleScopedClasses['bg-surface-200']} */ ;
                /** @type {__VLS_StyleScopedClasses['dark:bg-surface-700']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
                    ...{ class: "pi pi-user text-lg" },
                });
                /** @type {__VLS_StyleScopedClasses['pi']} */ ;
                /** @type {__VLS_StyleScopedClasses['pi-user']} */ ;
                /** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "min-w-0" },
            });
            /** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "block truncate font-semibold" },
            });
            /** @type {__VLS_StyleScopedClasses['block']} */ ;
            /** @type {__VLS_StyleScopedClasses['truncate']} */ ;
            /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
            (user);
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "flex items-center gap-1 text-sm text-surface-500 dark:text-surface-400" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['items-center']} */ ;
            /** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-surface-500']} */ ;
            /** @type {__VLS_StyleScopedClasses['dark:text-surface-400']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
                ...{ class: "pi pi-github text-xs" },
            });
            /** @type {__VLS_StyleScopedClasses['pi']} */ ;
            /** @type {__VLS_StyleScopedClasses['pi-github']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
            (user);
            // @ts-ignore
            [];
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "mt-4 text-sm font-semibold" },
        });
        /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
        (__VLS_unwrap(t, {})('about.team.repos'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({
            ...{ class: "mt-1 flex flex-col gap-1 text-sm" },
        });
        /** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
        /** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
        const __VLS_19 = __VLS_tryAsConstant((__VLS_unwrap(REPOS, {})));
        for (const [repo] of __VLS_vFor(__VLS_nonNull(__VLS_19))) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
                key: (repo),
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
                href: (`https://github.com/${repo}`),
                target: "_blank",
                rel: "noopener noreferrer",
                ...{ class: "text-primary hover:underline" },
            });
            /** @type {__VLS_StyleScopedClasses['text-primary']} */ ;
            /** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.i)({
                ...{ class: "pi pi-github mr-1 text-xs" },
            });
            /** @type {__VLS_StyleScopedClasses['pi']} */ ;
            /** @type {__VLS_StyleScopedClasses['pi-github']} */ ;
            /** @type {__VLS_StyleScopedClasses['mr-1']} */ ;
            /** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
            (repo);
            // @ts-ignore
            [t, REPOS,];
        }
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    let __VLS_20;
    /** @ts-ignore @type { | typeof Message | typeof Message} */
    Message;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
        // @ts-ignore
        severity: "secondary",
    }));
    const __VLS_22 = __VLS_21({
        severity: "secondary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    var __VLS_23;
    const { default: __VLS_25 } = __VLS_nonNull(__VLS_23.slots);
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "font-semibold" },
    });
    /** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
    (__VLS_unwrap(t, {})('about.acknowledgement.title'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "text-sm" },
    });
    /** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
    (__VLS_unwrap(t, {})('about.acknowledgement.body'));
    // @ts-ignore
    [t, t,];
    // @ts-ignore
    [];
    return {};
};
void [__VLS_template];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
