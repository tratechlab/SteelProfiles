import {
  SteelProfile,
  SteelGrade,
  CalculationLoads,
  EurocodeResult,
  VerificationCheck,
  BucklingCurve,
} from '../types/steel';
import { getEffectiveMechanicalProperties } from '../data/steelGrades';

const IMPERFECTION_FACTORS: Record<BucklingCurve, number> = {
  a0: 0.13,
  a: 0.21,
  b: 0.34,
  c: 0.49,
  d: 0.76,
};

/**
 * Calculates reduction factor chi for flexural buckling according to EN 1993-1-1 clause 6.3.1.2
 */
export function calculateBucklingChi(lambdaBar: number, curve: BucklingCurve): number {
  if (lambdaBar <= 0.2) {
    return 1.0;
  }
  const alpha = IMPERFECTION_FACTORS[curve] || 0.34;
  const phi = 0.5 * (1 + alpha * (lambdaBar - 0.2) + lambdaBar * lambdaBar);
  const root = Math.sqrt(Math.max(0, phi * phi - lambdaBar * lambdaBar));
  const chi = 1 / (phi + root);
  return Math.min(1.0, Math.max(0, chi));
}

/**
 * Calculates elastic critical moment Mcr for lateral torsional buckling
 */
export function calculateMcr(
  profile: SteelProfile,
  grade: SteelGrade,
  LltMeters: number
): number {
  const L = LltMeters * 1000; // mm
  if (L <= 0) return 9999999;

  const E = grade.E; // N/mm²
  const G = grade.G; // N/mm²
  const Iz = profile.Iz * 10000; // cm⁴ -> mm⁴
  const It = profile.It * 10000; // cm⁴ -> mm⁴
  const Iw = profile.Iw * 1000000; // cm⁶ -> mm⁶

  const C1 = 1.132;
  const term1 = (Math.PI * Math.PI * E * Iz) / (L * L);
  const term2 = (Iw / (Iz || 1)) * (Math.PI * Math.PI * E / (L * L)) + (G * It);
  
  const McrNmm = C1 * Math.sqrt(Math.max(0, term1 * term2));
  return McrNmm / 1e6; // Return in kNm
}

/**
 * Calculates the material-dependent Tangent Modulus Et
 * - For Carbon/HS/DIN/ISO steel: CRC parabolic formulation
 * - For Stainless steel (Inox): Ramberg-Osgood non-linear model (EN 1993-1-4)
 */
export function calculateTangentModulus(
  totalStressMPa: number,
  grade: SteelGrade,
  effectiveFy: number
): number {
  const E = grade.E;
  const sigma = Math.min(effectiveFy * 1.05, Math.abs(totalStressMPa));

  if (grade.materialFamily === 'STAINLESS_STEEL') {
    // Ramberg-Osgood formulation for stainless steel (EN 1993-1-4 Annex C)
    const n = 6.0; // Ramberg-Osgood strain hardening parameter
    const ratio = sigma / (effectiveFy || 1);
    const et = E / (1 + (3 / 7) * n * Math.pow(ratio, n - 1));
    return Math.round(Math.max(E * 0.05, et));
  }

  // Standard CRC parabolic tangent modulus for structural carbon and high-strength steels
  const fp = 0.58 * effectiveFy; // Proportional limit
  if (sigma <= fp) {
    return E; // Pure elastic state
  }

  const fraction = (sigma - fp) / (effectiveFy - fp);
  const reduction = 1 - fraction * fraction;
  const minRatio = grade.tangentModulusRatio || 0.08;
  const etRatio = Math.max(minRatio, reduction);
  return Math.round(E * etRatio);
}

export function calculateEurocode3(
  profile: SteelProfile,
  grade: SteelGrade,
  loads: CalculationLoads
): EurocodeResult {
  // 1. Thickness-adjusted mechanical properties (EN 10025-2 Table 7 / ISO 630)
  const flangeThickness = profile.tf || 10;
  const effectiveProps = getEffectiveMechanicalProperties(grade, flangeThickness);
  const { fy, fu, E } = effectiveProps;
  const { gammaM0, gammaM1 } = grade;

  const epsilon = Math.sqrt(235 / fy);
  
  // 2. Cross-section classification
  const cFlange = (profile.b - profile.tw - 2 * profile.r) / 2;
  const flangeSlenderness = Math.max(1, cFlange / (profile.tf || 1));
  const dWeb = Math.max(1, profile.h - 2 * profile.tf - 2 * profile.r);
  const webSlenderness = dWeb / (profile.tw || 1);

  let crossSectionClass: 1 | 2 | 3 | 4 = 1;
  if (flangeSlenderness > 14 * epsilon || webSlenderness > 124 * epsilon) {
    crossSectionClass = 4;
  } else if (flangeSlenderness > 10 * epsilon || webSlenderness > 83 * epsilon) {
    crossSectionClass = 3;
  } else if (flangeSlenderness > 9 * epsilon || webSlenderness > 72 * epsilon) {
    crossSectionClass = 2;
  } else {
    crossSectionClass = 1;
  }

  // 3. Stress & Tangent Modulus
  const axialStress = (Math.abs(loads.Ned) * 10) / (profile.A || 1);
  const bendingStress = (Math.abs(loads.Myed) * 1000) / (profile.Wely || 1);
  const totalStress = axialStress + bendingStress;
  const calculatedEt = calculateTangentModulus(totalStress, grade, fy);
  const etRatio = calculatedEt / (E || 1);

  // 4. Tension Resistance: Nt,Rd = (A * fy) / gammaM0 [kN]
  const NtRd = (profile.A * 100 * fy) / (gammaM0 * 1000);
  const isTension = loads.Ned < 0;
  const absNed = Math.abs(loads.Ned);
  const etaTension = isTension ? absNed / (NtRd || 1) : 0;

  // 5. Compression Resistance (squash load): Nc,Rd = (A * fy) / gammaM0 [kN]
  const NcRd = (profile.A * 100 * fy) / (gammaM0 * 1000);
  const isCompression = loads.Ned > 0;
  const etaCompression = isCompression ? loads.Ned / (NcRd || 1) : 0;

  // 6. Flexural Buckling Resistance (EN 1993-1-1 6.3.1)
  const lambda1 = Math.PI * Math.sqrt(E / fy);
  
  // y-axis buckling
  const lambdaY = (loads.Lcry * 100) / (profile.iy || 1);
  const lambdaBarY = lambdaY / lambda1;
  const chiY = calculateBucklingChi(lambdaBarY, profile.curveY);
  const NbYRd = (chiY * profile.A * 100 * fy) / (gammaM1 * 1000);
  const etaBucklingY = isCompression ? loads.Ned / (NbYRd || 1) : 0;

  // z-axis buckling
  const lambdaZ = (loads.Lcrz * 100) / (profile.iz || 1);
  const lambdaBarZ = lambdaZ / lambda1;
  const chiZ = calculateBucklingChi(lambdaBarZ, profile.curveZ);
  const NbZRd = (chiZ * profile.A * 100 * fy) / (gammaM1 * 1000);
  const etaBucklingZ = isCompression ? loads.Ned / (NbZRd || 1) : 0;

  const NbRdMin = Math.min(NbYRd, NbZRd);
  const etaBucklingMin = Math.max(etaBucklingY, etaBucklingZ);

  // 7. Bending Resistance (EN 1993-1-1 6.2.5)
  const Wy = crossSectionClass <= 2 ? profile.Wply : profile.Wely;
  const Wz = crossSectionClass <= 2 ? profile.Wplz : profile.Welz;
  
  const MyRd = (Wy * 1000 * fy) / (gammaM0 * 1e6);
  const MzRd = (Wz * 1000 * fy) / (gammaM0 * 1e6);
  
  const etaBendingY = Math.abs(loads.Myed) / (MyRd || 1);
  const etaBendingZ = Math.abs(loads.Mzed) / (MzRd || 1);

  // 8. Lateral-Torsional Buckling Resistance (EN 1993-1-1 6.3.2)
  const Mcr = calculateMcr(profile, grade, loads.Llt);
  const lambdaBarLT = Math.sqrt((Wy * 1000 * fy) / (Mcr * 1e6 || 1));
  const chiLT = calculateBucklingChi(lambdaBarLT, profile.curveLT);
  const MbRd = (chiLT * Wy * 1000 * fy) / (gammaM1 * 1e6);
  const etaLTB = Math.abs(loads.Myed) / (MbRd || 1);

  // 9. Shear Resistance (EN 1993-1-1 6.2.6)
  const VzRd = (profile.Avz * 100 * (fy / Math.sqrt(3))) / (gammaM0 * 1000);
  const etaShear = Math.abs(loads.Vzed) / (VzRd || 1);

  // 10. Deflection (SLS)
  const Lmm = loads.L * 1000;
  const qNmm = loads.q; // 1 kN/m = 1 N/mm
  const FN = loads.F * 1000;
  const Iymm4 = profile.Iy * 10000;

  const deltaQ = (5 * qNmm * Math.pow(Lmm, 4)) / (384 * E * Iymm4);
  const deltaF = (FN * Math.pow(Lmm, 3)) / (48 * E * Iymm4);
  const deflectionActual = deltaQ + deltaF; // mm
  const deflectionAllowed = Lmm / loads.deflectionLimit; // mm
  const etaDeflection = deflectionAllowed > 0 ? deflectionActual / deflectionAllowed : 0;

  // 11. Combined Interaction (EN 1993-1-1 6.2.9 & 6.3.3)
  let etaCombined = 0;
  if (isCompression) {
    etaCombined = etaBucklingMin + etaLTB + etaBendingZ;
  } else if (isTension) {
    etaCombined = etaTension + etaBendingY + etaBendingZ;
  } else {
    etaCombined = Math.max(etaBendingY, etaLTB) + etaBendingZ;
  }

  // 12. Verification checks list
  const standardLabel =
    profile.standardGroup === 'ASTM'
      ? 'AISC 360'
      : profile.standardGroup === 'ISO'
      ? 'ISO / EN 1993'
      : 'EN 1993-1-1';

  const checks: VerificationCheck[] = [
    {
      id: 'tension',
      title: 'Vlačna nosivost poprečnog presjeka',
      standardClause: `${standardLabel} čl. 6.2.3`,
      demandValue: isTension ? absNed : 0,
      demandUnit: 'kN',
      capacityValue: NtRd,
      capacityUnit: 'kN',
      formula: 'N_Ed / N_t,Rd ≤ 1.0',
      ratio: etaTension,
      isSatisfied: etaTension <= 1.0,
      notes: `N_t,Rd = A · fy / γM0 = ${NtRd.toFixed(1)} kN (fy = ${fy} MPa)`,
    },
    {
      id: 'compression',
      title: 'Tlačna nosivost poprečnog presjeka',
      standardClause: `${standardLabel} čl. 6.2.4`,
      demandValue: isCompression ? loads.Ned : 0,
      demandUnit: 'kN',
      capacityValue: NcRd,
      capacityUnit: 'kN',
      formula: 'N_Ed / N_c,Rd ≤ 1.0',
      ratio: etaCompression,
      isSatisfied: etaCompression <= 1.0,
      notes: `N_c,Rd = A · fy / γM0 = ${NcRd.toFixed(1)} kN`,
    },
    {
      id: 'buckling_y',
      title: 'Izvijanje oko jače osi (y-y)',
      standardClause: `${standardLabel} čl. 6.3.1`,
      demandValue: isCompression ? loads.Ned : 0,
      demandUnit: 'kN',
      capacityValue: NbYRd,
      capacityUnit: 'kN',
      formula: 'N_Ed / N_b,y,Rd ≤ 1.0',
      ratio: etaBucklingY,
      isSatisfied: etaBucklingY <= 1.0,
      notes: `λ_y = ${lambdaY.toFixed(1)}, λ̄_y = ${lambdaBarY.toFixed(2)}, χ_y = ${chiY.toFixed(3)} (krivulja ${profile.curveY})`,
    },
    {
      id: 'buckling_z',
      title: 'Izvijanje oko slabije osi (z-z)',
      standardClause: `${standardLabel} čl. 6.3.1`,
      demandValue: isCompression ? loads.Ned : 0,
      demandUnit: 'kN',
      capacityValue: NbZRd,
      capacityUnit: 'kN',
      formula: 'N_Ed / N_b,z,Rd ≤ 1.0',
      ratio: etaBucklingZ,
      isSatisfied: etaBucklingZ <= 1.0,
      notes: `λ_z = ${lambdaZ.toFixed(1)}, λ̄_z = ${lambdaBarZ.toFixed(2)}, χ_z = ${chiZ.toFixed(3)} (krivulja ${profile.curveZ})`,
    },
    {
      id: 'bending_y',
      title: 'Savijanje oko jače osi (M_y)',
      standardClause: `${standardLabel} čl. 6.2.5`,
      demandValue: Math.abs(loads.Myed),
      demandUnit: 'kNm',
      capacityValue: MyRd,
      capacityUnit: 'kNm',
      formula: 'M_y,Ed / M_c,y,Rd ≤ 1.0',
      ratio: etaBendingY,
      isSatisfied: etaBendingY <= 1.0,
      notes: `M_c,y,Rd = W_pl,y · fy / γM0 = ${MyRd.toFixed(1)} kNm`,
    },
    {
      id: 'bending_z',
      title: 'Savijanje oko slabije osi (M_z)',
      standardClause: `${standardLabel} čl. 6.2.5`,
      demandValue: Math.abs(loads.Mzed),
      demandUnit: 'kNm',
      capacityValue: MzRd,
      capacityUnit: 'kNm',
      formula: 'M_z,Ed / M_c,z,Rd ≤ 1.0',
      ratio: etaBendingZ,
      isSatisfied: etaBendingZ <= 1.0,
      notes: `M_c,z,Rd = W_pl,z · fy / γM0 = ${MzRd.toFixed(1)} kNm`,
    },
    {
      id: 'ltb',
      title: 'Bočno-torzijsko izvijanje (M_b,Rd)',
      standardClause: `${standardLabel} čl. 6.3.2`,
      demandValue: Math.abs(loads.Myed),
      demandUnit: 'kNm',
      capacityValue: MbRd,
      capacityUnit: 'kNm',
      formula: 'M_y,Ed / M_b,Rd ≤ 1.0',
      ratio: etaLTB,
      isSatisfied: etaLTB <= 1.0,
      notes: `M_cr = ${Mcr.toFixed(1)} kNm, λ̄_LT = ${lambdaBarLT.toFixed(2)}, χ_LT = ${chiLT.toFixed(3)}`,
    },
    {
      id: 'shear_z',
      title: 'Posmična nosivost (V_z)',
      standardClause: `${standardLabel} čl. 6.2.6`,
      demandValue: Math.abs(loads.Vzed),
      demandUnit: 'kN',
      capacityValue: VzRd,
      capacityUnit: 'kN',
      formula: 'V_z,Ed / V_pl,z,Rd ≤ 1.0',
      ratio: etaShear,
      isSatisfied: etaShear <= 1.0,
      notes: `V_pl,z,Rd = A_vz · (fy / √3) / γM0 = ${VzRd.toFixed(1)} kN`,
    },
    {
      id: 'interaction',
      title: 'Interakcija uzdužne sile i savijanja',
      standardClause: `${standardLabel} čl. 6.3.3`,
      demandValue: etaCombined,
      demandUnit: '-',
      capacityValue: 1.0,
      capacityUnit: '-',
      formula: 'N_Ed/N_b,Rd + k_y·M_y,Ed/M_b,Rd + k_z·M_z,Ed/M_z,Rd ≤ 1.0',
      ratio: etaCombined,
      isSatisfied: etaCombined <= 1.0,
      notes: `Kombinirano djelovanje N + My + Mz`,
    },
    {
      id: 'deflection',
      title: 'Progib nosača u eksploataciji (SLS)',
      standardClause: 'EN 1990 / ISO / SLS',
      demandValue: deflectionActual,
      demandUnit: 'mm',
      capacityValue: deflectionAllowed,
      capacityUnit: 'mm',
      formula: `w_max ≤ L / ${loads.deflectionLimit}`,
      ratio: etaDeflection,
      isSatisfied: etaDeflection <= 1.0,
      notes: `Stvarni progib w = ${deflectionActual.toFixed(1)} mm, dopušteno = ${deflectionAllowed.toFixed(1)} mm`,
    },
  ];

  let criticalRatio = 0;
  let governingCheck = 'Tlačna nosivost';

  for (const check of checks) {
    if (check.ratio > criticalRatio) {
      criticalRatio = check.ratio;
      governingCheck = check.title;
    }
  }

  const isSatisfied = criticalRatio <= 1.0;

  return {
    profile,
    grade,
    effectiveFy: fy,
    effectiveFu: fu,
    loads,
    crossSectionClass,
    epsilon,
    axialStress,
    bendingStress,
    totalStress,
    calculatedEt,
    etRatio,
    NtRd,
    etaTension,
    NcRd,
    etaCompression,
    lambdaY,
    lambdaBarY,
    chiY,
    NbYRd,
    etaBucklingY,
    lambdaZ,
    lambdaBarZ,
    chiZ,
    NbZRd,
    etaBucklingZ,
    NbRdMin,
    etaBucklingMin,
    MyRd,
    etaBendingY,
    MzRd,
    etaBendingZ,
    Mcr,
    lambdaBarLT,
    chiLT,
    MbRd,
    etaLTB,
    VzRd,
    etaShear,
    deflectionActual,
    deflectionAllowed,
    etaDeflection,
    etaCombined,
    criticalRatio,
    governingCheck,
    isSatisfied,
    checks,
  };
}
