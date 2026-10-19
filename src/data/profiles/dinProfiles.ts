import { SteelProfile } from '../../types/steel';

const DIN_MECHANICS = {
  E: 210000,
  Et: 16800,
  fy: 235,    // St 37-2 default
  fu: 360,
  G: 81000,
  poisson: 0.3,
  density: 7850,
};

export const DIN_PROFILES: SteelProfile[] = [
  // ===================== IPN PROFILES (DIN 1025-1) =====================
  {
    id: 'ipn-80', name: 'IPN 80', family: 'IPN', standardGroup: 'DIN', standard: 'DIN 1025-1',
    h: 80, b: 42, tw: 3.9, tf: 5.9, r: 3.9,
    G: 5.95, A: 7.58, Avz: 3.58, Iy: 77.8, Iz: 6.29, Ip: 84.09, iy: 3.20, iz: 0.91,
    Wely: 19.5, Welz: 3.00, Wply: 22.8, Wplz: 4.88, It: 0.88, Iw: 85, AL: 0.304,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipn-100', name: 'IPN 100', family: 'IPN', standardGroup: 'DIN', standard: 'DIN 1025-1',
    h: 100, b: 50, tw: 4.5, tf: 6.8, r: 4.5,
    G: 8.32, A: 10.6, Avz: 5.25, Iy: 171.0, Iz: 12.2, Ip: 183.2, iy: 4.01, iz: 1.07,
    Wely: 34.2, Welz: 4.88, Wply: 40.1, Wplz: 7.95, It: 1.55, Iw: 270, AL: 0.370,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipn-120', name: 'IPN 120', family: 'IPN', standardGroup: 'DIN', standard: 'DIN 1025-1',
    h: 120, b: 58, tw: 5.1, tf: 7.7, r: 5.1,
    G: 11.2, A: 14.2, Avz: 7.20, Iy: 328.0, Iz: 21.5, Ip: 349.5, iy: 4.81, iz: 1.23,
    Wely: 54.7, Welz: 7.41, Wply: 64.3, Wplz: 12.1, It: 2.50, Iw: 670, AL: 0.439,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipn-140', name: 'IPN 140', family: 'IPN', standardGroup: 'DIN', standard: 'DIN 1025-1',
    h: 140, b: 66, tw: 5.7, tf: 8.6, r: 5.7,
    G: 14.4, A: 18.3, Avz: 9.42, Iy: 573.0, Iz: 35.2, Ip: 608.2, iy: 5.61, iz: 1.40,
    Wely: 81.9, Welz: 10.7, Wply: 96.4, Wplz: 17.5, It: 3.86, Iw: 1480, AL: 0.505,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipn-160', name: 'IPN 160', family: 'IPN', standardGroup: 'DIN', standard: 'DIN 1025-1',
    h: 160, b: 74, tw: 6.3, tf: 9.5, r: 6.3,
    G: 17.9, A: 22.8, Avz: 11.85, Iy: 935.0, Iz: 54.7, Ip: 989.7, iy: 6.40, iz: 1.55,
    Wely: 117.0, Welz: 14.8, Wply: 138.0, Wplz: 24.3, It: 5.60, Iw: 2970, AL: 0.575,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipn-180', name: 'IPN 180', family: 'IPN', standardGroup: 'DIN', standard: 'DIN 1025-1',
    h: 180, b: 82, tw: 6.9, tf: 10.4, r: 6.9,
    G: 21.9, A: 27.9, Avz: 14.54, Iy: 1450.0, Iz: 81.3, Ip: 1531.3, iy: 7.20, iz: 1.71,
    Wely: 161.0, Welz: 19.8, Wply: 190.0, Wplz: 32.7, It: 7.74, Iw: 5970, AL: 0.640,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipn-200', name: 'IPN 200', family: 'IPN', standardGroup: 'DIN', standard: 'DIN 1025-1',
    h: 200, b: 90, tw: 7.5, tf: 11.3, r: 7.5,
    G: 26.3, A: 33.5, Avz: 17.51, Iy: 2140.0, Iz: 117.0, Ip: 2257.0, iy: 8.00, iz: 1.87,
    Wely: 214.0, Welz: 26.0, Wply: 252.0, Wplz: 43.1, It: 10.4, Iw: 10300, AL: 0.709,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipn-220', name: 'IPN 220', family: 'IPN', standardGroup: 'DIN', standard: 'DIN 1025-1',
    h: 220, b: 98, tw: 8.1, tf: 12.2, r: 8.1,
    G: 31.1, A: 39.6, Avz: 20.78, Iy: 3060.0, Iz: 162.0, Ip: 3222.0, iy: 8.80, iz: 2.02,
    Wely: 278.0, Welz: 33.1, Wply: 329.0, Wplz: 55.1, It: 14.2, Iw: 17400, AL: 0.775,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipn-240', name: 'IPN 240', family: 'IPN', standardGroup: 'DIN', standard: 'DIN 1025-1',
    h: 240, b: 106, tw: 8.7, tf: 13.1, r: 8.7,
    G: 36.2, A: 46.1, Avz: 24.36, Iy: 4250.0, Iz: 221.0, Ip: 4471.0, iy: 9.59, iz: 2.20,
    Wely: 354.0, Welz: 41.7, Wply: 418.0, Wplz: 69.5, It: 18.8, Iw: 29700, AL: 0.844,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipn-260', name: 'IPN 260', family: 'IPN', standardGroup: 'DIN', standard: 'DIN 1025-1',
    h: 260, b: 113, tw: 9.4, tf: 14.1, r: 9.4,
    G: 41.9, A: 53.4, Avz: 28.53, Iy: 5740.0, Iz: 288.0, Ip: 6028.0, iy: 10.4, iz: 2.32,
    Wely: 442.0, Welz: 51.0, Wply: 524.0, Wplz: 85.3, It: 25.1, Iw: 45700, AL: 0.906,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipn-300', name: 'IPN 300', family: 'IPN', standardGroup: 'DIN', standard: 'DIN 1025-1',
    h: 300, b: 125, tw: 10.8, tf: 16.2, r: 10.8,
    G: 54.2, A: 69.1, Avz: 37.60, Iy: 9800.0, Iz: 451.0, Ip: 10251.0, iy: 11.9, iz: 2.56,
    Wely: 653.0, Welz: 72.2, Wply: 778.0, Wplz: 122.0, It: 41.3, Iw: 93800, AL: 1.03,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipn-360', name: 'IPN 360', family: 'IPN', standardGroup: 'DIN', standard: 'DIN 1025-1',
    h: 360, b: 143, tw: 13.0, tf: 19.5, r: 13.0,
    G: 76.1, A: 97.1, Avz: 54.34, Iy: 19600.0, Iz: 818.0, Ip: 20418.0, iy: 14.2, iz: 2.90,
    Wely: 1090.0, Welz: 114.0, Wply: 1310.0, Wplz: 197.0, It: 80.8, Iw: 238000, AL: 1.21,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },
  {
    id: 'ipn-400', name: 'IPN 400', family: 'IPN', standardGroup: 'DIN', standard: 'DIN 1025-1',
    h: 400, b: 155, tw: 14.4, tf: 21.6, r: 14.4,
    G: 92.6, A: 118.0, Avz: 67.24, Iy: 29200.0, Iz: 1160.0, Ip: 30360.0, iy: 15.7, iz: 3.13,
    Wely: 1460.0, Welz: 149.0, Wply: 1760.0, Wplz: 260.0, It: 117.0, Iw: 407000, AL: 1.33,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'a', curveZ: 'b', curveLT: 'b'
  },

  // ===================== UPN PROFILES (DIN 1026-1) =====================
  {
    id: 'din-upn-80', name: 'UPN 80 (DIN)', family: 'UPN', standardGroup: 'DIN', standard: 'DIN 1026-1',
    h: 80, b: 45, tw: 6.0, tf: 8.0, r: 8.0,
    G: 8.64, A: 11.0, Avz: 5.6, Iy: 106.0, Iz: 19.4, Ip: 125.4, iy: 3.10, iz: 1.33,
    Wely: 26.5, Welz: 6.36, Wply: 31.8, Wplz: 12.3, It: 1.25, Iw: 230, AL: 0.312,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'din-upn-100', name: 'UPN 100 (DIN)', family: 'UPN', standardGroup: 'DIN', standard: 'DIN 1026-1',
    h: 100, b: 50, tw: 6.0, tf: 8.5, r: 8.5,
    G: 10.6, A: 13.5, Avz: 7.2, Iy: 206.0, Iz: 29.3, Ip: 235.3, iy: 3.91, iz: 1.47,
    Wely: 41.2, Welz: 8.49, Wply: 49.3, Wplz: 16.5, It: 1.76, Iw: 540, AL: 0.372,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'din-upn-140', name: 'UPN 140 (DIN)', family: 'UPN', standardGroup: 'DIN', standard: 'DIN 1026-1',
    h: 140, b: 60, tw: 7.0, tf: 10.0, r: 10.0,
    G: 16.0, A: 20.4, Avz: 11.5, Iy: 605.0, Iz: 62.7, Ip: 667.7, iy: 5.45, iz: 1.75,
    Wely: 86.4, Welz: 14.8, Wply: 103.0, Wplz: 28.8, It: 3.96, Iw: 2320, AL: 0.489,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'din-upn-180', name: 'UPN 180 (DIN)', family: 'UPN', standardGroup: 'DIN', standard: 'DIN 1026-1',
    h: 180, b: 70, tw: 8.0, tf: 11.0, r: 11.0,
    G: 22.0, A: 28.0, Avz: 16.4, Iy: 1350.0, Iz: 114.0, Ip: 1464.0, iy: 6.95, iz: 2.02,
    Wely: 150.0, Welz: 22.4, Wply: 179.0, Wplz: 44.0, It: 7.42, Iw: 7290, AL: 0.611,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 'din-upn-240', name: 'UPN 240 (DIN)', family: 'UPN', standardGroup: 'DIN', standard: 'DIN 1026-1',
    h: 240, b: 85, tw: 9.5, tf: 13.0, r: 13.0,
    G: 33.2, A: 42.3, Avz: 26.0, Iy: 3600.0, Iz: 248.0, Ip: 3848.0, iy: 9.22, iz: 2.42,
    Wely: 300.0, Welz: 39.6, Wply: 360.0, Wplz: 78.9, It: 17.5, Iw: 28600, AL: 0.775,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },

  // ===================== T-PROFILES (DIN 1024) =====================
  {
    id: 't-40', name: 'TB 40', family: 'T', standardGroup: 'DIN', standard: 'DIN 1024',
    h: 40, b: 40, tw: 5.0, tf: 5.0, r: 5.0,
    G: 2.96, A: 3.77, Avz: 2.0, Iy: 5.28, Iz: 2.58, Ip: 7.86, iy: 1.18, iz: 0.83,
    Wely: 1.84, Welz: 1.29, Wply: 3.42, Wplz: 2.05, It: 0.32, Iw: 1.5, AL: 0.154,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 't-50', name: 'TB 50', family: 'T', standardGroup: 'DIN', standard: 'DIN 1024',
    h: 50, b: 50, tw: 6.0, tf: 6.0, r: 6.0,
    G: 4.44, A: 5.66, Avz: 3.0, Iy: 12.8, Iz: 6.06, Ip: 18.86, iy: 1.50, iz: 1.03,
    Wely: 3.54, Welz: 2.42, Wply: 6.61, Wplz: 3.86, It: 0.71, Iw: 3.8, AL: 0.193,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 't-60', name: 'TB 60', family: 'T', standardGroup: 'DIN', standard: 'DIN 1024',
    h: 60, b: 60, tw: 7.0, tf: 7.0, r: 7.0,
    G: 6.23, A: 7.94, Avz: 4.2, Iy: 26.2, Iz: 12.2, Ip: 38.4, iy: 1.82, iz: 1.24,
    Wely: 5.96, Welz: 4.07, Wply: 11.2, Wplz: 6.48, It: 1.34, Iw: 8.5, AL: 0.232,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 't-80', name: 'TB 80', family: 'T', standardGroup: 'DIN', standard: 'DIN 1024',
    h: 80, b: 80, tw: 9.0, tf: 9.0, r: 9.0,
    G: 10.7, A: 13.6, Avz: 7.2, Iy: 76.8, Iz: 38.8, Ip: 115.6, iy: 2.37, iz: 1.69,
    Wely: 13.3, Welz: 9.70, Wply: 24.5, Wplz: 15.2, It: 3.82, Iw: 24.5, AL: 0.312,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 't-100', name: 'TB 100', family: 'T', standardGroup: 'DIN', standard: 'DIN 1024',
    h: 100, b: 100, tw: 11.0, tf: 11.0, r: 10.0,
    G: 16.4, A: 20.9, Avz: 11.0, Iy: 185.0, Iz: 91.8, Ip: 276.8, iy: 2.97, iz: 2.10,
    Wely: 25.8, Welz: 18.4, Wply: 47.9, Wplz: 28.9, It: 8.65, Iw: 62.0, AL: 0.389,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
  {
    id: 't-120', name: 'TB 120', family: 'T', standardGroup: 'DIN', standard: 'DIN 1024',
    h: 120, b: 120, tw: 13.0, tf: 13.0, r: 11.0,
    G: 23.2, A: 29.6, Avz: 15.6, Iy: 374.0, Iz: 184.0, Ip: 558.0, iy: 3.56, iz: 2.49,
    Wely: 43.6, Welz: 30.7, Wply: 81.2, Wplz: 48.5, It: 17.2, Iw: 145.0, AL: 0.468,
    defaultMechanics: { ...DIN_MECHANICS, fy: 235 },
    curveY: 'c', curveZ: 'c', curveLT: 'c'
  },
];
