import api from "../../../services/api";
import { DEFAULT_LANGUAGE } from "../utils/languages";

/**
 * 1. Send a user message or voice transcription to the RAG backend.
 *
 * @param {string} userMessage - The user's query.
 * @param {Array} conversationHistory - Past conversation logs.
 * @param {string} languageCode - Target language ("en", "hi", "gu").
 * @param {string} [conversationId=null] - Target conversation ID.
 * @returns {Promise<object>} Full response payload (includes confidenceScore, sources, etc.)
 */
export async function sendMessageToAI(
  userMessage,
  conversationHistory = [],
  languageCode = DEFAULT_LANGUAGE,
  conversationId = null
) {
  try {
    const langMap = {
      en: "English",
      hi: "Hindi",
      gu: "Gujarati"
    };

    const response = await api.post("/ai/chat", {
      message: userMessage,
      language: langMap[languageCode] || "English",
      conversationId
    });

    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || "Failed to retrieve answer from AI service.");
    }
  } catch (error) {
    console.error("AI Service Error:", error.message || error);
    throw new Error(
      languageCode === "hi" 
        ? "एआई सेवा से जुड़ने में असमर्थ। कृपया बाद में प्रयास करें।"
        : languageCode === "gu"
          ? "એઆઈ સેવા સાથે જોડાણ થઈ શક્યું નથી. કૃપા કરીને ફરી પ્રયાસ કરો."
          : "Unable to connect to Krishi AI. Please try again later."
    );
  }
}

/**
 * 2. Generate a short conversation title from the first user message.
 */
export function generateConversationTitle(firstMessage) {
  if (!firstMessage) return "New Conversation";
  const cleaned = firstMessage.replace(/[^a-zA-Z0-9\u0900-\u097F\u0A80-\u0AFF\s?]/g, "").trim();
  return cleaned.length > 45 ? cleaned.slice(0, 42) + "…" : cleaned;
}

/**
 * 3. Convert uploaded image to base64 and request diagnosis from backend Gemini.
 */
export async function analyzeUploadedFile(file, languageCode = DEFAULT_LANGUAGE, conversationId = null) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("No file selected."));

    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      return resolve(
        languageCode === "hi"
          ? `दस्तावेज़ **${file.name}** प्राप्त हुआ।`
          : languageCode === "gu"
            ? `દસ્તાવેજ **${file.name}** મળ્યો છે.`
            : `Document **${file.name}** received.`
      );
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result.split(",")[1];
        const langMap = {
          en: "English",
          hi: "Hindi",
          gu: "Gujarati"
        };

        const response = await api.post("/ai/chat", {
          message: "Please analyze this crop leaf image. Identify any visible plant diseases, describe the symptoms, recommend organic/chemical control measures, and estimate recovery time.",
          language: langMap[languageCode] || "English",
          image: base64Data,
          mimeType: file.type,
          conversationId
        });

        if (response.data && response.data.success) {
          resolve(response.data.data);
        } else {
          throw new Error(response.data?.message || "Failed to analyze image file.");
        }
      } catch (error) {
        console.error("Leaf Image Diagnostics Error:", error);
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * 4. Fetch all conversations for the user.
 */
export async function fetchConversations() {
  try {
    const response = await api.get("/ai/conversations");
    return response.data?.data || [];
  } catch (error) {
    console.error("fetchConversations Error:", error.message || error);
    return [];
  }
}

/**
 * 5. Fetch all messages in a conversation.
 */
export async function fetchMessages(conversationId) {
  try {
    const response = await api.get(`/ai/conversations/${conversationId}/messages`);
    return response.data?.data || [];
  } catch (error) {
    console.error("fetchMessages Error:", error.message || error);
    return [];
  }
}

/**
 * 6. Start a new conversation explicitly.
 */
export async function createConversation(title) {
  try {
    const response = await api.post("/ai/conversations", { title });
    return response.data?.data;
  } catch (error) {
    console.error("createConversation Error:", error.message || error);
    return null;
  }
}

/**
 * 7. Update conversation metadata (Rename, Favorite, Pinned).
 */
export async function updateConversation(id, updates) {
  try {
    const response = await api.put(`/ai/conversations/${id}`, updates);
    return response.data?.data;
  } catch (error) {
    console.error("updateConversation Error:", error.message || error);
    return null;
  }
}

/**
 * 8. Delete a conversation session along with all associated history logs.
 */
export async function deleteConversation(id) {
  try {
    const response = await api.delete(`/ai/conversations/${id}`);
    return response.data?.success;
  } catch (error) {
    console.error("deleteConversation Error:", error.message || error);
    return false;
  }
}

/**
 * 9. Delete a single chat log message.
 */
export async function deleteMessage(messageId) {
  try {
    const response = await api.delete(`/ai/history/${messageId}`);
    return response.data?.success;
  } catch (error) {
    console.error("deleteMessage Error:", error.message || error);
    return false;
  }
}

/**
 * 10. Submit feedback rating for a generated response.
 */
export async function submitFeedback(messageId, rating, feedback) {
  try {
    const response = await api.post(`/ai/history/${messageId}/feedback`, { rating, feedback });
    return response.data?.success;
  } catch (error) {
    console.error("submitFeedback Error:", error.message || error);
    return false;
  }
}

/**
 * 11. Export conversation as plain text transcript.
 */
export async function downloadTextTranscript(conversationId) {
  try {
    const response = await api.get(`/ai/conversations/${conversationId}/export/text`, { responseType: "blob" });
    const blob = new Blob([response.data], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `chat_transcript_${conversationId}.txt`;
    link.click();
    return true;
  } catch (error) {
    console.error("downloadTextTranscript Error:", error.message || error);
    return false;
  }
}

/**
 * 12. Simulate voice transcription (browser Speech to Text).
 */
export async function transcribeVoice(audioBlob, languageCode = DEFAULT_LANGUAGE) {
  await new Promise((resolve) => setTimeout(resolve, 1500));
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
