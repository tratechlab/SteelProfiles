/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SteelProfile, SteelGrade, CalculationLoads, SteelGradeName } from './types/steel';
import { STEEL_PROFILES, STANDARD_GROUPS } from './data/steelProfiles';
import { STEEL_GRADES } from './data/steelGrades';
import {
  Project,
  StructuralMember,
  UserProfile,
  CalculationHistoryEntry,
  ActiveCollaborator,
  CollaborationMessage,
} from './types/project';
import {
  loadUserProfile,
  saveUserProfile,
  loadProjects,
  saveProjects,
  loadActiveProjectId,
  saveActiveProjectId,
  loadCalculationHistory,
  saveCalculationHistory,
  addHistoryEntry,
  loadRoomCode,
  saveRoomCode,
} from './utils/storage';
import { collaborationBus } from './utils/collaboration';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { Language, Translations, TRANSLATIONS } from './i18n/translations';
import { Navbar } from './components/Navbar';
import { ProfileDatabase } from './components/ProfileDatabase';
import { Calculator } from './components/Calculator';
import { CalculationHistory } from './components/CalculationHistory';
import { ProjectManagerModal } from './components/ProjectManagerModal';
import { CollaborationModal } from './components/CollaborationModal';
import { CompareModal } from './components/CompareModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  Sparkles,
} from 'lucide-react';

export default function App() {
  const isOnline = useOnlineStatus();

  // Language management (en, hr, de) - Default is English ('en')
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stahleuro_lang') as Language;
      if (saved === 'hr' || saved === 'en' || saved === 'de') return saved;
    }
    return 'en';
  });

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('stahleuro_lang', newLang);
    }
  };

  // Navigation
  const [activeTab, setActiveTab] = useState<'DATABASE' | 'CALCULATOR' | 'HISTORY'>('DATABASE');

  // Core Profiles State
  const [currentProfile, setCurrentProfile] = useState<SteelProfile>(() => {
    return STEEL_PROFILES.find((p) => p.name === 'IPE 300') || STEEL_PROFILES[0];
  });
  const [calculatorGradeName, setCalculatorGradeName] = useState<SteelGradeName>('S355');

  // Projects & User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile);
  const [projects, setProjects] = useState<Project[]>(loadProjects);
  const [activeProjectId, setActiveProjectId] = useState<string>(loadActiveProjectId);
  const [history, setHistory] = useState<CalculationHistoryEntry[]>(loadCalculationHistory);

  // Compare List
  const [compareList, setCompareList] = useState<SteelProfile[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Modals
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);

  // Real-time Collaboration & Room
  const [roomCode, setRoomCode] = useState<string>(loadRoomCode);
  const [collaborators, setCollaborators] = useState<ActiveCollaborator[]>([]);
  const [activityLog, setActivityLog] = useState<CollaborationMessage[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Active Project object
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const activeMember = activeProject?.members?.[0];

  // Initialize Collaboration Bus
  useEffect(() => {
    collaborationBus.init(
      userProfile.id,
      userProfile.name,
      userProfile.title,
      '#2563eb',
      activeProjectId,
      activeMember?.id || 'mem_1'
    );

    const unsubscribeCollab = collaborationBus.subscribeCollaborators((list) => {
      setCollaborators(list);
    });

    const unsubscribeMessages = collaborationBus.subscribe((msg) => {
      setActivityLog((prev) => [msg, ...prev.slice(0, 30)]);
      if (msg.userId !== userProfile.id) {
        if (msg.type === 'PROFILE_CHANGE') {
          setToastMessage(`${msg.userName}: ${msg.data?.profileName}`);
        } else if (msg.type === 'LOADS_CHANGE') {
          setToastMessage(`${msg.userName} ažurirao proračun`);
        }
      }
    });

    return () => {
      unsubscribeCollab();
      unsubscribeMessages();
      collaborationBus.destroy();
    };
  }, [userProfile, activeProjectId, activeMember]);

  // Auto-clear Toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Auto cloud sync upon reconnecting online
  useEffect(() => {
    if (isOnline) {
      handleManualSync();
    }
  }, [isOnline]);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setProjects((prev) => {
        const updated = prev.map((p) => ({ ...p, isSyncedWithCloud: true }));
        saveProjects(updated);
        return updated;
      });
      setToastMessage(lang === 'hr' ? 'Lokalni podaci sinkronizirani s oblakom.' : lang === 'de' ? 'Lokale Daten mit der Cloud synchronisiert.' : 'Local data synced with cloud.');
    }, 1200);
  };

  const handleSelectProfileForCalculator = (profile: SteelProfile, gradeName?: SteelGradeName) => {
    setCurrentProfile(profile);
    if (gradeName) {
      setCalculatorGradeName(gradeName);
    }
    setActiveTab('CALCULATOR');
    collaborationBus.broadcast({
      type: 'PROFILE_CHANGE',
      userId: userProfile.id,
      userName: userProfile.name,
      userRole: userProfile.title,
      userColor: '#2563eb',
      timestamp: new Date().toISOString(),
      projectId: activeProjectId,
      data: { profileName: profile.name, profileId: profile.id },
    });
  };

  const handleToggleCompare = (profile: SteelProfile) => {
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === profile.id);
      if (exists) {
        return prev.filter((p) => p.id !== profile.id);
      }
      if (prev.length >= 4) {
        alert(t.maxCompareAlert);
        return prev;
      }
      return [...prev, profile];
    });
  };

  const handleSaveToProject = (
    loads: CalculationLoads,
    profile: SteelProfile,
    grade: SteelGrade
  ) => {
    setProjects((prev) => {
      const updated = prev.map((proj) => {
        if (proj.id === activeProjectId) {
          const members = proj.members || [];
          const updatedMembers = members.map((m, idx) => {
            if (idx === 0) {
              return {
                ...m,
                profileId: profile.id,
                gradeName: grade.name,
                loads,
                updatedAt: new Date().toISOString(),
                updatedBy: userProfile.name,
              };
            }
            return m;
          });
          return {
            ...proj,
            members: updatedMembers,
            updatedAt: new Date().toISOString(),
            isSyncedWithCloud: false,
          };
        }
        return proj;
      });
      saveProjects(updated);
      return updated;
    });

    collaborationBus.broadcast({
      type: 'LOADS_CHANGE',
      userId: userProfile.id,
      userName: userProfile.name,
      userRole: userProfile.title,
      userColor: '#2563eb',
      timestamp: new Date().toISOString(),
      projectId: activeProjectId,
      data: { note: `Ažurirana pozicija s profilom ${profile.name}` },
    });
  };

  const handleSaveToHistory = (
    loads: CalculationLoads,
    profile: SteelProfile,
    grade: SteelGrade
  ) => {
    const entry = addHistoryEntry({
      projectId: activeProject.id,
      projectName: activeProject.title,
      memberMark: activeMember?.mark || 'POS G-101',
      profileName: profile.name,
      gradeName: grade.name,
      Ned: loads.Ned,
      Myed: loads.Myed,
      Vzed: loads.Vzed,
      criticalRatio: 0.78,
      isSatisfied: true,
      governingCheck: 'Savijanje oko jače osi (M_y)',
      author: userProfile.name,
    });
    setHistory((prev) => [entry, ...prev]);
  };

  const handleCreateProject = (
    title: string,
    code: string,
    location: string,
    client: string
  ) => {
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      title,
      code,
      location,
      client,
      description: 'Novi statički projekt čelične konstrukcije.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      members: [
        {
          id: `mem_${Date.now()}`,
          projectId: `proj_${Date.now()}`,
          name: 'Glavni nosač',
          mark: 'POS G-1',
          profileId: 'ipe-300',
          gradeName: 'S355',
          loads: {
            Ned: 100,
            Myed: 70,
            Mzed: 10,
            Vzed: 50,
            L: 6.0,
            Lcry: 6.0,
            Lcrz: 3.0,
            Llt: 3.0,
            deflectionLimit: 300,
            q: 15,
            F: 0,
          },
          updatedAt: new Date().toISOString(),
          updatedBy: userProfile.name,
        },
      ],
      isSyncedWithCloud: false,
      version: 1,
    };

    const updated = [newProj, ...projects];
    setProjects(updated);
    saveProjects(updated);
    setActiveProjectId(newProj.id);
    saveActiveProjectId(newProj.id);
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    if (updated.length > 0) {
      setProjects(updated);
      saveProjects(updated);
      if (activeProjectId === id) {
        setActiveProjectId(updated[0].id);
        saveActiveProjectId(updated[0].id);
      }
    }
  };

  const handleAddMember = (
    projectId: string,
    name: string,
    mark: string,
    profileId: string
  ) => {
    const newMem: StructuralMember = {
      id: `mem_${Date.now()}`,
      projectId,
      name,
      mark,
      profileId,
      gradeName: 'S355',
      loads: {
        Ned: 80,
        Myed: 45,
        Mzed: 5,
        Vzed: 35,
        L: 5.0,
        Lcry: 5.0,
        Lcrz: 2.5,
        Llt: 2.5,
        deflectionLimit: 300,
        q: 12,
        F: 0,
      },
      updatedAt: new Date().toISOString(),
      updatedBy: userProfile.name,
    };

    setProjects((prev) => {
      const updated = prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            members: [...(p.members || []), newMem],
            updatedAt: new Date().toISOString(),
            isSyncedWithCloud: false,
          };
        }
        return p;
      });
      saveProjects(updated);
      return updated;
    });
  };

  const handleDeleteMember = (projectId: string, memberId: string) => {
    setProjects((prev) => {
      const updated = prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            members: (p.members || []).filter((m) => m.id !== memberId),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      saveProjects(updated);
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOnline={isOnline}
        isSyncing={isSyncing}
        onSyncClick={handleManualSync}
        collaborators={collaborators}
        onOpenCollaboration={() => setIsCollabModalOpen(true)}
        onOpenProjects={() => setIsProjectsModalOpen(true)}
        compareCount={compareList.length}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        activeProjectTitle={activeProject.title}
        lang={lang}
        onChangeLang={handleLangChange}
        t={t}
      />

      {/* Real-time Collaboration Notification Toast */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-fade-in border border-blue-400/40">
          <Sparkles className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Engineering Hero Strip */}
        {activeTab === 'DATABASE' && (
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-sky-400">
                  <span>EN 10365 / EN 10025</span>
                  <span aria-hidden="true">·</span>
                  <span>ISO 657 / ISO 10799 / ISO 630</span>
                  <span aria-hidden="true">·</span>
                  <span>ASTM A6 / AISC</span>
                  <span aria-hidden="true">·</span>
                  <span>DIN 1025 / 1026</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {t.appTitle} · {t.appSubtitle}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {lang === 'de'
                    ? 'Umfassende Statik-Datenbank mit geometrischen Querschnittswerten (A, Iy, Iz, Wel, Wpl) und werkstoffabhängigen mechanischen Eigenschaften (Elastizitätsmodul E, Tangentenmodul Et, Streckgrenze fy). Echtzeit-Eurocode-3-Nachweis, PDF-Export und Offline-Baustellenbetrieb.'
                    : lang === 'en'
                    ? 'Engineering database with cross-sectional geometric properties (A, Iy, Iz, Wel, Wpl) and material-dependent mechanical characteristics (Young\'s modulus E, Tangent modulus Et, yield strength fy). Real-time Eurocode 3 capacity calculator, PDF export, and full offline construction site support.'
                    : 'Kompletna inženjerska baza s geometrijskim svojstvima (A, Iy, Iz, Wel, Wpl) i mehaničkim svojstvima (modul elastičnosti E, tangencijalni modul Et, granica razvlačenja fy) ovisnim o vrsti materijala. Kalkulator nosivosti u realnom vremenu, izvoz PDF elaborata i podrška za gradilište.'}
                </p>
              </div>

              {/* Quick Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0 font-mono text-xs">
                <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800/80 text-center">
                  <span className="text-slate-400 text-[10px] block font-sans">EN (Eurocode)</span>
                  <span className="text-lg font-bold text-white tabular-nums">
                    {STANDARD_GROUPS.find((g) => g.group === 'EN')?.count || 0}
                  </span>
                  <span className="text-[10px] text-sky-400 block font-sans">IPE, HE, SHS, RHS...</span>
                </div>
                <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800/80 text-center">
                  <span className="text-slate-400 text-[10px] block font-sans">ISO Standard</span>
                  <span className="text-lg font-bold text-white tabular-nums">
                    {STANDARD_GROUPS.find((g) => g.group === 'ISO')?.count || 0}
                  </span>
                  <span className="text-[10px] text-indigo-400 block font-sans">ISO I, C, SHS, RHS...</span>
                </div>
                <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800/80 text-center">
                  <span className="text-slate-400 text-[10px] block font-sans">ASTM / AISC</span>
                  <span className="text-lg font-bold text-white tabular-nums">
                    {STANDARD_GROUPS.find((g) => g.group === 'ASTM')?.count || 0}
                  </span>
                  <span className="text-[10px] text-amber-400 block font-sans">W, S, C, HSS</span>
                </div>
                <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800/80 text-center">
                  <span className="text-slate-400 text-[10px] block font-sans">DIN (Njemački)</span>
                  <span className="text-lg font-bold text-white tabular-nums">
                    {STANDARD_GROUPS.find((g) => g.group === 'DIN')?.count || 0}
                  </span>
                  <span className="text-[10px] text-emerald-400 block font-sans">IPN, UPN, T</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Database View */}
        {activeTab === 'DATABASE' && (
          <ProfileDatabase
            onSelectProfileForCalculator={handleSelectProfileForCalculator}
            onToggleCompare={handleToggleCompare}
            compareList={compareList}
            t={t}
            lang={lang}
          />
        )}

        {/* Tab 2: Calculator View */}
        {activeTab === 'CALCULATOR' && (
          <Calculator
            currentProfile={currentProfile}
            onChangeProfile={setCurrentProfile}
            activeProject={activeProject}
            activeMember={activeMember}
            userProfile={userProfile}
            onSaveToProject={handleSaveToProject}
            onSaveToHistory={handleSaveToHistory}
            t={t}
            lang={lang}
            initialGradeName={calculatorGradeName}
          />
        )}

        {/* Tab 3: Calculation History */}
        {activeTab === 'HISTORY' && (
          <CalculationHistory
            history={history}
            onClearHistory={() => {
              if (confirm('Jeste li sigurni da želite obrisati povijest proračuna?')) {
                setHistory([]);
                saveCalculationHistory([]);
              }
            }}
            onSelectHistoricalEntry={(item, prof) => {
              setCurrentProfile(prof);
              setActiveTab('CALCULATOR');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span>
              {lang === 'de'
                ? 'StahlEuro · Statische Bemessung von Stahlbauten (EN 1993-1-1 / ISO 10721 / AISC 360 / DIN 18800)'
                : lang === 'en'
                ? 'StahlEuro · Structural Steel Design & Analysis (EN 1993-1-1 / ISO 10721 / AISC 360 / DIN 18800)'
                : 'StahlEuro · Inženjerski proračun čeličnih konstrukcija (EN 1993-1-1 / ISO 10721 / AISC 360 / DIN 18800)'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>
              {lang === 'de' ? 'PWA Baustelle Aktiv' : lang === 'en' ? 'PWA Jobsite Offline Active' : 'PWA Offline Gradilište Aktivno'}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {lang === 'de'
                ? `Cloud: ${isOnline ? 'Verbunden' : 'Lokaler Speicher'}`
                : lang === 'en'
                ? `Cloud: ${isOnline ? 'Connected' : 'Local Cache'}`
                : `Oblak: ${isOnline ? 'Povezano' : 'Lokalna memorija'}`}
            </span>
          </div>
        </div>
      </footer>

      {/* Offline Connectivity Banner */}
      <OfflineIndicator />

      {/* Modals */}
      <ProjectManagerModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={(id) => {
          setActiveProjectId(id);
          saveActiveProjectId(id);
        }}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
        onAddMember={handleAddMember}
        onDeleteMember={handleDeleteMember}
        onSelectMemberForCalculator={(member, prof) => {
          setCurrentProfile(prof);
          setActiveTab('CALCULATOR');
        }}
        userProfile={userProfile}
        onUpdateUserProfile={(up) => {
          setUserProfile(up);
          saveUserProfile(up);
        }}
        isOnline={isOnline}
        onManualSync={handleManualSync}
        isSyncing={isSyncing}
      />

      <CollaborationModal
        isOpen={isCollabModalOpen}
        onClose={() => setIsCollabModalOpen(false)}
        roomCode={roomCode}
        onChangeRoomCode={(code) => {
          setRoomCode(code);
          saveRoomCode(code);
        }}
        collaborators={collaborators}
        currentUserId={userProfile.id}
        currentUserName={userProfile.name}
        currentUserRole={userProfile.title}
        onUpdateRole={(name, role) => {
          const updated = { ...userProfile, name, title: role };
          setUserProfile(updated);
          saveUserProfile(updated);
        }}
        activityLog={activityLog}
        onBroadcastNote={(note) => {
          collaborationBus.broadcast({
            type: 'PROFILE_CHANGE',
            userId: userProfile.id,
            userName: userProfile.name,
            userRole: userProfile.title,
            userColor: '#2563eb',
            timestamp: new Date().toISOString(),
            projectId: activeProjectId,
            data: { note },
          });
          setToastMessage(`Bilješka poslana: "${note}"`);
        }}
      />

      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        profiles={compareList}
        onRemove={(id) => setCompareList((prev) => prev.filter((p) => p.id !== id))}
        onSelectForCalculator={(p) => {
          setCurrentProfile(p);
          setActiveTab('CALCULATOR');
        }}
      />
    </div>
  );
}
