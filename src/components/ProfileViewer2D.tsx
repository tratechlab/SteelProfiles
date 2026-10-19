import React, { useState } from 'react';
import { SteelProfile, SteelGrade } from '../types/steel';
import { getEffectiveMechanicalProperties } from '../data/steelGrades';
import { Layers, Info, CheckCircle2 } from 'lucide-react';

interface ProfileViewer2DProps {
  profile: SteelProfile;
  calculatedEt?: number;
  selectedGrade?: SteelGrade;
}

export const ProfileViewer2D: React.FC<ProfileViewer2DProps> = ({
  profile,
  calculatedEt,
  selectedGrade,
}) => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  // SVG canvas coordinates
  const svgWidth = 320;
  const svgHeight = 280;
  const cx = svgWidth / 2;
  const cy = svgHeight / 2 - 10;

  // Scale geometry to fit within ~200px box
  const maxDim = Math.max(profile.h, profile.b);
  const scale = 170 / (maxDim || 1);

  const hScaled = profile.h * scale;
  const bScaled = profile.b * scale;
  const twScaled = Math.max(3, profile.tw * scale);
  const tfScaled = Math.max(4, profile.tf * scale);
  const rScaled = Math.max(2, profile.r * scale);

  // Material mechanical properties
  const grade = selectedGrade;
  const eNominal = grade ? grade.E : profile.defaultMechanics.E;
  const gNominal = grade ? grade.G : profile.defaultMechanics.G;
  const density = grade ? grade.density : (profile.defaultMechanics.density || 7850);
  const effectiveProps = grade
    ? getEffectiveMechanicalProperties(grade, profile.tf)
    : {
        fy: profile.defaultMechanics.fy,
        fu: profile.defaultMechanics.fu,
        E: eNominal,
        G: gNominal,
        isReduced: false,
      };

  const etDisplay = calculatedEt
    ? calculatedEt
    : grade?.tangentModulusRatio
    ? eNominal * grade.tangentModulusRatio
    : profile.defaultMechanics.Et;

  const etPercent = Math.round((etDisplay / eNominal) * 100);

  // Actual recalculated weight per meter if density differs from standard steel (e.g. aluminum)
  const calculatedWeight = ((profile.A * density) / 1000).toFixed(1);

  // Render shapes according to family
  const renderProfileShape = () => {
    switch (profile.family) {
      case 'SHS':
      case 'HSS':
      case 'ISO-SHS': {
        // Square hollow section
        const outerLeft = cx - bScaled / 2;
        const outerTop = cy - hScaled / 2;
        const innerLeft = outerLeft + twScaled;
        const innerTop = outerTop + tfScaled;
        const innerWidth = Math.max(2, bScaled - 2 * twScaled);
        const innerHeight = Math.max(2, hScaled - 2 * tfScaled);

        return (
          <g>
            <rect
              x={outerLeft}
              y={outerTop}
              width={bScaled}
              height={hScaled}
              rx={rScaled}
              className="fill-blue-600/30 stroke-blue-400 transition-colors"
              strokeWidth="2.5"
            />
            <rect
              x={innerLeft}
              y={innerTop}
              width={innerWidth}
              height={innerHeight}
              rx={Math.max(1, rScaled - twScaled)}
              className="fill-slate-950 stroke-blue-500/60"
              strokeWidth="2"
            />
          </g>
        );
      }

      case 'RHS':
      case 'ISO-RHS': {
        // Rectangular hollow section
        const outerLeft = cx - bScaled / 2;
        const outerTop = cy - hScaled / 2;
        const innerLeft = outerLeft + twScaled;
        const innerTop = outerTop + tfScaled;
        const innerWidth = Math.max(2, bScaled - 2 * twScaled);
        const innerHeight = Math.max(2, hScaled - 2 * tfScaled);

        return (
          <g>
            <rect
              x={outerLeft}
              y={outerTop}
              width={bScaled}
              height={hScaled}
              rx={rScaled}
              className="fill-blue-600/30 stroke-blue-400 transition-colors"
              strokeWidth="2.5"
            />
            <rect
              x={innerLeft}
              y={innerTop}
              width={innerWidth}
              height={innerHeight}
              rx={Math.max(1, rScaled - twScaled)}
              className="fill-slate-950 stroke-blue-500/60"
              strokeWidth="2"
            />
          </g>
        );
      }

      case 'CHS':
      case 'ISO-CHS': {
        // Circular hollow pipe
        const radius = Math.min(bScaled, hScaled) / 2;
        const innerRadius = Math.max(2, radius - twScaled);

        return (
          <g>
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              className="fill-blue-600/30 stroke-blue-400"
              strokeWidth="2.5"
            />
            <circle
              cx={cx}
              cy={cy}
              r={innerRadius}
              className="fill-slate-950 stroke-blue-500/60"
              strokeWidth="2"
            />
          </g>
        );
      }

      case 'UPN':
      case 'UPE':
      case 'C-SHAPE':
      case 'ISO-C': {
        // Channel section (opens to the right)
        const left = cx - bScaled / 2;
        const top = cy - hScaled / 2;
        const bottom = cy + hScaled / 2;
        const right = cx + bScaled / 2;

        const pathData = `
          M ${left} ${top}
          H ${right}
          V ${top + tfScaled}
          H ${left + twScaled}
          V ${bottom - tfScaled}
          H ${right}
          V ${bottom}
          H ${left}
          Z
        `;

        return (
          <path
            d={pathData}
            className="fill-blue-600/30 stroke-blue-400 transition-colors"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        );
      }

      case 'L':
      case 'ISO-L': {
        // Angle section
        const left = cx - bScaled / 2;
        const top = cy - hScaled / 2;
        const bottom = cy + hScaled / 2;
        const right = cx + bScaled / 2;

        const pathData = `
          M ${left} ${top}
          H ${left + twScaled}
          V ${bottom - tfScaled}
          H ${right}
          V ${bottom}
          H ${left}
          Z
        `;

        return (
          <path
            d={pathData}
            className="fill-blue-600/30 stroke-blue-400 transition-colors"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        );
      }

      case 'T': {
        // T-profile
        const left = cx - bScaled / 2;
        const right = cx + bScaled / 2;
        const top = cy - hScaled / 2;
        const bottom = cy + hScaled / 2;

        const pathData = `
          M ${left} ${top}
          H ${right}
          V ${top + tfScaled}
          H ${cx + twScaled / 2}
          V ${bottom}
          H ${cx - twScaled / 2}
          V ${top + tfScaled}
          H ${left}
          Z
        `;

        return (
          <path
            d={pathData}
            className="fill-blue-600/30 stroke-blue-400 transition-colors"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        );
      }

      default: {
        // Standard I-beams (IPE, HEA, HEB, HEM, IPN, W-Shape, S-Shape, ISO-I)
        const left = cx - bScaled / 2;
        const right = cx + bScaled / 2;
        const top = cy - hScaled / 2;
        const bottom = cy + hScaled / 2;
        const webLeft = cx - twScaled / 2;
        const webRight = cx + twScaled / 2;

        const pathData = `
          M ${left} ${top}
          H ${right}
          V ${top + tfScaled}
          H ${webRight}
          V ${bottom - tfScaled}
          H ${right}
          V ${bottom}
          H ${left}
          V ${bottom - tfScaled}
          H ${webLeft}
          V ${top + tfScaled}
          H ${left}
          Z
        `;

        return (
          <g>
            <path
              d={pathData}
              className="fill-blue-600/25 stroke-blue-400 transition-colors hover:fill-blue-600/40"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Upper Flange Hover Region */}
            <rect
              x={left}
              y={top}
              width={bScaled}
              height={tfScaled}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPart(`Gornja pojasnica (Flange): b=${profile.b}mm, tf=${profile.tf}mm`)}
              onMouseLeave={() => setHoveredPart(null)}
            />
            {/* Web Hover Region */}
            <rect
              x={webLeft}
              y={top + tfScaled}
              width={twScaled}
              height={Math.max(1, hScaled - 2 * tfScaled)}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPart(`Hrbat (Web): h_w=${profile.h - 2 * profile.tf}mm, tw=${profile.tw}mm`)}
              onMouseLeave={() => setHoveredPart(null)}
            />
            {/* Lower Flange Hover Region */}
            <rect
              x={left}
              y={bottom - tfScaled}
              width={bScaled}
              height={tfScaled}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPart(`Donja pojasnica (Flange): b=${profile.b}mm, tf=${profile.tf}mm`)}
              onMouseLeave={() => setHoveredPart(null)}
            />
          </g>
        );
      }
    }
  };

  const leftX = cx - bScaled / 2;
  const rightX = cx + bScaled / 2;
  const topY = cy - hScaled / 2;
  const bottomY = cy + hScaled / 2;

  return (
    <div className="flex flex-col space-y-4 rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-mono text-base font-bold text-white">{profile.name}</h3>
            <span className="rounded bg-sky-950/80 px-2 py-0.5 text-[11px] font-medium text-sky-400 border border-sky-800/60">
              {profile.standardGroup} · {profile.standard}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Geometrijski poprečni presjek i ovisna mehanička svojstva
          </p>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative flex items-center justify-center rounded-lg bg-slate-950/80 p-2 border border-slate-800/80">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="h-60 w-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Grid Lines */}
          <line x1="20" y1={cy} x2={svgWidth - 20} y2={cy} stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
          <line x1={cx} y1="20" x2={cx} y2={svgHeight - 20} stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />

          {/* Axes Labels */}
          <text x={svgWidth - 16} y={cy - 5} fill="#64748b" fontSize="10" fontFamily="monospace">
            y
          </text>
          <text x={cx + 6} y="22" fill="#64748b" fontSize="10" fontFamily="monospace">
            z
          </text>

          {/* Cross section shape */}
          {renderProfileShape()}

          {/* Dimension: Height (h) on the left */}
          <g>
            <line x1={leftX - 16} y1={topY} x2={leftX - 16} y2={bottomY} stroke="#94a3b8" strokeWidth="1" />
            <line x1={leftX - 20} y1={topY} x2={leftX - 12} y2={topY} stroke="#94a3b8" strokeWidth="1" />
            <line x1={leftX - 20} y1={bottomY} x2={leftX - 12} y2={bottomY} stroke="#94a3b8" strokeWidth="1" />
            <text
              x={leftX - 22}
              y={cy + 4}
              fill="#cbd5e1"
              fontSize="10"
              textAnchor="end"
              fontFamily="monospace"
              fontWeight="bold"
            >
              h={profile.h}
            </text>
          </g>

          {/* Dimension: Width (b) on the bottom */}
          <g>
            <line x1={leftX} y1={bottomY + 16} x2={rightX} y2={bottomY + 16} stroke="#94a3b8" strokeWidth="1" />
            <line x1={leftX} y1={bottomY + 12} x2={leftX} y2={bottomY + 20} stroke="#94a3b8" strokeWidth="1" />
            <line x1={rightX} y1={bottomY + 12} x2={rightX} y2={bottomY + 20} stroke="#94a3b8" strokeWidth="1" />
            <text
              x={cx}
              y={bottomY + 28}
              fill="#cbd5e1"
              fontSize="10"
              textAnchor="middle"
              fontFamily="monospace"
              fontWeight="bold"
            >
              b={profile.b}
            </text>
          </g>

          {/* Web thickness (tw) label */}
          <text
            x={cx + twScaled / 2 + 6}
            y={cy - 20}
            fill="#93c5fd"
            fontSize="9"
            fontFamily="monospace"
          >
            tw={profile.tw}
          </text>

          {/* Flange thickness (tf) label */}
          <text
            x={rightX - 35}
            y={topY - 6}
            fill="#93c5fd"
            fontSize="9"
            fontFamily="monospace"
          >
            tf={profile.tf}
          </text>

          {/* Center of gravity marker */}
          <circle cx={cx} cy={cy} r="3" fill="#ef4444" />
          <circle cx={cx} cy={cy} r="6" stroke="#ef4444" strokeWidth="1" fill="none" strokeDasharray="2 2" />
        </svg>

        {hoveredPart && (
          <div className="absolute top-2 right-2 rounded bg-slate-800/90 px-2 py-1 text-xs text-slate-200 shadow-md border border-slate-700">
            {hoveredPart}
          </div>
        )}
      </div>

      {/* Material Dependency Badge */}
      <div className="rounded-lg bg-blue-950/30 border border-blue-900/50 p-2.5 text-xs space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-blue-300 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-sky-400" />
            {grade ? grade.displayName : `${profile.defaultMechanics.fy} MPa standard`}
          </span>
          <span className="font-mono text-[10px] text-slate-400">
            {grade ? grade.standard : profile.standard}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          {grade?.description || 'Mehanička svojstva (E, Et, fy, fu, G) se računaju prema odabranoj kvaliteti materijala i debljini elemenata.'}
        </p>
      </div>

      {/* Mechanical Properties Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="rounded bg-slate-950/60 p-2 border border-slate-800/80">
          <span className="text-slate-400 block text-[11px]">Modul elastičnosti (E)</span>
          <span className="font-mono font-bold text-sky-400 tabular-nums">
            {(eNominal / 1000).toFixed(0)} GPa
          </span>
          <span className="text-[10px] text-slate-500 block">Elastično područje</span>
        </div>

        <div className="rounded bg-slate-950/60 p-2 border border-slate-800/80">
          <span className="text-slate-400 block text-[11px]">Tangencijalni modul (Et)</span>
          <span className="font-mono font-bold text-amber-400 tabular-nums">
            {(etDisplay / 1000).toFixed(1)} GPa
          </span>
          <span className="text-[10px] text-slate-500 block">{etPercent}% početnog E</span>
        </div>

        <div className="rounded bg-slate-950/60 p-2 border border-slate-800/80">
          <span className="text-slate-400 block text-[11px]">Granica razvlačenja (fy)</span>
          <span className="font-mono font-bold text-emerald-400 tabular-nums">
            {effectiveProps.fy} MPa
          </span>
          <span className="text-[10px] text-slate-500 block">
            {effectiveProps.isReduced ? 'Smanjeno (tf>16mm)' : `fu = ${effectiveProps.fu} MPa`}
          </span>
        </div>

        <div className="rounded bg-slate-950/60 p-2 border border-slate-800/80">
          <span className="text-slate-400 block text-[11px]">Gustoća (ρ) & Masa</span>
          <span className="font-mono font-bold text-white tabular-nums">
            {calculatedWeight} kg/m
          </span>
          <span className="text-[10px] text-slate-500 block">ρ = {density} kg/m³</span>
        </div>
      </div>

      {/* Geometrical Properties Strip */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
        <div className="rounded bg-slate-950/40 p-2 border border-slate-800/50">
          <span className="text-slate-500 block text-[10px] font-sans">Površina A:</span>
          <span className="text-slate-200 font-semibold">{profile.A} cm²</span>
        </div>
        <div className="rounded bg-slate-950/40 p-2 border border-slate-800/50">
          <span className="text-slate-500 block text-[10px] font-sans">Otporni Wel,y:</span>
          <span className="text-amber-400 font-semibold">{profile.Wely} cm³</span>
        </div>
        <div className="rounded bg-slate-950/40 p-2 border border-slate-800/50">
          <span className="text-slate-500 block text-[10px] font-sans">Inercija Iy:</span>
          <span className="text-sky-300 font-semibold">{profile.Iy.toLocaleString()} cm⁴</span>
        </div>
      </div>
    </div>
  );
};
