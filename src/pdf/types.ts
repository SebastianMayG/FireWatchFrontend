/** Imagen capturada de un mapa (FireMap.capture) */
export interface MapImage {
  dataUrl: string
  width: number
  height: number
}

/** Función de traducción (compatible con el `t` de vue-i18n) */
export type Translate = (key: string, params?: Record<string, unknown>) => string
