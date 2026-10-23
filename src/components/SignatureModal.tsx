import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Type, Upload, Trash2, Check, X } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureDataUrl: string) => void;
  title: string;
  defaultName?: string;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  defaultName = '',
}) => {
  const [mode, setMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState(defaultName);
  const [typedFont, setTypedFont] = useState<'font-handwriting-1' | 'font-handwriting-2' | 'font-handwriting-3'>('font-handwriting-1');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen && mode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSave(event.target.result as string);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (mode === 'draw' && canvasRef.current) {
      // Check if empty
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
      onClose();
    } else if (mode === 'type' && typedName.trim()) {
      // Convert typed name to canvas dataUrl for crisp rendering in PDF
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 400;
      tempCanvas.height = 120;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0f172a';
        ctx.font = 'italic 38px "Brush Script MT", "Caveat", "Segoe Script", cursive';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedName, 200, 60);
        onSave(tempCanvas.toDataURL('image/png'));
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-neutral-900 border border-neutral-700 text-neutral-100 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <div>
            <h3 className="text-base font-semibold text-neutral-100">{title}</h3>
            <p className="text-xs text-neutral-400">Add an authentic digital signature or clear to sign physically</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200 p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex border-b border-neutral-800 px-5 pt-3 gap-2">
          <button
            onClick={() => setMode('draw')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-md transition-colors border-b-2 ${
              mode === 'draw'
                ? 'border-sky-500 text-sky-400 bg-neutral-800/60'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            Draw
          </button>
          <button
            onClick={() => setMode('type')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-md transition-colors border-b-2 ${
              mode === 'type'
                ? 'border-sky-500 text-sky-400 bg-neutral-800/60'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            Type Name
          </button>
          <button
            onClick={() => setMode('upload')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-md transition-colors border-b-2 ${
              mode === 'upload'
                ? 'border-sky-500 text-sky-400 bg-neutral-800/60'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Image
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 flex-1 flex flex-col justify-center">
          {mode === 'draw' && (
            <div>
              <div className="relative border-2 border-dashed border-neutral-700 rounded-lg bg-white overflow-hidden shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={460}
                  height={150}
                  className="w-full h-40 cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                <span className="absolute bottom-2 left-3 text-[11px] text-neutral-400 select-none pointer-events-none">
                  Sign above this guideline
                </span>
                <div className="absolute bottom-6 left-3 right-3 border-b border-neutral-300 pointer-events-none" />
              </div>
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="flex items-center gap-1 text-xs text-neutral-400 hover:text-rose-400 transition-colors py-1 px-2 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Pad
                </button>
              </div>
            </div>
          )}

          {mode === 'type' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Enter Full Name to Generate Signature
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="e.g. Arben Krasniqi"
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="p-6 border border-neutral-700 rounded-lg bg-white text-center">
                <div
                  className="text-3xl text-neutral-900 select-none min-h-[50px] flex items-center justify-center"
                  style={{ fontFamily: '"Brush Script MT", "Caveat", "Segoe Script", cursive' }}
                >
                  {typedName.trim() || 'Your Signature Preview'}
                </div>
                <div className="w-48 h-px bg-neutral-300 mx-auto mt-2" />
              </div>
            </div>
          )}

          {mode === 'upload' && (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-700 rounded-lg p-8 bg-neutral-800/40 text-center">
              <Upload className="w-8 h-8 text-neutral-400 mb-2" />
              <p className="text-sm font-medium text-neutral-200">Select signature image</p>
              <p className="text-xs text-neutral-400 mt-1 mb-4">PNG, JPG, or SVG with transparent background recommended</p>
              <label className="cursor-pointer px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium rounded-lg transition-colors">
                Browse Files
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-neutral-800 bg-neutral-900/80">
          <button
            type="button"
            onClick={() => {
              onSave('');
              onClose();
            }}
            className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            Leave Blank (Wet Signature)
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-neutral-300 hover:text-neutral-100 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              Apply Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
