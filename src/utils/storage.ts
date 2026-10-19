import { Project, UserProfile, CalculationHistoryEntry, StructuralMember } from '../types/project';
import { STEEL_PROFILES } from '../data/steelProfiles';
import { calculateEurocode3 } from './eurocodeEngine';
import { STEEL_GRADES } from '../data/steelGrades';

const STORAGE_KEYS = {
  USER_PROFILE: 'stahleuro_user_profile',
  PROJECTS: 'stahleuro_projects',
  ACTIVE_PROJECT_ID: 'stahleuro_active_project_id',
  HISTORY: 'stahleuro_history',
  PENDING_SYNC: 'stahleuro_pending_sync',
  ROOM_CODE: 'stahleuro_room_code',
};

export const DEFAULT_USER: UserProfile = {
  id: 'usr_default',
  name: 'Ing. Emir Ibrahimović',
  email: 'eibrahimovic@gmail.com',
  title: 'Ovlašteni inženjer građevinarstva',
  licenseNumber: 'HR-G-4921',
  company: 'Statika & Konstrukcije Studio',
  avatarUrl: '/src/assets/images/engineer_avatar_1792413014851.jpg',
};

const DEFAULT_MEMBER_1: StructuralMember = {
  id: 'mem_1',
  projectId: 'proj_1',
  name: 'Glavna krovna rešetka - Pojas',
  mark: 'POS G-101',
  profileId: 'ipe-300',
  gradeName: 'S355',
  loads: {
    Ned: 140,      // 140 kN compression
    Myed: 85,      // 85 kNm
    Mzed: 12,      // 12 kNm
    Vzed: 65,      // 65 kN
    L: 6.0,        // 6m span
    Lcry: 6.0,
    Lcrz: 3.0,     // Lateral restraints at mid-span
    Llt: 3.0,
    deflectionLimit: 300,
    q: 18,         // 18 kN/m
    F: 25,         // 25 kN
  },
  updatedAt: new Date().toISOString(),
  updatedBy: 'Ing. Emir Ibrahimović',
  notes: 'Krovni nosač iznad proizvodne hale. Pripadajući razmak rešetki b = 6.0m.',
};

const DEFAULT_MEMBER_2: StructuralMember = {
  id: 'mem_2',
  projectId: 'proj_1',
  name: 'Glavni stup hale - Portalni okvir',
  mark: 'POS S-1',
  profileId: 'hea-260',
  gradeName: 'S355',
  loads: {
    Ned: 380,      // 380 kN compression
    Myed: 110,     // 110 kNm
    Mzed: 15,
    Vzed: 45,
    L: 7.2,        // 7.2m height
    Lcry: 7.2,
    Lcrz: 3.6,
    Llt: 3.6,
    deflectionLimit: 250,
    q: 5,
    F: 0,
  },
  updatedAt: new Date().toISOString(),
  updatedBy: 'Ing. Emir Ibrahimović',
  notes: 'Rubni stup portalnog okvira hale. Uključeno opterećenje vjetrom i kranom.',
};

const DEFAULT_PROJECT: Project = {
  id: 'proj_1',
  title: 'Industrijska Proizvodna Hala Zagreb',
  code: 'HALA-ZG-2026',
  location: 'Zagreb - Lučko, Poslovna zona',
  client: 'Logistika Centar d.o.o.',
  description: 'Čelična konstrukcija proizvodno-skladišne hale raspona 24m s krovnim rožnjačama i portalnim okvirima.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  members: [DEFAULT_MEMBER_1, DEFAULT_MEMBER_2],
  isSyncedWithCloud: true,
  version: 1,
};

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading user profile:', e);
  }
  return DEFAULT_USER;
}

export function saveUserProfile(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
  } catch (e) {
    console.error('Error saving user profile:', e);
  }
}

export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading projects:', e);
  }
  // Initialize default
  saveProjects([DEFAULT_PROJECT]);
  return [DEFAULT_PROJECT];
}

export function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Error saving projects:', e);
  }
}

export function loadActiveProjectId(): string {
  try {
    const id = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT_ID);
    if (id) return id;
  } catch (e) {}
  return DEFAULT_PROJECT.id;
}

export function saveActiveProjectId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT_ID, id);
  } catch (e) {}
}

export function loadCalculationHistory(): CalculationHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error loading history:', e);
  }
  
  // Seed with initial realistic calculation log
  const initialProfile = STEEL_PROFILES.find(p => p.id === 'ipe-300') || STEEL_PROFILES[0];
  const initialGrade = STEEL_GRADES.S355;
  const initialRes = calculateEurocode3(initialProfile, initialGrade, DEFAULT_MEMBER_1.loads);
  
  const seedEntry: CalculationHistoryEntry = {
    id: 'hist_seed_1',
    timestamp: new Date().toISOString(),
    projectId: DEFAULT_PROJECT.id,
    projectName: DEFAULT_PROJECT.title,
    memberMark: DEFAULT_MEMBER_1.mark,
    profileName: initialProfile.name,
    gradeName: initialGrade.name,
    Ned: DEFAULT_MEMBER_1.loads.Ned,
    Myed: DEFAULT_MEMBER_1.loads.Myed,
    Vzed: DEFAULT_MEMBER_1.loads.Vzed,
    criticalRatio: initialRes.criticalRatio,
    isSatisfied: initialRes.isSatisfied,
    governingCheck: initialRes.governingCheck,
    author: DEFAULT_USER.name,
  };

  saveCalculationHistory([seedEntry]);
  return [seedEntry];
}

export function saveCalculationHistory(history: CalculationHistoryEntry[]): void {
  try {
    // Keep last 100 entries
    const trimmed = history.slice(0, 100);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Error saving history:', e);
  }
}

export function addHistoryEntry(entry: Omit<CalculationHistoryEntry, 'id' | 'timestamp'>): CalculationHistoryEntry {
  const fullEntry: CalculationHistoryEntry = {
    ...entry,
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  const list = loadCalculationHistory();
  const updated = [fullEntry, ...list];
  saveCalculationHistory(updated);
  return fullEntry;
}

export function loadPendingSyncQueue(): any[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PENDING_SYNC);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

export function savePendingSyncQueue(queue: any[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(queue));
  } catch (e) {}
}

export function loadRoomCode(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.ROOM_CODE) || 'HALA-26';
  } catch (e) {
    return 'HALA-26';
  }
}

export function saveRoomCode(code: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ROOM_CODE, code);
  } catch (e) {}
}
