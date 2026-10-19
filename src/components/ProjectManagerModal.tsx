import React, { useState } from 'react';
import { Project, StructuralMember, UserProfile } from '../types/project';
import { SteelProfile } from '../types/steel';
import { STEEL_PROFILES } from '../data/steelProfiles';
import {
  FolderKanban,
  Plus,
  Trash2,
  Cloud,
  CheckCircle2,
  X,
  User,
  Building,
  FileCode,
  Download,
  Upload,
} from 'lucide-react';

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (title: string, code: string, location: string, client: string) => void;
  onDeleteProject: (id: string) => void;
  onAddMember: (projectId: string, name: string, mark: string, profileId: string) => void;
  onDeleteMember: (projectId: string, memberId: string) => void;
  onSelectMemberForCalculator: (member: StructuralMember, profile: SteelProfile) => void;
  userProfile: UserProfile;
  onUpdateUserProfile: (user: UserProfile) => void;
  isOnline: boolean;
  onManualSync: () => void;
  isSyncing: boolean;
}

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onAddMember,
  onDeleteMember,
  onSelectMemberForCalculator,
  userProfile,
  onUpdateUserProfile,
  isOnline,
  onManualSync,
  isSyncing,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'PROJECTS' | 'MEMBERS' | 'USER_PROFILE' | 'BACKUP'>('PROJECTS');

  // New Project Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newClient, setNewClient] = useState('');

  // New Member Form state
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberMark, setNewMemberMark] = useState('POS G-');
  const [newMemberProfileId, setNewMemberProfileId] = useState('ipe-240');

  // User Profile Form
  const [userName, setUserName] = useState(userProfile.name);
  const [userTitle, setUserTitle] = useState(userProfile.title);
  const [userLicense, setUserLicense] = useState(userProfile.licenseNumber);
  const [userCompany, setUserCompany] = useState(userProfile.company);
  const [userProfileSaved, setUserProfileSaved] = useState(false);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const handleCreateNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateProject(newTitle, newCode || `PROJ-${Date.now().toString().slice(-4)}`, newLocation, newClient);
    setNewTitle('');
    setNewCode('');
    setNewLocation('');
    setNewClient('');
  };

  const handleCreateNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberMark.trim()) return;
    onAddMember(activeProject.id, newMemberName, newMemberMark, newMemberProfileId);
    setNewMemberName('');
    setNewMemberMark('POS G-');
  };

  const handleSaveUserProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUserProfile({
      ...userProfile,
      name: userName,
      title: userTitle,
      licenseNumber: userLicense,
      company: userCompany,
    });
    setUserProfileSaved(true);
    setTimeout(() => setUserProfileSaved(false), 2500);
  };

  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user: userProfile,
      projects,
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', jsonStr);
    dlAnchorElem.setAttribute('download', `StahlEuro_Projekti_Backup_${Date.now()}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <FolderKanban className="h-5 w-5 text-blue-500" />
            <div>
              <h3 className="text-base font-bold text-white">Upravljanje Projektima i Pozicijama</h3>
              <p className="text-xs text-slate-400">
                Pohrana proračuna po projektima, sinkronizacija s oblakom i inženjerski profil
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 mt-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('PROJECTS')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'PROJECTS'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Popis Projekata ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('MEMBERS')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'MEMBERS'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Pozicije / Nosači ({activeProject?.members?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('USER_PROFILE')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'USER_PROFILE'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Inženjerski Profil
          </button>
          <button
            onClick={() => setActiveTab('BACKUP')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'BACKUP'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Oblak & Sigurnosna Kopija
          </button>
        </div>

        {/* Tab 1: Projects List */}
        {activeTab === 'PROJECTS' && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {projects.map((proj) => {
                const isActive = proj.id === activeProjectId;
                return (
                  <div
                    key={proj.id}
                    onClick={() => onSelectProject(proj.id)}
                    className={`rounded-xl border p-4 transition-all cursor-pointer ${
                      isActive
                        ? 'border-blue-500 bg-blue-950/20 shadow-md ring-1 ring-blue-500/50'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{proj.title}</span>
                          {isActive && (
                            <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded">
                              AKTIVAN
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-sky-400 block mt-0.5">
                          {proj.code}
                        </span>
                      </div>
                      {projects.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteProject(proj.id);
                          }}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">{proj.description}</p>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-2">
                      <span>Lokacija: {proj.location || 'Nije navedena'}</span>
                      <span className="font-mono text-slate-300 font-semibold">
                        {proj.members?.length || 0} nosača
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Create New Project Form */}
            <form
              onSubmit={handleCreateNewProject}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3"
            >
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-blue-400" />
                Kreiraj Novi Inženjerski Projekt
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Naziv projekta *</label>
                  <input
                    type="text"
                    required
                    placeholder="npr. Poslovni centar Rijeka"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Oznaka projekta (šifra)</label>
                  <input
                    type="text"
                    placeholder="npr. PC-RI-2026"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Lokacija gradilišta</label>
                  <input
                    type="text"
                    placeholder="npr. Rijeka, Industrijska zona"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Investitor / Naručitelj</label>
                  <input
                    type="text"
                    placeholder="npr. Grad Rijeka d.o.o."
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
              </div>

              <div className="text-right pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                >
                  Kreiraj Projekt
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Structural Members within Active Project */}
        {activeTab === 'MEMBERS' && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span>
                Pozicije u projektu: <strong className="text-white">{activeProject.title}</strong>
              </span>
              <span className="font-mono text-sky-400">{activeProject.code}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeProject.members.length === 0 ? (
                <div className="col-span-2 py-8 text-center text-slate-500 text-xs font-sans">
                  Nema dodanih pozicija u ovom projektu. Dodajte poziciju u obrascu ispod.
                </div>
              ) : (
                activeProject.members.map((mem) => {
                  const prof = STEEL_PROFILES.find((p) => p.id === mem.profileId);
                  return (
                    <div
                      key={mem.id}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-bold text-white text-sm block">{mem.mark}</span>
                          <span className="text-xs text-slate-300 block">{mem.name}</span>
                        </div>
                        <button
                          onClick={() => onDeleteMember(activeProject.id, mem.id)}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
                        <span className="text-amber-400 font-semibold">{prof?.name || mem.profileId}</span>
                        <span className="text-sky-400">{mem.gradeName}</span>
                        <span>L = {mem.loads.L}m</span>
                      </div>

                      {prof && (
                        <button
                          onClick={() => {
                            onSelectMemberForCalculator(mem, prof);
                            onClose();
                          }}
                          className="w-full mt-2 rounded bg-slate-800 hover:bg-blue-600 hover:text-white py-1.5 text-center text-xs font-semibold text-slate-200 transition-colors"
                        >
                          Učitaj u kalkulator nosivosti
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Add Member Form */}
            <form
              onSubmit={handleCreateNewMember}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3"
            >
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-emerald-400" />
                Dodaj Novu Statičku Poziciju (Element)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Oznaka pozicije *</label>
                  <input
                    type="text"
                    required
                    placeholder="npr. POS G-102"
                    value={newMemberMark}
                    onChange={(e) => setNewMemberMark(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Opis pozicije *</label>
                  <input
                    type="text"
                    required
                    placeholder="npr. Podrožnjača krova"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Preporučeni profil</label>
                  <select
                    value={newMemberProfileId}
                    onChange={(e) => setNewMemberProfileId(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white font-mono"
                  >
                    {STEEL_PROFILES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.standardGroup})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-right pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                >
                  Dodaj Poziciju
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: User Profile */}
        {activeTab === 'USER_PROFILE' && (
          <form onSubmit={handleSaveUserProfile} className="mt-4 space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950">
              <img
                src={userProfile.avatarUrl}
                alt="Avatar"
                className="h-16 w-16 rounded-full object-cover border-2 border-blue-500"
              />
              <div>
                <h4 className="font-bold text-white text-sm">{userProfile.name}</h4>
                <p className="text-xs text-sky-400">{userProfile.title}</p>
                <p className="text-xs text-slate-400">{userProfile.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Ime i Prezime odgovornog inženjera</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Stručni naziv / Titula</label>
                <input
                  type="text"
                  value={userTitle}
                  onChange={(e) => setUserTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Broj ovlaštenja (HKIG / Komora)</label>
                <input
                  type="text"
                  value={userLicense}
                  onChange={(e) => setUserLicense(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Projektni biro / Tvrtka</label>
                <input
                  type="text"
                  value={userCompany}
                  onChange={(e) => setUserCompany(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              {userProfileSaved ? (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  Inženjerski podaci uspješno spremljeni!
                </span>
              ) : (
                <span className="text-xs text-slate-500">
                  Podaci se automatski umeću u zaglavlje PDF elaborata proračuna.
                </span>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
              >
                Spremi Promjene
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Cloud Sync & Backup */}
        {activeTab === 'BACKUP' && (
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-sky-400" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Sinkronizacija s Oblakom</h4>
                    <p className="text-xs text-slate-400">
                      Automatsko usklađivanje lokalnih gradilišnih podataka i uredske baze
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold ${
                      isOnline
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {isOnline ? 'Online (Oblak Dostupan)' : 'Offline (Rad na Gradilištu)'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 space-y-1">
                <p>
                  <strong>Offline rad na gradilištu:</strong> Svi vaši proračuni i promjene spremaju se lokalno u
                  vaš preglednik i spremni su bez internetske veze.
                </p>
                <p>
                  <strong>Automatska sinkronizacija:</strong> Čim se uspostavi internetska veza (Wi-Fi ili 4G/5G na
                  terenu), svi podaci automatski se sinkroniziraju.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  Status projekta: {activeProject.isSyncedWithCloud ? 'Usklađeno s poslužiteljem' : 'Ima nesinkroniziranih izmjena'}
                </span>
                <button
                  onClick={onManualSync}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                >
                  <Cloud className={`h-3.5 w-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
                  {isSyncing ? 'Sinkroniziram...' : 'Sinkroniziraj Sada'}
                </button>
              </div>
            </div>

            {/* JSON Export / Import */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Download className="h-4 w-4 text-amber-400" />
                Izvoz i Uvoz Sigurnosne Kopije (JSON)
              </h4>

              <p className="text-xs text-slate-400">
                Preuzmite cjelokupnu bazu svih vaših projekata, proračuna i postavki u obliku JSON datoteke za
                arhiviranje ili prijenos na drugi uređaj.
              </p>

              <button
                onClick={handleExportBackup}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700"
              >
                <Download className="h-4 w-4 text-sky-400" />
                Preuzmi Sigurnosnu Kopiju (JSON)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
