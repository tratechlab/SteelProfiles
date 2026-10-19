import { SteelProfile } from '../../types/steel';

const ASTM_MECHANICS = {
  E: 200000,  // 29,000 ksi
  Et: 16000,
  fy: 345,    // 50 ksi = 345 MPa (A992)
  fu: 450,
  G: 77000,
  poisson: 0.3,
  density: 7850,
};

// Helper for ASTM HSS Box sections (ASTM A500)
function makeHSS(sizeInches: number, tInches: number): SteelProfile {
  const sizeMm = sizeInches * 25.4;
  const tMm = tInches * 25.4;
  const r = 2 * tMm;
  const cornerArea = (4 - Math.PI) * Math.pow(r, 2);
  const A = Math.max(0.1, (4 * tMm * (sizeMm - tMm) - cornerArea) / 100);
  const G = Number((A * 0.785).toFixed(2));
  const Avz = Number((A / 2).toFixed(2));
  
  const d_in = sizeMm - 2 * tMm;
  const Iy = Number(((Math.pow(sizeMm, 4) - Math.pow(d_in, 4)) / (12 * 10000)).toFixed(1));
  const Iz = Iy;
  const Ip = Number((2 * Iy).toFixed(1));
  
  const iy = Number(Math.sqrt(Iy / A).toFixed(2));
  const iz = iy;
  
  const Wely = Number(((2 * Iy) / (sizeMm / 10)).toFixed(1));
  const Welz = Wely;
  
  const Wply = Number((((sizeMm - tMm) * (sizeMm - tMm) * tMm + (tMm * tMm * tMm) / 3) / 1000).toFixed(1));
  const Wplz = Wply;
  
  const meanArea = Math.pow(sizeMm - tMm, 2);
  const meanPerimeter = 4 * (sizeMm - tMm);
  const It = Number(((4 * Math.pow(meanArea, 2) * tMm / meanPerimeter) / 10000).toFixed(1));
  const AL = Number(((4 * sizeMm) / 1000).toFixed(3));

  const tFrac = tInches === 0.125 ? '1/8' : tInches === 0.1875 ? '3/16' : tInches === 0.25 ? '1/4' : tInches === 0.3125 ? '5/16' : tInches === 0.375 ? '3/8' : tInches === 0.5 ? '1/2' : `${tInches}`;

  return {
    id: `astm-hss-${sizeInches}x${sizeInches}x${tFrac.replace('/', '-')}`,
    name: `HSS ${sizeInches}x${sizeInches}x${tFrac}`,
    family: 'HSS',
    standardGroup: 'ASTM',
    standard: 'ASTM A500',
    h: Number(sizeMm.toFixed(1)),
    b: Number(sizeMm.toFixed(1)),
    tw: Number(tMm.toFixed(1)),
    tf: Number(tMm.toFixed(1)),
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
    defaultMechanics: { ...ASTM_MECHANICS, fy: 315 },
    curveY: 'a',
    curveZ: 'a',
    curveLT: 'a',
  };
}

export const ASTM_PROFILES: SteelProfile[] = [
  // ===================== W-SHAPES (AISC / ASTM A6 / A992) =====================
  {
    id: 'w-4-13', name: 'W 4x13', family: 'W-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A6 / A992',
    h: 105.7, b: 103.1, tw: 7.1, tf: 8.8, r: 8.0,
    G: 19.3, A: 24.7, Avz: 7.5, Iy: 470.0, Iz: 161.0, Ip: 631.0, iy: 4.37, iz: 2.55,
    Wely: 89.0, Welz: 31.2, Wply: 102.0, Wplz: 48.0, It: 5.8, Iw: 3950, AL: 0.60,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 345 },
    curveY: 'b', curveZ: 'c', curveLT: 'b'
  },
  {
    id: 'w-6-9', name: 'W 6x9', family: 'W-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A6 / A992',
    h: 150.0, b: 100.0, tw: 4.3, tf: 5.5, r: 8.0,
    G: 13.5, A: 17.2, Avz: 6.5, Iy: 683.0, Iz: 91.2, Ip: 774.2, iy: 6.30, iz: 2.30,
    Wely: 91.1, Welz: 18.2, Wply: 104.0, Wplz: 28.5, It: 1.8, Iw: 4680, AL: 0.68,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 345 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'w-6-15', name: 'W 6x15', family: 'W-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A6 / A992',
    h: 152.1, b: 152.4, tw: 5.8, tf: 6.6, r: 8.0,
    G: 22.3, A: 28.6, Avz: 8.8, Iy: 1170.0, Iz: 391.0, Ip: 1561.0, iy: 6.40, iz: 3.71,
    Wely: 154.0, Welz: 51.3, Wply: 174.0, Wplz: 78.7, It: 3.8, Iw: 20500, AL: 0.88,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 345 },
    curveY: 'b', curveZ: 'c', curveLT: 'b'
  },
  {
    id: 'w-8-18', name: 'W 8x18', family: 'W-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A6 / A992',
    h: 206.8, b: 133.4, tw: 5.8, tf: 8.4, r: 10.0,
    G: 26.8, A: 34.2, Avz: 12.0, Iy: 2580.0, Iz: 331.0, Ip: 2911.0, iy: 8.69, iz: 3.11,
    Wely: 249.0, Welz: 49.7, Wply: 282.0, Wplz: 77.2, It: 6.9, Iw: 32500, AL: 0.98,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 345 },
    curveY: 'b', curveZ: 'c', curveLT: 'b'
  },
  {
    id: 'w-8-24', name: 'W 8x24', family: 'W-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A6 / A992',
    h: 201.4, b: 164.6, tw: 6.2, tf: 10.2, r: 10.0,
    G: 35.7, A: 45.5, Avz: 12.5, Iy: 3450.0, Iz: 762.0, Ip: 4212.0, iy: 8.71, iz: 4.09,
    Wely: 342.5, Welz: 92.6, Wply: 380.2, Wplz: 142.6, It: 14.4, Iw: 72000, AL: 1.02,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 345 },
    curveY: 'b', curveZ: 'c', curveLT: 'b'
  },
  {
    id: 'w-10-33', name: 'W 10x33', family: 'W-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A6 / A992',
    h: 247.1, b: 202.2, tw: 7.4, tf: 11.0, r: 12.0,
    G: 49.1, A: 62.6, Avz: 18.3, Iy: 7110.0, Iz: 1520.0, Ip: 8630.0, iy: 10.7, iz: 4.93,
    Wely: 575.2, Welz: 150.8, Wply: 639.1, Wplz: 231.1, It: 24.1, Iw: 215000, AL: 1.25,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 345 },
    curveY: 'b', curveZ: 'c', curveLT: 'b'
  },
  {
    id: 'w-10-49', name: 'W 10x49', family: 'W-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A6 / A992',
    h: 253.5, b: 254.0, tw: 8.6, tf: 14.2, r: 14.0,
    G: 72.9, A: 92.9, Avz: 21.8, Iy: 11300.0, Iz: 3890.0, Ip: 15190.0, iy: 11.0, iz: 6.47,
    Wely: 891.0, Welz: 306.0, Wply: 1010.0, Wplz: 469.0, It: 58.2, Iw: 574000, AL: 1.48,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 345 },
    curveY: 'b', curveZ: 'c', curveLT: 'b'
  },
  {
    id: 'w-12-26', name: 'W 12x26', family: 'W-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A6 / A992',
    h: 310.4, b: 164.8, tw: 5.8, tf: 9.7, r: 12.0,
    G: 38.7, A: 49.4, Avz: 18.0, Iy: 8490.0, Iz: 720.0, Ip: 9210.0, iy: 13.1, iz: 3.82,
    Wely: 547.0, Welz: 87.4, Wply: 618.0, Wplz: 136.0, It: 13.8, Iw: 161000, AL: 1.23,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 345 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'w-12-50', name: 'W 12x50', family: 'W-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A6 / A992',
    h: 309.6, b: 205.2, tw: 9.4, tf: 16.3, r: 15.0,
    G: 74.4, A: 94.8, Avz: 29.1, Iy: 16400.0, Iz: 2340.0, Ip: 18740.0, iy: 13.2, iz: 4.98,
    Wely: 1060.0, Welz: 228.0, Wply: 1180.0, Wplz: 351.0, It: 71.2, Iw: 512000, AL: 1.38,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 345 },
    curveY: 'b', curveZ: 'c', curveLT: 'b'
  },
  {
    id: 'w-14-30', name: 'W 14x30', family: 'W-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A6 / A992',
    h: 352.0, b: 171.0, tw: 6.9, tf: 9.8, r: 12.0,
    G: 44.6, A: 57.1, Avz: 24.3, Iy: 12100.0, Iz: 816.0, Ip: 12916.0, iy: 14.6, iz: 3.78,
    Wely: 688.0, Welz: 95.4, Wply: 780.0, Wplz: 150.0, It: 16.2, Iw: 234000, AL: 1.35,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 345 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'w-14-90', name: 'W 14x90', family: 'W-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A6 / A992',
    h: 356.1, b: 368.8, tw: 11.2, tf: 18.0, r: 18.0,
    G: 134.0, A: 171.0, Avz: 39.9, Iy: 41600.0, Iz: 15100.0, Ip: 56700.0, iy: 15.6, iz: 9.40,
    Wely: 2340.0, Welz: 819.0, Wply: 2620.0, Wplz: 1250.0, It: 171.0, Iw: 4420000, AL: 2.12,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 345 },
    curveY: 'b', curveZ: 'c', curveLT: 'b'
  },
  {
    id: 'w-16-40', name: 'W 16x40', family: 'W-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A6 / A992',
    h: 406.7, b: 177.8, tw: 7.7, tf: 12.8, r: 15.0,
    G: 59.5, A: 76.1, Avz: 31.3, Iy: 21600.0, Iz: 1200.0, Ip: 22800.0, iy: 16.8, iz: 3.97,
    Wely: 1060.0, Welz: 135.0, Wply: 1200.0, Wplz: 212.0, It: 34.6, Iw: 462000, AL: 1.48,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 345 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'w-18-50', name: 'W 18x50', family: 'W-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A6 / A992',
    h: 457.0, b: 190.5, tw: 9.0, tf: 14.5, r: 15.0,
    G: 74.4, A: 94.8, Avz: 41.1, Iy: 33300.0, Iz: 1670.0, Ip: 34970.0, iy: 18.7, iz: 4.20,
    Wely: 1460.0, Welz: 175.0, Wply: 1660.0, Wplz: 277.0, It: 51.6, Iw: 820000, AL: 1.61,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 345 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'w-21-62', name: 'W 21x62', family: 'W-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A6 / A992',
    h: 533.1, b: 209.3, tw: 10.2, tf: 15.6, r: 18.0,
    G: 92.3, A: 118.0, Avz: 54.4, Iy: 55400.0, Iz: 2390.0, Ip: 57790.0, iy: 21.7, iz: 4.50,
    Wely: 2080.0, Welz: 228.0, Wply: 2360.0, Wplz: 362.0, It: 76.2, Iw: 1610000, AL: 1.84,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 345 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'w-24-68', name: 'W 24x68', family: 'W-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A6 / A992',
    h: 602.7, b: 227.7, tw: 10.5, tf: 14.9, r: 18.0,
    G: 101.0, A: 130.0, Avz: 63.3, Iy: 76200.0, Iz: 2930.0, Ip: 79130.0, iy: 24.2, iz: 4.75,
    Wely: 2530.0, Welz: 257.0, Wply: 2880.0, Wplz: 409.0, It: 77.8, Iw: 2490000, AL: 2.05,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 345 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },

  // ===================== S-SHAPES (ASTM A36) =====================
  {
    id: 's-3-5.7', name: 'S 3x5.7', family: 'S-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A36',
    h: 76.2, b: 59.2, tw: 4.3, tf: 6.6, r: 6.0,
    G: 8.48, A: 10.8, Avz: 3.3, Iy: 105.0, Iz: 18.9, Ip: 123.9, iy: 3.12, iz: 1.32,
    Wely: 27.5, Welz: 6.39, Wply: 32.2, Wplz: 11.2, It: 1.3, Iw: 240, AL: 0.36,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 250 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 's-4-7.7', name: 'S 4x7.7', family: 'S-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A36',
    h: 101.6, b: 67.6, tw: 4.9, tf: 7.4, r: 6.0,
    G: 11.5, A: 14.6, Avz: 5.0, Iy: 250.0, Iz: 37.5, Ip: 287.5, iy: 4.14, iz: 1.60,
    Wely: 49.2, Welz: 11.1, Wply: 57.6, Wplz: 19.4, It: 2.3, Iw: 880, AL: 0.45,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 250 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 's-6-12.5', name: 'S 6x12.5', family: 'S-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A36',
    h: 152.4, b: 84.6, tw: 5.8, tf: 9.1, r: 7.0,
    G: 18.6, A: 23.7, Avz: 8.8, Iy: 920.0, Iz: 75.3, Ip: 995.3, iy: 6.22, iz: 1.78,
    Wely: 121.0, Welz: 17.8, Wply: 141.0, Wplz: 30.1, It: 4.8, Iw: 3950, AL: 0.61,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 250 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 's-8-18.4', name: 'S 8x18.4', family: 'S-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A36',
    h: 203.2, b: 101.6, tw: 6.9, tf: 10.8, r: 8.0,
    G: 27.4, A: 34.9, Avz: 14.0, Iy: 2390.0, Iz: 180.0, Ip: 2570.0, iy: 8.28, iz: 2.27,
    Wely: 235.0, Welz: 35.4, Wply: 274.0, Wplz: 60.5, It: 10.5, Iw: 16800, AL: 0.77,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 250 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 's-10-25.4', name: 'S 10x25.4', family: 'S-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A36',
    h: 254.0, b: 118.4, tw: 8.0, tf: 12.5, r: 9.0,
    G: 37.8, A: 48.1, Avz: 20.3, Iy: 5160.0, Iz: 348.0, Ip: 5508.0, iy: 10.4, iz: 2.69,
    Wely: 406.0, Welz: 58.8, Wply: 472.0, Wplz: 101.0, It: 20.1, Iw: 50800, AL: 0.93,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 250 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 's-12-31.8', name: 'S 12x31.8', family: 'S-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A36',
    h: 304.8, b: 127.0, tw: 8.9, tf: 13.7, r: 10.0,
    G: 47.3, A: 60.3, Avz: 27.1, Iy: 9070.0, Iz: 512.0, Ip: 9582.0, iy: 12.3, iz: 2.91,
    Wely: 595.0, Welz: 80.6, Wply: 694.0, Wplz: 140.0, It: 31.4, Iw: 110000, AL: 1.08,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 250 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },

  // ===================== C-SHAPES (ASTM A36) =====================
  {
    id: 'c-3-4.1', name: 'C 3x4.1', family: 'C-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A36',
    h: 76.2, b: 35.8, tw: 4.3, tf: 6.9, r: 5.0,
    G: 6.10, A: 7.77, Avz: 3.3, Iy: 69.1, Iz: 7.95, Ip: 77.05, iy: 2.98, iz: 1.01,
    Wely: 18.1, Welz: 3.16, Wply: 21.8, Wplz: 6.25, It: 0.95, Iw: 85, AL: 0.28,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 250 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'c-4-5.4', name: 'C 4x5.4', family: 'C-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A36',
    h: 101.6, b: 40.1, tw: 4.7, tf: 7.5, r: 6.0,
    G: 8.04, A: 10.2, Avz: 4.8, Iy: 160.0, Iz: 13.3, Ip: 173.3, iy: 3.96, iz: 1.14,
    Wely: 31.5, Welz: 4.67, Wply: 38.0, Wplz: 9.32, It: 1.48, Iw: 245, AL: 0.34,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 250 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'c-6-8.2', name: 'C 6x8.2', family: 'C-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A36',
    h: 152.4, b: 48.8, tw: 5.1, tf: 8.7, r: 7.0,
    G: 12.2, A: 15.5, Avz: 7.8, Iy: 545.0, Iz: 28.7, Ip: 573.7, iy: 5.92, iz: 1.36,
    Wely: 71.6, Welz: 7.83, Wply: 86.2, Wplz: 14.8, It: 2.9, Iw: 1150, AL: 0.46,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 250 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'c-8-11.5', name: 'C 8x11.5', family: 'C-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A36',
    h: 203.2, b: 57.4, tw: 5.6, tf: 9.9, r: 8.0,
    G: 17.1, A: 21.8, Avz: 11.4, Iy: 1360.0, Iz: 54.5, Ip: 1414.5, iy: 7.90, iz: 1.58,
    Wely: 134.0, Welz: 13.0, Wply: 161.0, Wplz: 25.1, It: 5.6, Iw: 3950, AL: 0.58,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 250 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'c-10-15.3', name: 'C 10x15.3', family: 'C-SHAPE', standardGroup: 'ASTM', standard: 'ASTM A36',
    h: 254.0, b: 66.0, tw: 6.1, tf: 11.1, r: 9.0,
    G: 22.8, A: 29.0, Avz: 15.5, Iy: 2790.0, Iz: 95.3, Ip: 2885.3, iy: 9.80, iz: 1.81,
    Wely: 220.0, Welz: 19.3, Wply: 264.0, Wplz: 38.5, It: 9.8, Iw: 10400, AL: 0.70,
    defaultMechanics: { ...ASTM_MECHANICS, fy: 250 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },

  // ===================== HSS HOLLOW BOX SECTIONS (ASTM A500) =====================
  makeHSS(2, 0.125),
  makeHSS(2.5, 0.1875),
  makeHSS(3, 0.1875),
  makeHSS(3, 0.25),
  makeHSS(4, 0.25),
  makeHSS(4, 0.375),
  makeHSS(5, 0.25),
  makeHSS(5, 0.375),
  makeHSS(6, 0.25),
  makeHSS(6, 0.375),
  makeHSS(6, 0.5),
  makeHSS(8, 0.25),
  makeHSS(8, 0.375),
  makeHSS(8, 0.5),
  makeHSS(10, 0.375),
  makeHSS(10, 0.5),
  makeHSS(12, 0.375),
  makeHSS(12, 0.5),
  makeHSS(14, 0.5),
  makeHSS(16, 0.5),
];
