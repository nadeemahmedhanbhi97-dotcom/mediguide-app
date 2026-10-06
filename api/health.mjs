// api/health.mjs  ->  GET /api/health
export default function handler(req, res) {
  const has = (v) => Boolean(v && v.trim().length > 0);

  res.status(200).json({
    status: "ok",
    appName: "MediGuide by Usman",
    hasGeminiKey: has(process.env.GEMINI_API_KEY),
    hasGoogleMapsKey:
      has(process.env.VITE_GOOGLE_MAPS_API_KEY) || has(process.env.GOOGLE_MAPS_API_KEY),
    timestamp: new Date().toISOString(),
  });
}
