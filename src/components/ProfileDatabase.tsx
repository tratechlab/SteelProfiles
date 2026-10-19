import React, { useState, useMemo } from 'react';
import { SteelProfile, StandardGroup, ProfileFamily, SteelGradeName } from '../types/steel';
import { STEEL_PROFILES, STANDARD_GROUPS, PROFILE_FAMILIES_EXTENDED } from '../data/steelProfiles';
import { STEEL_GRADES, getEffectiveMechanicalProperties } from '../data/steelGrades';
import { ProfileViewer2D } from './ProfileViewer2D';
import { Translations, Language } from '../i18n/translations';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Calculator,
  ArrowRightLeft,
  Layers,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';

interface ProfileDatabaseProps {
  onSelectProfileForCalculator: (profile: SteelProfile, gradeName?: SteelGradeName) => void;
  onToggleCompare: (profile: SteelProfile) => void;
  compareList: SteelProfile[];
  t: Translations;
  lang: Language;
}

export const ProfileDatabase: React.FC<ProfileDatabaseProps> = ({
  onSelectProfileForCalculator,
  onToggleCompare,
  compareList,
  t,
  lang,
}) => {
  const [selectedStandard, setSelectedStandard] = useState<StandardGroup | 'ALL'>('ALL');
  const [selectedFamily, setSelectedFamily] = useState<ProfileFamily | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Active material selection - mechanical characteristics depend on material!
  const [selectedGradeName, setSelectedGradeName] = useState<SteelGradeName>('S355');

  // Range filters
  const [minHeight, setMinHeight] = useState<number>(0);
  const [maxHeight, setMaxHeight] = useState<number>(1000);
  const [minWeight, setMinWeight] = useState<number>(0);
  const [maxWeight, setMaxWeight] = useState<number>(250);

  // Sorting
  const [sortField, setSortField] = useState<keyof SteelProfile>('h');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Preview profile
  const [previewProfile, setPreviewProfile] = useState<SteelProfile>(STEEL_PROFILES[0]);

  const activeGrade = STEEL_GRADES[selectedGradeName] || STEEL_GRADES.S355;

  // Filtered profiles
  const filteredProfiles = useMemo(() => {
    return STEEL_PROFILES.filter((p) => {
      // Standard group filter
      if (selectedStandard !== 'ALL' && p.standardGroup !== selectedStandard) {
        return false;
      }
      // Family filter
      if (selectedFamily !== 'ALL' && p.family !== selectedFamily) {
        return false;
      }
      // Text search
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesStandard = p.standard.toLowerCase().includes(query);
        const matchesFamily = p.family.toLowerCase().includes(query);
        if (!matchesName && !matchesStandard && !matchesFamily) {
          return false;
        }
      }
      // Dimension range filters
      if (p.h < minHeight || p.h > maxHeight) return false;
      if (p.G < minWeight || p.G > maxWeight) return false;

      return true;
    }).sort((a, b) => {
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortOrder === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [
    selectedStandard,
    selectedFamily,
    searchQuery,
    minHeight,
    maxHeight,
    minWeight,
    maxWeight,
    sortField,
    sortOrder,
  ]);

  const handleSort = (field: keyof SteelProfile) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const isProfileInCompare = (id: string) => compareList.some((p) => p.id === id);

  return (
    <div className="space-y-6">
      {/* Material Selection Banner - Core functionality: mechanical characteristics depend on material */}
      <div className="rounded-xl border border-blue-900/60 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-sky-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                {t.materialType}
              </span>
              <span className="rounded bg-sky-900/60 px-2 py-0.5 text-[10px] font-mono text-sky-300 border border-sky-700/60">
                {activeGrade.standard}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {t.materialNotice}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs text-slate-400 font-medium whitespace-nowrap">
              {t.activeMaterial}:
            </label>
            <select
              value={selectedGradeName}
              onChange={(e) => setSelectedGradeName(e.target.value as SteelGradeName)}
              className="rounded-lg border border-blue-700/60 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white shadow-sm focus:border-blue-500 focus:outline-none"
            >
              <optgroup label="Europski standard EN 10025 (Ugljični čelici)">
                <option value="S235">S235 (fy = 235 MPa, E = 210 GPa)</option>
                <option value="S275">S275 (fy = 275 MPa, E = 210 GPa)</option>
                <option value="S355">S355 (fy = 355 MPa, E = 210 GPa)</option>
                <option value="S420">S420 TMCP (fy = 420 MPa, E = 210 GPa)</option>
                <option value="S460">S460 TMCP (fy = 460 MPa, E = 210 GPa)</option>
              </optgroup>
              <optgroup label="Visokočvrsti čelici (EN 10025-4/6)">
                <option value="S500ML">S500ML (fy = 500 MPa)</option>
                <option value="S690QL">S690QL (fy = 690 MPa)</option>
              </optgroup>
              <optgroup label="Međunarodni standard ISO 630">
                <option value="ISO_E235">ISO E235 (fy = 235 MPa, E = 205 GPa)</option>
                <option value="ISO_E275">ISO E275 (fy = 275 MPa, E = 205 GPa)</option>
                <option value="ISO_E355">ISO E355 (fy = 355 MPa, E = 205 GPa)</option>
                <option value="ISO_E460">ISO E460 (fy = 460 MPa, E = 205 GPa)</option>
              </optgroup>
              <optgroup label="Američki standard ASTM (AISC)">
                <option value="A36">ASTM A36 (fy = 250 MPa, E = 200 GPa)</option>
                <option value="A992">ASTM A992 Gr.50 (fy = 345 MPa, E = 200 GPa)</option>
                <option value="A500_B">ASTM A500 Gr.B HSS (fy = 315 MPa)</option>
                <option value="A572_50">ASTM A572 Gr.50 (fy = 345 MPa)</option>
              </optgroup>
              <optgroup label="Njemački standard DIN 17100">
                <option value="St37_2">DIN St 37-2 (fy = 235 MPa, E = 210 GPa)</option>
                <option value="St52_3">DIN St 52-3 (fy = 355 MPa, E = 210 GPa)</option>
              </optgroup>
              <optgroup label="Nehrđajući / Inox čelici (EN 10088 / EN 1993-1-4)">
                <option value="Inox_1_4301">Inox 1.4301 / AISI 304 (fy = 210 MPa, E = 200 GPa)</option>
                <option value="Inox_1_4404">Inox 1.4404 / AISI 316L (fy = 220 MPa, E = 200 GPa)</option>
                <option value="Inox_1_4462">Inox 1.4462 / Duplex 2205 (fy = 450 MPa, E = 200 GPa)</option>
              </optgroup>
              <optgroup label="Atmosferski čelik / Corten (EN 10025-5)">
                <option value="S355J2W">Corten S355J2W (fy = 355 MPa)</option>
              </optgroup>
              <optgroup label="Konstrukcijski aluminij (Eurocode 9 / EN 1999-1-1)">
                <option value="Al_6082_T6">Aluminij EN AW-6082 T6 (fy = 260 MPa, E = 70 GPa, ρ = 2700 kg/m³)</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Top Controls / Standard Selection Tabs */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Standard Group Segmented Control */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                setSelectedStandard('ALL');
                setSelectedFamily('ALL');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedStandard === 'ALL'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.allStandards} ({STEEL_PROFILES.length})
            </button>
            {STANDARD_GROUPS.map((sg) => (
              <button
                key={sg.group}
                onClick={() => {
                  setSelectedStandard(sg.group);
                  setSelectedFamily('ALL');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  selectedStandard === sg.group
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sg.group === 'EN'
                  ? t.enStandard
                  : sg.group === 'ASTM'
                  ? t.astmStandard
                  : sg.group === 'DIN'
                  ? t.dinStandard
                  : t.isoStandard}{' '}
                ({sg.count})
              </button>
            ))}
          </div>

          {/* Search Box & Advanced Filters Toggle */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                showAdvancedFilters
                  ? 'border-blue-500 bg-blue-950 text-blue-200'
                  : 'border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {t.filters}
            </button>
          </div>
        </div>

        {/* Profile Families Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-800/80">
          <button
            onClick={() => setSelectedFamily('ALL')}
            className={`px-2.5 py-1 text-[11px] rounded transition-colors whitespace-nowrap ${
              selectedFamily === 'ALL'
                ? 'bg-slate-200 text-slate-900 font-bold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800'
            }`}
          >
            {t.allSeries}
          </button>
          {PROFILE_FAMILIES_EXTENDED.filter(
            (f) => selectedStandard === 'ALL' || f.group === selectedStandard
          ).map((fam) => (
            <button
              key={`${fam.group}-${fam.family}`}
              onClick={() => setSelectedFamily(fam.family)}
              className={`px-2.5 py-1 text-[11px] rounded transition-colors whitespace-nowrap ${
                selectedFamily === fam.family
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800'
              }`}
            >
              {fam.label}
            </button>
          ))}
        </div>

        {/* Collapsible Advanced Filters */}
        {showAdvancedFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-lg bg-slate-950 p-4 border border-slate-800 text-xs">
            <div>
              <label className="text-slate-300 block mb-1">
                Visina nosača h (mm): <span className="font-mono text-blue-400 font-semibold">{minHeight} - {maxHeight} mm</span>
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="10"
                  value={maxHeight}
                  onChange={(e) => setMaxHeight(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">
                Težina G (kg/m): <span className="font-mono text-blue-400 font-semibold">{minWeight} - {maxWeight} kg/m</span>
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="5"
                  max="250"
                  step="5"
                  value={maxWeight}
                  onChange={(e) => setMaxWeight(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setMinHeight(0);
                  setMaxHeight(1000);
                  setMinWeight(0);
                  setMaxWeight(250);
                  setSearchQuery('');
                }}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded border border-slate-800 bg-slate-900 w-full"
              >
                {t.resetFilters}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Profiles Table (Left/Center) + 2D Interactive Preview (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Table Area (2 cols) */}
        <div className="xl:col-span-2 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Prikazano <strong className="text-white font-mono">{filteredProfiles.length}</strong> profila ·{' '}
              <span className="text-sky-400 font-semibold">{activeGrade.name}</span> (E = {(activeGrade.E / 1000).toFixed(0)} GPa)
            </span>
            <span className="text-[11px] text-slate-500">
              Kliknite zaglavlje stupca za sortiranje
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/90 shadow-md">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-950/90 border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider font-semibold select-none">
                <tr>
                  <th
                    onClick={() => handleSort('name')}
                    className="py-3 px-3 cursor-pointer hover:text-white whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      {t.profile}
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="py-3 px-2">{t.standard}</th>
                  <th
                    onClick={() => handleSort('h')}
                    className="py-3 px-2 cursor-pointer hover:text-white text-right whitespace-nowrap"
                  >
                    {t.dimensions}
                  </th>
                  <th className="py-3 px-2 text-right whitespace-nowrap">{t.thickness}</th>
                  <th
                    onClick={() => handleSort('A')}
                    className="py-3 px-2 cursor-pointer hover:text-white text-right whitespace-nowrap"
                  >
                    {t.area}
                  </th>
                  <th
                    onClick={() => handleSort('G')}
                    className="py-3 px-2 cursor-pointer hover:text-white text-right whitespace-nowrap"
                  >
                    {t.weight}
                  </th>
                  <th
                    onClick={() => handleSort('Iy')}
                    className="py-3 px-2 cursor-pointer hover:text-white text-right whitespace-nowrap"
                  >
                    {t.inertiaY}
                  </th>
                  <th
                    onClick={() => handleSort('Wely')}
                    className="py-3 px-2 cursor-pointer hover:text-white text-right whitespace-nowrap"
                  >
                    {t.elasticModulus}
                  </th>
                  <th className="py-3 px-2 text-right whitespace-nowrap" title="Granica razvlačenja fy i modul elastičnosti E za odabrani materijal">
                    fy / E (MPa/GPa)
                  </th>
                  <th className="py-3 px-3 text-center whitespace-nowrap">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {filteredProfiles.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-500 font-sans">
                      Nema pronađenih profila za zadane kriterije pretrage.
                    </td>
                  </tr>
                ) : (
                  filteredProfiles.map((p) => {
                    const isSelected = previewProfile.id === p.id;
                    const inCompare = isProfileInCompare(p.id);

                    // Real-time material properties for this specific profile
                    const effective = getEffectiveMechanicalProperties(activeGrade, p.tf);
                    const eGpa = (activeGrade.E / 1000).toFixed(0);
                    // Actual weight recalculation if aluminum (density 2700 vs 7850)
                    const actualWeight = activeGrade.density !== 7850
                      ? ((p.A * activeGrade.density) / 1000).toFixed(1)
                      : p.G.toFixed(1);

                    return (
                      <tr
                        key={p.id}
                        onClick={() => setPreviewProfile(p)}
                        className={`transition-colors cursor-pointer hover:bg-slate-800/60 ${
                          isSelected ? 'bg-blue-950/40 border-l-2 border-blue-500' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-sans font-semibold text-white whitespace-nowrap">
                          {p.name}
                        </td>
                        <td className="py-2.5 px-2 font-sans text-[11px] text-sky-400 whitespace-nowrap">
                          {p.standardGroup}
                        </td>
                        <td className="py-2.5 px-2 text-right tabular-nums whitespace-nowrap">
                          {p.h} × {p.b}
                        </td>
                        <td className="py-2.5 px-2 text-right text-slate-400 tabular-nums whitespace-nowrap">
                          {p.tw} / {p.tf}
                        </td>
                        <td className="py-2.5 px-2 text-right font-medium text-slate-200 tabular-nums">
                          {p.A.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-2 text-right font-semibold text-white tabular-nums">
                          {actualWeight}
                        </td>
                        <td className="py-2.5 px-2 text-right tabular-nums text-slate-300">
                          {p.Iy.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-2 text-right tabular-nums text-amber-300">
                          {p.Wely.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-2 text-right tabular-nums text-emerald-400 text-[11px] whitespace-nowrap">
                          <span className={effective.isReduced ? 'text-amber-400 underline decoration-dotted' : ''}>
                            {effective.fy}
                          </span>{' '}
                          / <span className="text-sky-300">{eGpa}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectProfileForCalculator(p, selectedGradeName);
                              }}
                              title={t.loadToCalculator}
                              className="rounded p-1 text-slate-400 hover:bg-blue-600 hover:text-white transition-colors"
                            >
                              <Calculator className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleCompare(p);
                              }}
                              title={inCompare ? 'Ukloni iz usporedbe' : 'Dodaj u usporedbu'}
                              className={`rounded p-1 transition-colors ${
                                inCompare
                                  ? 'bg-amber-500/30 text-amber-300 hover:bg-amber-500/40'
                                  : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                              }`}
                            >
                              <ArrowRightLeft className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2D Preview & Technical Sheet (1 col) */}
        <div className="space-y-4">
          <ProfileViewer2D
            profile={previewProfile}
            selectedGrade={activeGrade}
          />

          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Brze inženjerske akcije
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => onSelectProfileForCalculator(previewProfile, selectedGradeName)}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition-colors shadow-sm"
              >
                <Calculator className="h-4 w-4" />
                <span>{t.loadToCalculator} ({previewProfile.name})</span>
              </button>

              <button
                onClick={() => onToggleCompare(previewProfile)}
                className={`w-full flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${
                  isProfileInCompare(previewProfile.id)
                    ? 'border-amber-500/60 bg-amber-950/40 text-amber-300'
                    : 'border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <ArrowRightLeft className="h-4 w-4" />
                <span>
                  {isProfileInCompare(previewProfile.id)
                    ? 'Ukloni iz usporedbe'
                    : `${t.compare} (${previewProfile.name})`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
