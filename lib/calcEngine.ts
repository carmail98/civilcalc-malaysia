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
