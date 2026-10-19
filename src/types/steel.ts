export type StandardGroup = 'EN' | 'ASTM' | 'DIN' | 'ISO';

export type MaterialFamily = 
  | 'CARBON_STEEL'       // Ugljični konstrukcijski čelik (S235, S275, S355, S420, S460, A36, A992, St37, ISO E235, ISO E355)
  | 'HIGH_STRENGTH'      // Visokočvrsti valjani čelici (S500ML, S690QL, ISO E460)
  | 'STAINLESS_STEEL'    // Nehrđajući / Inox čelici (1.4301, 1.4404, 1.4462 Duplex)
  | 'WEATHERING_STEEL'   // Čelici otporni na atmosfersku koroziju (Corten S355J2W)
  | 'ALUMINUM';          // Konstrukcijski aluminij (EN AW-6082 T6)

export type ProfileFamily = 
  | 'IPE' 
  | 'HEA' 
  | 'HEB' 
  | 'HEM' 
  | 'IPN'
  | 'UPN' 
  | 'UPE' 
  | 'W-SHAPE'
  | 'S-SHAPE'
  | 'C-SHAPE'
  | 'SHS' 
  | 'RHS' 
  | 'CHS'
  | 'HSS' 
  | 'L'
  | 'T'
  | 'ISO-I'
  | 'ISO-C'
  | 'ISO-SHS'
  | 'ISO-RHS'
  | 'ISO-CHS'
  | 'ISO-L';

export type StandardCode = 
  | 'EN 10365' 
  | 'EN 10034' 
  | 'EN 10025' 
  | 'EN 10210' 
  | 'EN 10219' 
  | 'EN 10056' 
  | 'DIN 1025-1' 
  | 'DIN 1025-2'
  | 'DIN 1026-1'
  | 'DIN 1024'
  | 'ASTM A6 / A992' 
  | 'ASTM A500'
  | 'ASTM A36'
  | 'ISO 657-1'
  | 'ISO 657-5'
  | 'ISO 657-11'
  | 'ISO 10799'
  | 'ISO 12633';

export type BucklingCurve = 'a0' | 'a' | 'b' | 'c' | 'd';

export interface MechanicalProperties {
  E: number;        // Young's modulus of elasticity (MPa / N/mm²)
  Et: number;       // Tangent modulus at design stress level (MPa / N/mm²)
  fy: number;       // Yield strength (MPa / N/mm²)
  fu: number;       // Ultimate tensile strength (MPa / N/mm²)
  G: number;        // Shear modulus (MPa / N/mm²)
  poisson: number;  // Poisson ratio (nu), 0.30
  density?: number; // Density in kg/m³
}

export interface SteelProfile {
  id: string;
  name: string;
  family: ProfileFamily;
  standardGroup: StandardGroup;
  standard: StandardCode;
  
  // Dimensions in mm
  h: number;          // Height / Depth (mm)
  b: number;          // Width (mm)
  tw: number;         // Web thickness (mm)
  tf: number;         // Flange thickness (mm)
  r: number;          // Root radius / corner radius (mm)
  
  // Cross-sectional geometrical properties
  G: number;          // Mass per unit length (kg/m)
  A: number;          // Cross-sectional area (cm²)
  Avz: number;        // Shear area z-axis (cm²)
  
  // Second moment of area (Moment of inertia)
  Iy: number;         // Moment of inertia y-y (cm⁴)
  Iz: number;         // Moment of inertia z-z (cm⁴)
  Ip?: number;        // Polar moment of inertia (cm⁴)
  
  // Radius of gyration
  iy: number;         // Radius of gyration y-y (cm)
  iz: number;         // Radius of gyration z-z (cm)
  
  // Elastic section modulus (Otporni moment - elastični)
  Wely: number;       // Elastic modulus y-y (cm³)
  Welz: number;       // Elastic modulus z-z (cm³)
  
  // Plastic section modulus (Otporni moment - plastični)
  Wply: number;       // Plastic modulus y-y (cm³)
  Wplz: number;       // Plastic modulus z-z (cm³)
  
  // Torsional properties
  It: number;         // Torsional constant (cm⁴)
  Iw: number;         // Warping constant (cm⁶)
  
  // Surface
  AL: number;         // Painting / perimeter surface (m²/m)
  
  // Default mechanical baseline
  defaultMechanics: MechanicalProperties;

  // Buckling curves
  curveY: BucklingCurve;
  curveZ: BucklingCurve;
  curveLT: BucklingCurve;
}

export type SteelGradeName = 
  // EN Carbon
  | 'S235' 
  | 'S275' 
  | 'S355' 
  | 'S420' 
  | 'S460'
  // High Strength
  | 'S500ML'
  | 'S690QL'
  // Stainless
  | 'Inox_1_4301'
  | 'Inox_1_4404'
  | 'Inox_1_4462'
  // Weathering
  | 'S355J2W'
  // ASTM
  | 'A36' 
  | 'A992' 
  | 'A500_B'
  | 'A572_50'
  // DIN
  | 'St37_2'
  | 'St52_3'
  // ISO (ISO 630)
  | 'ISO_E235'
  | 'ISO_E275'
  | 'ISO_E355'
  | 'ISO_E460'
  // Aluminum
  | 'Al_6082_T6';

export interface SteelGrade {
  name: SteelGradeName;
  displayName: string;
  materialFamily: MaterialFamily;
  familyLabel: string;
  standardGroup: StandardGroup;
  standard: string;
  fy: number;      // Nominal yield strength (MPa or N/mm²) for t <= 16mm
  fu: number;      // Ultimate tensile strength (MPa)
  E: number;       // Modulus of elasticity (MPa)
  G: number;       // Shear modulus (MPa)
  poisson: number; // Poisson's ratio
  density: number; // kg/m³
  gammaM0: number; // Partial safety factor for cross-section (1.0)
  gammaM1: number; // Partial safety factor for buckling (1.0)
  gammaM2: number; // Partial safety factor for tension fracture (1.25)
  tangentModulusRatio?: number; // Et / E at yield plateau
  description: string;
  thicknessRanges?: { maxT: number; fy: number; fu: number }[];
}

export interface CalculationLoads {
  Ned: number;       // Design axial load in kN (positive = compression, negative = tension)
  Myed: number;      // Design bending moment about y-y in kNm
  Mzed: number;      // Design bending moment about z-z in kNm
  Vzed: number;      // Design shear force along z-axis in kN
  L: number;         // Member span length in meters
  Lcry: number;      // Buckling length y-y in meters (Ky * L)
  Lcrz: number;      // Buckling length z-z in meters (Kz * L)
  Llt: number;       // Unrestrained length for lateral torsional buckling in meters
  deflectionLimit: number; // e.g. 250, 300, 350 (meaning L / denominator)
  q: number;         // Distributed vertical load in kN/m for deflection check
  F: number;         // Concentrated mid-span point load in kN for deflection check
}

export interface VerificationCheck {
  id: string;
  title: string;
  standardClause: string;
  demandValue: number;
  demandUnit: string;
  capacityValue: number;
  capacityUnit: string;
  formula: string;
  ratio: number; // demand / capacity (0 to 1+)
  isSatisfied: boolean;
  notes?: string;
}

export interface EurocodeResult {
  profile: SteelProfile;
  grade: SteelGrade;
  effectiveFy: number;      // Adjusted for nominal element thickness
  effectiveFu: number;
  loads: CalculationLoads;
  
  // Section classification & parameters
  crossSectionClass: 1 | 2 | 3 | 4;
  epsilon: number;
  
  // Tangent Modulus at current stress state
  axialStress: number;     // sigma = N / A (MPa)
  bendingStress: number;    // sigma_b = My / Wy (MPa)
  totalStress: number;      // max stress (MPa)
  calculatedEt: number;     // Tangent Modulus (MPa)
  etRatio: number;          // Et / E (0 to 1)
  
  // Tension check
  NtRd: number; // kN
  etaTension: number;
  
  // Compression check (squash)
  NcRd: number; // kN
  etaCompression: number;
  
  // Buckling checks
  lambdaY: number;
  lambdaBarY: number;
  chiY: number;
  NbYRd: number; // kN
  etaBucklingY: number;
  
  lambdaZ: number;
  lambdaBarZ: number;
  chiZ: number;
  NbZRd: number; // kN
  etaBucklingZ: number;
  
  NbRdMin: number; // min(NbYRd, NbZRd)
  etaBucklingMin: number;
  
  // Bending checks
  MyRd: number; // kNm
  etaBendingY: number;
  
  MzRd: number; // kNm
  etaBendingZ: number;
  
  // Lateral-torsional buckling
  Mcr: number; // kNm
  lambdaBarLT: number;
  chiLT: number;
  MbRd: number; // kNm
  etaLTB: number;
  
  // Shear check
  VzRd: number; // kN
  etaShear: number;
  
  // Deflection check (SLS)
  deflectionActual: number; // mm
  deflectionAllowed: number; // mm
  etaDeflection: number;
  
  // Combined interaction
  etaCombined: number;
  
  // Governed critical
  criticalRatio: number;
  governingCheck: string;
  isSatisfied: boolean;
  
  // List of checks for reporting
  checks: VerificationCheck[];
}
