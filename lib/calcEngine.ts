/**
 * Rational Method — Peak Flow
 * Q = C × i × A / 360
 * Reference: MSMA 2nd Edition, Chapter 2
 */
export function rationalMethod(C: number, i: number, A: number): number {
  return (C * i * A) / 360;
}

/**
 * Time of Concentration
 * Tc = to + td
 * Reference: MSMA 2nd Edition, Chapter 2
 */
export function timeOfConcentration(to: number, td: number): number {
  return to + td;
}

/**
 * Earthworks Cut & Fill Volume (Average End Area Method)
 * V = (A1 + A2) / 2 × L
 */
export function cutFillVolume(A1: number, A2: number, L: number): number {
  return ((A1 + A2) / 2) * L;
}

/**
 * Slope Gradient
 * S = V / H  (expressed as 1:n where n = H/V)
 */
export function slopeGradient(
  verticalRise: number,
  horizontalRun: number
): { ratio: number; percentage: number } {
  const ratio = horizontalRun / verticalRise;
  const percentage = (verticalRise / horizontalRun) * 100;
  return { ratio, percentage };
}
