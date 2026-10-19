import { SteelProfile, StandardGroup, ProfileFamily } from '../types/steel';
import { EN_PROFILES } from './profiles/enProfiles';
import { ASTM_PROFILES } from './profiles/astmProfiles';
import { DIN_PROFILES } from './profiles/dinProfiles';
import { ISO_PROFILES } from './profiles/isoProfiles';

export const STEEL_PROFILES: SteelProfile[] = [
  ...EN_PROFILES,
  ...ASTM_PROFILES,
  ...DIN_PROFILES,
  ...ISO_PROFILES,
];

export const STANDARD_GROUPS: { group: StandardGroup; label: string; desc: string; count: number }[] = [
  {
    group: 'EN',
    label: 'Europska norma (EN / Eurocode)',
    desc: 'IPE, HEA, HEB, HEM, UPN, L, SHS, RHS, CHS prema EN 10365 / EN 10210 / EN 10056',
    count: EN_PROFILES.length,
  },
  {
    group: 'ASTM',
    label: 'Američki standard (ASTM / AISC)',
    desc: 'W-Shape, S-Shape, C-Shape, HSS prema ASTM A6 / A992 / A36 / A500',
    count: ASTM_PROFILES.length,
  },
  {
    group: 'DIN',
    label: 'Njemački standard (DIN)',
    desc: 'IPN, UPN, T-profili prema DIN 1025-1 / DIN 1026-1 / DIN 1024',
    count: DIN_PROFILES.length,
  },
  {
    group: 'ISO',
    label: 'Međunarodni standard (ISO)',
    desc: 'ISO I-nosači, ISO kanali, ISO šuplji profili prema ISO 657 / ISO 10799 / ISO 12633',
    count: ISO_PROFILES.length,
  },
];

export const PROFILE_FAMILIES_EXTENDED: { family: ProfileFamily; label: string; group: StandardGroup }[] = [
  { family: 'IPE', label: 'IPE (EN)', group: 'EN' },
  { family: 'HEA', label: 'HEA (EN)', group: 'EN' },
  { family: 'HEB', label: 'HEB (EN)', group: 'EN' },
  { family: 'HEM', label: 'HEM (EN)', group: 'EN' },
  { family: 'UPN', label: 'UPN (EN)', group: 'EN' },
  { family: 'L', label: 'L Kutnik (EN)', group: 'EN' },
  { family: 'SHS', label: 'SHS Kvadratna (EN)', group: 'EN' },
  { family: 'RHS', label: 'RHS Pravokutna (EN)', group: 'EN' },
  { family: 'CHS', label: 'CHS Okrugla (EN)', group: 'EN' },
  { family: 'W-SHAPE', label: 'W-Shape (ASTM)', group: 'ASTM' },
  { family: 'S-SHAPE', label: 'S-Shape (ASTM)', group: 'ASTM' },
  { family: 'C-SHAPE', label: 'C-Shape (ASTM)', group: 'ASTM' },
  { family: 'HSS', label: 'HSS Box (ASTM)', group: 'ASTM' },
  { family: 'IPN', label: 'IPN (DIN)', group: 'DIN' },
  { family: 'T', label: 'T-Profil (DIN)', group: 'DIN' },
  { family: 'ISO-I', label: 'ISO I-Nosač', group: 'ISO' },
  { family: 'ISO-C', label: 'ISO Kanal', group: 'ISO' },
  { family: 'ISO-SHS', label: 'ISO Kvadratna (ISO)', group: 'ISO' },
  { family: 'ISO-RHS', label: 'ISO Pravokutna (ISO)', group: 'ISO' },
  { family: 'ISO-CHS', label: 'ISO Okrugla (ISO)', group: 'ISO' },
  { family: 'ISO-L', label: 'ISO Kutnik (ISO)', group: 'ISO' },
];
