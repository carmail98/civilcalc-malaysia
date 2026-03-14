/**
 * Rational Method — Peak Flow
 * Q = C × i × A / 360
 * Reference: MSMA 2nd Edition, Chapter 2
 */
export function rationalMethod(C: number, i: number, A: number): number {
  return (C * i * A) / 360;
}

/**
 * Overland Flow Time (Friend's Formula)
 * to = (107 × n × L^(1/3)) / S^(1/5)
 * Reference: MSMA 2nd Edition, Chapter 2, Eq. 2.5
 */
export function overlandFlowTime(n: number, L: number, S: number): number {
  return (107 * n * Math.pow(L, 1 / 3)) / Math.pow(S, 1 / 5);
}

/**
 * Drain Flow Time
 * td = L_d / (60 × V)
 * Reference: MSMA 2nd Edition, Chapter 2
 */
export function drainFlowTime(Ld: number, V: number): number {
  return Ld / (60 * V);
}

/**
 * Time of Concentration
 * tc = to + td (min), minimum 5 minutes per MSMA Clause 2.4.3
 * Reference: MSMA 2nd Edition, Chapter 2, Eq. 2.3
 */
export function timeOfConcentration(to: number, td: number): number {
  const tc = to + td;
  return Math.max(tc, 5);
}

/**
 * Earthworks Cut & Fill Volume
 * Average End Area: V = L/2 × (A1 + A2)
 * Prismoidal:       V = L/6 × (A1 + A2 + √(A1×A2))
 * Reference: JKR Earthworks Manual
 */
export function cutFillVolume(
  A1: number,
  A2: number,
  L: number,
  method: "average" | "prismoidal" = "average"
): number {
  if (method === "prismoidal") {
    return (L / 6) * (A1 + A2 + Math.sqrt(A1 * A2));
  }
  return (L / 2) * (A1 + A2);
}

/**
 * Slope Gradient & Batter
 * Ratio = 1 : (H/V), Percentage = (V/H) × 100, Angle = atan(V/H)
 * Reference: JKR Road Design / MASMA
 */
export function slopeGradient(
  verticalRise: number,
  horizontalRun: number
): { ratio: number; percentage: number; angle: number } {
  const ratio = horizontalRun / verticalRise;
  const percentage = (verticalRise / horizontalRun) * 100;
  const angle = Math.atan(verticalRise / horizontalRun) * (180 / Math.PI);
  return { ratio, percentage, angle };
}

/**
 * Dry Density & Compaction Check
 * ρw = (wetMass - mouldMass) / mouldVol
 * ρd = ρw / (1 + w/100)
 * Compaction % = (ρd / MDD) × 100
 * Reference: JKR Standard Specification S/4
 */
export function dryDensityCompaction(
  wetMass: number,
  mouldMass: number,
  mouldVol: number,
  moisture: number,
  MDD: number,
  requirement: number
): {
  wetDensity: number;
  dryDensity: number;
  compactionPercent: number;
  pass: boolean;
} {
  const netWetMass = wetMass - mouldMass;
  const wetDensity = netWetMass / mouldVol; // g/cm³ = Mg/m³
  const dryDensity = wetDensity / (1 + moisture / 100);
  const compactionPercent = (dryDensity / MDD) * 100;
  const pass = compactionPercent >= requirement;
  return { wetDensity, dryDensity, compactionPercent, pass };
}

/**
 * Road Carriageway Width Check
 * Min width = numLanes × laneWidth
 * Reference: JKR ATJ 8/86
 */
export function roadCarriagewayWidth(
  laneWidth: number,
  numLanes: number,
  proposedWidth: number
): { minWidth: number; pass: boolean } {
  const minWidth = laneWidth * numLanes;
  const pass = proposedWidth >= minWidth;
  return { minWidth, pass };
}

/**
 * Load Take-Off (Slab/Beam)
 * Gk = 24 × thickness(m) + finishes
 * ULS = 1.35Gk + 1.5Qk
 * W = ULS × tributary width
 * Reference: MS EN 1991-1-1 (EC1), Malaysia National Annex
 */
export function loadTakeOff(
  thickness: number,
  finishes: number,
  imposed: number,
  tribWidth: number
): {
  slabSW: number;
  Gk: number;
  Qk: number;
  ULS: number;
  lineLoad: number;
} {
  const slabSW = 24 * (thickness / 1000); // mm to m
  const Gk = slabSW + finishes;
  const Qk = imposed;
  const ULS = 1.35 * Gk + 1.5 * Qk;
  const lineLoad = ULS * tribWidth;
  return { slabSW, Gk, Qk, ULS, lineLoad };
}

/**
 * Manning's Open Channel Drain Sizing
 * Q = (1/n) × A × R^(2/3) × S^(1/2)
 * Rectangular: A = b×y, P = b + 2y
 * Trapezoidal: A = (b + z·y)·y, P = b + 2y·√(1 + z²)
 * Reference: MSMA 2nd Edition, Chapter 14 & 16
 */
export function manningDrainSizing(
  n: number,
  b: number,
  y: number,
  S: number,
  shape: "rectangular" | "trapezoidal" = "rectangular",
  z: number = 0
): {
  area: number;
  wettedPerimeter: number;
  hydraulicRadius: number;
  velocity: number;
  discharge: number;
} {
  let area: number;
  let wettedPerimeter: number;

  if (shape === "trapezoidal") {
    area = (b + z * y) * y;
    wettedPerimeter = b + 2 * y * Math.sqrt(1 + z * z);
  } else {
    area = b * y;
    wettedPerimeter = b + 2 * y;
  }

  const hydraulicRadius = area / wettedPerimeter;
  const velocity =
    (1 / n) * Math.pow(hydraulicRadius, 2 / 3) * Math.pow(S, 1 / 2);
  const discharge = velocity * area;

  return { area, wettedPerimeter, hydraulicRadius, velocity, discharge };
}

/**
 * JKR Flexible Pavement Design
 * Cumulative ESAL = ADT_cv × TF × 365 × DD × LDF × GF
 * GF = ((1 + r)^n − 1) / r
 * Traffic Category from cumulative ESAL
 * Pavement thicknesses from JKR design table (ATJ 5/85 rev 2013)
 * Reference: JKR Arahan Teknik Jalan 5/85 (Revised 2013)
 */

/** Growth factor: ((1+r)^n - 1) / r */
function growthFactor(r: number, n: number): number {
  if (r === 0) return n;
  return (Math.pow(1 + r, n) - 1) / r;
}

/** Determine Traffic Category from cumulative ESAL */
function trafficCategory(esal: number): { tc: string; range: string } {
  if (esal < 1e5) return { tc: "TC1", range: "< 1×10⁵" };
  if (esal < 5e5) return { tc: "TC2", range: "1×10⁵ – 5×10⁵" };
  if (esal < 1e6) return { tc: "TC3", range: "5×10⁵ – 1×10⁶" };
  if (esal < 5e6) return { tc: "TC4", range: "1×10⁶ – 5×10⁶" };
  if (esal < 1e7) return { tc: "TC5", range: "5×10⁶ – 1×10⁷" };
  if (esal < 2e7) return { tc: "TC6", range: "1×10⁷ – 2×10⁷" };
  return { tc: "TC7", range: "> 2×10⁷" };
}

/** JKR pavement thickness lookup (mm) by TC and CBR range */
interface PavementLayers {
  acWearing: number;
  acBinder: number;
  roadbase: number;
  subbase: number;
  total: number;
  cbrNote: string;
}

function pavementThickness(tc: string, cbr: number): PavementLayers {
  // Subbase adjustment for low CBR
  const subbaseExtra = cbr < 3 ? 100 : cbr < 5 ? 50 : 0;
  const cbrNote =
    cbr < 3
      ? "Low CBR (<3%) — additional 100mm subbase or consider subgrade stabilisation"
      : cbr < 5
      ? "Marginal CBR (3–5%) — additional 50mm subbase added"
      : cbr >= 10
      ? "Good subgrade (CBR ≥10%)"
      : "Adequate subgrade (CBR 5–10%)";

  const table: Record<string, [number, number, number, number]> = {
    TC1: [40, 0, 100, 150],
    TC2: [40, 40, 100, 150],
    TC3: [40, 60, 125, 200],
    TC4: [40, 60, 150, 200],
    TC5: [50, 70, 175, 200],
    TC6: [50, 75, 200, 200],
    TC7: [50, 100, 200, 250],
  };

  const [acWearing, acBinder, roadbase, baseSubbase] = table[tc] ?? table.TC4;
  const subbase = baseSubbase + subbaseExtra;
  const total = acWearing + acBinder + roadbase + subbase;

  return { acWearing, acBinder, roadbase, subbase, total, cbrNote };
}

export function flexiblePavement(
  adtCommercial: number,
  truckFactor: number,
  growthRate: number,
  designPeriod: number,
  directionalDist: number,
  laneDistFactor: number,
  cbr: number
): {
  growthFactor: number;
  cumulativeESAL: number;
  tc: string;
  tcRange: string;
  layers: PavementLayers;
} {
  const gf = growthFactor(growthRate / 100, designPeriod);
  const cumulativeESAL =
    adtCommercial * truckFactor * 365 * directionalDist * laneDistFactor * gf;
  const { tc, range } = trafficCategory(cumulativeESAL);
  const layers = pavementThickness(tc, cbr);

  return {
    growthFactor: gf,
    cumulativeESAL,
    tc,
    tcRange: range,
    layers,
  };
}

/**
 * Culvert Hydraulic Design (Manning's Full-Flow)
 * Q = (1/n) × A × R^(2/3) × S^(1/2) × N_barrels
 * Box: A = B×D, P = 2(B+D)
 * Pipe: A = π·d²/4, P = π·d
 * Reference: MSMA 2nd Edition Ch 36, REAM Road Drainage Design Vol 4
 */
export function culvertDesign(
  n: number,
  slope: number,
  numBarrels: number,
  type: "box" | "pipe",
  /** Box: width (m), Pipe: diameter (m) */
  dim1: number,
  /** Box: height (m), Pipe: unused */
  dim2: number,
  Qdesign?: number
): {
  area: number;
  wettedPerimeter: number;
  hydraulicRadius: number;
  velocity: number;
  capacityPerBarrel: number;
  totalCapacity: number;
  adequacy: number | null;
  pass: boolean | null;
} {
  let area: number;
  let wettedPerimeter: number;

  if (type === "pipe") {
    area = (Math.PI * dim1 * dim1) / 4;
    wettedPerimeter = Math.PI * dim1;
  } else {
    area = dim1 * dim2;
    wettedPerimeter = 2 * (dim1 + dim2);
  }

  const hydraulicRadius = area / wettedPerimeter;
  const velocity =
    (1 / n) * Math.pow(hydraulicRadius, 2 / 3) * Math.pow(slope, 1 / 2);
  const capacityPerBarrel = velocity * area;
  const totalCapacity = capacityPerBarrel * numBarrels;

  let adequacy: number | null = null;
  let pass: boolean | null = null;
  if (Qdesign !== undefined && Qdesign > 0) {
    adequacy = totalCapacity / Qdesign;
    pass = adequacy >= 1.0;
  }

  return {
    area,
    wettedPerimeter,
    hydraulicRadius,
    velocity,
    capacityPerBarrel,
    totalCapacity,
    adequacy,
    pass,
  };
}

/**
 * IDF Curve — Rainfall Intensity
 * i = (λ × T^κ) / (d + θ)^η
 * Where:
 *   i  = rainfall intensity (mm/hr)
 *   T  = Average Recurrence Interval, ARI (years)
 *   d  = storm duration (minutes)
 *   λ, κ, θ, η = station-specific fitting constants
 * Reference: MSMA 2nd Edition, Appendix 2.B & DID HP1
 */
export interface IDFConstants {
  lambda: number;
  kappa: number;
  theta: number;
  eta: number;
}

/** Preset IDF constants for major Malaysian regions (MSMA/HP1 representative) */
export const IDF_PRESETS: Record<string, { label: string; constants: IDFConstants }> = {
  kl: {
    label: "Kuala Lumpur (Stn 3116004)",
    constants: { lambda: 59.972, kappa: 0.163, theta: 0.121, eta: 0.794 },
  },
  jb: {
    label: "Johor Bahru (Stn 1437116)",
    constants: { lambda: 54.265, kappa: 0.174, theta: 0.128, eta: 0.776 },
  },
  penang: {
    label: "Penang (Stn 5302001)",
    constants: { lambda: 55.360, kappa: 0.169, theta: 0.130, eta: 0.780 },
  },
  ipoh: {
    label: "Ipoh (Stn 4207048)",
    constants: { lambda: 58.118, kappa: 0.156, theta: 0.115, eta: 0.788 },
  },
  kuantan: {
    label: "Kuantan (Stn 3930012)",
    constants: { lambda: 52.910, kappa: 0.190, theta: 0.100, eta: 0.756 },
  },
  kb: {
    label: "Kota Bharu (Stn 5722057)",
    constants: { lambda: 61.380, kappa: 0.182, theta: 0.105, eta: 0.768 },
  },
  custom: {
    label: "Custom (enter own constants)",
    constants: { lambda: 0, kappa: 0, theta: 0, eta: 0 },
  },
};

export function rainfallIntensity(
  constants: IDFConstants,
  ari: number,
  duration: number
): number {
  const { lambda, kappa, theta, eta } = constants;
  return (lambda * Math.pow(ari, kappa)) / Math.pow(duration + theta, eta);
}

/** Generate intensity table for multiple ARIs and durations */
export function idfTable(
  constants: IDFConstants,
  ariList: number[],
  durationList: number[]
): { ari: number; duration: number; intensity: number }[] {
  const results: { ari: number; duration: number; intensity: number }[] = [];
  for (const ari of ariList) {
    for (const dur of durationList) {
      results.push({
        ari,
        duration: dur,
        intensity: rainfallIntensity(constants, ari, dur),
      });
    }
  }
  return results;
}

/**
 * Detention Pond Volume Sizing (MSMA Simplified Rational Method)
 * Q_pre  = C_pre  × i × A / 360
 * Q_post = C_post × i × A / 360
 * PSD = Permissible Site Discharge (= Q_pre or authority-specified)
 * V_s = (Q_post − PSD) × t_d × 60   (m³)
 * Reference: MSMA 2nd Edition, Chapter 5 (On-Site Detention / Quantity Control)
 */
export function detentionPond(
  area: number,
  cPre: number,
  cPost: number,
  intensity: number,
  stormDuration: number,
  psdOverride?: number
): {
  qPre: number;
  qPost: number;
  psd: number;
  storageVolume: number;
  storageDuration: number;
  psdSource: string;
} {
  const qPre = (cPre * intensity * area) / 360;
  const qPost = (cPost * intensity * area) / 360;

  const psd =
    psdOverride !== undefined && psdOverride > 0 ? psdOverride : qPre;
  const psdSource =
    psdOverride !== undefined && psdOverride > 0
      ? "Authority-specified"
      : "Pre-development flow (Q_pre)";

  // Storage volume (m³) — net inflow over storm duration
  const storageVolume = Math.max(0, (qPost - psd) * stormDuration * 60);

  return {
    qPre,
    qPost,
    psd,
    storageVolume,
    storageDuration: stormDuration,
    psdSource,
  };
}

/**
 * Sewer Pipe Sizing (MSIG / SPAN)
 * DWF = PE × q / 86400   (L/s)
 * Peak Factor (Harmon's): PF = 1 + 14 / (4 + √(PE/1000))
 * Peak Flow = PF × DWF
 * Design Flow = Peak Flow + Infiltration
 * Pipe capacity (full): Q = (1/n) × A × R^(2/3) × S^(1/2)
 * Reference: MSIG (Malaysian Sewerage Industry Guidelines), SPAN UTG
 */
export function sewerPipeSizing(
  PE: number,
  perCapitaFlow: number,
  pipeDia: number,
  pipeSlope: number,
  manningN: number,
  infiltration: number
): {
  dwf: number;
  peakFactor: number;
  peakFlow: number;
  infiltrationFlow: number;
  designFlow: number;
  pipeArea: number;
  hydraulicRadius: number;
  fullFlowCapacity: number;
  fullFlowVelocity: number;
  flowRatio: number;
  selfCleansing: boolean;
  adequate: boolean;
} {
  // DWF in L/s
  const dwf = (PE * perCapitaFlow) / 86400;

  // Harmon's Peak Factor
  const pThousands = PE / 1000;
  const peakFactor = 1 + 14 / (4 + Math.sqrt(pThousands));

  // Peak flow
  const peakFlow = peakFactor * dwf;

  // Infiltration (input is already L/s)
  const infiltrationFlow = infiltration;

  // Design flow
  const designFlow = peakFlow + infiltrationFlow;

  // Pipe full-flow capacity using Manning's (diameter in mm → m)
  const d = pipeDia / 1000;
  const pipeArea = (Math.PI * d * d) / 4;
  const wettedPerimeter = Math.PI * d;
  const hydraulicRadius = pipeArea / wettedPerimeter; // = d/4

  const fullFlowVelocity =
    (1 / manningN) *
    Math.pow(hydraulicRadius, 2 / 3) *
    Math.pow(pipeSlope, 1 / 2);
  const fullFlowCapacity = fullFlowVelocity * pipeArea * 1000; // m³/s → L/s

  // Flow ratio (Q_design / Q_full)
  const flowRatio = designFlow / fullFlowCapacity;

  // Self-cleansing: velocity at design flow should be ≥ 0.6 m/s
  // Approximate velocity at partial flow ≈ full flow velocity × ratio factor
  const selfCleansing = fullFlowVelocity >= 0.6;

  // Adequate if flow ratio ≤ 0.80 (MSIG: max 80% full for gravity sewer)
  const adequate = flowRatio <= 0.8;

  return {
    dwf,
    peakFactor,
    peakFlow,
    infiltrationFlow,
    designFlow,
    pipeArea,
    hydraulicRadius,
    fullFlowCapacity,
    fullFlowVelocity,
    flowRatio,
    selfCleansing,
    adequate,
  };
}

/**
 * RC Beam Moment Capacity (EC2)
 * Mu = 0.87 × fyk × As × z
 * z = d - 0.4x, capped at 0.95d
 * K = Mu / (b × d² × fck), K' = 0.167
 * Reference: MS EN 1992-1-1:2010, Malaysia NA (αcc = 0.85)
 */
export function rcBeamMoment(
  b: number,
  d: number,
  As: number,
  fck: number,
  fyk: number,
  MEd?: number
): {
  K: number;
  K_limit: number;
  z: number;
  Mu: number;
  singlyReinforced: boolean;
  utilisation: number | null;
  passUtilisation: boolean | null;
} {
  const K_limit = 0.167;

  // Force equilibrium: 0.454·fck·b·x = 0.87·fyk·As
  const Fst = 0.87 * fyk * As;
  const x = Fst / (0.454 * fck * b);

  // Lever arm, capped at 0.95d
  let z = d - 0.4 * x;
  z = Math.min(z, 0.95 * d);

  // Moment capacity (N·mm → kN·m)
  const Mu = (Fst * z) / 1e6;

  // K value check
  const K = (Mu * 1e6) / (b * d * d * fck);
  const singlyReinforced = K <= K_limit;

  // Utilisation check if MEd provided
  let utilisation: number | null = null;
  let passUtilisation: boolean | null = null;
  if (MEd !== undefined && MEd > 0) {
    utilisation = MEd / Mu;
    passUtilisation = utilisation <= 1.0;
  }

  return { K, K_limit, z, Mu, singlyReinforced, utilisation, passUtilisation };
}
