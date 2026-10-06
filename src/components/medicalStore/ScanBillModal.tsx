import React, { useState, useRef } from 'react';
import { Camera, Upload, AlertTriangle, Check, RefreshCw, X, ShieldAlert, Sparkles, Image as ImageIcon } from 'lucide-react';
import { BillOCRResult } from '../../types.ts';

interface ScanBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtracted: (result: BillOCRResult, imageBase64?: string) => void;
}

export const ScanBillModal: React.FC<ScanBillModalProps> = ({ isOpen, onClose, onExtracted }) => {
  const [mode, setMode] = useState<'options' | 'camera' | 'preview'>('options');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<BillOCRResult | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const startCamera = async () => {
    setCameraError(null);
    setMode('camera');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera is not supported in this browser or environment.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      let msg = 'Unable to access camera. Please check camera permissions in your browser or use "Upload Bill Image".';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission denied. Please allow camera permissions or upload a bill image file.';
      } else if (err.name === 'NotFoundError') {
        msg = 'No camera found on this device. Please upload a bill image file.';
      }
      setCameraError(msg);
      setMode('options');
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(dataUrl);
    stopCamera();
    setMode('preview');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG or PNG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCapturedImage(reader.result as string);
      setMode('preview');
    };
    reader.readAsDataURL(file);
  };

  const processOCR = async () => {
    if (!capturedImage) return;
    setIsProcessing(true);
    setCameraError(null);

    try {
      const base64Clean = capturedImage.replace(/^data:image\/\w+;base64,/, '');
      const response = await fetch('/api/ocr-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Clean,
          mimeType: capturedImage.startsWith('data:image/png') ? 'image/png' : 'image/jpeg'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process bill image.');
      }

      setExtractedData(data);
    } catch (err: any) {
      console.error('Bill OCR client error:', err);
      setExtractedData({
        rawText: '',
        items: [],
        confidence: 'UNCERTAIN',
        isUncertain: true,
        uncertaintyReason: err.message || 'OCR processing service could not connect. You can manually enter the bill details.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseExtracted = () => {
    if (!extractedData) return;
    stopCamera();
    onExtracted(extractedData, capturedImage || undefined);
    onClose();
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#FBF8F2] border border-[#D9CFB8] text-[#1a2e2b] w-full max-w-2xl rounded-xs shadow-2xl p-6 relative my-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#D9CFB8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-stone-900 text-[#FBF8F2] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif text-stone-900">Scan / Upload Bill</h3>
              <p className="text-xs text-stone-900/70">Capture paper receipt or upload photo to auto-extract items</p>
            </div>
          </div>
          <button type="button" onClick={handleClose} aria-label="Close scan bill modal" className="p-1.5 text-stone-500 hover:text-stone-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {cameraError && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xs text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Options Mode */}
        {mode === 'options' && (
          <div className="py-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={startCamera}
                className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-[#D9CFB8] bg-white hover:bg-[#EDF1EA] transition rounded-xs text-stone-900 group"
              >
                <div className="w-12 h-12 rounded-xs bg-stone-900/10 flex items-center justify-center text-stone-900 group-hover:scale-105 transition">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm">Take Bill Photo</div>
                  <div className="text-xs text-stone-500 mt-1">Use device camera live preview</div>
                </div>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-[#D9CFB8] bg-white hover:bg-[#EDF1EA] transition rounded-xs text-stone-900 group"
              >
                <div className="w-12 h-12 rounded-xs bg-[#B08D57]/15 flex items-center justify-center text-[#B08D57] group-hover:scale-105 transition">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm">Upload Bill Image</div>
                  <div className="text-xs text-stone-500 mt-1">Select PNG/JPEG from device</div>
                </div>
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <div className="p-3 bg-[#EDF1EA] border border-[#D9CFB8] rounded-xs text-xs text-stone-900/80 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B08D57]" />
              <span>OCR extraction automatically parses line items, medicine names, unit prices, and quantities. You can always review and edit before saving.</span>
            </div>
          </div>
        )}

        {/* Live Camera Mode */}
        {mode === 'camera' && (
          <div className="py-4 space-y-4">
            <div className="relative rounded-xs overflow-hidden bg-black aspect-4/3 flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-x-8 inset-y-8 border-2 border-dashed border-white/60 pointer-events-none rounded-xs flex items-center justify-center">
                <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-xs">Position bill within frame</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => { stopCamera(); setMode('options'); }}
                className="px-4 py-2 border border-[#D9CFB8] text-xs font-semibold rounded-xs hover:bg-[#EDF1EA] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCapture}
                className="px-5 py-2.5 bg-stone-900 text-[#FBF8F2] text-xs font-semibold rounded-xs hover:bg-stone-900/90 transition flex items-center gap-2 shadow-xs"
              >
                <Camera className="w-4 h-4" />
                Capture Photo
              </button>
            </div>
          </div>
        )}

        {/* Preview & OCR Mode */}
        {mode === 'preview' && capturedImage && (
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="border border-[#D9CFB8] rounded-xs overflow-hidden bg-stone-900 flex flex-col items-center">
                <img src={capturedImage} alt="Captured Bill" className="max-h-72 object-contain w-full" />
                <div className="w-full bg-white p-2 border-t border-[#D9CFB8] flex justify-between text-xs">
                  <button
                    onClick={() => { setCapturedImage(null); setExtractedData(null); setMode('options'); }}
                    className="text-stone-600 hover:text-stone-900 font-medium"
                  >
                    Retake / Re-upload
                  </button>
                  <span className="text-stone-400">Original bill image</span>
                </div>
              </div>

              <div className="space-y-3">
                {!extractedData && !isProcessing && (
                  <div className="p-4 bg-white border border-[#D9CFB8] rounded-xs space-y-3">
                    <p className="text-xs text-stone-600">
                      Image captured. Click <strong>Extract Bill Data</strong> to automatically analyze lines, prices, and totals using clinical OCR.
                    </p>
                    <button
                      onClick={processOCR}
                      className="w-full py-2.5 bg-stone-900 text-[#FBF8F2] text-xs font-bold rounded-xs hover:bg-stone-900/90 transition flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-[#B08D57]" />
                      Extract Bill Data (OCR)
                    </button>
                  </div>
                )}

                {isProcessing && (
                  <div className="p-6 bg-white border border-[#D9CFB8] rounded-xs text-center space-y-3">
                    <RefreshCw className="w-6 h-6 animate-spin text-stone-900 mx-auto" />
                    <div className="text-xs font-semibold text-stone-900">Analyzing bill items & amounts...</div>
                    <div className="text-[11px] text-stone-500">Checking arithmetic and extracting medicines</div>
                  </div>
                )}

                {extractedData && (
                  <div className="p-3 bg-white border border-[#D9CFB8] rounded-xs space-y-3 max-h-72 overflow-y-auto">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                      <span className="text-xs font-bold text-stone-900">OCR Results</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                        extractedData.isUncertain ? 'bg-amber-100 text-amber-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        Confidence: {extractedData.confidence}
                      </span>
                    </div>

                    {extractedData.isUncertain && (
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded-xs text-[11px] text-amber-900 flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Review required: </strong>
                          {extractedData.uncertaintyReason || 'Some items could not be identified with certainty. Please verify numbers carefully.'}
                        </div>
                      </div>
                    )}

                    <div className="text-xs space-y-1">
                      {extractedData.customerName && (
                        <div><span className="text-stone-500">Customer:</span> <span className="font-semibold">{extractedData.customerName}</span></div>
                      )}
                      {extractedData.date && (
                        <div><span className="text-stone-500">Date:</span> <span className="font-semibold">{extractedData.date}</span></div>
                      )}
                      <div>
                        <span className="text-stone-500">Detected Items:</span>{' '}
                        <span className="font-semibold">{extractedData.items?.length || 0}</span>
                      </div>
                      {extractedData.grandTotal ? (
                        <div><span className="text-stone-500">Total:</span> <span className="font-bold text-stone-900">{extractedData.grandTotal}</span></div>
                      ) : null}
                    </div>

                    <button
                      onClick={handleUseExtracted}
                      className="w-full py-2 bg-stone-900 text-[#FBF8F2] text-xs font-bold rounded-xs hover:bg-stone-900/90 transition flex items-center justify-center gap-1.5 mt-2"
                    >
                      <Check className="w-4 h-4" />
                      Apply to New Bill Form
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
