// ─────────────────────────────────────────────────────────────────────────────
// aiService.js
// Mock AI service with language-aware responses.
// Replace sendMessageToAI body with Google Gemini API call for production.
// ─────────────────────────────────────────────────────────────────────────────

import { getResponses, DEFAULT_LANGUAGE } from "../utils/languages";

/**
 * Simulate API network delay (ms).
 */
function randomDelay(min = 800, max = 2000) {
  return new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min)
  );
}

/**
 * Priority-ordered keyword map — same for all languages because users may
 * type in any language. Responses are then returned in the selected lang.
 */
const KEYWORD_MAP = [
  { keywords: ["wheat", "gehu", "गेहूं", "ઘઉં", "rabi", "roti"], key: "wheat" },
  { keywords: ["cotton", "kapas", "kapasi", "कपास", "કપાસ", "white gold"], key: "cotton" },
  { keywords: ["soil", "mitti", "land", "माटी", "मिट्टी", "જમીન", "pH"], key: "soil" },
  { keywords: ["scheme", "yojana", "subsidy", "govt", "government", "योजना", "sarkari", "kisan", "pm-kisan", "pmfby", "kcc", "nabard", "sarkar", "yojna", "સરકારી", "યોજના"], key: "scheme" },
  { keywords: ["fertilizer", "urea", "npk", "dap", "manure", "khad", "खाद", "उर्वरक", "ખાતર"], key: "wheat" },
  { keywords: ["pest", "insect", "aphid", "caterpillar", "कीट", "जीवात", "જીવાત", "boll"], key: "wheat" },
];

/**
 * Match user message to a response keyword key.
 * @param {string} text
 * @returns {string} key
 */
function matchKey(text) {
  const lower = text.toLowerCase();
  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.key;
    }
  }
  return "general";
}

/**
 * Send a message to the AI assistant.
 * Currently uses keyword-based multilingual dummy responses.
 *
 * ── FUTURE INTEGRATION (Google Gemini API) ──────────────────────────────────
 *
 *   const response = await fetch(
 *     `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
 *     {
 *       method: "POST",
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify({
 *         contents: [{ parts: [{ text: userMessage }] }],
 *         systemInstruction: {
 *           parts: [{
 *             text: `You are a farming AI assistant. Reply ONLY in ${languageCode === "hi" ? "Hindi" : languageCode === "gu" ? "Gujarati" : "English"}.`
 *           }]
 *         }
 *       })
 *     }
 *   );
 *   const data = await response.json();
 *   return data.candidates[0].content.parts[0].text;
 *
 * ────────────────────────────────────────────────────────────────────────────
 *
 * @param {string} userMessage        - The user's input text
 * @param {Array}  conversationHistory - Previous messages (for context)
 * @param {string} languageCode       - "en" | "hi" | "gu" (default: "en")
 * @returns {Promise<string>}          - AI response in markdown
 */
export async function sendMessageToAI(
  userMessage,
  conversationHistory = [],
  languageCode = DEFAULT_LANGUAGE
) {
  // Simulate API latency
  await randomDelay(900, 1800);

  // Get responses for the selected language
  const responses = getResponses(languageCode);

  // Match keyword
  const key = matchKey(userMessage);

  // Return matched response or general fallback
  return responses[key] || responses.general;
}

/**
 * Generate a short conversation title from the first user message.
 * @param {string} firstMessage
 * @returns {string}
 */
export function generateConversationTitle(firstMessage) {
  if (!firstMessage) return "New Conversation";
  const cleaned = firstMessage.replace(/[^a-zA-Z0-9\u0900-\u097F\u0A80-\u0AFF\s?]/g, "").trim();
  return cleaned.length > 45 ? cleaned.slice(0, 42) + "…" : cleaned;
}

/**
 * Simulate image/document analysis (future: Gemini Vision API).
 * @param {File}   file
 * @param {string} languageCode
 * @returns {Promise<string>}
 */
export async function analyzeUploadedFile(file, languageCode = DEFAULT_LANGUAGE) {
  await randomDelay(1500, 2500);
  const isImage = file.type.startsWith("image/");
  const msgs = {
    en: isImage
      ? `## Image Analysis 📸\n\nI received your crop image. Full Gemini Vision analysis coming soon!\n\n### 💡 Tip\n> For now, describe the symptoms in text and I'll provide detailed guidance.`
      : `## Document Received 📄\n\nReceived **${file.name}**. Document analysis coming soon! Please type key details from your document.`,
    hi: isImage
      ? `## छवि विश्लेषण 📸\n\nआपकी फसल की छवि मिली। Gemini Vision विश्लेषण जल्द आएगा!\n\n### 💡 सलाह\n> अभी के लिए लक्षणों को टेक्स्ट में बताएं।`
      : `## दस्तावेज़ मिला 📄\n\n**${file.name}** मिला। दस्तावेज़ विश्लेषण जल्द आएगा! मुख्य विवरण टाइप करें।`,
    gu: isImage
      ? `## છબી વિશ્લેષણ 📸\n\nતમારી પાકની છબી મળી. Gemini Vision વિશ્લેષણ ટૂંક સમયમાં!\n\n### 💡 ટિપ\n> હાલ માટે, ટેક્સ્ટમાં લક્ષણો જણાવો।`
      : `## દસ્તાવેજ મળ્યો 📄\n\n**${file.name}** મળ્યો. ટૂંક સમયમાં! મુખ્ય વિગતો ટાઇપ કરો।`,
  };
  return msgs[languageCode] || msgs.en;
}

/**
 * Simulate voice transcription (future: Web Speech API).
 * @param {Blob}   audioBlob
 * @param {string} languageCode
 * @returns {Promise<string>}
 */
export async function transcribeVoice(audioBlob, languageCode = DEFAULT_LANGUAGE) {
  await randomDelay(1000, 2000);
  const samples = {
    en: [
      "Which fertilizer is best for my wheat crop?",
      "How do I control aphids in my cotton field?",
      "Tell me about PM Kisan scheme eligibility",
    ],
    hi: [
      "गेहूं के लिए कौन सा उर्वरक सबसे अच्छा है?",
      "कपास में एफिड कैसे नियंत्रित करें?",
      "PM किसान योजना की पात्रता बताएं",
    ],
    gu: [
      "ઘઉં માટે કયું ખાતર શ્રેષ્ઠ છે?",
      "કપાસ ખેતરમાં એફિડ કેવી રીતે નિયંત્રિત કરવા?",
      "PM કિસાન યોજનાની પાત્રતા જણાવો",
    ],
  };
  const list = samples[languageCode] || samples.en;
  return list[Math.floor(Math.random() * list.length)];
}
