// Tipos de las respuestas del backend. Fuente de verdad: FireWatchBackend/docs/api.md
import type { FeatureCollection, Point, Polygon, MultiPolygon } from 'geojson'

/** [minLon, minLat, maxLon, maxLat] */
export type BBox = [number, number, number, number]

export type MinConf = 'low' | 'nominal' | 'high'

export interface Meta {
  years: number[]
  default_year: number
  complete_years: number[]
  estimated_years: number[]
  partial_years: number[]
  sensors: string[]
  default_bbox: BBox
  grid_deg: number
  points_limit: number
  recurrent_zones: {
    zone_deg: number
    min_years: number
    min_cell_days_per_year: number
    period: [number, number]
    description: string
  }
  attribution: string
}

export interface MonthActivity {
  month: number
  activity: number
}

export interface Indicators {
  year: number
  /** Detecciones crudas (todos los sensores). No comparable entre años. */
  detections: number
  /** Actividad armonizada. Comparable entre años. */
  activity: number
  peak_year: number | null
  top_months: MonthActivity[]
  median_activity: number
  vs_median_pct: number | null
  years_analyzed: number
  estimated: boolean
  partial: boolean
}

/** Métrica común para comparar dos años sin que el factor de calibración decida el resultado */
export type CompareMetric = 'activity' | 'modis_cell_days' | 'terra_cell_days'

export interface Compare {
  a: Indicators
  b: Indicators
  /** Usar esto para "año mayor de los dos" y "% vs. el otro año" */
  basis: {
    metric: CompareMetric
    a: number
    b: number
    pct_b_vs_a: number | null
    pct_a_vs_b: number | null
    peak_years: number[]
    /** Alguno de los años tiene pocas detecciones: comparación poco confiable */
    low_data: boolean
    low_data_threshold: number
  }
  delta: {
    activity_pct: number | null
    detections_pct: number | null
    activity_abs: number
    detections_abs: number
  }
}

export interface Calendar {
  years: number[]
  months: number[]
  /** values[i][j] = actividad del año years[i] en el mes months[j] */
  values: number[][]
  max: number
  estimated_years: number[]
  partial_years: number[]
}

export interface TrendPoint {
  year: number
  activity: number
  detections: number
  estimated: boolean
  partial: boolean
}

export interface Trend {
  series: TrendPoint[]
  median_activity: number
  peak_year: number | null
}

export interface HotspotProps {
  datetime_utc: string
  satellite: string
  conf_level: string
  frp: number
}

interface HotspotsBase {
  year: number
  bbox: BBox
  min_conf: MinConf
  total_detections: number
}

export interface HotspotsPoints extends HotspotsBase {
  mode: 'points'
  points: FeatureCollection<Point, HotspotProps>
}

export interface HotspotsGrid extends HotspotsBase {
  mode: 'grid'
  grid: {
    cell_deg: number
    columns: ['lat', 'lon', 'count', 'frp_max']
    max_count: number
    /** [lat, lon, count, frp_max] */
    cells: [number, number, number, number][]
  }
}

export type HotspotsResponse = HotspotsPoints | HotspotsGrid

export interface RecurrentZoneProps {
  id: number
  n_zones: number
  years_active_max: number
  years_active_mean: number
  first_year: number | null
  last_year: number | null
}

export interface RecurrentZones extends FeatureCollection<
  Polygon | MultiPolygon,
  RecurrentZoneProps
> {
  total_polygons: number
  criteria: Meta['recurrent_zones']
}
