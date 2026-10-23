import React from 'react';
import { Printer, Download } from 'lucide-react';
import { PRESET_TEMPLATES } from '../utils/presets';
import { HandoverFormData } from '../types';

interface NavbarProps {
  onPrint: () => void;
  onExportPdf: () => void;
  isGeneratingPdf: boolean;
  onLoadTemplate: (templateData: Partial<HandoverFormData>) => void;
  onReset: () => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  toggleViewMode?: () => void;
  viewMode?: 'split' | 'preview-only' | 'editor-only';
  onSetViewMode?: (mode: 'split' | 'preview-only' | 'editor-only') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onPrint,
  onExportPdf,
  isGeneratingPdf,
  onLoadTemplate,
  onReset,
  zoom,
  onZoomChange,
  viewMode = 'split',
  onSetViewMode,
}) => {
  return (
    <header className="h-14 border-b border-neutral-800 bg-neutral-950 px-4 md:px-6 flex items-center justify-between shrink-0 select-none z-20">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <a href="/" className="text-base font-bold tracking-tight text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            D
          </span>
          <span>DocuCraft</span>
          <span className="text-xs font-normal text-neutral-400 border-l border-neutral-800 pl-2">
            Asset Handover Studio
          </span>
        </a>
      </div>

      {/* Zone 2: Navigation controls & Presets */}
      <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-neutral-300">
        {/* Preset Selector Dropdown */}
        <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
          <span className="text-neutral-500 text-[11px] px-2">Template:</span>
          {PRESET_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => onLoadTemplate(tmpl.data)}
              className="px-2.5 py-1 rounded text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors whitespace-nowrap text-[11px]"
              title={tmpl.description}
            >
              {tmpl.name}
            </button>
          ))}
        </div>

        {/* View Layout Tabs */}
        {onSetViewMode && (
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
            <button
              onClick={() => onSetViewMode('split')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                viewMode === 'split' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => onSetViewMode('editor-only')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                viewMode === 'editor-only' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Editor Only
            </button>
            <button
              onClick={() => onSetViewMode('preview-only')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                viewMode === 'preview-only' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Preview Only
            </button>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1">
          <button
            onClick={() => onZoomChange(Math.max(0.6, Number((zoom - 0.1).toFixed(1))))}
            className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-white"
          >
            -
          </button>
          <span className="w-10 text-center font-mono text-[11px] tabular-nums text-neutral-300">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => onZoomChange(Math.min(1.4, Number((zoom + 0.1).toFixed(1))))}
            className="w-5 h-5 flex items-center justify-center text-neutral-400 hover:text-white"
          >
            +
          </button>
        </div>
      </div>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrint}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-850 hover:bg-neutral-800 border border-neutral-750 rounded-lg transition-colors whitespace-nowrap"
          title="Open native browser print / save as PDF"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save</span>
        </button>

        <button
          onClick={onExportPdf}
          disabled={isGeneratingPdf}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 active:scale-[0.98] disabled:opacity-50 rounded-lg transition-all shadow-sm whitespace-nowrap"
          title="Download high-resolution PDF file directly"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
        </button>
      </div>
    </header>
  );
};
