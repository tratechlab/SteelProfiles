import React from 'react';
import { SteelProfile } from '../types/steel';
import { X, ArrowRight, Trash2, CheckCircle2 } from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: SteelProfile[];
  onRemove: (id: string) => void;
  onSelectForCalculator: (profile: SteelProfile) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  profiles,
  onRemove,
  onSelectForCalculator,
}) => {
  if (!isOpen) return null;

  // Baseline is first profile
  const baseline = profiles[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-5xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">
              Inženjerska Usporedba Čeličnih Profila
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Usporedba geometrijskih, mehaničkih svojstava i ekonomske težine (max 4 profila)
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {profiles.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            Niste odabrali profile za usporedbu. U bazi profila kliknite ikonu za usporedbu pored profila.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="py-3 px-3">Karakteristika</th>
                  {profiles.map((p, idx) => (
                    <th key={p.id} className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="font-sans font-bold text-white text-sm">
                          {p.name}
                        </span>
                        <button
                          onClick={() => onRemove(p.id)}
                          title="Ukloni"
                          className="text-slate-500 hover:text-red-400 p-0.5"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-[10px] text-sky-400 font-normal">
                        [{p.standardGroup}] {p.standard}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {/* Standard and Family */}
                <tr>
                  <td className="py-2 px-3 text-slate-400 font-sans">Serija profila</td>
                  {profiles.map((p) => (
                    <td key={p.id} className="py-2 px-3 text-right text-slate-200">
                      {p.family}
                    </td>
                  ))}
                </tr>

                {/* Dimensions */}
                <tr>
                  <td className="py-2 px-3 text-slate-400 font-sans">Dimenzije h × b (mm)</td>
                  {profiles.map((p) => (
                    <td key={p.id} className="py-2 px-3 text-right text-white font-semibold">
                      {p.h} × {p.b}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-400 font-sans">Debljine tw / tf (mm)</td>
                  {profiles.map((p) => (
                    <td key={p.id} className="py-2 px-3 text-right text-slate-300">
                      {p.tw} / {p.tf}
                    </td>
                  ))}
                </tr>

                {/* Area & Mass */}
                <tr className="bg-slate-950/40">
                  <td className="py-2.5 px-3 text-slate-300 font-sans font-semibold">
                    Težina G (kg/m)
                  </td>
                  {profiles.map((p, idx) => {
                    const diff = baseline ? ((p.G - baseline.G) / baseline.G) * 100 : 0;
                    return (
                      <td key={p.id} className="py-2.5 px-3 text-right text-white font-bold">
                        {p.G.toFixed(1)} kg/m
                        {idx > 0 && (
                          <span
                            className={`block text-[10px] ${
                              diff < 0 ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {diff > 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                <tr>
                  <td className="py-2 px-3 text-slate-400 font-sans">Površina presjeka A (cm²)</td>
                  {profiles.map((p) => (
                    <td key={p.id} className="py-2 px-3 text-right text-slate-200">
                      {p.A.toFixed(1)}
                    </td>
                  ))}
                </tr>

                {/* Moments of inertia */}
                <tr className="bg-slate-950/40">
                  <td className="py-2.5 px-3 text-slate-300 font-sans font-semibold">
                    Moment inercije Iy (cm⁴)
                  </td>
                  {profiles.map((p) => (
                    <td key={p.id} className="py-2.5 px-3 text-right text-sky-400 font-bold">
                      {p.Iy.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-400 font-sans">Moment inercije Iz (cm⁴)</td>
                  {profiles.map((p) => (
                    <td key={p.id} className="py-2 px-3 text-right text-slate-200">
                      {p.Iz.toLocaleString()}
                    </td>
                  ))}
                </tr>

                {/* Section moduli */}
                <tr className="bg-slate-950/40">
                  <td className="py-2.5 px-3 text-slate-300 font-sans font-semibold">
                    Plastični otpor Wpl,y (cm³)
                  </td>
                  {profiles.map((p) => (
                    <td key={p.id} className="py-2.5 px-3 text-right text-amber-400 font-bold">
                      {p.Wply.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-400 font-sans">Elastični otpor Wel,y (cm³)</td>
                  {profiles.map((p) => (
                    <td key={p.id} className="py-2 px-3 text-right text-slate-200">
                      {p.Wely.toLocaleString()}
                    </td>
                  ))}
                </tr>

                {/* Mechanical properties */}
                <tr className="bg-slate-950/40">
                  <td className="py-2.5 px-3 text-slate-300 font-sans font-semibold">
                    Modul elastičnosti E (GPa)
                  </td>
                  {profiles.map((p) => (
                    <td key={p.id} className="py-2.5 px-3 text-right text-sky-300 font-bold">
                      {(p.defaultMechanics.E / 1000).toFixed(0)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 text-slate-400 font-sans">
                    Tangencijalni modul Et (GPa)
                  </td>
                  {profiles.map((p) => (
                    <td key={p.id} className="py-2 px-3 text-right text-amber-300">
                      {(p.defaultMechanics.Et / 1000).toFixed(1)}
                    </td>
                  ))}
                </tr>

                {/* Action button */}
                <tr>
                  <td className="py-3 px-3 text-slate-400 font-sans">Učitaj u proračun</td>
                  {profiles.map((p) => (
                    <td key={p.id} className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          onSelectForCalculator(p);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-sans text-xs font-semibold"
                      >
                        Odaberi profil
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
