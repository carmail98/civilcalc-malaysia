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

/**
 * RC Beam Shear Design (EC2 Cl. 6.2.3)
 * VRd,c = [CRd,c · k · (100 · ρl · fck)^(1/3)] · bw · d
 * VRd,s = (Asw/s) · z · fywd · cot θ
 * VRd,max = αcw · bw · z · ν1 · fcd / (cot θ + tan θ)
 * Reference: MS EN 1992-1-1:2010, Clause 6.2.3, Malaysia NA
 */
export function rcBeamShear(
  bw: number,
  d: number,
  Asl: number,
  fck: number,
  fyk: number,
  VEd: number,
  AswProvided?: number,
  sProvided?: number
): {
  k: number;
  rhoL: number;
  VRdc: number;
  VRdcMin: number;
  shearReinfRequired: boolean;
  cotTheta: number;
  VRdmax: number;
  AswsRequired: number;
  AswsMin: number;
  slMax: number;
  VRds: number | null;
  utilisation: number;
  pass: boolean;
} {
  const gammaC = 1.5;
  const gammaS = 1.15;
  const CRdc = 0.18 / gammaC;

  // k factor (d in mm)
  const k = Math.min(1 + Math.sqrt(200 / d), 2.0);

  // Longitudinal reinforcement ratio
  const rhoL = Math.min(Asl / (bw * d), 0.02);

  // Concrete shear resistance (N → kN)
  const VRdc =
    (CRdc * k * Math.pow(100 * rhoL * fck, 1 / 3) * bw * d) / 1000;

  // Minimum concrete shear resistance
  const vMin = 0.035 * Math.pow(k, 1.5) * Math.pow(fck, 0.5);
  const VRdcMin = (vMin * bw * d) / 1000;

  const VRdcDesign = Math.max(VRdc, VRdcMin);
  const shearReinfRequired = VEd > VRdcDesign;

  // Lever arm
  const z = 0.9 * d;
  const fywd = fyk / gammaS;
  const fcd = 0.85 * fck / gammaC;
  const v1 = 0.6 * (1 - fck / 250);

  // Optimise cot θ: start at 2.5 (flattest strut), check VRd,max
  let cotTheta = 2.5;
  let VRdmax = (bw * z * v1 * fcd) / ((cotTheta + 1 / cotTheta) * 1000);
  if (VEd > VRdmax) {
    // Need steeper strut — solve for θ from VEd = VRd,max
    // cot θ + tan θ = bw·z·v1·fcd / (VEd·1000)
    const ratio = (bw * z * v1 * fcd) / (VEd * 1000);
    if (ratio >= 2) {
      // Solve cot²θ - ratio·cotθ + 1 = 0
      const disc = ratio * ratio - 4;
      cotTheta = disc > 0 ? (ratio - Math.sqrt(disc)) / 2 : 1.0;
      cotTheta = Math.max(1.0, Math.min(cotTheta, 2.5));
    } else {
      cotTheta = 1.0;
    }
    VRdmax = (bw * z * v1 * fcd) / ((cotTheta + 1 / cotTheta) * 1000);
  }

  // Required Asw/s (mm²/mm)
  const AswsRequired = shearReinfRequired
    ? (VEd * 1000) / (z * fywd * cotTheta)
    : 0;

  // Minimum shear reinforcement ρw,min = 0.08√fck / fyk
  const rhoWmin = (0.08 * Math.sqrt(fck)) / fyk;
  const AswsMin = rhoWmin * bw;

  // Maximum link spacing
  const slMax = 0.75 * d;

  // If user provides Asw and spacing, compute VRd,s
  let VRds: number | null = null;
  if (
    AswProvided !== undefined &&
    sProvided !== undefined &&
    AswProvided > 0 &&
    sProvided > 0
  ) {
    VRds = ((AswProvided / sProvided) * z * fywd * cotTheta) / 1000;
  }

  const capacity = VRds !== null ? Math.min(VRds, VRdmax) : VRdmax;
  const utilisation = VEd / capacity;
  const pass = VEd <= capacity && VEd <= VRdmax;

  return {
    k,
    rhoL,
    VRdc: VRdcDesign,
    VRdcMin,
    shearReinfRequired,
    cotTheta,
    VRdmax,
    AswsRequired: Math.max(AswsRequired, AswsMin),
    AswsMin,
    slMax,
    VRds,
    utilisation,
    pass,
  };
}

/**
 * RC Column N-M Interaction (EC2 Cl. 6.1)
 * Rectangular stress block with symmetric reinforcement
 * ε_cu = 0.0035, λ = 0.8, η = 1.0 for fck ≤ 50 MPa
 * Reference: MS EN 1992-1-1:2010, Clause 6.1, Malaysia NA
 */
export interface ColumnInteractionPoint {
  N: number;
  M: number;
}

export function rcColumnInteraction(
  b: number,
  h: number,
  dPrime: number,
  AsFace1: number,
  AsFace2: number,
  fck: number,
  fyk: number
): {
  points: ColumnInteractionPoint[];
  Nmax: number;
  Nbal: number;
  Mbal: number;
  M0: number;
  AsMin: number;
  AsMax: number;
} {
  const gammaC = 1.5;
  const gammaS = 1.15;
  const fcd = 0.85 * fck / gammaC;
  const fyd = fyk / gammaS;
  const Es = 200000; // MPa
  const epsCu = 0.0035;
  const lambda = 0.8;
  const eta = 1.0;

  const d = h - dPrime;
  const Ac = b * h;

  // Min/max steel checks
  const AsTotal = AsFace1 + AsFace2;
  const NEdApprox = fcd * Ac / 1000; // rough for min check
  const AsMin = Math.max(0.002 * Ac, (0.10 * NEdApprox * 1000) / fyd);
  const AsMax = 0.04 * Ac;

  // Generate interaction diagram by varying neutral axis x
  const points: ColumnInteractionPoint[] = [];

  // Pure compression (x → ∞, all concrete and steel in compression)
  const Nmax =
    (eta * fcd * Ac + fyd * AsTotal) / 1000; // kN

  // Pure tension
  const Ntension = -(fyd * AsTotal) / 1000;

  // Sweep x from small to large
  const steps = 50;
  for (let i = 0; i <= steps; i++) {
    // x ranges from 0 to 2h (covers all cases)
    const x = (i / steps) * 2 * h;

    // Concrete compression block
    const sBlock = Math.min(lambda * x, h);
    const Fcc = eta * fcd * b * sBlock;

    // Steel strains (compression positive)
    const eps1 = x > 0 ? epsCu * (x - dPrime) / x : -Infinity;
    const eps2 = x > 0 ? epsCu * (x - d) / x : -Infinity;

    // Steel stresses (capped at fyd)
    const sig1 = Math.min(Math.max(eps1 * Es, -fyd), fyd);
    const sig2 = Math.min(Math.max(eps2 * Es, -fyd), fyd);

    const Fs1 = sig1 * AsFace1;
    const Fs2 = sig2 * AsFace2;

    // Axial force (kN) — positive compression, centroid at h/2
    const N = (Fcc + Fs1 + Fs2) / 1000;

    // Moment about centroid (kN.m)
    const M =
      (Fcc * (h / 2 - sBlock / 2) +
        Fs1 * (h / 2 - dPrime) +
        Fs2 * (h / 2 - d)) /
      1e6;

    points.push({ N, M: Math.abs(M) });
  }

  // Add pure tension point
  points.push({ N: Ntension, M: 0 });

  // Find balanced point (steel at d just yields: εs = fyd/Es)
  const xBal = (epsCu * d) / (epsCu + fyd / Es);
  const sBlockBal = Math.min(lambda * xBal, h);
  const FccBal = eta * fcd * b * sBlockBal;
  const eps1Bal = epsCu * (xBal - dPrime) / xBal;
  const sig1Bal = Math.min(Math.max(eps1Bal * Es, -fyd), fyd);
  const Fs1Bal = sig1Bal * AsFace1;
  const Fs2Bal = -fyd * AsFace2; // tension steel yields
  const Nbal = (FccBal + Fs1Bal + Fs2Bal) / 1000;
  const Mbal =
    Math.abs(
      FccBal * (h / 2 - sBlockBal / 2) +
        Fs1Bal * (h / 2 - dPrime) +
        Fs2Bal * (h / 2 - d)
    ) / 1e6;

  // Pure bending (N ≈ 0): find x where N = 0 by bisection
  let xLow = 0;
  let xHigh = h;
  let M0 = 0;
  for (let iter = 0; iter < 50; iter++) {
    const xMid = (xLow + xHigh) / 2;
    const sB = Math.min(lambda * xMid, h);
    const Fc = eta * fcd * b * sB;
    const e1 = xMid > 0 ? epsCu * (xMid - dPrime) / xMid : 0;
    const e2 = xMid > 0 ? epsCu * (xMid - d) / xMid : 0;
    const s1 = Math.min(Math.max(e1 * Es, -fyd), fyd);
    const s2 = Math.min(Math.max(e2 * Es, -fyd), fyd);
    const Ntest = Fc + s1 * AsFace1 + s2 * AsFace2;
    if (Ntest > 0) xHigh = xMid;
    else xLow = xMid;
    if (Math.abs(Ntest) < 10) {
      // close enough to 0
      M0 =
        Math.abs(
          Fc * (h / 2 - sB / 2) +
            s1 * AsFace1 * (h / 2 - dPrime) +
            s2 * AsFace2 * (h / 2 - d)
        ) / 1e6;
      break;
    }
  }

  return { points, Nmax, Nbal, Mbal, M0, AsMin, AsMax };
}

/**
 * Check if (NEd, MEd) is inside column interaction diagram
 */
export function rcColumnCheck(
  b: number,
  h: number,
  dPrime: number,
  AsFace1: number,
  AsFace2: number,
  fck: number,
  fyk: number,
  NEd: number,
  MEd: number
): {
  pass: boolean;
  utilisationRatio: number;
} {
  const { points } = rcColumnInteraction(b, h, dPrime, AsFace1, AsFace2, fck, fyk);

  // Find capacity moment at given N level by interpolation on the envelope
  // Ratio = distance from origin to (NEd, MEd) / distance to envelope
  let MCapacity = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    if ((p1.N >= NEd && p2.N <= NEd) || (p1.N <= NEd && p2.N >= NEd)) {
      const t = Math.abs(p1.N - p2.N) > 0.01 ? (NEd - p1.N) / (p2.N - p1.N) : 0;
      const Mint = p1.M + t * (p2.M - p1.M);
      MCapacity = Math.max(MCapacity, Mint);
    }
  }

  const utilisationRatio = MCapacity > 0 ? MEd / MCapacity : 999;
  const pass = utilisationRatio <= 1.0;

  return { pass, utilisationRatio };
}

/**
 * Isolated Pad Footing Design (EC2/EC7)
 * Bearing: q = N/A ± 6M/(B·L²)
 * Flexure: K = M/(b·d²·fck), As = M/(0.87·fyk·z)
 * Punching: vEd = β·V/(u₁·d), vRd,c = CRd,c·k·(100·ρl·fck)^(1/3)
 * Reference: MS EN 1992-1-1:2010 Cl 6.4, MS EN 1997-1, Malaysia NA
 */
export function padFootingDesign(
  colWidth: number,
  colDepth: number,
  Nsls: number,
  Nuls: number,
  B: number,
  L: number,
  h: number,
  cover: number,
  barDia: number,
  fck: number,
  fyk: number,
  qAllowable: number,
  Msls?: number,
  Muls?: number,
  linkDia: number = 0
): {
  footingSW: number;
  qMaxSLS: number;
  qMinSLS: number;
  bearingPass: boolean;
  bearingUtilisation: number;
  dEff: number;
  qUls: number;
  MEdLong: number;
  AsReqLong: number;
  MEdShort: number;
  AsReqShort: number;
  AsMinFooting: number;
  u1: number;
  vEdPunch: number;
  vRdcPunch: number;
  punchingPass: boolean;
  punchingUtilisation: number;
  overallPass: boolean;
} {
  const gammaC = 1.5;

  // Effective depth (mm) — EC2: d = h - cover - linkDia - barDia/2
  const dEff = h - cover - linkDia - barDia / 2;

  // Footing self-weight (kN)
  const footingSW = 24 * (B / 1000) * (L / 1000) * (h / 1000);

  // Bearing pressure (SLS) — convert B, L from mm to m
  const Bm = B / 1000;
  const Lm = L / 1000;
  const Atot = Bm * Lm;
  const NslsTotal = Nsls + footingSW;
  const mSls = Msls ?? 0;
  const qDirect = NslsTotal / Atot;
  const qMoment = mSls > 0 ? (6 * mSls) / (Bm * Lm * Lm) : 0;
  const qMaxSLS = qDirect + qMoment;
  const qMinSLS = qDirect - qMoment;
  const bearingUtilisation = qMaxSLS / qAllowable;
  const bearingPass = qMaxSLS <= qAllowable && qMinSLS >= 0;

  // ULS bearing pressure for flexure design (kPa)
  const mUls = Muls ?? 0;
  const qUls = Nuls / Atot + (mUls > 0 ? (6 * mUls) / (Bm * Lm * Lm) : 0);

  // Flexure — cantilever from column face
  // Long direction (spanning along L)
  const cantL = (Lm / 2 - (colDepth / 1000) / 2);
  const MEdLong = qUls * Bm * cantL * cantL / 2; // kN.m

  // Short direction (spanning along B)
  const cantB = (Bm / 2 - (colWidth / 1000) / 2);
  const MEdShort = qUls * Lm * cantB * cantB / 2; // kN.m

  // Steel area required (per m width)
  const calcAs = (Med: number, width: number): number => {
    const K = (Med * 1e6) / (width * dEff * dEff * fck);
    const zCalc = dEff * Math.min(0.5 + Math.sqrt(0.25 - K / 1.134), 0.95);
    return (Med * 1e6) / (0.87 * fyk * zCalc);
  };

  const AsReqLong = calcAs(MEdLong, B);
  const AsReqShort = calcAs(MEdShort, L);

  // Minimum reinforcement
  const fctm = 0.3 * Math.pow(fck, 2 / 3);
  const AsMinFooting = Math.max(0.26 * (fctm / fyk) * 1000 * dEff, 0.0013 * 1000 * dEff);

  // Punching shear (EC2 Cl. 6.4)
  const CRdc = 0.18 / gammaC;
  const k = Math.min(1 + Math.sqrt(200 / dEff), 2.0);

  // Control perimeter at 2d from column face
  const u1 =
    2 * (colWidth + colDepth) + 2 * Math.PI * 2 * dEff;

  // Punching shear stress
  const beta = 1.0; // concentric (no eccentricity factor)
  const VEdPunch = Nuls - qUls * ((colWidth / 1000 + 4 * dEff / 1000) * (colDepth / 1000 + 4 * dEff / 1000));
  const vEdPunch = (beta * Math.max(VEdPunch, 0) * 1000) / (u1 * dEff);

  // Punching resistance
  const rhoLx = AsReqLong > 0 ? AsReqLong / (B * dEff) : 0.002;
  const rhoLy = AsReqShort > 0 ? AsReqShort / (L * dEff) : 0.002;
  const rhoL = Math.min(Math.sqrt(rhoLx * rhoLy), 0.02);
  const vRdcPunch = CRdc * k * Math.pow(100 * rhoL * fck, 1 / 3);
  const vMin = 0.035 * Math.pow(k, 1.5) * Math.pow(fck, 0.5);
  const vRdcFinal = Math.max(vRdcPunch, vMin);

  const punchingUtilisation = vEdPunch / vRdcFinal;
  const punchingPass = vEdPunch <= vRdcFinal;

  const overallPass = bearingPass && punchingPass;

  return {
    footingSW,
    qMaxSLS,
    qMinSLS,
    bearingPass,
    bearingUtilisation,
    dEff,
    qUls,
    MEdLong,
    AsReqLong,
    MEdShort,
    AsReqShort,
    AsMinFooting,
    u1,
    vEdPunch,
    vRdcPunch: vRdcFinal,
    punchingPass,
    punchingUtilisation,
    overallPass,
  };
}

/**
 * Crack Width Control SLS (EC2 Cl. 7.3.4)
 * wk = sr,max · (εsm − εcm)
 * sr,max = 3.4c + 0.425·k1·k2·φ/ρp,eff
 * Reference: MS EN 1992-1-1:2010, Clause 7.3.4, Malaysia NA
 */
export function crackWidthEC2(
  b: number,
  h: number,
  d: number,
  As: number,
  phi: number,
  cover: number,
  fck: number,
  Msls: number,
  kt: number,
  wkLimit?: number
): {
  Ecm: number;
  fctEff: number;
  alphaE: number;
  xCracked: number;
  z: number;
  sigmaS: number;
  rhoEff: number;
  hcEff: number;
  AcEff: number;
  srMax: number;
  epsilonDiff: number;
  wk: number;
  wkLimit: number;
  pass: boolean;
  utilisation: number;
} {
  const Es = 200000; // MPa
  const limit = wkLimit ?? 0.3;

  // Concrete properties (EC2 Table 3.1)
  const Ecm = 22 * Math.pow(fck / 10 + 0.8, 0.3) * 1000; // MPa
  const fctm = fck <= 50 ? 0.3 * Math.pow(fck, 2 / 3) : 2.12 * Math.log(1 + fck / 10 + 0.8);
  const fctEff = fctm;
  const alphaE = Es / Ecm;

  // Cracked neutral axis by solving quadratic: b·x²/2 = αe·As·(d - x)
  // → b·x²/2 + αe·As·x - αe·As·d = 0
  const a = b / 2;
  const bCoeff = alphaE * As;
  const c = -alphaE * As * d;
  const disc = bCoeff * bCoeff - 4 * a * c;
  const xCracked = (-bCoeff + Math.sqrt(disc)) / (2 * a);

  // Lever arm
  const z = d - xCracked / 3;

  // Steel stress under SLS moment (Msls in kN.m → N.mm)
  const sigmaS = (Msls * 1e6) / (As * z);

  // Effective tension area
  const hcEff = Math.min(2.5 * (h - d), (h - xCracked) / 3, h / 2);
  const AcEff = b * hcEff;
  const rhoEff = As / AcEff;

  // Crack spacing
  const k1 = 0.8; // deformed bars
  const k2 = 0.5; // bending
  const k3 = 3.4;
  const k4 = 0.425;
  const srMax = k3 * cover + k1 * k2 * k4 * phi / rhoEff;

  // Strain difference
  const epsilonDiff = Math.max(
    (sigmaS - kt * (fctEff / rhoEff) * (1 + alphaE * rhoEff)) / Es,
    0.6 * sigmaS / Es
  );

  // Crack width
  const wk = srMax * epsilonDiff;

  const utilisation = wk / limit;
  const pass = wk <= limit;

  return {
    Ecm: Ecm / 1000, // return in GPa
    fctEff,
    alphaE,
    xCracked,
    z,
    sigmaS,
    rhoEff,
    hcEff,
    AcEff,
    srMax,
    epsilonDiff,
    wk,
    wkLimit: limit,
    pass,
    utilisation,
  };
}
