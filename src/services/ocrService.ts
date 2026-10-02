import { Medicine, OCRResult } from '../types.ts';
import { SEED_MEDICINES } from '../data/seedMedicines.ts';

export interface OCRServiceResponse {
  success: boolean;
  configured: boolean;
  result?: OCRResult;
  error?: string;
}

/**
 * Normalizes input image string (SVG data URI or data URL) into JPEG base64
 */
async function rasterizeToJpegBase64(dataUrl: string): Promise<{ base64: string; mimeType: string }> {
  // If it's an SVG data URI, render to offscreen canvas
  if (dataUrl.startsWith('data:image/svg+xml')) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 420;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, 640, 420);
          const jpeg = canvas.toDataURL('image/jpeg', 0.9);
          resolve({
            base64: jpeg.replace(/^data:[^;]+;base64,/i, ''),
            mimeType: 'image/jpeg'
          });
        } else {
          resolve({
            base64: dataUrl.replace(/^data:[^;]+;base64,/i, ''),
            mimeType: 'image/jpeg'
          });
        }
      };
      img.onerror = () => {
        resolve({
          base64: dataUrl.replace(/^data:[^;]+;base64,/i, ''),
          mimeType: 'image/jpeg'
        });
      };
      img.src = dataUrl;
    });
  }

  const mimeMatch = dataUrl.match(/^data:([^;]+);base64,/i);
  const mimeType = mimeMatch ? mimeMatch[1].toLowerCase() : 'image/jpeg';
  const cleanBase64 = dataUrl.replace(/^data:[^;]+;base64,/i, '').trim();

  return { base64: cleanBase64, mimeType };
}

export async function processMedicineImageOCR(imageDataUrl: string): Promise<OCRServiceResponse> {
  try {
    const { base64, mimeType } = await rasterizeToJpegBase64(imageDataUrl);

    // Send to server-side endpoint
    const response = await fetch('/api/ocr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        imageBase64: base64,
        mimeType
      })
    });

    if (!response.ok) {
      return {
        success: false,
        configured: false,
        error: 'OCR could not process this image. Please try another image or search manually.'
      };
    }

    const data = await response.json();

    if (data.isBusy || (data.error && (data.error.includes('busy') || data.error.includes('503')))) {
      return {
        success: false,
        configured: true,
        error: 'AI service is busy right now. Please try after a few seconds.'
      };
    }

    if (!data.configured) {
      return {
        success: false,
        configured: false,
        error: data.error || 'OCR could not process this image. Please try another image or search manually.'
      };
    }

    const {
      rawText = '',
      possibleMedicineNames = [],
      activeIngredients = [],
      strength,
      dosageForm,
      manufacturer,
      confidence = 'LOW',
      isUncertain = false
    } = data;

    // Check if no medicine text was detected
    const cleanRawText = (rawText || '').trim();
    if (!cleanRawText && possibleMedicineNames.length === 0 && activeIngredients.length === 0) {
      return {
        success: false,
        configured: true,
        error: 'No medicine text was detected. Please use a clearer photo or search manually.'
      };
    }

    // Match against verified medicine database
    const matched = matchMedicinesFromText(possibleMedicineNames, activeIngredients, cleanRawText);

    // Safety checks: if uncertain, low confidence, or no verified clinical match found
    const finalUncertain = isUncertain || confidence === 'UNCERTAIN' || confidence === 'LOW' || matched.length === 0;

    return {
      success: true,
      configured: true,
      result: {
        rawText: cleanRawText,
        possibleMedicineNames: Array.isArray(possibleMedicineNames) ? possibleMedicineNames : [possibleMedicineNames],
        activeIngredients: Array.isArray(activeIngredients) ? activeIngredients : [activeIngredients],
        strength,
        dosageForm,
        manufacturer,
        confidence: finalUncertain ? 'UNCERTAIN' : (confidence as any),
        isUncertain: finalUncertain,
        uncertaintyReason: finalUncertain
          ? 'Could not reliably identify medicine. Please verify with a doctor or pharmacist.'
          : undefined,
        matchedMedicines: matched
      }
    };
  } catch (err: any) {
    console.error('OCR processing error:', err);
    return {
      success: false,
      configured: false,
      error: 'OCR could not process this image. Please try another image or search manually.'
    };
  }
}

/**
 * Normalizes text and matches against seed medicine database
 */
export function matchMedicinesFromText(
  possibleNames: string[],
  activeIngredients: string[],
  rawText: string
): Medicine[] {
  const matchedSet = new Set<string>();
  const results: Medicine[] = [];

  const textToSearch = [
    ...(Array.isArray(possibleNames) ? possibleNames : [possibleNames]),
    ...(Array.isArray(activeIngredients) ? activeIngredients : [activeIngredients]),
    rawText
  ].join(' ').toLowerCase();

  for (const med of SEED_MEDICINES) {
    const medNameLower = med.name.toLowerCase();
    const genericLower = med.genericName.toLowerCase();

    // Check direct name match
    if (textToSearch.includes(medNameLower) || textToSearch.includes(genericLower)) {
      if (!matchedSet.has(med.id)) {
        matchedSet.add(med.id);
        results.push(med);
      }
      continue;
    }

    // Check brand names
    for (const brand of med.brandNames) {
      const brandLower = brand.toLowerCase();
      const regex = new RegExp(`\\b${brandLower}\\b`, 'i');
      if (regex.test(textToSearch)) {
        if (!matchedSet.has(med.id)) {
          matchedSet.add(med.id);
          results.push(med);
        }
        break;
      }
    }

    // Check ingredients
    for (const ing of med.ingredients) {
      const ingLower = ing.toLowerCase();
      const firstWord = ingLower.split(' ')[0];
      if (firstWord.length > 3 && textToSearch.includes(firstWord)) {
        if (!matchedSet.has(med.id)) {
          matchedSet.add(med.id);
          results.push(med);
        }
        break;
      }
    }
  }

  return results;
}
