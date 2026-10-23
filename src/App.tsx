/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HandoverFormData } from './types';
import { INITIAL_KIKXXL_DATA } from './utils/presets';
import { FormEditor } from './components/FormEditor';
import { PdfDocumentPreview } from './components/PdfDocumentPreview';
import { Navbar } from './components/Navbar';
import { SignatureModal } from './components/SignatureModal';
import { exportElementToPdf, printDocument } from './utils/pdfGenerator';
import {
  RotateCcw,
  CheckCircle2,
  FolderDown,
  UploadCloud,
} from 'lucide-react';

const STORAGE_KEY = 'docucraft_asset_handover_data_v2';

export default function App() {
  const [formData, setFormData] = useState<HandoverFormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.handoverBy) {
          parsed.itDeptName = parsed.handoverBy;
        }
        return parsed;
      }
    } catch {
      // fallback to initial
    }
    return INITIAL_KIKXXL_DATA;
  });

  const [zoom, setZoom] = useState<number>(0.9);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'preview-only' | 'editor-only'>('split');

  // Signature modal state
  const [signatureModalTarget, setSignatureModalTarget] = useState<'plTl' | 'itDept' | 'employee' | null>(null);

  // Auto-save
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch {
      // ignore
    }
  }, [formData]);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification((curr) => (curr === message ? null : curr));
    }, 3500);
  };

  // Reset to default KiKxxl&evroTarget form
  const handleResetToDefault = () => {
    if (window.confirm('Reset all fields to the default KiKxxl & evroTarget template?')) {
      setFormData(INITIAL_KIKXXL_DATA);
      showToast('Form reset to official KiKxxl & evroTarget layout');
    }
  };

  // Load a preset template
  const handleLoadTemplate = (presetData: Partial<HandoverFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...presetData,
      formatting: {
        ...prev.formatting,
        ...(presetData.formatting || {}),
      },
    }));
    showToast('Template preset loaded successfully');
  };

  // Helper to format employee file name: e.g. "Klodiana Krivaqa" -> "klodianakrivaqa.pdf"
  const getEmployeePdfFileName = (name?: string): string => {
    if (!name || !name.trim()) return 'assethandover.pdf';
    const sanitized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${sanitized || 'assethandover'}.pdf`;
  };

  // Export PDF
  const handleExportPdf = async () => {
    const docElement = document.getElementById('printable-pdf-document');
    if (!docElement) {
      showToast('Error: Document element not found');
      return;
    }

    try {
      setIsGeneratingPdf(true);
      const fileName = getEmployeePdfFileName(formData.employeeName);

      await exportElementToPdf(docElement, {
        fileName,
        paperSize: formData.formatting.paperSize,
        quality: 2.2, // Crisp 2x+ scaling for professional print DPI
      });

      showToast(`Downloaded: ${fileName}`);
    } catch (err) {
      console.error('PDF generation error:', err);
      showToast('Failed to generate PDF. You can also use the Print button to Save as PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Browser Print - also saves a copy in PC under the employee's name
  const handlePrint = async () => {
    const docElement = document.getElementById('printable-pdf-document');
    const fileName = getEmployeePdfFileName(formData.employeeName);

    // Set document title so Chrome "Save as PDF" will also default to this exact filename
    const originalTitle = document.title;
    document.title = fileName.replace('.pdf', '');

    try {
      if (docElement) {
        setIsGeneratingPdf(true);
        // Automatically save copy to PC
        await exportElementToPdf(docElement, {
          fileName,
          paperSize: formData.formatting.paperSize,
          quality: 2.2,
        });
        showToast(`Saved ${fileName} to PC! Opening print dialog...`);
      }
    } catch (err) {
      console.error('Auto-save error before print:', err);
    } finally {
      setIsGeneratingPdf(false);
      // Open native browser print dialog
      setTimeout(() => {
        printDocument();
        // Restore document title
        setTimeout(() => {
          document.title = originalTitle;
        }, 1500);
      }, 350);
    }
  };

  // Handle signature save
  const handleSaveSignature = (signatureUrl: string) => {
    if (!signatureModalTarget) return;

    if (signatureModalTarget === 'plTl') {
      setFormData((prev) => ({ ...prev, plTlSignature: signatureUrl }));
      showToast('Department Head signature updated');
    } else if (signatureModalTarget === 'itDept') {
      setFormData((prev) => ({ ...prev, itDeptSignature: signatureUrl }));
      showToast('IT Department signature updated');
    } else if (signatureModalTarget === 'employee') {
      setFormData((prev) => ({ ...prev, employeeSignature: signatureUrl }));
      showToast('Employee signature updated');
    }
  };

  // JSON export & import
  const exportAsJson = () => {
    const jsonStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DocuCraft_Handover_Config_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Configuration exported as JSON');
  };

  const importFromJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.companyName || parsed.items) {
            setFormData(parsed);
            showToast('Configuration imported successfully');
          } else {
            showToast('Invalid configuration file');
          }
        } catch {
          showToast('Failed to parse JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 overflow-hidden font-sans print:min-h-0 print:h-auto print:bg-white print:text-black print:overflow-visible print:block">
      {/* 3-Zone SaaS Top Bar */}
      <div className="no-print">
        <Navbar
          onPrint={handlePrint}
          onExportPdf={handleExportPdf}
          isGeneratingPdf={isGeneratingPdf}
          onLoadTemplate={handleLoadTemplate}
          onReset={handleResetToDefault}
          zoom={zoom}
          onZoomChange={setZoom}
          viewMode={viewMode}
          onSetViewMode={setViewMode}
        />
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden relative print:overflow-visible print:block print:h-auto print:p-0 print:m-0">
        {/* Left Side: Form Editor Panel */}
        <div
          className={`no-print border-r border-neutral-800 transition-all duration-200 shrink-0 ${
            viewMode === 'preview-only'
              ? 'hidden'
              : viewMode === 'editor-only'
              ? 'w-full'
              : 'w-full lg:w-[480px] xl:w-[540px]'
          }`}
        >
          <FormEditor
            data={formData}
            onChange={setFormData}
            onOpenSignatureModal={(target) => setSignatureModalTarget(target)}
          />
        </div>

        {/* Right Side: Document Preview Canvas Viewport */}
        <div
          id="printable-pdf-container"
          className={`flex-1 flex flex-col bg-neutral-900/90 overflow-auto relative print:bg-white print:overflow-visible print:block print:p-0 print:m-0 print:border-none ${
            viewMode === 'editor-only' ? 'hidden' : 'flex'
          }`}
        >
          {/* Top Bar inside canvas for quick zoom and file management */}
          <div className="no-print sticky top-0 z-10 bg-neutral-950/80 backdrop-blur-xs border-b border-neutral-800/80 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="font-medium text-neutral-300">Live Paper Canvas</span>
              <span>·</span>
              <span className="uppercase">{formData.formatting.paperSize}</span>
              <span>·</span>
              <span>{formData.items.length} Assets Listed</span>
            </div>

            <div className="flex items-center gap-2">
              <label
                title="Import JSON settings"
                className="cursor-pointer flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-200 px-2 py-1 rounded bg-neutral-800/80 hover:bg-neutral-800 transition-colors"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Import JSON</span>
                <input
                  type="file"
                  accept="application/json"
                  onChange={importFromJson}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={exportAsJson}
                title="Backup settings as JSON"
                className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-200 px-2 py-1 rounded bg-neutral-800/80 hover:bg-neutral-800 transition-colors"
              >
                <FolderDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Backup JSON</span>
              </button>

              <button
                type="button"
                onClick={handleResetToDefault}
                className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-rose-400 px-2 py-1 rounded bg-neutral-800/80 hover:bg-neutral-800 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Canvas Scroll Center */}
          <div className="flex-1 flex justify-center items-start p-6 lg:p-10 overflow-auto print:p-0 print:m-0 print:block print:overflow-visible print:bg-white">
            <PdfDocumentPreview
              data={formData}
              onOpenSignatureModal={(target) => setSignatureModalTarget(target)}
              scale={zoom}
            />
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {notification && (
        <div className="no-print fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-xl shadow-2xl text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Signature Modal */}
      {signatureModalTarget && (
        <SignatureModal
          isOpen={!!signatureModalTarget}
          onClose={() => setSignatureModalTarget(null)}
          onSave={handleSaveSignature}
          title={
            signatureModalTarget === 'plTl'
              ? 'PL / TL Department Head Signature'
              : signatureModalTarget === 'itDept'
              ? 'IT Department Representative Signature'
              : 'Employee Acknowledgment Signature'
          }
          defaultName={
            signatureModalTarget === 'plTl'
              ? formData.plTlName
              : signatureModalTarget === 'itDept'
              ? formData.handoverBy || formData.itDeptName
              : formData.employeeName
          }
        />
      )}
    </div>
  );
}
