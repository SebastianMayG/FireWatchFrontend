import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
// Paleta del proyecto: navy como color primario, negro como superficie en modo oscuro.
// colorScheme.dark se aplica cuando <html> tiene la clase .app-dark.
export const FireWatchPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#eef2fb',
            100: '#d9e1f5',
            200: '#b3c3eb',
            300: '#8199d9',
            400: '#4f6cc0',
            500: '#2f4ba3',
            600: '#213a87',
            700: '#1a2e6c',
            800: '#142454',
            900: '#0f1b3f',
            950: '#0a1229',
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{primary.800}',
                    contrastColor: '#ffffff',
                    hoverColor: '{primary.900}',
                    activeColor: '{primary.950}',
                },
                surface: {
                    0: '#ffffff',
                    50: '{slate.50}',
                    100: '{slate.100}',
                    200: '{slate.200}',
                    300: '{slate.300}',
                    400: '{slate.400}',
                    500: '{slate.500}',
                    600: '{slate.600}',
                    700: '{slate.700}',
                    800: '{slate.800}',
                    900: '{slate.900}',
                    950: '{slate.950}',
                },
            },
            dark: {
                // Navy más claro para que se lea sobre negro
                primary: {
                    color: '{primary.300}',
                    contrastColor: '{primary.950}',
                    hoverColor: '{primary.200}',
                    activeColor: '{primary.100}',
                },
                surface: {
                    0: '#ffffff',
                    50: '{neutral.50}',
                    100: '{neutral.100}',
                    200: '{neutral.200}',
                    300: '{neutral.300}',
                    400: '{neutral.400}',
                    500: '{neutral.500}',
                    600: '{neutral.600}',
                    700: '{neutral.700}',
                    800: '{neutral.800}',
                    900: '{neutral.900}',
                    950: '#000000',
                },
            },
        },
    },
});
