import React, { useState } from 'react';
import { CalculationHistoryEntry } from '../types/project';
import { SteelProfile } from '../types/steel';
import { STEEL_PROFILES } from '../data/steelProfiles';
import { Clock, Search, Download, Trash2, ArrowUpRight, CheckCircle2, XCircle } from 'lucide-react';

interface CalculationHistoryProps {
  history: CalculationHistoryEntry[];
  onClearHistory: () => void;
  onSelectHistoricalEntry: (entry: CalculationHistoryEntry, profile: SteelProfile) => void;
}

export const CalculationHistory: React.FC<CalculationHistoryProps> = ({
  history,
  onClearHistory,
  onSelectHistoricalEntry,
}) => {
  const [search, setSearch] = useState('');

  const filtered = history.filter((h) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      h.projectName.toLowerCase().includes(q) ||
      h.memberMark.toLowerCase().includes(q) ||
      h.profileName.toLowerCase().includes(q) ||
      h.author.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = [
      'ID',
      'Datum i Vrijeme',
      'Projekt',
      'Pozicija',
      'Profil',
      'Kvaliteta',
      'N_Ed (kN)',
      'M_y,Ed (kNm)',
      'V_z,Ed (kN)',
      'Iskoristivost (%)',
      'Status',
      'Mjerodavni dokaz',
      'Inženjer',
    ];

    const rows = history.map((h) => [
      h.id,
      new Date(h.timestamp).toLocaleString('hr-HR'),
      `"${h.projectName}"`,
      h.memberMark,
      h.profileName,
      h.gradeName,
      h.Ned,
      h.Myed,
      h.Vzed,
      (h.criticalRatio * 100).toFixed(1),
      h.isSatisfied ? 'ZADOVOLJAVA' : 'PREKORAČENO',
      `"${h.governingCheck}"`,
      `"${h.author}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StahlEuro_Povijest_Proracuna_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <h3 className="text-base font-bold text-white">Povijest Proračuna i Statičkih Dokaza</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Kronološki registar svih proračuna s mogućnošću trenutnog vraćanja u kalkulator
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Filtriraj povijest..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 w-48 focus:outline-none"
            />
          </div>

          <button
            onClick={handleExportCSV}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            Izvoz CSV
          </button>

          <button
            onClick={onClearHistory}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-950/40 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Očisti
          </button>
        </div>
      </div>

      {/* Table of calculations */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/90 shadow-md">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-950 border-b border-slate-800 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-3">Datum & Vrijeme</th>
              <th className="py-3 px-3">Projekt & Pozicija</th>
              <th className="py-3 px-3">Profil & Čelik</th>
              <th className="py-3 px-2 text-right">N_Ed (kN)</th>
              <th className="py-3 px-2 text-right">M_y,Ed (kNm)</th>
              <th className="py-3 px-2 text-right">V_z,Ed (kN)</th>
              <th className="py-3 px-3 text-right">Iskorištenost (η)</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3">Mjerodavni Dokaz</th>
              <th className="py-3 px-3 text-center">Akcija</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-500 font-sans">
                  Povijest proračuna je prazna. Svaki proračun spremljen putem kalkulatora bit će zabilježen ovdje.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const matchedProfile = STEEL_PROFILES.find((p) => p.name === item.profileName);
                const percent = (item.criticalRatio * 100).toFixed(1);

                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400 font-sans whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleString('hr-HR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-2.5 px-3 font-sans whitespace-nowrap">
                      <span className="font-bold text-white block">{item.memberMark}</span>
                      <span className="text-[11px] text-slate-400 truncate max-w-xs block">
                        {item.projectName}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans whitespace-nowrap">
                      <span className="font-semibold text-white block">{item.profileName}</span>
                      <span className="text-[11px] text-sky-400 block">{item.gradeName}</span>
                    </td>
                    <td className="py-2.5 px-2 text-right tabular-nums text-slate-300">
                      {item.Ned > 0 ? `+${item.Ned}` : item.Ned}
                    </td>
                    <td className="py-2.5 px-2 text-right tabular-nums text-slate-300">
                      {item.Myed}
                    </td>
                    <td className="py-2.5 px-2 text-right tabular-nums text-slate-300">
                      {item.Vzed}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold tabular-nums">
                      <span
                        className={
                          item.criticalRatio > 1.0
                            ? 'text-red-400'
                            : item.criticalRatio > 0.9
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }
                      >
                        {percent}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      {item.isSatisfied ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          OK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-red-400">
                          <XCircle className="h-3.5 w-3.5" />
                          Prekoračeno
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-300 text-[11px] whitespace-nowrap">
                      {item.governingCheck}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      {matchedProfile && (
                        <button
                          onClick={() => onSelectHistoricalEntry(item, matchedProfile)}
                          title="Učitaj u kalkulator"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 transition-colors font-sans text-xs font-semibold"
                        >
                          Učitaj
                          <ArrowUpRight className="h-3 w-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
