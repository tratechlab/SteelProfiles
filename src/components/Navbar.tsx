import React, { useState } from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { ActiveCollaborator } from '../types/project';
import { Language, Translations } from '../i18n/translations';
import {
  Users,
  Cloud,
  CloudOff,
  ArrowRightLeft,
  FolderKanban,
  Globe,
  Share2,
  Check,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'DATABASE' | 'CALCULATOR' | 'HISTORY';
  setActiveTab: (tab: 'DATABASE' | 'CALCULATOR' | 'HISTORY') => void;
  isOnline: boolean;
  isSyncing: boolean;
  onSyncClick: () => void;
  collaborators: ActiveCollaborator[];
  onOpenCollaboration: () => void;
  onOpenProjects: () => void;
  compareCount: number;
  onOpenCompare: () => void;
  activeProjectTitle: string;
  lang: Language;
  onChangeLang: (lang: Language) => void;
  t: Translations;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isOnline,
  isSyncing,
  onSyncClick,
  collaborators,
  onOpenCollaboration,
  onOpenProjects,
  compareCount,
  onOpenCompare,
  activeProjectTitle,
  lang,
  onChangeLang,
  t,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle =
      lang === 'en'
        ? 'StahlEuro - Steel Profiles Database & Capacity Calculator'
        : lang === 'de'
        ? 'StahlEuro - Stahlprofil-Datenbank & Bemessungsrechner'
        : 'StahlEuro - Baza Čeličnih Profila & Kalkulator';
    const shareText =
      lang === 'en'
        ? 'Engineering steel profile database (EN, ASTM, DIN, ISO) & Eurocode 3 capacity calculator.'
        : lang === 'de'
        ? 'Ingenieur-Stahlprofildatenbank (EN, ASTM, DIN, ISO) & Eurocode 3 Bemessungsrechner.'
        : 'Inženjerska baza čeličnih profila (EN, ASTM, DIN, ISO) i Eurocode 3 kalkulator nosivosti.';

    const shareData = {
      title: shareTitle,
      text: shareText,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (e) {
      // Ignored
    }
  };
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('DATABASE');
            }}
            className="flex items-center gap-2 text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-blue-400 transition-colors"
          >
            <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 font-mono text-xs font-black">
              SE
            </div>
            <span>StahlEuro</span>
          </a>

          {/* Active project mini pill */}
          <button
            onClick={onOpenProjects}
            title="Promijeni ili uredi projekt"
            className="hidden lg:flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
          >
            <FolderKanban className="h-3 w-3 text-sky-400" />
            <span className="truncate max-w-[140px] font-medium">{activeProjectTitle}</span>
          </button>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="flex items-center gap-1 sm:gap-6 text-xs font-medium text-slate-400 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('DATABASE')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'DATABASE' ? 'text-white font-bold border-b-2 border-blue-500' : 'hover:text-slate-200'
            }`}
          >
            {t.databaseTab}
          </button>
          <button
            onClick={() => setActiveTab('CALCULATOR')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'CALCULATOR' ? 'text-white font-bold border-b-2 border-blue-500' : 'hover:text-slate-200'
            }`}
          >
            {t.calculatorTab}
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'HISTORY' ? 'text-white font-bold border-b-2 border-blue-500' : 'hover:text-slate-200'
            }`}
          >
            {t.historyTab}
          </button>
        </nav>

        {/* Zone 3: Actions, Language Switcher & Presence */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language Switcher Buttons (EN / HR / DE) */}
          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900/80 p-0.5 text-xs font-medium">
            <button
              onClick={() => onChangeLang('en')}
              title="English language"
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                lang === 'en'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onChangeLang('hr')}
              title="Hrvatski jezik"
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                lang === 'hr'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              HR
            </button>
            <button
              onClick={() => onChangeLang('de')}
              title="Deutsche Sprache"
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                lang === 'de'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              DE
            </button>
          </div>

          {/* Cloud Sync Status */}
          <button
            onClick={onSyncClick}
            title={isOnline ? 'Kliknite za ručnu sinkronizaciju s oblakom' : 'Rad na gradilištu - izvan mreže'}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
              isOnline
                ? 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
                : 'border-amber-800/80 bg-amber-950/40 text-amber-300'
            }`}
          >
            {isOnline ? (
              <Cloud className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin text-sky-400' : 'text-sky-400'}`} />
            ) : (
              <CloudOff className="h-3.5 w-3.5 text-amber-400" />
            )}
            <span className="hidden sm:inline">
              {isSyncing ? '...' : isOnline ? t.cloudSync : 'Offline'}
            </span>
          </button>

          {/* Real-time Collaborators indicator */}
          <button
            onClick={onOpenCollaboration}
            title={t.collaboration}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <Users className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden md:inline">{t.collaboration}</span>
            <span className="h-4 w-4 rounded-full bg-blue-600/60 font-mono text-[10px] text-white flex items-center justify-center font-bold">
              {collaborators.length}
            </span>
          </button>

          {/* Compare Trigger */}
          {compareCount > 0 && (
            <button
              onClick={onOpenCompare}
              className="flex items-center gap-1 rounded-lg bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition-colors"
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              <span>{t.compare} ({compareCount})</span>
            </button>
          )}

          {/* PWA Install Button */}
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
