import { SteelProfile } from '../../types/steel';

const ISO_MECHANICS = {
  E: 205000,  // ISO 630 baseline 205 GPa
  Et: 16400,
  fy: 355,    // ISO E355 default
  fu: 510,
  G: 79000,
  poisson: 0.3,
  density: 7850,
};

// Helper for ISO SHS (ISO 10799)
function makeISOSHS(size: number, t: number): SteelProfile {
  const r = 1.5 * t;
  const cornerArea = (4 - Math.PI) * Math.pow(r, 2);
  const A = Math.max(0.1, (4 * t * (size - t) - cornerArea) / 100);
  const G = Number((A * 0.785).toFixed(2));
  const Avz = Number((A / 2).toFixed(2));
  
  const d_in = size - 2 * t;
  const Iy = Number(((Math.pow(size, 4) - Math.pow(d_in, 4)) / (12 * 10000)).toFixed(1));
  const Iz = Iy;
  const Ip = Number((2 * Iy).toFixed(1));
  
  const iy = Number(Math.sqrt(Iy / A).toFixed(2));
  const iz = iy;
  
  const Wely = Number(((2 * Iy) / (size / 10)).toFixed(1));
  const Welz = Wely;
  
  const Wply = Number((((size - t) * (size - t) * t + (t * t * t) / 3) / 1000).toFixed(1));
  const Wplz = Wply;
  
  const meanArea = Math.pow(size - t, 2);
  const meanPerimeter = 4 * (size - t);
  const It = Number(((4 * Math.pow(meanArea, 2) * t / meanPerimeter) / 10000).toFixed(1));
  const AL = Number(((4 * size) / 1000).toFixed(3));

  return {
    id: `iso-shs-${size}x${t}`,
    name: `ISO SHS ${size}x${t.toFixed(1)}`,
    family: 'ISO-SHS',
    standardGroup: 'ISO',
    standard: 'ISO 10799',
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
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'a',
    curveZ: 'a',
    curveLT: 'a',
  };
}

// Helper for ISO RHS (ISO 10799)
function makeISORHS(h: number, b: number, t: number): SteelProfile {
  const r = 1.5 * t;
  const cornerArea = (4 - Math.PI) * Math.pow(r, 2);
  const A = Math.max(0.1, (2 * t * (h + b - 2 * t) - cornerArea) / 100);
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
    id: `iso-rhs-${h}x${b}x${t}`,
    name: `ISO RHS ${h}x${b}x${t.toFixed(1)}`,
    family: 'ISO-RHS',
    standardGroup: 'ISO',
    standard: 'ISO 10799',
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
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'a',
    curveZ: 'a',
    curveLT: 'a',
  };
}

// Helper for ISO CHS (ISO 12633)
function makeISOCHS(d: number, t: number): SteelProfile {
  const A = Number(((Math.PI * (d - t) * t) / 100).toFixed(2));
  const G = Number((A * 0.785).toFixed(2));
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
    id: `iso-chs-${d.toFixed(1)}x${t}`,
    name: `ISO CHS Ø${d.toFixed(1)}x${t.toFixed(1)}`,
    family: 'ISO-CHS',
    standardGroup: 'ISO',
    standard: 'ISO 12633',
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
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'a',
    curveZ: 'a',
    curveLT: 'a',
  };
}

export const ISO_PROFILES: SteelProfile[] = [
  // ===================== ISO I-BEAMS (ISO 657-1) =====================
  {
    id: 'iso-i-80-42', name: 'ISO I 80x42', family: 'ISO-I', standardGroup: 'ISO', standard: 'ISO 657-1',
    h: 80, b: 42, tw: 3.9, tf: 5.9, r: 5.0,
    G: 5.95, A: 7.58, Avz: 3.4, Iy: 77.8, Iz: 6.29, Ip: 84.09, iy: 3.20, iz: 0.91,
    Wely: 19.5, Welz: 3.00, Wply: 22.8, Wplz: 4.88, It: 0.88, Iw: 85, AL: 0.304,
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'iso-i-100-68', name: 'ISO I 100x68', family: 'ISO-I', standardGroup: 'ISO', standard: 'ISO 657-1',
    h: 100, b: 68, tw: 4.5, tf: 7.6, r: 7.0,
    G: 11.2, A: 14.3, Avz: 6.2, Iy: 236.0, Iz: 39.2, Ip: 275.2, iy: 4.06, iz: 1.66,
    Wely: 47.2, Welz: 11.5, Wply: 54.3, Wplz: 18.2, It: 2.1, Iw: 780, AL: 0.44,
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'iso-i-120-74', name: 'ISO I 120x74', family: 'ISO-I', standardGroup: 'ISO', standard: 'ISO 657-1',
    h: 120, b: 74, tw: 5.0, tf: 8.2, r: 8.0,
    G: 14.2, A: 18.1, Avz: 7.8, Iy: 450.0, Iz: 62.5, Ip: 512.5, iy: 4.99, iz: 1.86,
    Wely: 75.0, Welz: 16.9, Wply: 86.2, Wplz: 26.5, It: 3.2, Iw: 1850, AL: 0.52,
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'iso-i-160-90', name: 'ISO I 160x90', family: 'ISO-I', standardGroup: 'ISO', standard: 'ISO 657-1',
    h: 160, b: 90, tw: 5.5, tf: 8.8, r: 9.0,
    G: 19.9, A: 25.4, Avz: 11.2, Iy: 1090.0, Iz: 108.0, Ip: 1198.0, iy: 6.55, iz: 2.06,
    Wely: 136.0, Welz: 24.0, Wply: 156.0, Wplz: 38.1, It: 5.2, Iw: 5800, AL: 0.65,
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'iso-i-200-100', name: 'ISO I 200x100', family: 'ISO-I', standardGroup: 'ISO', standard: 'ISO 657-1',
    h: 200, b: 100, tw: 6.0, tf: 9.5, r: 10.0,
    G: 25.1, A: 32.0, Avz: 14.5, Iy: 2190.0, Iz: 160.0, Ip: 2350.0, iy: 8.28, iz: 2.24,
    Wely: 219.0, Welz: 32.0, Wply: 251.0, Wplz: 50.8, It: 8.1, Iw: 14200, AL: 0.77,
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'iso-i-250-125', name: 'ISO I 250x125', family: 'ISO-I', standardGroup: 'ISO', standard: 'ISO 657-1',
    h: 250, b: 125, tw: 7.0, tf: 11.5, r: 12.0,
    G: 38.3, A: 48.8, Avz: 21.0, Iy: 5180.0, Iz: 375.0, Ip: 5555.0, iy: 10.3, iz: 2.77,
    Wely: 414.0, Welz: 60.0, Wply: 474.0, Wplz: 94.8, It: 17.5, Iw: 52000, AL: 0.96,
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'iso-i-300-150', name: 'ISO I 300x150', family: 'ISO-I', standardGroup: 'ISO', standard: 'ISO 657-1',
    h: 300, b: 150, tw: 8.0, tf: 13.0, r: 15.0,
    G: 54.2, A: 69.1, Avz: 29.5, Iy: 10700.0, Iz: 732.0, Ip: 11432.0, iy: 12.4, iz: 3.25,
    Wely: 713.0, Welz: 97.6, Wply: 815.0, Wplz: 154.0, It: 31.0, Iw: 148000, AL: 1.15,
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'iso-i-360-143', name: 'ISO I 360x143', family: 'ISO-I', standardGroup: 'ISO', standard: 'ISO 657-1',
    h: 360, b: 143, tw: 8.6, tf: 14.3, r: 16.0,
    G: 64.3, A: 81.9, Avz: 35.2, Iy: 17200.0, Iz: 1060.0, Ip: 18260.0, iy: 14.5, iz: 3.60,
    Wely: 955.0, Welz: 148.0, Wply: 1090.0, Wplz: 231.0, It: 44.0, Iw: 285000, AL: 1.32,
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'iso-i-400-155', name: 'ISO I 400x155', family: 'ISO-I', standardGroup: 'ISO', standard: 'ISO 657-1',
    h: 400, b: 155, tw: 9.5, tf: 15.8, r: 18.0,
    G: 77.8, A: 99.1, Avz: 43.1, Iy: 26500.0, Iz: 1490.0, Ip: 27990.0, iy: 16.3, iz: 3.88,
    Wely: 1325.0, Welz: 192.0, Wply: 1520.0, Wplz: 301.0, It: 62.0, Iw: 495000, AL: 1.48,
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },

  // ===================== ISO CHANNELS (ISO 657-11) =====================
  {
    id: 'iso-c-80-45', name: 'ISO C 80x45', family: 'ISO-C', standardGroup: 'ISO', standard: 'ISO 657-11',
    h: 80, b: 45, tw: 5.5, tf: 7.5, r: 7.5,
    G: 8.24, A: 10.5, Avz: 5.2, Iy: 98.5, Iz: 17.8, Ip: 116.3, iy: 3.06, iz: 1.30,
    Wely: 24.6, Welz: 5.85, Wply: 29.5, Wplz: 11.2, It: 1.15, Iw: 195, AL: 0.31,
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'iso-c-100-50', name: 'ISO C 100x50', family: 'ISO-C', standardGroup: 'ISO', standard: 'ISO 657-11',
    h: 100, b: 50, tw: 6.0, tf: 8.5, r: 8.5,
    G: 10.6, A: 13.5, Avz: 7.2, Iy: 206.0, Iz: 29.3, Ip: 235.3, iy: 3.91, iz: 1.47,
    Wely: 41.2, Welz: 8.49, Wply: 49.3, Wplz: 16.5, It: 1.76, Iw: 540, AL: 0.37,
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'iso-c-140-60', name: 'ISO C 140x60', family: 'ISO-C', standardGroup: 'ISO', standard: 'ISO 657-11',
    h: 140, b: 60, tw: 6.5, tf: 9.0, r: 9.0,
    G: 15.5, A: 19.7, Avz: 9.5, Iy: 590.0, Iz: 60.5, Ip: 650.5, iy: 5.47, iz: 1.75,
    Wely: 84.3, Welz: 14.2, Wply: 101.0, Wplz: 27.5, It: 4.8, Iw: 1950, AL: 0.49,
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'iso-c-200-75', name: 'ISO C 200x75', family: 'ISO-C', standardGroup: 'ISO', standard: 'ISO 657-11',
    h: 200, b: 75, tw: 7.5, tf: 11.0, r: 11.0,
    G: 23.8, A: 30.3, Avz: 15.6, Iy: 1850.0, Iz: 140.0, Ip: 1990.0, iy: 7.82, iz: 2.15,
    Wely: 185.0, Welz: 25.4, Wply: 221.0, Wplz: 50.2, It: 9.8, Iw: 9800, AL: 0.67,
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'iso-c-240-85', name: 'ISO C 240x85', family: 'ISO-C', standardGroup: 'ISO', standard: 'ISO 657-11',
    h: 240, b: 85, tw: 9.5, tf: 13.0, r: 13.0,
    G: 33.2, A: 42.3, Avz: 24.2, Iy: 3600.0, Iz: 248.0, Ip: 3848.0, iy: 9.22, iz: 2.42,
    Wely: 300.0, Welz: 39.6, Wply: 358.0, Wplz: 78.5, It: 18.4, Iw: 27400, AL: 0.82,
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'iso-c-300-100', name: 'ISO C 300x100', family: 'ISO-C', standardGroup: 'ISO', standard: 'ISO 657-11',
    h: 300, b: 100, tw: 10.0, tf: 16.0, r: 16.0,
    G: 46.2, A: 58.8, Avz: 32.5, Iy: 8030.0, Iz: 495.0, Ip: 8525.0, iy: 11.7, iz: 2.90,
    Wely: 535.0, Welz: 67.8, Wply: 636.0, Wplz: 133.0, It: 38.0, Iw: 85000, AL: 1.01,
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },

  // ===================== ISO SHS (ISO 10799) =====================
  makeISOSHS(40, 3.0),
  makeISOSHS(50, 4.0),
  makeISOSHS(60, 4.0),
  makeISOSHS(70, 5.0),
  makeISOSHS(80, 5.0),
  makeISOSHS(90, 5.0),
  makeISOSHS(100, 6.0),
  makeISOSHS(120, 6.0),
  makeISOSHS(140, 8.0),
  makeISOSHS(150, 8.0),
  makeISOSHS(160, 8.0),
  makeISOSHS(180, 10.0),
  makeISOSHS(200, 10.0),
  makeISOSHS(250, 12.5),

  // ===================== ISO RHS (ISO 10799) =====================
  makeISORHS(80, 40, 4.0),
  makeISORHS(100, 50, 5.0),
  makeISORHS(120, 80, 6.0),
  makeISORHS(140, 80, 6.0),
  makeISORHS(160, 80, 8.0),
  makeISORHS(180, 100, 8.0),
  makeISORHS(200, 100, 10.0),
  makeISORHS(250, 150, 12.0),

  // ===================== ISO CHS (ISO 12633) =====================
  makeISOCHS(48.3, 3.2),
  makeISOCHS(60.3, 3.6),
  makeISOCHS(76.1, 4.0),
  makeISOCHS(88.9, 5.0),
  makeISOCHS(114.3, 6.3),
  makeISOCHS(139.7, 6.3),
  makeISOCHS(168.3, 8.0),
  makeISOCHS(219.1, 10.0),
  makeISOCHS(273.0, 12.5),

  // ===================== ISO L ANGLES (ISO 657-5) =====================
  {
    id: 'iso-l-50x50x5', name: 'ISO L 50x50x5', family: 'ISO-L', standardGroup: 'ISO', standard: 'ISO 657-5',
    h: 50, b: 50, tw: 5.0, tf: 5.0, r: 7.0,
    G: 3.77, A: 4.80, Avz: 2.4, Iy: 11.0, Iz: 11.0, Ip: 22.0, iy: 1.51, iz: 1.51,
    Wely: 3.05, Welz: 3.05, Wply: 5.51, Wplz: 5.51, It: 0.42, Iw: 0, AL: 0.194,
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'iso-l-60x60x6', name: 'ISO L 60x60x6', family: 'ISO-L', standardGroup: 'ISO', standard: 'ISO 657-5',
    h: 60, b: 60, tw: 6.0, tf: 6.0, r: 8.0,
    G: 5.42, A: 6.91, Avz: 3.45, Iy: 22.8, Iz: 22.8, Ip: 45.6, iy: 1.82, iz: 1.82,
    Wely: 5.29, Welz: 5.29, Wply: 9.58, Wplz: 9.58, It: 0.86, Iw: 0, AL: 0.233,
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'iso-l-75x75x8', name: 'ISO L 75x75x8', family: 'ISO-L', standardGroup: 'ISO', standard: 'ISO 657-5',
    h: 75, b: 75, tw: 8.0, tf: 8.0, r: 9.0,
    G: 8.99, A: 11.5, Avz: 5.75, Iy: 59.1, Iz: 59.1, Ip: 118.2, iy: 2.27, iz: 2.27,
    Wely: 11.0, Welz: 11.0, Wply: 19.8, Wplz: 19.8, It: 2.45, Iw: 0, AL: 0.292,
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'iso-l-100x100x10', name: 'ISO L 100x100x10', family: 'ISO-L', standardGroup: 'ISO', standard: 'ISO 657-5',
    h: 100, b: 100, tw: 10.0, tf: 10.0, r: 12.0,
    G: 15.0, A: 19.2, Avz: 9.6, Iy: 177.0, Iz: 177.0, Ip: 354.0, iy: 3.04, iz: 3.04,
    Wely: 24.6, Welz: 24.6, Wply: 44.5, Wplz: 44.5, It: 6.4, Iw: 0, AL: 0.39,
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'iso-l-120x120x12', name: 'ISO L 120x120x12', family: 'ISO-L', standardGroup: 'ISO', standard: 'ISO 657-5',
    h: 120, b: 120, tw: 12.0, tf: 12.0, r: 13.0,
    G: 21.6, A: 27.5, Avz: 13.75, Iy: 368.0, Iz: 368.0, Ip: 736.0, iy: 3.66, iz: 3.66,
    Wely: 42.7, Welz: 42.7, Wply: 78.4, Wplz: 78.4, It: 13.9, Iw: 0, AL: 0.467,
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'iso-l-150x150x15', name: 'ISO L 150x150x15', family: 'ISO-L', standardGroup: 'ISO', standard: 'ISO 657-5',
    h: 150, b: 150, tw: 15.0, tf: 15.0, r: 16.0,
    G: 33.8, A: 43.0, Avz: 21.5, Iy: 890.0, Iz: 890.0, Ip: 1780.0, iy: 4.55, iz: 4.55,
    Wely: 83.2, Welz: 83.2, Wply: 153.0, Wplz: 153.0, It: 32.5, Iw: 0, AL: 0.584,
    defaultMechanics: { ...ISO_MECHANICS, fy: 355 },
    curveY: 'b', curveZ: 'b', curveLT: 'b'
  },
];
