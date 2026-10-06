import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Upload, X, Check, AlertCircle, Image as ImageIcon, Video, Sparkles } from 'lucide-react';
import { SAMPLE_MEDICINE_PACKAGES } from '../data/sampleMedicineImages.ts';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string, file?: File) => void;
  title?: string;
  description?: string;
  guideText?: string;
  aspectRatio?: 'landscape' | 'square' | 'portrait';
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  title = 'Capture Medicine Package',
  description = 'Point your camera clearly at the medicine box, label, or blister pack.',
  guideText = 'Align label or text inside frame',
  aspectRatio = 'landscape'
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Synchronize stream with video element whenever stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      if (videoRef.current.srcObject !== stream) {
        videoRef.current.srcObject = stream;
      }
      videoRef.current.play().catch((e) => {
        console.warn('Video play warning:', e);
      });
    }
  }, [stream, isCameraActive]);

  // Initialize camera when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setPreviewImage(null);
      setSelectedFile(null);
      setCameraError(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);

    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (typeof window !== 'undefined' && !window.isSecureContext && window.location.hostname !== 'localhost') {
        setCameraError('Camera access requires a secure HTTPS connection. Please use the document or image upload option below.');
      } else {
        setCameraError('Camera access is not supported by your browser or environment. Please upload a photo or document.');
      }
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (constraintErr) {
        // Fallback to basic unconstrained video for devices/virtual cameras that fail strict constraints
        console.warn('High-res constraints rejected, falling back to basic video:', constraintErr);
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      setStream(mediaStream);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Camera initialization error:', err);
      let message = 'Unable to access camera. Please grant camera permission or select a photo file.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message = 'Camera access was denied. You can allow camera access in browser settings or upload an image instead.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        message = 'No camera device was detected on your device. Please upload an image file instead.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        message = 'Camera device is already in use by another application or hardware is busy. Please close other camera apps or upload an image.';
      }
      setCameraError(message);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const width = video.videoWidth > 0 ? video.videoWidth : 640;
    const height = video.videoHeight > 0 ? video.videoHeight : 480;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontally if front camera
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setPreviewImage(dataUrl);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewImage(event.target.result as string);
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (previewImage) {
      onCapture(previewImage, selectedFile || undefined);
      onClose();
    }
  };

  const handleRetake = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    startCamera();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-stone-900 text-amber-800 dark:text-amber-300">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg leading-tight">
                {title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Test Sample Specimens */}
        <div className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Test Packages:</span>
          </span>
          {SAMPLE_MEDICINE_PACKAGES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => {
                setPreviewImage(sample.dataUrl);
                setSelectedFile(null);
                stopCamera();
              }}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-700 dark:text-slate-200 whitespace-nowrap text-[11px] font-semibold transition hover:bg-amber-50 dark:hover:bg-stone-800"
              title={sample.subtitle}
            >
              {sample.name}
            </button>
          ))}
        </div>

        {/* Viewport / Preview Area */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] sm:min-h-[360px] overflow-hidden">
          {previewImage ? (
            /* Snapshot Preview */
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={previewImage}
                alt="Captured Preview"
                className="max-h-[360px] max-w-full object-contain"
              />
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-emerald-400 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-amber-500/30">
                <Check className="w-3.5 h-3.5" />
                <span>Image captured ready for processing</span>
              </div>
            </div>
          ) : isCameraActive ? (
            /* Live Camera Feed */
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={(node) => {
                  videoRef.current = node;
                  if (node && stream && node.srcObject !== stream) {
                    node.srcObject = stream;
                    node.play().catch(() => {});
                  }
                }}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover min-h-[320px] max-h-[400px]"
              />

              {/* Viewfinder Target Box Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                <div
                  className={`w-full ${
                    aspectRatio === 'square'
                      ? 'max-w-[260px] aspect-square'
                      : 'max-w-[340px] aspect-[4/3]'
                  } border-2 border-amber-400/80 rounded-xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow">
                    {guideText}
                  </div>
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-amber-400 -mt-1 -ml-1 rounded-tl" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-amber-400 -mt-1 -mr-1 rounded-tr" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-amber-400 -mb-1 -ml-1 rounded-bl" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-amber-400 -mb-1 -mr-1 rounded-br" />
                </div>
              </div>

              {/* Camera Switcher Button */}
              <button
                type="button"
                onClick={switchCamera}
                className="absolute top-3 right-3 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition border border-white/20"
                title="Switch Camera (Front/Rear)"
                aria-label="Switch camera front or rear"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Error or Fallback State */
            <div className="p-6 text-center max-w-md mx-auto text-white">
              <div className="inline-flex p-3 rounded-full bg-amber-500/20 text-amber-400 mb-3 border border-amber-500/30">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h4 className="font-semibold text-base mb-1">Camera Not Available</h4>
              <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                {cameraError || 'Device camera could not be started. You can upload an existing medicine package photo or document instead.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                <button
                  type="button"
                  onClick={startCamera}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Try Camera Again
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Select Image File
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          aria-label="Upload medicine image or PDF"
          onChange={handleFileUpload}
        />

        {/* Action Toolbar */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          {previewImage ? (
            /* Confirmation Actions */
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retake</span>
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition"
              >
                <Check className="w-4 h-4" />
                <span>Use Photo / Continue</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-semibold"
              >
                <span>Cancel</span>
              </button>
            </div>
          ) : (
            /* Capture / File Selection Actions */
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium transition"
                >
                  <Upload className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                  <span>Upload Image / Document</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>

              {isCameraActive && (
                <button
                  type="button"
                  onClick={takeSnapshot}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md transition"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
