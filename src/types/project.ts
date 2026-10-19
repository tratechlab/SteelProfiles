import { CalculationLoads, EurocodeResult, SteelGradeName } from './steel';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  title: string;          // e.g. "Ovlašteni inženjer građevinarstva"
  licenseNumber: string;  // e.g. "G-4892"
  company: string;        // e.g. "Statika Biro d.o.o."
  avatarUrl: string;
}

export interface StructuralMember {
  id: string;
  projectId: string;
  name: string;           // e.g. "Glavna krovna greda"
  mark: string;           // e.g. "POS G-101"
  profileId: string;
  gradeName: SteelGradeName;
  loads: CalculationLoads;
  resultSnapshot?: EurocodeResult;
  updatedAt: string;
  updatedBy: string;
  notes?: string;
}

export interface Project {
  id: string;
  title: string;
  code: string;           // e.g. "PROJ-2026-ZG01"
  location: string;       // e.g. "Zagreb, Poslovna Zona"
  client: string;         // e.g. "Investitor d.o.o."
  description: string;
  createdAt: string;
  updatedAt: string;
  members: StructuralMember[];
  isSyncedWithCloud: boolean;
  version: number;
}

export interface CalculationHistoryEntry {
  id: string;
  timestamp: string;
  projectId: string;
  projectName: string;
  memberMark: string;
  profileName: string;
  gradeName: SteelGradeName;
  Ned: number;
  Myed: number;
  Vzed: number;
  criticalRatio: number;
  isSatisfied: boolean;
  governingCheck: string;
  author: string;
}

export interface ActiveCollaborator {
  id: string;
  name: string;
  role: string;
  color: string;
  activeMemberId?: string;
  lastPing: number;
}

export interface CollaborationMessage {
  type: 'USER_JOIN' | 'USER_LEAVE' | 'PROFILE_CHANGE' | 'LOADS_CHANGE' | 'MEMBER_ADD' | 'MEMBER_DELETE';
  userId: string;
  userName: string;
  userRole: string;
  userColor: string;
  timestamp: string;
  projectId: string;
  memberId?: string;
  data?: any;
}
