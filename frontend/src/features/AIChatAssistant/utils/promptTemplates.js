// ─────────────────────────────────────────────────────────────────────────────
// promptTemplates.js
// Predefined prompt templates and system context for the AI assistant.
// These will be passed as system context when integrating with Gemini API.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Main system prompt for the Smart Krishi AI assistant.
 * Will be used as the "system" role message when connecting to Gemini.
 */
export const SYSTEM_PROMPT = `You are "Krishi AI", an expert agricultural assistant for Smart Krishi Mitra — India's leading AI-powered farming platform.

Your role is to help Indian farmers with:
- Crop selection, sowing calendars, and cultivation practices
- Soil health assessment, fertilizer recommendations (organic and chemical)
- Pest identification and integrated pest management (IPM)
- Plant disease diagnosis, prevention, and treatment
- Irrigation scheduling and water management
- Weather interpretation and climate-smart farming advice
- Government subsidies, schemes, and how to apply for them
- Commodity market prices, MSP rates, and profitable selling strategies
- Cost estimation for crop cultivation
- Organic farming transition and certification
- Farm machinery selection and government subsidies

## Communication Style
- Be concise, friendly, and practical
- Use structured responses with headers, bullet points, and tables when appropriate
- Provide specific actionable advice, not vague generalities
- Mention relevant government schemes when applicable
- Include safety warnings for pesticide/chemical use
- Support farmers in both Hindi and English contexts
- Use emojis sparingly to improve readability

## Response Format
- Use markdown formatting for all responses
- Include a relevant tip or warning block in most responses
- Keep responses under 400 words unless the topic requires detail
- Always end with a follow-up question or offer to provide more information

You do NOT provide medical advice, financial investment advice, or information outside agriculture.`;

/**
 * Prompt templates for specific farming contexts.
 * These can be used to create structured queries for the AI.
 */
export const PROMPT_TEMPLATES = {
  cropAdvisor: (soilType, state, season) =>
    `I am a farmer in ${state}. My soil type is ${soilType}. It is currently ${season} season. Which crops should I grow and why? Include expected yield and current market price.`,

  fertilizerRecommendation: (crop, soilPH, area) =>
    `Recommend the best fertilizer plan for ${crop} cultivation on ${area} acres of land with soil pH ${soilPH}. Include organic options, application schedule, and cost estimate.`,

  pestDiagnosis: (crop, symptoms) =>
    `My ${crop} crop is showing these symptoms: ${symptoms}. Please identify the pest or disease, explain the damage mechanism, and provide integrated pest management solutions including organic methods.`,

  diseaseIdentification: (crop, symptoms, leafColor) =>
    `My ${crop} crop has ${leafColor} leaves with symptoms: ${symptoms}. Diagnose the disease and provide a treatment plan with both organic and chemical options.`,

  costEstimation: (crop, area, state) =>
    `Give me a detailed cultivation cost breakdown for ${crop} on ${area} acres in ${state}. Include all inputs, labour, irrigation, and expected profit calculation.`,

  schemeEligibility: (farmerType, state, crop) =>
    `I am a ${farmerType} farmer in ${state} growing ${crop}. Which government schemes am I eligible for? How do I apply and what documents do I need?`,

  irrigationSchedule: (crop, stage, soilType, rainfall) =>
    `Create an irrigation schedule for ${crop} at ${stage} growth stage. My soil is ${soilType} and current monthly rainfall is ${rainfall}mm. Include critical irrigation stages.`,

  marketAnalysis: (crop, quantity, location) =>
    `I have ${quantity} quintals of ${crop} ready for sale in ${location}. Where should I sell for best price? Compare mandi rates, e-NAM, FPO, and direct buyers.`,
};

/**
 * Quick action suggestions that appear in the empty chat state
 */
export const QUICK_ACTIONS = [
  {
    id: "qa-1",
    title: "Diagnose my crop",
    description: "Describe symptoms to identify pest or disease",
    icon: "🔬",
    template: "My crop is showing symptoms of...",
  },
  {
    id: "qa-2",
    title: "Get crop recommendations",
    description: "Find best crops for your soil and climate",
    icon: "🌾",
    template: "Which crops should I grow in my area during...",
  },
  {
    id: "qa-3",
    title: "Find government schemes",
    description: "Discover subsidies and support programs",
    icon: "📢",
    template: "Which government schemes are available for...",
  },
  {
    id: "qa-4",
    title: "Calculate farming costs",
    description: "Estimate costs and profit for your crop",
    icon: "💰",
    template: "Calculate the cultivation cost and profit for...",
  },
];

/**
 * Conversation starters grouped by topic for the empty chat suggestions
 */
export const TOPIC_SUGGESTIONS = {
  "Crop & Soil": [
    "Which crop is best for red laterite soil?",
    "How to improve soil organic matter?",
    "Best intercropping combinations for small farms",
  ],
  "Pest & Disease": [
    "How to identify and treat late blight in tomato?",
    "Natural control methods for stem borer",
    "Fungicide schedule for kharif crops",
  ],
  "Schemes & Market": [
    "How to apply for PM Fasal Bima Yojana?",
    "Current cotton MSP and selling strategies",
    "How to register on e-NAM portal?",
  ],
  "Irrigation & Water": [
    "Drip irrigation setup cost and subsidy",
    "Water requirement for summer vegetables",
    "How to prevent waterlogging in field?",
  ],
};
