import { SteelProfile } from '../../types/steel';

const EN_MECHANICS = {
  E: 210000,
  Et: 16800,
  fy: 355,
  fu: 510,
  G: 81000,
  poisson: 0.3,
  density: 7850,
};

// Helper to create exact EN SHS (Square Hollow Section - EN 10210 / EN 10219)
function makeSHS(size: number, t: number, standard: 'EN 10210' | 'EN 10219' = 'EN 10210'): SteelProfile {
  const r = standard === 'EN 10210' ? 1.5 * t : 2.0 * t;
  // Exact area considering rounded corners: A = 4*t*(size - t) - (4 - PI)*r^2
  const cornerArea = (4 - Math.PI) * Math.pow(r, 2);
  const A = Math.max(0.1, (4 * t * (size - t) - cornerArea) / 100); // cm²
  const G = Number((A * 0.785).toFixed(2)); // kg/m
  const Avz = Number((A / 2).toFixed(2));
  
  // Moment of inertia (cm⁴)
  const d_in = size - 2 * t;
  const Iy_raw = (Math.pow(size, 4) - Math.pow(d_in, 4)) / 12;
  const cornerI = 0.046 * (Math.pow(r, 4) - Math.pow(Math.max(0, r - t), 4));
  const Iy = Number(((Iy_raw - cornerI) / 10000).toFixed(1));
  const Iz = Iy;
  const Ip = Number((2 * Iy).toFixed(1));
  
  const iy = Number(Math.sqrt(Iy / A).toFixed(2));
  const iz = iy;
  
  const Wely = Number(((2 * Iy) / (size / 10)).toFixed(1));
  const Welz = Wely;
  
  // Plastic section modulus: (size - t)^2 * t + (t^3 / 3)...
  const Wply = Number((((size - t) * (size - t) * t + (t * t * t) / 3) / 1000).toFixed(1));
  const Wplz = Wply;
  
  // Torsional constant (Bredt's formula)
  const meanPerimeter = 4 * (size - t);
  const meanArea = Math.pow(size - t, 2);
  const It = Number(((4 * Math.pow(meanArea, 2) * t / meanPerimeter) / 10000).toFixed(1));
  
  const AL = Number(((4 * size) / 1000).toFixed(3));
  
  return {
    id: `en-shs-${size}x${t}`,
    name: `SHS ${size}x${t.toFixed(1)}`,
    family: 'SHS',
    standardGroup: 'EN',
    standard,
    h: size,
    b: size,
    tw: t,
    tf: t,
    r,
    G,
    A,
    Avz,
    Iy,
    Iz,
    Ip,
    iy,
    iz,
    Wely,
    Welz,
    Wply,
    Wplz,
    It,
    Iw: 0,
    AL,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: standard === 'EN 10210' ? 'a' : 'c',
    curveZ: standard === 'EN 10210' ? 'a' : 'c',
    curveLT: standard === 'EN 10210' ? 'a' : 'c',
  };
}

// Helper to create exact EN RHS (Rectangular Hollow Section - EN 10210 / EN 10219)
function makeRHS(h: number, b: number, t: number, standard: 'EN 10210' | 'EN 10219' = 'EN 10210'): SteelProfile {
  const r = standard === 'EN 10210' ? 1.5 * t : 2.0 * t;
  const cornerArea = (4 - Math.PI) * Math.pow(r, 2);
  const A = Math.max(0.1, (2 * t * (h + b - 2 * t) - cornerArea) / 100); // cm²
  const G = Number((A * 0.785).toFixed(2));
  const Avz = Number((A * (h / (h + b))).toFixed(2));
  
  const h_in = h - 2 * t;
  const b_in = b - 2 * t;
  
  const Iy = Number(((b * Math.pow(h, 3) - b_in * Math.pow(h_in, 3)) / (12 * 10000)).toFixed(1));
  const Iz = Number(((h * Math.pow(b, 3) - h_in * Math.pow(b_in, 3)) / (12 * 10000)).toFixed(1));
  const Ip = Number((Iy + Iz).toFixed(1));
  
  const iy = Number(Math.sqrt(Iy / A).toFixed(2));
  const iz = Number(Math.sqrt(Iz / A).toFixed(2));
  
  const Wely = Number(((2 * Iy) / (h / 10)).toFixed(1));
  const Welz = Number(((2 * Iz) / (b / 10)).toFixed(1));
  
  const Wply = Number(((b * h * h - b_in * h_in * h_in) / (4 * 1000)).toFixed(1));
  const Wplz = Number(((h * b * b - h_in * b_in * b_in) / (4 * 1000)).toFixed(1));
  
  const meanArea = (h - t) * (b - t);
  const meanPerimeter = 2 * (h - t + b - t);
  const It = Number(((4 * Math.pow(meanArea, 2) * t / meanPerimeter) / 10000).toFixed(1));
  const AL = Number(((2 * (h + b)) / 1000).toFixed(3));
  
  return {
    id: `en-rhs-${h}x${b}x${t}`,
    name: `RHS ${h}x${b}x${t.toFixed(1)}`,
    family: 'RHS',
    standardGroup: 'EN',
    standard,
    h,
    b,
    tw: t,
    tf: t,
    r,
    G,
    A,
    Avz,
    Iy,
    Iz,
    Ip,
    iy,
    iz,
    Wely,
    Welz,
    Wply,
    Wplz,
    It,
    Iw: 0,
    AL,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: standard === 'EN 10210' ? 'a' : 'c',
    curveZ: standard === 'EN 10210' ? 'a' : 'c',
    curveLT: standard === 'EN 10210' ? 'a' : 'c',
  };
}

// Helper to create exact EN CHS (Circular Hollow Section - EN 10210 / EN 10219)
function makeCHS(d: number, t: number, standard: 'EN 10210' | 'EN 10219' = 'EN 10210'): SteelProfile {
  const A = Number(((Math.PI * (d - t) * t) / 100).toFixed(2)); // cm²
  const G = Number((A * 0.785).toFixed(2)); // kg/m
  const Avz = Number(((2 / Math.PI) * A).toFixed(2));
  
  const d_in = d - 2 * t;
  const Iy = Number(((Math.PI * (Math.pow(d, 4) - Math.pow(d_in, 4))) / (64 * 10000)).toFixed(1));
  const Iz = Iy;
  const Ip = Number((2 * Iy).toFixed(1));
  
  const iy = Number(Math.sqrt(Iy / A).toFixed(2));
  const iz = iy;
  
  const Wely = Number(((2 * Iy) / (d / 10)).toFixed(1));
  const Welz = Wely;
  
  const Wply = Number(((Math.pow(d, 3) - Math.pow(d_in, 3)) / (6 * 1000)).toFixed(1));
  const Wplz = Wply;
  
  const It = Number((2 * Iy).toFixed(1));
  const AL = Number(((Math.PI * d) / 1000).toFixed(3));
  
  return {
    id: `en-chs-${d.toFixed(1)}x${t}`,
    name: `CHS Ø${d.toFixed(1)}x${t.toFixed(1)}`,
    family: 'CHS',
    standardGroup: 'EN',
    standard,
    h: d,
    b: d,
    tw: t,
    tf: t,
    r: 0,
    G,
    A,
    Avz,
    Iy,
    Iz,
    Ip,
    iy,
    iz,
    Wely,
    Welz,
    Wply,
    Wplz,
    It,
    Iw: 0,
    AL,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: standard === 'EN 10210' ? 'a' : 'c',
    curveZ: standard === 'EN 10210' ? 'a' : 'c',
    curveLT: standard === 'EN 10210' ? 'a' : 'c',
  };
}

export const EN_PROFILES: SteelProfile[] = [
  // ===================== IPE (EN 10365 / EN 10034) =====================
  {
    id: 'ipe-80', name: 'IPE 80', family: 'IPE', standardGroup: 'EN', standard: 'EN 10365',
    h: 80, b: 46, tw: 3.8, tf: 5.2, r: 5.0,
    G: 6.0, A: 7.64, Avz: 3.58, Iy: 80.1, Iz: 8.49, Ip: 88.59, iy: 3.24, iz: 1.05,
    Wely: 20.0, Welz: 3.69, Wply: 23.2, Wplz: 5.82, It: 0.70, Iw: 114, AL: 0.328,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipe-100', name: 'IPE 100', family: 'IPE', standardGroup: 'EN', standard: 'EN 10365',
    h: 100, b: 55, tw: 4.1, tf: 5.7, r: 7.0,
    G: 8.1, A: 10.32, Avz: 5.08, Iy: 171.0, Iz: 15.9, Ip: 186.9, iy: 4.07, iz: 1.24,
    Wely: 34.2, Welz: 5.79, Wply: 39.4, Wplz: 9.15, It: 1.20, Iw: 351, AL: 0.400,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipe-120', name: 'IPE 120', family: 'IPE', standardGroup: 'EN', standard: 'EN 10365',
    h: 120, b: 64, tw: 4.4, tf: 6.3, r: 7.0,
    G: 10.4, A: 13.21, Avz: 6.31, Iy: 317.8, Iz: 27.7, Ip: 345.5, iy: 4.90, iz: 1.45,
    Wely: 53.0, Welz: 8.65, Wply: 60.7, Wplz: 13.58, It: 1.74, Iw: 890, AL: 0.475,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipe-140', name: 'IPE 140', family: 'IPE', standardGroup: 'EN', standard: 'EN 10365',
    h: 140, b: 73, tw: 4.7, tf: 6.9, r: 7.0,
    G: 12.9, A: 16.43, Avz: 7.64, Iy: 541.2, Iz: 44.9, Ip: 586.1, iy: 5.74, iz: 1.65,
    Wely: 77.3, Welz: 12.3, Wply: 88.3, Wplz: 19.25, It: 2.45, Iw: 1980, AL: 0.551,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipe-160', name: 'IPE 160', family: 'IPE', standardGroup: 'EN', standard: 'EN 10365',
    h: 160, b: 82, tw: 5.0, tf: 7.4, r: 9.0,
    G: 15.8, A: 20.09, Avz: 9.66, Iy: 869.3, Iz: 68.3, Ip: 937.6, iy: 6.58, iz: 1.84,
    Wely: 108.7, Welz: 16.7, Wply: 123.9, Wplz: 26.1, It: 3.60, Iw: 3960, AL: 0.623,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipe-180', name: 'IPE 180', family: 'IPE', standardGroup: 'EN', standard: 'EN 10365',
    h: 180, b: 91, tw: 5.3, tf: 8.0, r: 9.0,
    G: 18.8, A: 23.95, Avz: 11.25, Iy: 1317.0, Iz: 100.9, Ip: 1417.9, iy: 7.42, iz: 2.05,
    Wely: 146.3, Welz: 22.2, Wply: 166.4, Wplz: 34.6, It: 4.79, Iw: 7430, AL: 0.698,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipe-200', name: 'IPE 200', family: 'IPE', standardGroup: 'EN', standard: 'EN 10365',
    h: 200, b: 100, tw: 5.6, tf: 8.5, r: 12.0,
    G: 22.4, A: 28.48, Avz: 14.00, Iy: 1943.0, Iz: 142.4, Ip: 2085.4, iy: 8.26, iz: 2.24,
    Wely: 194.3, Welz: 28.5, Wply: 220.6, Wplz: 44.6, It: 6.98, Iw: 13000, AL: 0.768,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipe-220', name: 'IPE 220', family: 'IPE', standardGroup: 'EN', standard: 'EN 10365',
    h: 220, b: 110, tw: 5.9, tf: 9.2, r: 12.0,
    G: 26.2, A: 33.37, Avz: 15.88, Iy: 2772.0, Iz: 204.9, Ip: 2976.9, iy: 9.11, iz: 2.48,
    Wely: 252.0, Welz: 37.3, Wply: 285.4, Wplz: 58.1, It: 9.07, Iw: 22700, AL: 0.848,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipe-240', name: 'IPE 240', family: 'IPE', standardGroup: 'EN', standard: 'EN 10365',
    h: 240, b: 120, tw: 6.2, tf: 9.8, r: 15.0,
    G: 30.7, A: 39.12, Avz: 19.14, Iy: 3892.0, Iz: 283.6, Ip: 4175.6, iy: 9.97, iz: 2.69,
    Wely: 324.3, Welz: 47.3, Wply: 366.6, Wplz: 73.9, It: 12.9, Iw: 37400, AL: 0.922,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipe-270', name: 'IPE 270', family: 'IPE', standardGroup: 'EN', standard: 'EN 10365',
    h: 270, b: 135, tw: 6.6, tf: 10.2, r: 15.0,
    G: 36.1, A: 45.95, Avz: 22.14, Iy: 5790.0, Iz: 419.9, Ip: 6209.9, iy: 11.2, iz: 3.02,
    Wely: 428.9, Welz: 62.2, Wply: 484.0, Wplz: 97.0, It: 15.9, Iw: 70600, AL: 1.04,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipe-300', name: 'IPE 300', family: 'IPE', standardGroup: 'EN', standard: 'EN 10365',
    h: 300, b: 150, tw: 7.1, tf: 10.7, r: 15.0,
    G: 42.2, A: 53.81, Avz: 25.68, Iy: 8356.0, Iz: 603.8, Ip: 8959.8, iy: 12.5, iz: 3.35,
    Wely: 557.1, Welz: 80.5, Wply: 628.4, Wplz: 125.2, It: 20.1, Iw: 126000, AL: 1.16,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipe-330', name: 'IPE 330', family: 'IPE', standardGroup: 'EN', standard: 'EN 10365',
    h: 330, b: 160, tw: 7.5, tf: 11.5, r: 18.0,
    G: 49.1, A: 62.61, Avz: 30.81, Iy: 11770.0, Iz: 788.1, Ip: 12558.1, iy: 13.7, iz: 3.55,
    Wely: 713.1, Welz: 98.5, Wply: 804.3, Wplz: 153.7, It: 28.2, Iw: 199000, AL: 1.25,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipe-360', name: 'IPE 360', family: 'IPE', standardGroup: 'EN', standard: 'EN 10365',
    h: 360, b: 170, tw: 8.0, tf: 12.7, r: 18.0,
    G: 57.1, A: 72.73, Avz: 35.14, Iy: 16270.0, Iz: 1043.0, Ip: 17313.0, iy: 15.0, iz: 3.79,
    Wely: 903.6, Welz: 122.8, Wply: 1019.0, Wplz: 191.1, It: 37.3, Iw: 314000, AL: 1.35,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipe-400', name: 'IPE 400', family: 'IPE', standardGroup: 'EN', standard: 'EN 10365',
    h: 400, b: 180, tw: 8.6, tf: 13.5, r: 21.0,
    G: 66.3, A: 84.46, Avz: 42.69, Iy: 23130.0, Iz: 1318.0, Ip: 24448.0, iy: 16.5, iz: 3.95,
    Wely: 1156.0, Welz: 146.4, Wply: 1307.0, Wplz: 229.0, It: 51.1, Iw: 490000, AL: 1.47,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipe-450', name: 'IPE 450', family: 'IPE', standardGroup: 'EN', standard: 'EN 10365',
    h: 450, b: 190, tw: 9.4, tf: 14.6, r: 21.0,
    G: 77.6, A: 98.82, Avz: 50.85, Iy: 33740.0, Iz: 1676.0, Ip: 35416.0, iy: 18.5, iz: 4.12,
    Wely: 1500.0, Welz: 176.4, Wply: 1702.0, Wplz: 276.4, It: 66.9, Iw: 791000, AL: 1.61,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipe-500', name: 'IPE 500', family: 'IPE', standardGroup: 'EN', standard: 'EN 10365',
    h: 500, b: 200, tw: 10.2, tf: 16.0, r: 21.0,
    G: 90.7, A: 115.5, Avz: 59.87, Iy: 48200.0, Iz: 2142.0, Ip: 50342.0, iy: 20.4, iz: 4.31,
    Wely: 1928.0, Welz: 214.2, Wply: 2194.0, Wplz: 335.9, It: 89.3, Iw: 1250000, AL: 1.74,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipe-550', name: 'IPE 550', family: 'IPE', standardGroup: 'EN', standard: 'EN 10365',
    h: 550, b: 210, tw: 11.1, tf: 17.2, r: 24.0,
    G: 106.0, A: 134.4, Avz: 72.33, Iy: 67120.0, Iz: 2668.0, Ip: 69788.0, iy: 22.3, iz: 4.45,
    Wely: 2441.0, Welz: 254.1, Wply: 2787.0, Wplz: 400.5, It: 123.0, Iw: 1880000, AL: 1.88,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipe-600', name: 'IPE 600', family: 'IPE', standardGroup: 'EN', standard: 'EN 10365',
    h: 600, b: 220, tw: 12.0, tf: 19.0, r: 24.0,
    G: 122.0, A: 156.0, Avz: 83.78, Iy: 92080.0, Iz: 3387.0, Ip: 95467.0, iy: 24.3, iz: 4.66,
    Wely: 3069.0, Welz: 307.9, Wply: 3512.0, Wplz: 485.6, It: 165.0, Iw: 2850000, AL: 2.02,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },

  // ===================== HEA (EN 10365 / EN 10034) =====================
  {
    id: 'hea-100', name: 'HEA 100', family: 'HEA', standardGroup: 'EN', standard: 'EN 10365',
    h: 96, b: 100, tw: 5.0, tf: 8.0, r: 12.0,
    G: 16.7, A: 21.24, Avz: 7.56, Iy: 349.2, Iz: 133.8, Ip: 483.0, iy: 4.06, iz: 2.51,
    Wely: 72.76, Welz: 26.76, Wply: 83.01, Wplz: 41.14, It: 5.24, Iw: 2570, AL: 0.561,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'hea-120', name: 'HEA 120', family: 'HEA', standardGroup: 'EN', standard: 'EN 10365',
    h: 114, b: 120, tw: 5.0, tf: 8.0, r: 12.0,
    G: 19.9, A: 25.34, Avz: 8.46, Iy: 606.2, Iz: 230.9, Ip: 837.1, iy: 4.89, iz: 3.02,
    Wely: 106.3, Welz: 38.48, Wply: 119.5, Wplz: 58.85, It: 5.99, Iw: 5720, AL: 0.675,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'hea-140', name: 'HEA 140', family: 'HEA', standardGroup: 'EN', standard: 'EN 10365',
    h: 133, b: 140, tw: 5.5, tf: 8.5, r: 12.0,
    G: 24.7, A: 31.42, Avz: 10.12, Iy: 1033.0, Iz: 388.6, Ip: 1421.6, iy: 5.73, iz: 3.52,
    Wely: 155.4, Welz: 55.62, Wply: 173.5, Wplz: 84.85, It: 8.13, Iw: 12300, AL: 0.794,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'hea-160', name: 'HEA 160', family: 'HEA', standardGroup: 'EN', standard: 'EN 10365',
    h: 152, b: 160, tw: 6.0, tf: 9.0, r: 15.0,
    G: 30.4, A: 38.77, Avz: 13.21, Iy: 1673.0, Iz: 615.6, Ip: 2288.6, iy: 6.57, iz: 3.98,
    Wely: 220.1, Welz: 76.9, Wply: 245.2, Wplz: 117.6, It: 12.2, Iw: 31400, AL: 0.906,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'hea-180', name: 'HEA 180', family: 'HEA', standardGroup: 'EN', standard: 'EN 10365',
    h: 171, b: 180, tw: 6.0, tf: 9.5, r: 15.0,
    G: 35.5, A: 45.25, Avz: 14.47, Iy: 2510.0, Iz: 924.9, Ip: 3434.9, iy: 7.45, iz: 4.52,
    Wely: 293.6, Welz: 102.8, Wply: 324.9, Wplz: 156.5, It: 14.8, Iw: 60200, AL: 1.02,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'hea-200', name: 'HEA 200', family: 'HEA', standardGroup: 'EN', standard: 'EN 10365',
    h: 190, b: 200, tw: 6.5, tf: 10.0, r: 18.0,
    G: 42.3, A: 53.83, Avz: 18.08, Iy: 3692.0, Iz: 1336.0, Ip: 5028.0, iy: 8.28, iz: 4.98,
    Wely: 388.6, Welz: 133.6, Wply: 429.5, Wplz: 203.8, It: 21.0, Iw: 108000, AL: 1.14,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'hea-220', name: 'HEA 220', family: 'HEA', standardGroup: 'EN', standard: 'EN 10365',
    h: 210, b: 220, tw: 7.0, tf: 11.0, r: 18.0,
    G: 50.5, A: 64.34, Avz: 20.67, Iy: 5410.0, Iz: 1955.0, Ip: 7365.0, iy: 9.17, iz: 5.51,
    Wely: 515.2, Welz: 177.7, Wply: 568.5, Wplz: 270.6, It: 28.5, Iw: 193000, AL: 1.26,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'hea-240', name: 'HEA 240', family: 'HEA', standardGroup: 'EN', standard: 'EN 10365',
    h: 230, b: 240, tw: 7.5, tf: 12.0, r: 21.0,
    G: 60.3, A: 76.84, Avz: 25.18, Iy: 7763.0, Iz: 2769.0, Ip: 10532.0, iy: 10.1, iz: 6.00,
    Wely: 675.1, Welz: 230.7, Wply: 744.6, Wplz: 351.7, It: 41.6, Iw: 328000, AL: 1.37,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'hea-260', name: 'HEA 260', family: 'HEA', standardGroup: 'EN', standard: 'EN 10365',
    h: 250, b: 260, tw: 7.5, tf: 12.5, r: 24.0,
    G: 68.2, A: 86.82, Avz: 28.76, Iy: 10450.0, Iz: 3668.0, Ip: 14118.0, iy: 11.0, iz: 6.50,
    Wely: 836.4, Welz: 282.1, Wply: 919.8, Wplz: 430.2, It: 52.5, Iw: 516000, AL: 1.50,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'hea-280', name: 'HEA 280', family: 'HEA', standardGroup: 'EN', standard: 'EN 10365',
    h: 270, b: 280, tw: 8.0, tf: 13.0, r: 24.0,
    G: 76.4, A: 97.26, Avz: 31.75, Iy: 13670.0, Iz: 4763.0, Ip: 18433.0, iy: 11.9, iz: 7.00,
    Wely: 1010.0, Welz: 340.2, Wply: 1112.0, Wplz: 518.1, It: 65.6, Iw: 785000, AL: 1.62,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'hea-300', name: 'HEA 300', family: 'HEA', standardGroup: 'EN', standard: 'EN 10365',
    h: 290, b: 300, tw: 8.5, tf: 14.0, r: 27.0,
    G: 88.3, A: 112.5, Avz: 37.28, Iy: 18260.0, Iz: 6310.0, Ip: 24570.0, iy: 12.7, iz: 7.49,
    Wely: 1260.0, Welz: 420.7, Wply: 1383.0, Wplz: 641.2, It: 85.2, Iw: 1200000, AL: 1.73,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'hea-320', name: 'HEA 320', family: 'HEA', standardGroup: 'EN', standard: 'EN 10365',
    h: 310, b: 300, tw: 9.0, tf: 15.5, r: 27.0,
    G: 97.6, A: 124.4, Avz: 41.05, Iy: 22930.0, Iz: 6985.0, Ip: 29915.0, iy: 13.6, iz: 7.49,
    Wely: 1479.0, Welz: 465.7, Wply: 1628.0, Wplz: 709.7, It: 108.0, Iw: 1510000, AL: 1.76,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'hea-340', name: 'HEA 340', family: 'HEA', standardGroup: 'EN', standard: 'EN 10365',
    h: 330, b: 300, tw: 9.5, tf: 16.5, r: 27.0,
    G: 105.0, A: 133.5, Avz: 44.96, Iy: 27690.0, Iz: 7436.0, Ip: 35126.0, iy: 14.4, iz: 7.46,
    Wely: 1678.0, Welz: 495.7, Wply: 1850.0, Wplz: 755.9, It: 128.0, Iw: 1820000, AL: 1.81,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'hea-360', name: 'HEA 360', family: 'HEA', standardGroup: 'EN', standard: 'EN 10365',
    h: 350, b: 300, tw: 10.0, tf: 17.5, r: 27.0,
    G: 112.0, A: 142.8, Avz: 48.96, Iy: 33090.0, Iz: 7887.0, Ip: 40977.0, iy: 15.2, iz: 7.43,
    Wely: 1891.0, Welz: 525.8, Wply: 2088.0, Wplz: 802.3, It: 149.0, Iw: 2200000, AL: 1.84,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'hea-400', name: 'HEA 400', family: 'HEA', standardGroup: 'EN', standard: 'EN 10365',
    h: 390, b: 300, tw: 11.0, tf: 19.0, r: 27.0,
    G: 125.0, A: 159.0, Avz: 57.42, Iy: 45070.0, Iz: 8564.0, Ip: 53634.0, iy: 16.8, iz: 7.34,
    Wely: 2311.0, Welz: 570.9, Wply: 2562.0, Wplz: 872.9, It: 189.0, Iw: 2940000, AL: 1.93,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'hea-450', name: 'HEA 450', family: 'HEA', standardGroup: 'EN', standard: 'EN 10365',
    h: 440, b: 300, tw: 11.5, tf: 21.0, r: 27.0,
    G: 140.0, A: 178.0, Avz: 67.50, Iy: 63720.0, Iz: 9465.0, Ip: 73185.0, iy: 18.9, iz: 7.29,
    Wely: 2896.0, Welz: 631.0, Wply: 3216.0, Wplz: 965.3, It: 234.0, Iw: 4140000, AL: 2.02,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'hea-500', name: 'HEA 500', family: 'HEA', standardGroup: 'EN', standard: 'EN 10365',
    h: 490, b: 300, tw: 12.0, tf: 23.0, r: 27.0,
    G: 155.0, A: 197.5, Avz: 77.82, Iy: 86970.0, Iz: 10370.0, Ip: 97340.0, iy: 21.0, iz: 7.24,
    Wely: 3550.0, Welz: 691.1, Wply: 3949.0, Wplz: 1059.0, It: 299.0, Iw: 5660000, AL: 2.12,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },

  // ===================== HEB (EN 10365 / EN 10034) =====================
  {
    id: 'heb-100', name: 'HEB 100', family: 'HEB', standardGroup: 'EN', standard: 'EN 10365',
    h: 100, b: 100, tw: 6.0, tf: 10.0, r: 12.0,
    G: 20.4, A: 26.04, Avz: 9.04, Iy: 449.5, Iz: 167.3, Ip: 616.8, iy: 4.16, iz: 2.53,
    Wely: 89.9, Welz: 33.5, Wply: 104.2, Wplz: 51.4, It: 9.25, Iw: 3420, AL: 0.567,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'heb-120', name: 'HEB 120', family: 'HEB', standardGroup: 'EN', standard: 'EN 10365',
    h: 120, b: 120, tw: 6.5, tf: 11.0, r: 12.0,
    G: 26.7, A: 34.01, Avz: 11.45, Iy: 864.4, Iz: 317.5, Ip: 1181.9, iy: 5.04, iz: 3.06,
    Wely: 144.1, Welz: 52.92, Wply: 165.2, Wplz: 80.93, It: 13.9, Iw: 9020, AL: 0.686,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'heb-140', name: 'HEB 140', family: 'HEB', standardGroup: 'EN', standard: 'EN 10365',
    h: 140, b: 140, tw: 7.0, tf: 12.0, r: 12.0,
    G: 33.7, A: 42.96, Avz: 13.88, Iy: 1509.0, Iz: 549.7, Ip: 2058.7, iy: 5.93, iz: 3.58,
    Wely: 215.6, Welz: 78.52, Wply: 245.4, Wplz: 119.8, It: 20.0, Iw: 20100, AL: 0.805,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'heb-160', name: 'HEB 160', family: 'HEB', standardGroup: 'EN', standard: 'EN 10365',
    h: 160, b: 160, tw: 8.0, tf: 13.0, r: 15.0,
    G: 42.6, A: 54.25, Avz: 17.59, Iy: 2492.0, Iz: 889.2, Ip: 3381.2, iy: 6.78, iz: 4.05,
    Wely: 311.5, Welz: 111.2, Wply: 353.9, Wplz: 170.0, It: 31.2, Iw: 47900, AL: 0.918,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'heb-180', name: 'HEB 180', family: 'HEB', standardGroup: 'EN', standard: 'EN 10365',
    h: 180, b: 180, tw: 8.5, tf: 14.0, r: 15.0,
    G: 51.2, A: 65.25, Avz: 20.65, Iy: 3831.0, Iz: 1363.0, Ip: 5194.0, iy: 7.66, iz: 4.57,
    Wely: 425.7, Welz: 151.4, Wply: 481.4, Wplz: 231.0, It: 42.2, Iw: 93800, AL: 1.04,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'heb-200', name: 'HEB 200', family: 'HEB', standardGroup: 'EN', standard: 'EN 10365',
    h: 200, b: 200, tw: 9.0, tf: 15.0, r: 18.0,
    G: 61.3, A: 78.08, Avz: 24.83, Iy: 5696.0, Iz: 2003.0, Ip: 7699.0, iy: 8.54, iz: 5.07,
    Wely: 569.6, Welz: 200.3, Wply: 642.5, Wplz: 305.8, It: 59.3, Iw: 171000, AL: 1.15,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'heb-220', name: 'HEB 220', family: 'HEB', standardGroup: 'EN', standard: 'EN 10365',
    h: 220, b: 220, tw: 9.5, tf: 16.0, r: 18.0,
    G: 71.5, A: 91.04, Avz: 27.95, Iy: 8091.0, Iz: 2843.0, Ip: 10934.0, iy: 9.43, iz: 5.59,
    Wely: 735.5, Welz: 258.5, Wply: 827.0, Wplz: 393.8, It: 76.6, Iw: 295000, AL: 1.27,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'heb-240', name: 'HEB 240', family: 'HEB', standardGroup: 'EN', standard: 'EN 10365',
    h: 240, b: 240, tw: 10.0, tf: 17.0, r: 21.0,
    G: 83.2, A: 106.0, Avz: 33.20, Iy: 11260.0, Iz: 3923.0, Ip: 15183.0, iy: 10.3, iz: 6.08,
    Wely: 938.3, Welz: 326.9, Wply: 1053.0, Wplz: 498.4, It: 103.0, Iw: 487000, AL: 1.38,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'heb-260', name: 'HEB 260', family: 'HEB', standardGroup: 'EN', standard: 'EN 10365',
    h: 260, b: 260, tw: 10.0, tf: 17.5, r: 24.0,
    G: 93.0, A: 118.4, Avz: 37.59, Iy: 14920.0, Iz: 5135.0, Ip: 20055.0, iy: 11.2, iz: 6.58,
    Wely: 1148.0, Welz: 395.0, Wply: 1283.0, Wplz: 602.2, It: 124.0, Iw: 753000, AL: 1.50,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'heb-280', name: 'HEB 280', family: 'HEB', standardGroup: 'EN', standard: 'EN 10365',
    h: 280, b: 280, tw: 10.5, tf: 18.0, r: 24.0,
    G: 103.0, A: 131.4, Avz: 41.60, Iy: 19270.0, Iz: 6595.0, Ip: 25865.0, iy: 12.1, iz: 7.09,
    Wely: 1376.0, Welz: 471.0, Wply: 1534.0, Wplz: 717.6, It: 144.0, Iw: 1130000, AL: 1.62,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'heb-300', name: 'HEB 300', family: 'HEB', standardGroup: 'EN', standard: 'EN 10365',
    h: 300, b: 300, tw: 11.0, tf: 19.0, r: 27.0,
    G: 117.0, A: 149.1, Avz: 48.71, Iy: 25170.0, Iz: 8563.0, Ip: 33733.0, iy: 13.0, iz: 7.58,
    Wely: 1678.0, Welz: 570.9, Wply: 1869.0, Wplz: 870.1, It: 185.0, Iw: 1690000, AL: 1.73,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'heb-320', name: 'HEB 320', family: 'HEB', standardGroup: 'EN', standard: 'EN 10365',
    h: 320, b: 300, tw: 11.5, tf: 20.5, r: 27.0,
    G: 127.0, A: 161.3, Avz: 52.88, Iy: 30820.0, Iz: 9239.0, Ip: 40059.0, iy: 13.8, iz: 7.57,
    Wely: 1926.0, Welz: 615.9, Wply: 2149.0, Wplz: 939.1, It: 225.0, Iw: 2070000, AL: 1.77,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'heb-340', name: 'HEB 340', family: 'HEB', standardGroup: 'EN', standard: 'EN 10365',
    h: 340, b: 300, tw: 12.0, tf: 21.5, r: 27.0,
    G: 134.0, A: 170.9, Avz: 57.06, Iy: 36660.0, Iz: 9690.0, Ip: 46350.0, iy: 14.6, iz: 7.53,
    Wely: 2156.0, Welz: 646.0, Wply: 2408.0, Wplz: 986.3, It: 256.0, Iw: 2470000, AL: 1.81,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'heb-360', name: 'HEB 360', family: 'HEB', standardGroup: 'EN', standard: 'EN 10365',
    h: 360, b: 300, tw: 12.5, tf: 22.5, r: 27.0,
    G: 142.0, A: 180.6, Avz: 61.38, Iy: 43190.0, Iz: 10140.0, Ip: 53330.0, iy: 15.5, iz: 7.49,
    Wely: 2400.0, Welz: 676.1, Wply: 2683.0, Wplz: 1033.0, It: 292.0, Iw: 2950000, AL: 1.85,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'heb-400', name: 'HEB 400', family: 'HEB', standardGroup: 'EN', standard: 'EN 10365',
    h: 400, b: 300, tw: 13.5, tf: 24.0, r: 27.0,
    G: 155.0, A: 197.8, Avz: 70.38, Iy: 57680.0, Iz: 10820.0, Ip: 68500.0, iy: 17.1, iz: 7.40,
    Wely: 2884.0, Welz: 721.3, Wply: 3232.0, Wplz: 1104.0, It: 356.0, Iw: 3880000, AL: 1.93,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'c', curveLT: 'c'
  },

  // ===================== HEM (EN 10365 / EN 10034) =====================
  {
    id: 'hem-100', name: 'HEM 100', family: 'HEM', standardGroup: 'EN', standard: 'EN 10365',
    h: 120, b: 106, tw: 12.0, tf: 20.0, r: 12.0,
    G: 41.8, A: 53.24, Avz: 21.68, Iy: 1143.0, Iz: 399.2, Ip: 1542.2, iy: 4.63, iz: 2.74,
    Wely: 190.4, Welz: 75.31, Wply: 235.8, Wplz: 117.1, It: 62.4, Iw: 11800, AL: 0.619,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'c', curveZ: 'd', curveLT: 'd'
  },
  {
    id: 'hem-140', name: 'HEM 140', family: 'HEM', standardGroup: 'EN', standard: 'EN 10365',
    h: 160, b: 146, tw: 13.0, tf: 22.0, r: 12.0,
    G: 63.2, A: 80.56, Avz: 29.56, Iy: 3291.0, Iz: 1144.0, Ip: 4435.0, iy: 6.39, iz: 3.77,
    Wely: 411.4, Welz: 156.8, Wply: 494.4, Wplz: 242.0, It: 110.0, Iw: 57900, AL: 0.857,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'c', curveZ: 'd', curveLT: 'd'
  },
  {
    id: 'hem-200', name: 'HEM 200', family: 'HEM', standardGroup: 'EN', standard: 'EN 10365',
    h: 220, b: 206, tw: 15.0, tf: 25.0, r: 18.0,
    G: 103.0, A: 131.3, Avz: 48.06, Iy: 10640.0, Iz: 3651.0, Ip: 14291.0, iy: 9.00, iz: 5.27,
    Wely: 967.4, Welz: 354.5, Wply: 1135.0, Wplz: 546.9, It: 227.0, Iw: 360000, AL: 1.19,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'c', curveZ: 'd', curveLT: 'd'
  },
  {
    id: 'hem-240', name: 'HEM 240', family: 'HEM', standardGroup: 'EN', standard: 'EN 10365',
    h: 270, b: 248, tw: 18.0, tf: 32.0, r: 21.0,
    G: 157.0, A: 199.6, Avz: 75.34, Iy: 24290.0, Iz: 8153.0, Ip: 32443.0, iy: 11.0, iz: 6.39,
    Wely: 1799.0, Welz: 657.5, Wply: 2133.0, Wplz: 1018.0, It: 554.0, Iw: 1270000, AL: 1.45,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'c', curveZ: 'd', curveLT: 'd'
  },
  {
    id: 'hem-300', name: 'HEM 300', family: 'HEM', standardGroup: 'EN', standard: 'EN 10365',
    h: 340, b: 310, tw: 21.0, tf: 39.0, r: 27.0,
    G: 238.0, A: 303.1, Avz: 118.8, Iy: 59200.0, Iz: 19400.0, Ip: 78600.0, iy: 14.0, iz: 8.00,
    Wely: 3482.0, Welz: 1252.0, Wply: 4189.0, Wplz: 1937.0, It: 1250.0, Iw: 4620000, AL: 1.83,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'c', curveZ: 'd', curveLT: 'd'
  },

  // ===================== UPN CHANNELS (EN 10365 / DIN 1026-1) =====================
  {
    id: 'upn-80', name: 'UPN 80', family: 'UPN', standardGroup: 'EN', standard: 'EN 10365',
    h: 80, b: 45, tw: 6.0, tf: 8.0, r: 8.0,
    G: 8.64, A: 11.0, Avz: 5.6, Iy: 106.0, Iz: 19.4, Ip: 125.4, iy: 3.10, iz: 1.33,
    Wely: 26.5, Welz: 6.36, Wply: 31.8, Wplz: 12.3, It: 1.25, Iw: 230, AL: 0.312,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'upn-100', name: 'UPN 100', family: 'UPN', standardGroup: 'EN', standard: 'EN 10365',
    h: 100, b: 50, tw: 6.0, tf: 8.5, r: 8.5,
    G: 10.6, A: 13.5, Avz: 7.2, Iy: 206.0, Iz: 29.3, Ip: 235.3, iy: 3.91, iz: 1.47,
    Wely: 41.2, Welz: 8.49, Wply: 49.3, Wplz: 16.5, It: 1.76, Iw: 540, AL: 0.372,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'upn-120', name: 'UPN 120', family: 'UPN', standardGroup: 'EN', standard: 'EN 10365',
    h: 120, b: 55, tw: 7.0, tf: 9.0, r: 9.0,
    G: 13.4, A: 17.0, Avz: 9.6, Iy: 364.0, Iz: 43.2, Ip: 407.2, iy: 4.62, iz: 1.59,
    Wely: 60.7, Welz: 11.1, Wply: 72.8, Wplz: 21.8, It: 2.78, Iw: 1140, AL: 0.434,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'upn-140', name: 'UPN 140', family: 'UPN', standardGroup: 'EN', standard: 'EN 10365',
    h: 140, b: 60, tw: 7.0, tf: 10.0, r: 10.0,
    G: 16.0, A: 20.4, Avz: 11.5, Iy: 605.0, Iz: 62.7, Ip: 667.7, iy: 5.45, iz: 1.75,
    Wely: 86.4, Welz: 14.8, Wply: 103.0, Wplz: 28.8, It: 3.96, Iw: 2320, AL: 0.489,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'upn-160', name: 'UPN 160', family: 'UPN', standardGroup: 'EN', standard: 'EN 10365',
    h: 160, b: 65, tw: 7.5, tf: 10.5, r: 10.5,
    G: 18.8, A: 24.0, Avz: 13.8, Iy: 925.0, Iz: 85.3, Ip: 1010.3, iy: 6.21, iz: 1.89,
    Wely: 116.0, Welz: 18.3, Wply: 138.0, Wplz: 35.8, It: 5.48, Iw: 4270, AL: 0.546,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'upn-180', name: 'UPN 180', family: 'UPN', standardGroup: 'EN', standard: 'EN 10365',
    h: 180, b: 70, tw: 8.0, tf: 11.0, r: 11.0,
    G: 22.0, A: 28.0, Avz: 16.4, Iy: 1350.0, Iz: 114.0, Ip: 1464.0, iy: 6.95, iz: 2.02,
    Wely: 150.0, Welz: 22.4, Wply: 179.0, Wplz: 44.0, It: 7.42, Iw: 7290, AL: 0.611,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'upn-200', name: 'UPN 200', family: 'UPN', standardGroup: 'EN', standard: 'EN 10365',
    h: 200, b: 75, tw: 8.5, tf: 11.5, r: 11.5,
    G: 25.3, A: 32.2, Avz: 19.3, Iy: 1910.0, Iz: 148.0, Ip: 2058.0, iy: 7.70, iz: 2.14,
    Wely: 191.0, Welz: 27.0, Wply: 228.0, Wplz: 53.4, It: 9.77, Iw: 11800, AL: 0.661,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'upn-220', name: 'UPN 220', family: 'UPN', standardGroup: 'EN', standard: 'EN 10365',
    h: 220, b: 80, tw: 9.0, tf: 12.5, r: 12.5,
    G: 29.4, A: 37.4, Avz: 22.8, Iy: 2690.0, Iz: 197.0, Ip: 2887.0, iy: 8.48, iz: 2.30,
    Wely: 245.0, Welz: 33.6, Wply: 294.0, Wplz: 66.8, It: 13.9, Iw: 19500, AL: 0.718,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'upn-240', name: 'UPN 240', family: 'UPN', standardGroup: 'EN', standard: 'EN 10365',
    h: 240, b: 85, tw: 9.5, tf: 13.0, r: 13.0,
    G: 33.2, A: 42.3, Avz: 26.0, Iy: 3600.0, Iz: 248.0, Ip: 3848.0, iy: 9.22, iz: 2.42,
    Wely: 300.0, Welz: 39.6, Wply: 360.0, Wplz: 78.9, It: 17.5, Iw: 28600, AL: 0.775,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'upn-300', name: 'UPN 300', family: 'UPN', standardGroup: 'EN', standard: 'EN 10365',
    h: 300, b: 100, tw: 10.0, tf: 16.0, r: 16.0,
    G: 46.2, A: 58.8, Avz: 35.8, Iy: 8030.0, Iz: 495.0, Ip: 8525.0, iy: 11.7, iz: 2.90,
    Wely: 535.0, Welz: 67.8, Wply: 642.0, Wplz: 136.0, It: 36.6, Iw: 88500, AL: 0.950,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },

  // ===================== EN 10056 EQUAL ANGLES (L) =====================
  {
    id: 'l-50x50x5', name: 'L 50x50x5', family: 'L', standardGroup: 'EN', standard: 'EN 10056',
    h: 50, b: 50, tw: 5.0, tf: 5.0, r: 7.0,
    G: 3.77, A: 4.80, Avz: 2.4, Iy: 11.0, Iz: 11.0, Ip: 22.0, iy: 1.51, iz: 1.51,
    Wely: 3.05, Welz: 3.05, Wply: 5.51, Wplz: 5.51, It: 0.42, Iw: 0, AL: 0.194,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'l-60x60x6', name: 'L 60x60x6', family: 'L', standardGroup: 'EN', standard: 'EN 10056',
    h: 60, b: 60, tw: 6.0, tf: 6.0, r: 8.0,
    G: 5.42, A: 6.91, Avz: 3.45, Iy: 22.8, Iz: 22.8, Ip: 45.6, iy: 1.82, iz: 1.82,
    Wely: 5.29, Welz: 5.29, Wply: 9.58, Wplz: 9.58, It: 0.86, Iw: 0, AL: 0.233,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'l-80x80x8', name: 'L 80x80x8', family: 'L', standardGroup: 'EN', standard: 'EN 10056',
    h: 80, b: 80, tw: 8.0, tf: 8.0, r: 10.0,
    G: 9.63, A: 12.3, Avz: 6.15, Iy: 72.2, Iz: 72.2, Ip: 144.4, iy: 2.43, iz: 2.43,
    Wely: 12.6, Welz: 12.6, Wply: 22.9, Wplz: 22.9, It: 2.76, Iw: 0, AL: 0.311,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'l-100x100x10', name: 'L 100x100x10', family: 'L', standardGroup: 'EN', standard: 'EN 10056',
    h: 100, b: 100, tw: 10.0, tf: 10.0, r: 12.0,
    G: 15.0, A: 19.2, Avz: 9.6, Iy: 177.0, Iz: 177.0, Ip: 354.0, iy: 3.04, iz: 3.04,
    Wely: 24.6, Welz: 24.6, Wply: 45.1, Wplz: 45.1, It: 6.78, Iw: 0, AL: 0.389,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'l-120x120x12', name: 'L 120x120x12', family: 'L', standardGroup: 'EN', standard: 'EN 10056',
    h: 120, b: 120, tw: 12.0, tf: 12.0, r: 13.0,
    G: 21.6, A: 27.5, Avz: 13.75, Iy: 368.0, Iz: 368.0, Ip: 736.0, iy: 3.66, iz: 3.66,
    Wely: 42.7, Welz: 42.7, Wply: 78.4, Wplz: 78.4, It: 13.9, Iw: 0, AL: 0.467,
    defaultMechanics: { ...EN_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'b', curveLT: 'b'
  },

  // ===================== EN SHS (SQUARE HOLLOW SECTIONS) =====================
  makeSHS(40, 3.0),
  makeSHS(40, 4.0),
  makeSHS(50, 3.0),
  makeSHS(50, 4.0),
  makeSHS(50, 5.0),
  makeSHS(60, 3.0),
  makeSHS(60, 4.0),
  makeSHS(60, 5.0),
  makeSHS(60, 6.3),
  makeSHS(70, 3.6),
  makeSHS(70, 5.0),
  makeSHS(70, 6.3),
  makeSHS(80, 4.0),
  makeSHS(80, 5.0),
  makeSHS(80, 6.3),
  makeSHS(80, 8.0),
  makeSHS(90, 4.0),
  makeSHS(90, 5.0),
  makeSHS(90, 6.3),
  makeSHS(90, 8.0),
  makeSHS(100, 4.0),
  makeSHS(100, 5.0),
  makeSHS(100, 6.3),
  makeSHS(100, 8.0),
  makeSHS(100, 10.0),
  makeSHS(120, 5.0),
  makeSHS(120, 6.3),
  makeSHS(120, 8.0),
  makeSHS(120, 10.0),
  makeSHS(120, 12.5),
  makeSHS(140, 5.0),
  makeSHS(140, 6.3),
  makeSHS(140, 8.0),
  makeSHS(140, 10.0),
  makeSHS(140, 12.5),
  makeSHS(150, 5.0),
  makeSHS(150, 6.3),
  makeSHS(150, 8.0),
  makeSHS(150, 10.0),
  makeSHS(150, 12.5),
  makeSHS(160, 6.3),
  makeSHS(160, 8.0),
  makeSHS(160, 10.0),
  makeSHS(160, 12.5),
  makeSHS(180, 6.3),
  makeSHS(180, 8.0),
  makeSHS(180, 10.0),
  makeSHS(180, 12.5),
  makeSHS(180, 16.0),
  makeSHS(200, 6.3),
  makeSHS(200, 8.0),
  makeSHS(200, 10.0),
  makeSHS(200, 12.5),
  makeSHS(200, 16.0),
  makeSHS(250, 8.0),
  makeSHS(250, 10.0),
  makeSHS(250, 12.5),
  makeSHS(250, 16.0),
  makeSHS(300, 8.0),
  makeSHS(300, 10.0),
  makeSHS(300, 12.5),
  makeSHS(300, 16.0),
  makeSHS(350, 10.0),
  makeSHS(350, 12.5),
  makeSHS(350, 16.0),
  makeSHS(400, 10.0),
  makeSHS(400, 12.5),
  makeSHS(400, 16.0),
  makeSHS(400, 20.0),

  // ===================== EN RHS (RECTANGULAR HOLLOW SECTIONS) =====================
  makeRHS(50, 30, 3.0),
  makeRHS(60, 40, 3.0),
  makeRHS(60, 40, 4.0),
  makeRHS(80, 40, 3.0),
  makeRHS(80, 40, 4.0),
  makeRHS(80, 40, 5.0),
  makeRHS(90, 50, 3.6),
  makeRHS(90, 50, 5.0),
  makeRHS(100, 50, 3.0),
  makeRHS(100, 50, 4.0),
  makeRHS(100, 50, 5.0),
  makeRHS(100, 50, 6.3),
  makeRHS(100, 60, 3.6),
  makeRHS(100, 60, 5.0),
  makeRHS(100, 60, 6.3),
  makeRHS(120, 60, 4.0),
  makeRHS(120, 60, 5.0),
  makeRHS(120, 60, 6.3),
  makeRHS(120, 60, 8.0),
  makeRHS(120, 80, 4.0),
  makeRHS(120, 80, 5.0),
  makeRHS(120, 80, 6.3),
  makeRHS(120, 80, 8.0),
  makeRHS(120, 80, 10.0),
  makeRHS(140, 80, 5.0),
  makeRHS(140, 80, 6.3),
  makeRHS(140, 80, 8.0),
  makeRHS(140, 80, 10.0),
  makeRHS(150, 100, 5.0),
  makeRHS(150, 100, 6.3),
  makeRHS(150, 100, 8.0),
  makeRHS(150, 100, 10.0),
  makeRHS(150, 100, 12.5),
  makeRHS(160, 80, 5.0),
  makeRHS(160, 80, 6.3),
  makeRHS(160, 80, 8.0),
  makeRHS(160, 80, 10.0),
  makeRHS(180, 100, 6.3),
  makeRHS(180, 100, 8.0),
  makeRHS(180, 100, 10.0),
  makeRHS(180, 100, 12.5),
  makeRHS(200, 100, 5.0),
  makeRHS(200, 100, 6.3),
  makeRHS(200, 100, 8.0),
  makeRHS(200, 100, 10.0),
  makeRHS(200, 100, 12.5),
  makeRHS(200, 120, 6.3),
  makeRHS(200, 120, 8.0),
  makeRHS(200, 120, 10.0),
  makeRHS(200, 120, 12.5),
  makeRHS(250, 150, 6.3),
  makeRHS(250, 150, 8.0),
  makeRHS(250, 150, 10.0),
  makeRHS(250, 150, 12.5),
  makeRHS(250, 150, 16.0),
  makeRHS(300, 200, 8.0),
  makeRHS(300, 200, 10.0),
  makeRHS(300, 200, 12.5),
  makeRHS(300, 200, 16.0),
  makeRHS(400, 200, 10.0),
  makeRHS(400, 200, 12.5),
  makeRHS(400, 200, 16.0),
  makeRHS(500, 300, 12.5),
  makeRHS(500, 300, 16.0),
  makeRHS(500, 300, 20.0),

  // ===================== EN CHS (CIRCULAR HOLLOW SECTIONS) =====================
  makeCHS(33.7, 2.6),
  makeCHS(33.7, 3.2),
  makeCHS(42.4, 2.6),
  makeCHS(42.4, 3.2),
  makeCHS(42.4, 4.0),
  makeCHS(48.3, 2.6),
  makeCHS(48.3, 3.2),
  makeCHS(48.3, 4.0),
  makeCHS(60.3, 2.9),
  makeCHS(60.3, 3.6),
  makeCHS(60.3, 4.5),
  makeCHS(60.3, 5.6),
  makeCHS(76.1, 3.2),
  makeCHS(76.1, 4.0),
  makeCHS(76.1, 5.0),
  makeCHS(76.1, 6.3),
  makeCHS(88.9, 3.2),
  makeCHS(88.9, 4.0),
  makeCHS(88.9, 5.0),
  makeCHS(88.9, 6.3),
  makeCHS(88.9, 8.0),
  makeCHS(101.6, 3.6),
  makeCHS(101.6, 4.5),
  makeCHS(101.6, 5.6),
  makeCHS(101.6, 6.3),
  makeCHS(101.6, 8.0),
  makeCHS(114.3, 3.6),
  makeCHS(114.3, 4.5),
  makeCHS(114.3, 5.0),
  makeCHS(114.3, 6.3),
  makeCHS(114.3, 8.0),
  makeCHS(114.3, 10.0),
  makeCHS(139.7, 4.0),
  makeCHS(139.7, 5.0),
  makeCHS(139.7, 6.3),
  makeCHS(139.7, 8.0),
  makeCHS(139.7, 10.0),
  makeCHS(139.7, 12.5),
  makeCHS(168.3, 4.5),
  makeCHS(168.3, 5.6),
  makeCHS(168.3, 6.3),
  makeCHS(168.3, 8.0),
  makeCHS(168.3, 10.0),
  makeCHS(168.3, 12.5),
  makeCHS(193.7, 5.6),
  makeCHS(193.7, 6.3),
  makeCHS(193.7, 8.0),
  makeCHS(193.7, 10.0),
  makeCHS(193.7, 12.5),
  makeCHS(219.1, 6.3),
  makeCHS(219.1, 8.0),
  makeCHS(219.1, 10.0),
  makeCHS(219.1, 12.5),
  makeCHS(219.1, 16.0),
  makeCHS(244.5, 6.3),
  makeCHS(244.5, 8.0),
  makeCHS(244.5, 10.0),
  makeCHS(244.5, 12.5),
  makeCHS(244.5, 16.0),
  makeCHS(273.0, 6.3),
  makeCHS(273.0, 8.0),
  makeCHS(273.0, 10.0),
  makeCHS(273.0, 12.5),
  makeCHS(273.0, 16.0),
  makeCHS(323.9, 7.1),
  makeCHS(323.9, 8.8),
  makeCHS(323.9, 10.0),
  makeCHS(323.9, 12.5),
  makeCHS(323.9, 16.0),
  makeCHS(355.6, 8.0),
  makeCHS(355.6, 10.0),
  makeCHS(355.6, 12.5),
  makeCHS(355.6, 16.0),
  makeCHS(406.4, 8.8),
  makeCHS(406.4, 10.0),
  makeCHS(406.4, 12.5),
  makeCHS(406.4, 16.0),
  makeCHS(457.0, 10.0),
  makeCHS(457.0, 12.5),
  makeCHS(457.0, 16.0),
  makeCHS(508.0, 10.0),
  makeCHS(508.0, 12.5),
  makeCHS(508.0, 16.0),
  makeCHS(508.0, 20.0),
];
