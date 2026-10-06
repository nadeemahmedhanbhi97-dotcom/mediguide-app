// api/_lib/gemini.mjs
// Shared helper. The "_lib" folder name starts with an underscore, so Vercel
// does NOT expose it as a public URL.

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Calls the Gemini REST API and returns { ok, text } or { ok:false, code }.
 * code is one of: NO_KEY, BUSY, API_ERROR, NETWORK
 */
export async function callGemini(parts, retries = 3) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return { ok: false, code: "NO_KEY" };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const r = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      });

      if (r.ok) {
        const data = await r.json();
        const text =
          data?.candidates?.[0]?.content?.parts
            ?.map((p) => p.text || "")
            .join("") || "";
        return { ok: true, text };
      }

      const errText = await r.text();
      console.warn(`[gemini] attempt ${attempt} failed:`, r.status, errText.slice(0, 300));

      const busy = r.status === 429 || r.status === 503;
      if (busy && attempt < retries) {
        await sleep(1000 * attempt);
        continue;
      }
      return { ok: false, code: busy ? "BUSY" : "API_ERROR", status: r.status };
    } catch (err) {
      console.warn(`[gemini] network error attempt ${attempt}:`, err?.message);
      if (attempt < retries) {
        await sleep(1000 * attempt);
        continue;
      }
      return { ok: false, code: "NETWORK" };
    }
  }
  return { ok: false, code: "BUSY" };
}
