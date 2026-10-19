import React, { useState } from 'react';
import { ActiveCollaborator, CollaborationMessage } from '../types/project';
import { Users, Copy, Check, Radio, Send, X, ShieldCheck } from 'lucide-react';

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
  onChangeRoomCode: (code: string) => void;
  collaborators: ActiveCollaborator[];
  currentUserId: string;
  currentUserName: string;
  currentUserRole: string;
  onUpdateRole: (name: string, role: string) => void;
  activityLog: CollaborationMessage[];
  onBroadcastNote: (note: string) => void;
}

export const CollaborationModal: React.FC<CollaborationModalProps> = ({
  isOpen,
  onClose,
  roomCode,
  onChangeRoomCode,
  collaborators,
  currentUserId,
  currentUserName,
  currentUserRole,
  onUpdateRole,
  activityLog,
  onBroadcastNote,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [newRoomInput, setNewRoomInput] = useState(roomCode);
  const [nameInput, setNameInput] = useState(currentUserName);
  const [roleInput, setCurrentUserRoleInput] = useState(currentUserRole);
  const [noteMessage, setNoteMessage] = useState('');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateRole(nameInput, roleInput);
  };

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteMessage.trim()) return;
    onBroadcastNote(noteMessage);
    setNoteMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-sky-400" />
            <div>
              <h3 className="text-base font-bold text-white">Suradnja u Realnom Vremenu</h3>
              <p className="text-xs text-slate-400">
                Sinkronizirani rad više inženjera na istom projektu i proračunima
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

        <div className="mt-4 space-y-4">
          {/* Room Code Card */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Soba za Suradnju (Room Code)
              </span>
              <span className="text-lg font-mono font-bold text-white tracking-widest">
                {roomCode}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-200 hover:bg-slate-800"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Kopirano' : 'Kopiraj Link'}
              </button>
            </div>
          </div>

          {/* Connected Collaborators list */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                Povezani Inženjeri u Sobi ({collaborators.length})
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Live presence</span>
            </div>

            <div className="divide-y divide-slate-800/60">
              {collaborators.map((collab) => {
                const isSelf = collab.id === currentUserId;
                return (
                  <div key={collab.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-7 w-7 rounded-full flex items-center justify-center font-bold text-white text-xs"
                        style={{ backgroundColor: collab.color || '#2563eb' }}
                      >
                        {collab.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-white">{collab.name}</span>
                          {isSelf && (
                            <span className="text-[10px] bg-slate-800 text-sky-400 font-bold px-1.5 py-0.2 rounded">
                              VI
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{collab.role}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Aktivan
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Engineer Identity & Role Form */}
          <form onSubmit={handleSaveRole} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              Vaš Inženjerski Identitet u Sobi
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Vaše ime:</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Uloga na projektu:</label>
                <select
                  value={roleInput}
                  onChange={(e) => setCurrentUserRoleInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white"
                >
                  <option value="Glavni projektant konstrukcije">Glavni projektant konstrukcije</option>
                  <option value="Ovlašteni statičar suradnik">Ovlašteni statičar suradnik</option>
                  <option value="Nadzorni inženjer na gradilištu">Nadzorni inženjer na gradilištu</option>
                  <option value="Voditelj građenja / Izvođač">Voditelj građenja / Izvođač</option>
                  <option value="Revident statičkog proračuna">Revident statičkog proračuna</option>
                </select>
              </div>
            </div>

            <div className="text-right pt-1">
              <button
                type="submit"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
              >
                Ažuriraj Ulogu
              </button>
            </div>
          </form>

          {/* Activity Stream & Quick Note */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Dnevnik Izmjena i Obavijesti Suradnika
            </h4>

            <div className="space-y-1.5 max-h-36 overflow-y-auto text-xs font-mono">
              {activityLog.length === 0 ? (
                <div className="text-slate-500 text-center py-4 font-sans text-xs">
                  Nema zabilježenih radnji u ovoj sesiji.
                </div>
              ) : (
                activityLog.map((act, i) => (
                  <div key={i} className="flex items-baseline gap-2 py-1 border-b border-slate-900">
                    <span className="text-slate-500 text-[10px]">
                      {new Date(act.timestamp).toLocaleTimeString('hr-HR')}
                    </span>
                    <span className="font-semibold text-slate-200">{act.userName}:</span>
                    <span className="text-slate-400 font-sans text-[11px]">{act.data?.note || act.type}</span>
                  </div>
                ))
              )}
            </div>

            {/* Broadcast Note Form */}
            <form onSubmit={handleSendNote} className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                placeholder="Pošalji brzu statičku bilješku timu..."
                value={noteMessage}
                onChange={(e) => setNoteMessage(e.target.value)}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold"
              >
                <Send className="h-3 w-3" />
                Pošalji
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
