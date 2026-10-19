import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { HardHat, WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-600/95 backdrop-blur px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-amber-400/40">
      <HardHat className="h-4 w-4 shrink-0 text-amber-100" />
      <div className="flex flex-col">
        <span>Offline način za gradilište</span>
        <span className="text-[10px] text-amber-200 font-normal">
          Svi proračuni rade lokalno. Sinkronizirat će se čim bude mreže.
        </span>
      </div>
    </div>
  );
};
