/**
 * MSMA 2nd Edition (2012) — Centralised reference data
 *
 * Source: Urban Stormwater Management Manual for Malaysia, 2nd Edition,
 * Department of Irrigation and Drainage (DID) Malaysia, 2012.
 * ISBN 978-983-9304-24-4
 *
 * Use this module instead of hard-coding citations or table values across
 * calculators. Keeping the single source of truth here makes it easier to
 * keep all calculators aligned with the latest MSMA revision.
 */

/** Canonical MSMA citations used across calculators. */
export const MSMA_CITATIONS = {
  rationalMethod: "MSMA 2nd Edition (2012), Chapter 2 — Quantity Design Fundamentals, Eq. 2.3",
  timeOfConcentration: "MSMA 2nd Edition (2012), Chapter 2, Table 2.1 (QUDM, 2007)",
  idfEquation: "MSMA 2nd Edition (2012), Chapter 2, Eq. 2.2; constants from Table 2.B1 (Appendix 2.B)",
  runoffCoefficients: "MSMA 2nd Edition (2012), Chapter 2, Table 2.5",
  manningRoughness: "MSMA 2nd Edition (2012), Chapter 2, Table 2.3",
  hortonRoughness: "MSMA 2nd Edition (2012), Chapter 2, Table 2.2",
  orificeWeir: "MSMA 2nd Edition (2012), Chapter 2, Section 2.4",
  osd: "MSMA 2nd Edition (2012), Chapter 5 — On-Site Detention; Tables 5.A1, 5.A2",
  rainwaterHarvesting: "MSMA 2nd Edition (2012), Chapter 6 — Rainwater Harvesting; Eq. 6.1, Table 6.4",
  detentionPond: "MSMA 2nd Edition (2012), Chapter 7 — Detention Pond",
  bioretention: "MSMA 2nd Edition (2012), Chapter 9 — Bioretention System; Eq. 9.1–9.2, Tables 9.6–9.7",
  pavementDrainage: "MSMA 2nd Edition (2012), Chapter 13 — Pavement Drainage",
  drainsSwales: "MSMA 2nd Edition (2012), Chapter 14 — Drains and Swales",
  pipeDrain: "MSMA 2nd Edition (2012), Chapter 15 — Pipe Drain",
  engineeredChannel: "MSMA 2nd Edition (2012), Chapter 16 — Engineered Channel",
  culvert: "MSMA 2nd Edition (2012), Chapter 18 — Culvert",
} as const;

/**
 * MSMA Table 2.2 — Horton's roughness n* for overland sheet flow (Eq in Table 2.1).
 * Used in the overland flow time (to) formula: to = 107·n*·L^(1/3) / S^(1/5)
 * where S is in PERCENT.
 */
export const HORTONS_ROUGHNESS = [
  { surface: "Paved", value: 0.015 },
  { surface: "Bare Soil", value: 0.0275 },
  { surface: "Poorly Grassed", value: 0.035 },
  { surface: "Average Grassed", value: 0.045 },
  { surface: "Densely Grassed", value: 0.060 },
] as const;

/** MSMA Table 2.3 — Manning's roughness coefficient n for open drains and pipes. */
export const MANNING_ROUGHNESS = [
  { material: "Grassed Drain — Short Grass (< 150 mm)", value: 0.035 },
  { material: "Grassed Drain — Tall Grass (≥ 150 mm)", value: 0.050 },
  { material: "Concrete — Smooth Finish", value: 0.015 },
  { material: "Concrete — Rough Finish", value: 0.018 },
  { material: "Stone Pitching — Dressed in Mortar", value: 0.017 },
  { material: "Stone Pitching — Random in Mortar / Rubble Masonry", value: 0.035 },
  { material: "Rock Riprap", value: 0.030 },
  { material: "Brickwork", value: 0.020 },
  { material: "Vitrified Clay Pipe", value: 0.012 },
  { material: "Spun Precast Concrete Pipe", value: 0.013 },
  { material: "Fibre Reinforced Cement Pipe", value: 0.013 },
  { material: "uPVC Pipe", value: 0.011 },
] as const;

/**
 * MSMA Table 2.5 — Recommended runoff coefficients (C).
 * Minor system = ≤ 10 year ARI, Major system = > 10 year ARI.
 */
export interface RunoffCoefficientEntry {
  landuse: string;
  minor: number;
  major: number;
}

export const RUNOFF_COEFFICIENTS: RunoffCoefficientEntry[] = [
  { landuse: "Residential — Bungalow", minor: 0.65, major: 0.70 },
  { landuse: "Residential — Semi-detached Bungalow", minor: 0.70, major: 0.75 },
  { landuse: "Residential — Link & Terrace House", minor: 0.80, major: 0.90 },
  { landuse: "Residential — Flat & Apartment", minor: 0.80, major: 0.85 },
  { landuse: "Residential — Condominium", minor: 0.75, major: 0.80 },
  { landuse: "Commercial and Business Centres", minor: 0.90, major: 0.95 },
  { landuse: "Industrial", minor: 0.90, major: 0.95 },
  { landuse: "Sport Fields, Park and Agriculture", minor: 0.30, major: 0.40 },
  { landuse: "Open Space — Bare Soil (No Cover)", minor: 0.50, major: 0.60 },
  { landuse: "Open Space — Grass Cover", minor: 0.40, major: 0.50 },
  { landuse: "Open Space — Bush Cover", minor: 0.35, major: 0.45 },
  { landuse: "Open Space — Forest Cover", minor: 0.30, major: 0.40 },
  { landuse: "Roads and Highways", minor: 0.95, major: 0.95 },
  { landuse: "Detention Pond (with outlet)", minor: 0.95, major: 0.95 },
  { landuse: "Retention Pond (no outlet)", minor: 0.0, major: 0.0 },
];

/**
 * MSMA Table 2.6 — Recommended loss values for rainfall excess estimation.
 */
export const RAINFALL_LOSSES = {
  impervious: { initialLoss_mm: 1.5, continuousLoss_mm_per_hr: 0 },
  perviousSandy: { initialLoss_mm: 10, continuousLoss_mm_per_hr_min: 10, continuousLoss_mm_per_hr_max: 25 },
  perviousLoam: { initialLoss_mm: 10, continuousLoss_mm_per_hr_min: 3, continuousLoss_mm_per_hr_max: 10 },
  perviousClay: { initialLoss_mm: 10, continuousLoss_mm_per_hr_min: 0.5, continuousLoss_mm_per_hr_max: 3 },
} as const;

/**
 * MSMA Ch 5 Figure 5.A1 — Five OSD design regions for Peninsular Malaysia.
 */
export type OsdRegion = "west" | "east" | "northern" | "highland" | "southern";
export type TerrainSlope = "lowlying" | "mild" | "steep";

export const OSD_REGIONS: { value: OsdRegion; label: string; description: string }[] = [
  { value: "west", label: "Region 1 — West Coast", description: "Selangor, KL, Putrajaya, Perak coast (non-highland)" },
  { value: "east", label: "Region 2 — East Coast", description: "Kelantan, Terengganu, Pahang (non-highland)" },
  { value: "northern", label: "Region 3 — Northern", description: "Perlis, Kedah, Penang" },
  { value: "highland", label: "Region 4 — Highland", description: "Cameron Highlands and other highland areas" },
  { value: "southern", label: "Region 5 — Southern", description: "Johor, Melaka, Negeri Sembilan" },
];

export const OSD_TERRAIN: { value: TerrainSlope; label: string; range: string }[] = [
  { value: "lowlying", label: "Low-lying", range: "Slope 1:2000 to 1:5000" },
  { value: "mild", label: "Mild", range: "Slope 1:875 to 1:1999" },
  { value: "steep", label: "Steep", range: "Slope 1:100 to 1:874" },
];

/**
 * MSMA Table 5.A1 — Maximum PSD (l/s/ha) and minimum SSR (m³/ha) by region,
 * terrain and impervious area percentage. Interpolate between columns for
 * intermediate impervious percentages.
 */
export interface OsdRegionEntry {
  terrain: TerrainSlope;
  imperviousBands: {
    pct: 25 | 40 | 50 | 75 | 90;
    psd_lpsHa: number;
    ssr_m3Ha: number;
  }[];
}

export const OSD_TABLE_5A1: Record<OsdRegion, OsdRegionEntry[]> = {
  west: [
    {
      terrain: "lowlying",
      imperviousBands: [
        { pct: 25, psd_lpsHa: 63.4, ssr_m3Ha: 322.2 },
        { pct: 40, psd_lpsHa: 64.2, ssr_m3Ha: 363.0 },
        { pct: 50, psd_lpsHa: 64.5, ssr_m3Ha: 394.2 },
        { pct: 75, psd_lpsHa: 65.2, ssr_m3Ha: 478.3 },
        { pct: 90, psd_lpsHa: 65.5, ssr_m3Ha: 540.4 },
      ],
    },
    {
      terrain: "mild",
      imperviousBands: [
        { pct: 25, psd_lpsHa: 76.7, ssr_m3Ha: 306.6 },
        { pct: 40, psd_lpsHa: 77.5, ssr_m3Ha: 340.0 },
        { pct: 50, psd_lpsHa: 77.9, ssr_m3Ha: 367.2 },
        { pct: 75, psd_lpsHa: 78.7, ssr_m3Ha: 448.5 },
        { pct: 90, psd_lpsHa: 79.1, ssr_m3Ha: 504.7 },
      ],
    },
    {
      terrain: "steep",
      imperviousBands: [
        { pct: 25, psd_lpsHa: 87.7, ssr_m3Ha: 294.0 },
        { pct: 40, psd_lpsHa: 88.6, ssr_m3Ha: 327.0 },
        { pct: 50, psd_lpsHa: 89.1, ssr_m3Ha: 350.5 },
        { pct: 75, psd_lpsHa: 90.1, ssr_m3Ha: 426.7 },
        { pct: 90, psd_lpsHa: 90.5, ssr_m3Ha: 478.8 },
      ],
    },
  ],
  east: [
    {
      terrain: "lowlying",
      imperviousBands: [
        { pct: 25, psd_lpsHa: 53.0, ssr_m3Ha: 276.6 },
        { pct: 40, psd_lpsHa: 53.6, ssr_m3Ha: 350.4 },
        { pct: 50, psd_lpsHa: 53.9, ssr_m3Ha: 410.7 },
        { pct: 75, psd_lpsHa: 54.5, ssr_m3Ha: 609.1 },
        { pct: 90, psd_lpsHa: 54.7, ssr_m3Ha: 768.8 },
      ],
    },
    {
      terrain: "mild",
      imperviousBands: [
        { pct: 25, psd_lpsHa: 61.1, ssr_m3Ha: 257.6 },
        { pct: 40, psd_lpsHa: 61.8, ssr_m3Ha: 321.7 },
        { pct: 50, psd_lpsHa: 62.2, ssr_m3Ha: 373.9 },
        { pct: 75, psd_lpsHa: 62.8, ssr_m3Ha: 546.1 },
        { pct: 90, psd_lpsHa: 63.1, ssr_m3Ha: 678.7 },
      ],
    },
    {
      terrain: "steep",
      imperviousBands: [
        { pct: 25, psd_lpsHa: 67.4, ssr_m3Ha: 243.5 },
        { pct: 40, psd_lpsHa: 68.2, ssr_m3Ha: 302.6 },
        { pct: 50, psd_lpsHa: 68.6, ssr_m3Ha: 351.0 },
        { pct: 75, psd_lpsHa: 69.3, ssr_m3Ha: 509.9 },
        { pct: 90, psd_lpsHa: 69.6, ssr_m3Ha: 625.9 },
      ],
    },
  ],
  northern: [
    {
      terrain: "lowlying",
      imperviousBands: [
        { pct: 25, psd_lpsHa: 54.8, ssr_m3Ha: 311.1 },
        { pct: 40, psd_lpsHa: 55.4, ssr_m3Ha: 353.3 },
        { pct: 50, psd_lpsHa: 55.7, ssr_m3Ha: 389.7 },
        { pct: 75, psd_lpsHa: 56.3, ssr_m3Ha: 493.3 },
        { pct: 90, psd_lpsHa: 56.5, ssr_m3Ha: 564.4 },
      ],
    },
    {
      terrain: "mild",
      imperviousBands: [
        { pct: 25, psd_lpsHa: 68.0, ssr_m3Ha: 295.5 },
        { pct: 40, psd_lpsHa: 68.8, ssr_m3Ha: 328.3 },
        { pct: 50, psd_lpsHa: 69.2, ssr_m3Ha: 360.3 },
        { pct: 75, psd_lpsHa: 69.9, ssr_m3Ha: 454.0 },
        { pct: 90, psd_lpsHa: 70.2, ssr_m3Ha: 521.6 },
      ],
    },
    {
      terrain: "steep",
      imperviousBands: [
        { pct: 25, psd_lpsHa: 77.3, ssr_m3Ha: 284.8 },
        { pct: 40, psd_lpsHa: 78.2, ssr_m3Ha: 316.2 },
        { pct: 50, psd_lpsHa: 78.6, ssr_m3Ha: 341.8 },
        { pct: 75, psd_lpsHa: 79.5, ssr_m3Ha: 430.3 },
        { pct: 90, psd_lpsHa: 79.8, ssr_m3Ha: 492.6 },
      ],
    },
  ],
  highland: [
    {
      terrain: "lowlying",
      imperviousBands: [
        { pct: 25, psd_lpsHa: 42.6, ssr_m3Ha: 227.8 },
        { pct: 40, psd_lpsHa: 43.1, ssr_m3Ha: 285.7 },
        { pct: 50, psd_lpsHa: 43.4, ssr_m3Ha: 331.4 },
        { pct: 75, psd_lpsHa: 43.8, ssr_m3Ha: 460.5 },
        { pct: 90, psd_lpsHa: 44.0, ssr_m3Ha: 546.6 },
      ],
    },
    {
      terrain: "mild",
      imperviousBands: [
        { pct: 25, psd_lpsHa: 49.6, ssr_m3Ha: 212.3 },
        { pct: 40, psd_lpsHa: 50.2, ssr_m3Ha: 266.0 },
        { pct: 50, psd_lpsHa: 50.5, ssr_m3Ha: 307.3 },
        { pct: 75, psd_lpsHa: 51.0, ssr_m3Ha: 428.2 },
        { pct: 90, psd_lpsHa: 51.2, ssr_m3Ha: 509.2 },
      ],
    },
    {
      terrain: "steep",
      imperviousBands: [
        { pct: 25, psd_lpsHa: 55.0, ssr_m3Ha: 202.1 },
        { pct: 40, psd_lpsHa: 55.6, ssr_m3Ha: 252.3 },
        { pct: 50, psd_lpsHa: 56.0, ssr_m3Ha: 291.0 },
        { pct: 75, psd_lpsHa: 56.5, ssr_m3Ha: 405.5 },
        { pct: 90, psd_lpsHa: 56.8, ssr_m3Ha: 484.1 },
      ],
    },
  ],
  southern: [
    {
      terrain: "lowlying",
      imperviousBands: [
        { pct: 25, psd_lpsHa: 61.1, ssr_m3Ha: 315.0 },
        { pct: 40, psd_lpsHa: 61.9, ssr_m3Ha: 362.0 },
        { pct: 50, psd_lpsHa: 62.2, ssr_m3Ha: 398.4 },
        { pct: 75, psd_lpsHa: 62.8, ssr_m3Ha: 501.0 },
        { pct: 90, psd_lpsHa: 63.1, ssr_m3Ha: 572.7 },
      ],
    },
    {
      terrain: "mild",
      imperviousBands: [
        { pct: 25, psd_lpsHa: 74.8, ssr_m3Ha: 298.5 },
        { pct: 40, psd_lpsHa: 75.7, ssr_m3Ha: 340.9 },
        { pct: 50, psd_lpsHa: 76.1, ssr_m3Ha: 372.6 },
        { pct: 75, psd_lpsHa: 76.9, ssr_m3Ha: 465.9 },
        { pct: 90, psd_lpsHa: 77.2, ssr_m3Ha: 532.3 },
      ],
    },
    {
      terrain: "steep",
      imperviousBands: [
        { pct: 25, psd_lpsHa: 83.4, ssr_m3Ha: 288.5 },
        { pct: 40, psd_lpsHa: 84.3, ssr_m3Ha: 323.3 },
        { pct: 50, psd_lpsHa: 84.8, ssr_m3Ha: 352.5 },
        { pct: 75, psd_lpsHa: 85.7, ssr_m3Ha: 442.8 },
        { pct: 90, psd_lpsHa: 86.1, ssr_m3Ha: 505.0 },
      ],
    },
  ],
};

/**
 * MSMA Table 6.2 + 6.4 — Mean annual rainfall and Average Annual Rainwater
 * Yield (AARY) for selected Malaysian towns. AARY values are based on a
 * 1 m³ tank and 100 m² roof using the YBS daily water balance model.
 */
export interface RwhTownData {
  town: string;
  station: string;
  mar_mm: number;
  rainDays: number;
  aary_m3: number;
}

export const RWH_TOWNS: RwhTownData[] = [
  { town: "Alor Setar", station: "6103047", mar_mm: 2365, rainDays: 147, aary_m3: 103 },
  { town: "Ipoh", station: "4511111", mar_mm: 2288, rainDays: 181, aary_m3: 99 },
  { town: "Klang", station: "3014084", mar_mm: 2197, rainDays: 132, aary_m3: 107 },
  { town: "Kuala Lumpur", station: "3117070", mar_mm: 2527, rainDays: 177, aary_m3: 116 },
  { town: "Seremban", station: "2719043", mar_mm: 1901, rainDays: 141, aary_m3: 98 },
  { town: "Melaka", station: "2222010", mar_mm: 1989, rainDays: 179, aary_m3: 100 },
  { town: "Kluang", station: "1833092", mar_mm: 2295, rainDays: 163, aary_m3: 115 },
  { town: "Johor Bahru", station: "1537113", mar_mm: 2787, rainDays: 158, aary_m3: 128 },
  { town: "Kota Bharu", station: "6121001", mar_mm: 2622, rainDays: 138, aary_m3: 95 },
  { town: "Kuala Terengganu", station: "5331048", mar_mm: 2659, rainDays: 161, aary_m3: 94 },
  { town: "Kuantan", station: "3833004", mar_mm: 2881, rainDays: 136, aary_m3: 111 },
  { town: "Kuching", station: "1403001", mar_mm: 4043, rainDays: 242, aary_m3: 156 },
  { town: "Sibu", station: "2219001", mar_mm: 3282, rainDays: 229, aary_m3: 144 },
  { town: "Bintulu", station: "MMS 96441", mar_mm: 4136, rainDays: 225, aary_m3: 148 },
  { town: "Kota Kinabalu", station: "5961002", mar_mm: 2629, rainDays: 177, aary_m3: 109 },
  { town: "Sandakan", station: "5875001", mar_mm: 3070, rainDays: 190, aary_m3: 120 },
  { town: "Tawau", station: "4278004", mar_mm: 1626, rainDays: 155, aary_m3: 89 },
];

/** MSMA Table 6.3 — First flush requirement by roof area. */
export function firstFlushVolume_m3(roofArea_m2: number): { min: number; max: number; note: string } {
  if (roofArea_m2 < 100) return { min: 0.025, max: 0.05, note: "Roof < 100 m²" };
  if (roofArea_m2 <= 4356) return { min: 0.05, max: 2.5, note: "Roof 100–4356 m² — scale linearly" };
  return { min: 2.5, max: 2.5, note: "Roof > 4356 m² — fixed 2.5 m³" };
}

/**
 * MSMA Table 9.6 — Bioretention physical specification & geometry.
 */
export const BIORETENTION_SPEC = {
  minDimensions: "3 m wide × 6 m long",
  lengthWidthRatio: "2:1 (optional)",
  maxEmptyingTime_hrs: 24,
  minPlantingBedPermeability_mm_hr: 13,
  pondingDepth_mm: { min: 150, max: 300 },
  depthToGroundwater_m: 0.60,
  designStormARI: "3-month ARI (equivalent to 40 mm rainfall for WQv)",
} as const;

/** MSMA Table 9.7 — Coefficient of permeability (k) for bioretention filter media. */
export const BIORETENTION_PERMEABILITY = [
  { media: "Sand", k_m_day: 1.0 },
  { media: "Peat", k_m_day: 0.6 },
  { media: "Leaf Compost", k_m_day: 2.65 },
  { media: "Bioretention Soil (engineered)", k_m_day: 0.312 },
] as const;

/**
 * MSMA Chapter 1 Table 1.1 — Design ARI for stormwater systems.
 * These are the standard design ARIs used across MSMA.
 */
export const DESIGN_ARI = {
  minorDrainageSystem: { ari_years: 10, note: "Minor system (≤ 10-year ARI)" },
  majorDrainageSystem: { ari_years: 100, note: "Major system (> 10-year ARI, typically 100-year)" },
  osdDesign: { ari_years: 10, note: "OSD design storm per MSMA Ch 5.8.1(a)" },
  waterQuality: { ari_months: 3, note: "Water quality (WQv) — 3-month ARI" },
  rationalMethodMaxArea_ha: 80,
} as const;
