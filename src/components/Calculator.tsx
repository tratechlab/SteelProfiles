import React, { useState, useMemo } from 'react';
import {
  SteelProfile,
  SteelGrade,
  CalculationLoads,
  SteelGradeName,
} from '../types/steel';
import { STEEL_PROFILES } from '../data/steelProfiles';
import { STEEL_GRADES, getEffectiveMechanicalProperties } from '../data/steelGrades';
import { calculateEurocode3 } from '../utils/eurocodeEngine';
import { exportCalculationToPDF } from '../utils/pdfExport';
import { Project, StructuralMember, UserProfile } from '../types/project';
import { ProfileViewer2D } from './ProfileViewer2D';
import { Translations, Language, TRANSLATIONS } from '../i18n/translations';
import {
  FileDown,
  Save,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

interface CalculatorProps {
  currentProfile: SteelProfile;
  onChangeProfile: (profile: SteelProfile) => void;
  activeProject?: Project;
  activeMember?: StructuralMember;
  userProfile?: UserProfile;
  onSaveToProject?: (loads: CalculationLoads, profile: SteelProfile, grade: SteelGrade) => void;
  onSaveToHistory?: (loads: CalculationLoads, profile: SteelProfile, grade: SteelGrade) => void;
  t?: Translations;
  lang?: Language;
  initialGradeName?: SteelGradeName;
}

export const Calculator: React.FC<CalculatorProps> = ({
  currentProfile,
  onChangeProfile,
  activeProject,
  activeMember,
  userProfile,
  onSaveToProject,
  onSaveToHistory,
  t: propsT,
  lang = 'en',
  initialGradeName,
}) => {
  const t = propsT || TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Steel grade selection - mechanical properties depend on this material!
  const [selectedGradeName, setSelectedGradeName] = useState<SteelGradeName>(() => {
    if (initialGradeName) return initialGradeName;
    if (currentProfile.standardGroup === 'ASTM') return 'A992';
    if (currentProfile.standardGroup === 'DIN') return 'St37_2';
    if (currentProfile.standardGroup === 'ISO') return 'ISO_E355';
    return 'S355';
  });

  // Design loads state
  const [loads, setLoads] = useState<CalculationLoads>(() => {
    if (activeMember?.loads) {
      return { ...activeMember.loads };
    }
    return {
      Ned: 120, // kN (compression)
      Myed: 85, // kNm
      Mzed: 10, // kNm
      Vzed: 65, // kN
      L: 6.0, // 6m
      Lcry: 6.0,
      Lcrz: 3.0,
      Llt: 3.0,
      deflectionLimit: 300,
      q: 18,
      F: 20,
    };
  });

  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'STEP_BY_STEP' | 'CROSS_SECTION'>('SUMMARY');
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  const currentGrade = STEEL_GRADES[selectedGradeName] || STEEL_GRADES.S355;

  // Real-time calculation result
  const result = useMemo(() => {
    return calculateEurocode3(currentProfile, currentGrade, loads);
  }, [currentProfile, currentGrade, loads]);

  const effectiveProps = useMemo(() => {
    return getEffectiveMechanicalProperties(currentGrade, currentProfile.tf);
  }, [currentGrade, currentProfile.tf]);

  const handleLoadChange = (key: keyof CalculationLoads, value: number) => {
    setLoads((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === 'L') {
        if (prev.Lcry === prev.L) updated.Lcry = value;
        if (prev.Lcrz === prev.L) updated.Lcrz = value;
        if (prev.Llt === prev.L) updated.Llt = value;
      }
      return updated;
    });
  };

  const handleExportPDF = () => {
    exportCalculationToPDF(result, activeProject, activeMember, userProfile);
  };

  const handleSaveProject = () => {
    if (onSaveToProject) {
      onSaveToProject(loads, currentProfile, currentGrade);
      setSavedFeedback('Proračun uspješno spremljen u projekt!');
      setTimeout(() => setSavedFeedback(null), 3000);
    }
  };

  const handleSaveHistory = () => {
    if (onSaveToHistory) {
      onSaveToHistory(loads, currentProfile, currentGrade);
      setSavedFeedback('Zabilježeno u inženjersku povijest!');
      setTimeout(() => setSavedFeedback(null), 3000);
    }
  };

  // Find next stronger profile in same family for quick auto-recommendation
  const strongerProfile = useMemo(() => {
    const sameFamily = STEEL_PROFILES.filter((p) => p.family === currentProfile.family);
    const currentIndex = sameFamily.findIndex((p) => p.id === currentProfile.id);
    if (currentIndex >= 0 && currentIndex < sameFamily.length - 1) {
      return sameFamily[currentIndex + 1];
    }
    return null;
  }, [currentProfile]);

  const criticalPercentage = result.criticalRatio * 100;

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>{t.calculatorTab}</span>
              <span className="font-mono text-sky-400">· {currentProfile.name}</span>
            </h2>
            <span
              className={`rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
                result.isSatisfied
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                  : 'bg-red-950 text-red-300 border border-red-800/80'
              }`}
            >
              {result.isSatisfied ? t.satisfies : t.overstressed} (η = {criticalPercentage.toFixed(1)}%)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Eurocode 3 (EN 1993-1-1) · AISC 360 · DIN 18800 · ISO 10721
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {savedFeedback && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 animate-fade-in mr-2">
              <CheckCircle2 className="h-4 w-4" />
              {savedFeedback}
            </span>
          )}

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>{t.exportPdf}</span>
          </button>

          {onSaveToProject && (
            <button
              onClick={handleSaveProject}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/90 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors"
            >
              <Save className="h-3.5 w-3.5 text-sky-400" />
              <span>{t.saveToProject}</span>
            </button>
          )}

          {onSaveToHistory && (
            <button
              onClick={handleSaveHistory}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/90 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors"
            >
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              <span>{t.saveToHistory}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Inputs (Left) + Live Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile Selector & Design Loads (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Profile & Steel Grade Selection Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-blue-400" />
              {t.profile} & {t.materialType}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">{t.profile}:</label>
                <select
                  value={currentProfile.id}
                  onChange={(e) => {
                    const found = STEEL_PROFILES.find((p) => p.id === e.target.value);
                    if (found) onChangeProfile(found);
                  }}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 font-semibold text-white focus:border-blue-500 focus:outline-none"
                >
                  <optgroup label="EN (Europska norma - IPE / HEA / HEB / HEM / SHS / RHS / CHS)">
                    {STEEL_PROFILES.filter((p) => p.standardGroup === 'EN').map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.G} kg/m)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="ISO (Međunarodna norma - ISO I / C / SHS / RHS / CHS / L)">
                    {STEEL_PROFILES.filter((p) => p.standardGroup === 'ISO').map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.G} kg/m)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="ASTM (Američki standard - W / S / C / HSS)">
                    {STEEL_PROFILES.filter((p) => p.standardGroup === 'ASTM').map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.G} kg/m)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="DIN (Njemački standard - IPN / UPN / T)">
                    {STEEL_PROFILES.filter((p) => p.standardGroup === 'DIN').map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.G} kg/m)
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{t.materialType}:</label>
                <select
                  value={selectedGradeName}
                  onChange={(e) => setSelectedGradeName(e.target.value as SteelGradeName)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 font-semibold text-white focus:border-blue-500 focus:outline-none"
                >
                  <optgroup label="Europski EN 10025 (Ugljični)">
                    <option value="S235">S235 (fy = 235 MPa, E = 210 GPa)</option>
                    <option value="S275">S275 (fy = 275 MPa, E = 210 GPa)</option>
                    <option value="S355">S355 (fy = 355 MPa, E = 210 GPa)</option>
                    <option value="S420">S420 TMCP (fy = 420 MPa)</option>
                    <option value="S460">S460 TMCP (fy = 460 MPa)</option>
                  </optgroup>
                  <optgroup label="Visokočvrsti čelici (EN 10025-4/6)">
                    <option value="S500ML">S500ML (fy = 500 MPa)</option>
                    <option value="S690QL">S690QL (fy = 690 MPa)</option>
                  </optgroup>
                  <optgroup label="Međunarodni ISO 630">
                    <option value="ISO_E235">ISO E235 (fy = 235 MPa, E = 205 GPa)</option>
                    <option value="ISO_E275">ISO E275 (fy = 275 MPa, E = 205 GPa)</option>
                    <option value="ISO_E355">ISO E355 (fy = 355 MPa, E = 205 GPa)</option>
                    <option value="ISO_E460">ISO E460 (fy = 460 MPa, E = 205 GPa)</option>
                  </optgroup>
                  <optgroup label="Američki ASTM (A36, A992, A500)">
                    <option value="A36">ASTM A36 (fy = 250 MPa, E = 200 GPa)</option>
                    <option value="A992">ASTM A992 (fy = 345 MPa / 50 ksi)</option>
                    <option value="A500_B">ASTM A500 Gr.B HSS (fy = 315 MPa)</option>
                    <option value="A572_50">ASTM A572 Gr.50 (fy = 345 MPa)</option>
                  </optgroup>
                  <optgroup label="Njemački DIN 17100">
                    <option value="St37_2">DIN St 37-2 (fy = 235 MPa)</option>
                    <option value="St52_3">DIN St 52-3 (fy = 355 MPa)</option>
                  </optgroup>
                  <optgroup label="Nehrđajući Inox (EN 1993-1-4)">
                    <option value="Inox_1_4301">Inox 1.4301 / AISI 304 (fy = 210 MPa)</option>
                    <option value="Inox_1_4404">Inox 1.4404 / AISI 316L (fy = 220 MPa)</option>
                    <option value="Inox_1_4462">Inox 1.4462 Duplex (fy = 450 MPa)</option>
                  </optgroup>
                  <optgroup label="Corten & Aluminij">
                    <option value="S355J2W">Corten S355J2W (fy = 355 MPa)</option>
                    <option value="Al_6082_T6">Aluminij EN AW-6082 T6 (fy = 260 MPa, E = 70 GPa)</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Material Mechanical Properties Live Callout */}
            <div className="rounded-lg bg-blue-950/40 border border-blue-800/60 p-2.5 text-[11px] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sky-300">
                  {currentGrade.displayName}
                </span>
                <span className="font-mono text-slate-400">
                  E = {(currentGrade.E / 1000).toFixed(0)} GPa · G = {(currentGrade.G / 1000).toFixed(0)} GPa
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 text-slate-300 font-mono">
                <span>fy = <strong className="text-emerald-400">{effectiveProps.fy} MPa</strong></span>
                <span>fu = {effectiveProps.fu} MPa</span>
                <span>ρ = {currentGrade.density} kg/m³</span>
                {effectiveProps.isReduced && (
                  <span className="text-amber-400 font-sans text-[10px]">
                    (Uračunato smanjenje fy za tf &gt; 16mm)
                  </span>
                )}
              </div>
            </div>

            {/* Quick Profile Specs Strip */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
              <div>
                <span className="text-slate-500 block">h × b:</span>
                <span className="text-slate-200">{currentProfile.h}×{currentProfile.b} mm</span>
              </div>
              <div>
                <span className="text-slate-500 block">A:</span>
                <span className="text-slate-200">{currentProfile.A} cm²</span>
              </div>
              <div>
                <span className="text-slate-500 block">Iy:</span>
                <span className="text-slate-200">{currentProfile.Iy.toLocaleString()} cm⁴</span>
              </div>
              <div>
                <span className="text-slate-500 block">Wpl,y:</span>
                <span className="text-amber-400 font-bold">{currentProfile.Wply} cm³</span>
              </div>
            </div>
          </div>

          {/* Design Loads Inputs Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {t.designLoads}
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">EN 1993-1-1</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">
                  {t.axialForce}:
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="5"
                    value={loads.Ned}
                    onChange={(e) => handleLoadChange('Ned', parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 font-mono text-white focus:border-blue-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    {loads.Ned > 0 ? t.compression : loads.Ned < 0 ? t.tension : '0'}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  {t.bendingMomentY}:
                </label>
                <input
                  type="number"
                  step="5"
                  value={loads.Myed}
                  onChange={(e) => handleLoadChange('Myed', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 font-mono text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  {t.bendingMomentZ}:
                </label>
                <input
                  type="number"
                  step="1"
                  value={loads.Mzed}
                  onChange={(e) => handleLoadChange('Mzed', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 font-mono text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  {t.shearForce}:
                </label>
                <input
                  type="number"
                  step="5"
                  value={loads.Vzed}
                  onChange={(e) => handleLoadChange('Vzed', parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 font-mono text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-300">
                  Duljina Raspona i Proračunske Duljine Izvijanja
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">{t.spanLength}:</label>
                  <input
                    type="number"
                    step="0.5"
                    value={loads.L}
                    onChange={(e) => handleLoadChange('L', parseFloat(e.target.value) || 1)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-1.5 font-mono text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">{t.bucklingLengthY}:</label>
                  <input
                    type="number"
                    step="0.5"
                    value={loads.Lcry}
                    onChange={(e) => handleLoadChange('Lcry', parseFloat(e.target.value) || 1)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-1.5 font-mono text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">{t.bucklingLengthZ}:</label>
                  <input
                    type="number"
                    step="0.5"
                    value={loads.Lcrz}
                    onChange={(e) => handleLoadChange('Lcrz', parseFloat(e.target.value) || 1)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-1.5 font-mono text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">{t.ltbLength}:</label>
                  <input
                    type="number"
                    step="0.5"
                    value={loads.Llt}
                    onChange={(e) => handleLoadChange('Llt', parseFloat(e.target.value) || 1)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 p-1.5 font-mono text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Serviceability limit state inputs */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 block">
                Uporabivost (SLS) tereti i progibi:
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block">{t.uniformLoad}:</label>
                  <input
                    type="number"
                    step="2"
                    value={loads.q}
                    onChange={(e) => handleLoadChange('q', parseFloat(e.target.value) || 0)}
                    className="w-full rounded border border-slate-700 bg-slate-950 p-1 font-mono text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">{t.pointLoad}:</label>
                  <input
                    type="number"
                    step="5"
                    value={loads.F}
                    onChange={(e) => handleLoadChange('F', parseFloat(e.target.value) || 0)}
                    className="w-full rounded border border-slate-700 bg-slate-950 p-1 font-mono text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">Granica progiba:</label>
                  <select
                    value={loads.deflectionLimit}
                    onChange={(e) => handleLoadChange('deflectionLimit', parseInt(e.target.value))}
                    className="w-full rounded border border-slate-700 bg-slate-950 p-1 font-mono text-white text-xs"
                  >
                    <option value={200}>L / 200 (Krovovi)</option>
                    <option value={250}>L / 250 (Standard)</option>
                    <option value={300}>L / 300 (Stropovi)</option>
                    <option value={350}>L / 350 (Krano staze)</option>
                    <option value={400}>L / 400 (Fasade)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Eurocode 3 Capacity Results (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Utilization Gauge Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t.criticalRatio}
              </span>
              <span className="text-xs font-mono text-sky-400 font-semibold">
                {result.profile.name} · {result.grade.name}
              </span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-3">
                  <span
                    className={`font-mono text-4xl sm:text-5xl font-black tracking-tight ${
                      result.criticalRatio > 1.0
                        ? 'text-red-400'
                        : result.criticalRatio > 0.9
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {criticalPercentage.toFixed(1)}%
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    (η = {result.criticalRatio.toFixed(3)})
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  {t.governingCheck}:{' '}
                  <strong className="text-white underline decoration-slate-600">
                    {result.governingCheck}
                  </strong>
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
                <span
                  className={`inline-block px-3 py-1 text-xs font-bold rounded uppercase tracking-wider ${
                    result.isSatisfied
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                      : 'bg-red-950/80 text-red-300 border border-red-700/60'
                  }`}
                >
                  {result.isSatisfied ? t.satisfies : t.overstressed}
                </span>
                <span className="block text-[11px] text-slate-400 mt-1">
                  {result.isSatisfied
                    ? `${t.remainingCapacity}: ${(100 - criticalPercentage).toFixed(1)}%`
                    : `${t.overloadBy}: ${(criticalPercentage - 100).toFixed(1)}%`}
                </span>
              </div>
            </div>

            {/* Inelastic Tangent Modulus (Et) & Stress Analysis Box */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">{t.totalStress}:</span>
                <span className="text-sm font-mono font-bold text-white tabular-nums">
                  {result.totalStress.toFixed(1)} MPa
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Granica tečenja: {result.effectiveFy} MPa
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">{t.tangentModulus}:</span>
                <span className="text-sm font-mono font-bold text-amber-400 tabular-nums">
                  {(result.calculatedEt / 1000).toFixed(1)} GPa
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {result.totalStress <= 0.6 * result.effectiveFy
                    ? t.elasticState
                    : t.inelasticState}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">{t.crossSectionClass}:</span>
                <span className="text-sm font-mono font-bold text-sky-400">
                  Klasa {result.crossSectionClass}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {result.crossSectionClass <= 2 ? 'Plastična nosivost (Wpl)' : 'Elastična nosivost (Wel)'}
                </span>
              </div>
            </div>

            {/* Auto-Recommendation if overstressed */}
            {!result.isSatisfied && strongerProfile && (
              <div className="mt-3 flex items-center justify-between p-3 rounded-lg bg-red-950/30 border border-red-900/60 text-xs">
                <div className="flex items-center gap-2 text-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                  <span>
                    {t.recommendedProfile}:{' '}
                    <strong>{strongerProfile.name}</strong> ({strongerProfile.G} kg/m)
                  </span>
                </div>
                <button
                  onClick={() => onChangeProfile(strongerProfile)}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold whitespace-nowrap"
                >
                  {t.applyProfile} {strongerProfile.name}
                </button>
              </div>
            )}
          </div>

          {/* Verification Table & Tabs */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-sm overflow-hidden">
            <div className="flex items-center border-b border-slate-800 px-4 pt-2 gap-4">
              <button
                onClick={() => setActiveTab('SUMMARY')}
                className={`py-2 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === 'SUMMARY'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Pojedinačne granične provjere (10 dokaza)
              </button>
              <button
                onClick={() => setActiveTab('CROSS_SECTION')}
                className={`py-2 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === 'CROSS_SECTION'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.preview2D} & Osne Karakteristike
              </button>
            </div>

            {activeTab === 'SUMMARY' ? (
              <div className="p-3 divide-y divide-slate-800/60">
                {result.checks.map((check) => {
                  const checkPercentage = check.ratio * 100;
                  const isOk = check.isSatisfied;

                  return (
                    <div
                      key={check.id}
                      className="py-2.5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{check.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {check.standardClause}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {check.notes || check.formula}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-right">
                        <div className="font-mono text-xs">
                          <span className="text-slate-400">{check.demandValue.toFixed(1)}</span>
                          <span className="text-slate-600"> / </span>
                          <span className="text-slate-200 font-semibold">
                            {check.capacityValue.toFixed(1)} {check.capacityUnit}
                          </span>
                        </div>

                        <div className="w-16 text-right">
                          <span
                            className={`font-mono font-bold text-xs ${
                              check.ratio > 1.0
                                ? 'text-red-400'
                                : check.ratio > 0.9
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {checkPercentage.toFixed(1)}%
                          </span>
                        </div>

                        <div className="w-6 text-center">
                          {isOk ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 inline" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4">
                <ProfileViewer2D
                  profile={currentProfile}
                  calculatedEt={result.calculatedEt}
                  selectedGrade={currentGrade}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
