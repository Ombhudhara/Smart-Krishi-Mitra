// ─────────────────────────────────────────────────────────────────────────────
// languages.js
// Central language configuration for the premium redesigned AI Chat Assistant.
// ─────────────────────────────────────────────────────────────────────────────

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "हिन्दी",   flag: "🇮🇳" },
  { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
];

export const DEFAULT_LANGUAGE = "en";

export const UI_STRINGS = {
  en: {
    // Header
    headerTitle: "Smart Krishi AI Assistant",
    headerOnline: "Online",
    headerPoweredBy: "Powered by",
    headerGemini: "Gemini",
    headerComingSoon: "(Coming Soon)",
    headerClear: "Clear Chat",
    headerNewChat: "New Chat",
    headerLanguageLabel: "Language",

    // Sidebar
    sidebarLogoSub: "AI Farming Assistant",
    sidebarNewChat: "New Chat",
    sidebarSearch: "Search conversations…",
    sidebarFreePlan: "Free Plan · Unlimited chats",
    sidebarEmptySearch: "No conversations found",
    sidebarSectionConversations: "Conversations",
    sidebarSectionPinned: "Pinned",
    sidebarSectionToday: "Today",
    sidebarSectionYesterday: "Yesterday",
    sidebarSectionLastWeek: "Last 7 days",
    sidebarSectionOlder: "Older",

    // Welcome Screen
    welcomeTitle: "Hello 👋",
    welcomeHeading: "Ask anything about farming",
    welcomeSubtitle: "Your premium AI-powered farming companion is here to help you with crop advice, pest control, soil health, market prices, and government schemes.",
    emptyChatHintLabel: "Try asking:",

    // 4 Premium Quick Action Cards
    quickActions: [
      { id: "qa-1", icon: "🌾", title: "Diagnose Crop Disease",  description: "Identify pest or disease symptoms", template: "My crop is showing symptoms of " },
      { id: "qa-2", icon: "🌱", title: "Crop Recommendation",  description: "Best crop matches for your soil",  template: "Which crops are recommended for " },
      { id: "qa-3", icon: "💰", title: "Cost Calculator",      description: "Estimate cultivation cost & profit",template: "Calculate the cultivation cost for " },
      { id: "qa-4", icon: "📢", title: "Government Schemes",   description: "Find active subsidies & benefits",  template: "What government schemes are available for " }
    ],

    // Suggested questions chips (4 cards)
    suggestedQuestions: [
      { id: "sq-1", icon: "🌾", text: "Best crop for black soil?" },
      { id: "sq-2", icon: "💧", text: "Cotton water requirement" },
      { id: "sq-3", icon: "🐛", text: "Pest control" },
      { id: "sq-4", icon: "🌦", text: "Weather forecast" }
    ],

    // Suggested chips label
    suggestedLabel: "✨ Suggested Questions",

    // Typing
    typingText: "Krishi AI is thinking…",

    // Input
    inputPlaceholder: "Ask anything about farming...",
    inputHintSend: "Press Enter to send · Shift + Enter for new line",

    // Error
    errorMessage: "⚠️ I'm having trouble responding right now. Please try again in a moment.",

    // Voice
    voiceRecording: "Recording",
    voiceTranscribing: "Transcribing…",
    voiceSpeakHint: "Speak clearly…",
    voiceStopSend: "Stop & Send",
    voiceCancel: "Cancel",

    // Tooltips
    tooltipEmoji: "Emoji",
    tooltipImage: "Upload Image",
    tooltipDoc: "Upload Document",
    tooltipVoice: "Voice Input",
  },

  hi: {
    // Header
    headerTitle: "स्मार्ट कृषि AI सहायक",
    headerOnline: "ऑनलाइन",
    headerPoweredBy: "संचालित",
    headerGemini: "Gemini",
    headerComingSoon: "(जल्द आ रहा है)",
    headerClear: "चैट साफ़ करें",
    headerNewChat: "नई बातचीत",
    headerLanguageLabel: "भाषा",

    // Sidebar
    sidebarLogoSub: "AI कृषि सहायक",
    sidebarNewChat: "नया चैट",
    sidebarSearch: "बातचीत खोजें…",
    sidebarFreePlan: "मुफ़्त योजना · असीमित चैट",
    sidebarEmptySearch: "कोई बातचीत नहीं मिली",
    sidebarSectionConversations: "बातचीत",
    sidebarSectionPinned: "पिन किया गया",
    sidebarSectionToday: "आज",
    sidebarSectionYesterday: "कल",
    sidebarSectionLastWeek: "पिछले 7 दिन",
    sidebarSectionOlder: "पुराने",

    // Welcome Screen
    welcomeTitle: "नमस्ते 👋",
    welcomeHeading: "खेती के बारे में कुछ भी पूछें",
    welcomeSubtitle: "आपका प्रीमियम AI-संचालित कृषि साथी फसल सलाह, कीट नियंत्रण, मिट्टी के स्वास्थ्य, बाजार भाव और सरकारी योजनाओं में आपकी सहायता करने के लिए यहाँ है।",
    emptyChatHintLabel: "कोशिश करें:",

    // 4 Premium Quick Action Cards
    quickActions: [
      { id: "qa-1", icon: "🌾", title: "फसल रोग का निदान",      description: "कीट या रोग के लक्षणों की पहचान",       template: "मेरी फसल में यह लक्षण दिख रहे हैं: " },
      { id: "qa-2", icon: "🌱", title: "फसल सुझाव",           description: "अपनी मिट्टी के लिए सर्वोत्तम फसलें",   template: "किस प्रकार की मिट्टी में कौन सी फसलें उगाएं: " },
      { id: "qa-3", icon: "💰", title: "लागत कैलकुलेटर",        description: "खेती की लागत और लाभ का अनुमान",    template: "खेती की लागत की गणना करें: " },
      { id: "qa-4", icon: "📢", title: "सरकारी योजनाएं",       description: "सक्रिय सब्सिडी और लाभ खोजें",         template: "किसानों के लिए कौन सी सरकारी योजनाएं उपलब्ध हैं: " }
    ],

    // Suggested questions chips (4 cards)
    suggestedQuestions: [
      { id: "sq-1", icon: "🌾", text: "काली मिट्टी के लिए सबसे अच्छी फसल?" },
      { id: "sq-2", icon: "💧", text: "कपास के लिए पानी की आवश्यकता" },
      { id: "sq-3", icon: "🐛", text: "कीट नियंत्रण" },
      { id: "sq-4", icon: "🌦", text: "मौसम का पूर्वानुमान" }
    ],

    // Suggested chips label
    suggestedLabel: "✨ सुझाए गए प्रश्न",

    // Typing
    typingText: "कृषि AI सोच रहा है…",

    // Input
    inputPlaceholder: "खेती के बारे में कुछ भी पूछें...",
    inputHintSend: "भेजने के लिए Enter दबाएं · नई लाइन के लिए Shift + Enter",

    // Error
    errorMessage: "⚠️ अभी जवाब देने में समस्या हो रही है। कृपया थोड़ी देर बाद दोबारा कोशिश करें।",

    // Voice
    voiceRecording: "रिकॉर्डिंग हो रही है",
    voiceTranscribing: "अनुवाद हो रहा है…",
    voiceSpeakHint: "स्पष्ट बोलें…",
    voiceStopSend: "रोकें और भेजें",
    voiceCancel: "रद करें",

    // Tooltips
    tooltipEmoji: "इमोजी",
    tooltipImage: "छवि अपलोड करें",
    tooltipDoc: "दस्तावेज़ अपलोड करें",
    tooltipVoice: "आवाज़ इनपुट",
  },

  gu: {
    // Header
    headerTitle: "સ્માર્ટ કૃષિ AI સહાયક",
    headerOnline: "ઓનલાઈન",
    headerPoweredBy: "સંચાલિત",
    headerGemini: "Gemini",
    headerComingSoon: "(ટૂંક સમયમાં)",
    headerClear: "ચેટ સાફ કરો",
    headerNewChat: "નવી વાતચીત",
    headerLanguageLabel: "ભાષા",

    // Sidebar
    sidebarLogoSub: "AI કૃષિ સહાયક",
    sidebarNewChat: "નવી ચેટ",
    sidebarSearch: "વાતચીત શોધો…",
    sidebarFreePlan: "મફત યોજના · અમર્યાદિત ચેટ",
    sidebarEmptySearch: "કોઈ વાતચીત મળી નથી",
    sidebarSectionConversations: "વાતચીત",
    sidebarSectionPinned: "પિન કરેલ",
    sidebarSectionToday: "આજે",
    sidebarSectionYesterday: "ગઇકાલે",
    sidebarSectionLastWeek: "છેલ્લા 7 દિવસ",
    sidebarSectionOlder: "જૂનું",

    // Welcome Screen
    welcomeTitle: "નમસ્તે 👋",
    welcomeHeading: "ખેતી વિશે કંઈપણ પૂછો",
    welcomeSubtitle: "તમારો પ્રીમિયમ AI-સંચાલિત ખેતી સાથી પાકની સલાહ, જીવાત નિયંત્રણ, જમીન આરોગ્ય, બજાર કિંમતો અને સરકારી યોજનાઓમાં તમને મદદ કરવા માટે અહીં છે.",
    emptyChatHintLabel: "અજમાવો:",

    // 4 Premium Quick Action Cards
    quickActions: [
      { id: "qa-1", icon: "🌾", title: "પાક રોગ નિદાન",         description: "જીવાત અથવા રોગના લક્ષણો ઓળખો",     template: "મારા પાકમાં આ લક્ષણો દેખાય છે: " },
      { id: "qa-2", icon: "🌱", title: "પાકની ભલામણ",          description: "તમારી જમીન માટે શ્રેષ્ઠ પાક મેળવો",  template: "કઈ જમીનમાં કયો પાક લેવો અનુકૂળ છે: " },
      { id: "qa-3", icon: "💰", title: "ખર્ચ ગણક",              description: "ખેતી ખર્ચ અને નફાનો અંદાજ મેળવો",   template: "વાવેતર ખર્ચની ગણતરી કરો: " },
      { id: "qa-4", icon: "📢", title: "સરકારી યોજનાઓ",         description: "સક્રિય સબસિડી અને યોજનાઓ શોધો",     template: "ખેડૂતો માટે કઈ સરકારી યોજનાઓ ઉપલબ્ધ છે: " }
    ],

    // Suggested questions chips (4 cards)
    suggestedQuestions: [
      { id: "sq-1", icon: "🌾", text: "કાળી જમીન માટે શ્રેષ્ઠ પાક?" },
      { id: "sq-2", icon: "💧", text: "કપાસમાં પાણીની જરૂરિયાત" },
      { id: "sq-3", icon: "🐛", text: "જીવાત નિયંત્રણ" },
      { id: "sq-4", icon: "🌦", text: "હવામાન આગાહી" }
    ],

    // Suggested chips label
    suggestedLabel: "✨ સૂચવેલા પ્રશ્નો",

    // Typing
    typingText: "કૃષિ AI વિચારી રહ્યો છે…",

    // Input
    inputPlaceholder: "ખેતી વિશે કંઈપણ પૂછો...",
    inputHintSend: "મોકલવા માટે Enter દબાવો · નવી લાઇન માટે Shift + Enter",

    // Error
    errorMessage: "⚠️ હમણાં જવાબ આપવામાં સમસ્યા છે. કૃપા કરી થોડી વાર પછી ફરી પ્રયાસ કરો।",

    // Voice
    voiceRecording: "રેકોર્ડિંગ થઈ રહ્યું છે",
    voiceTranscribing: "ટેક્સ્ટમાં રૂપાંતર…",
    voiceSpeakHint: "સ્પષ્ટ બોલો…",
    voiceStopSend: "રોકો અને મોકલો",
    voiceCancel: "રદ કરો",

    // Tooltips
    tooltipEmoji: "ઇમોજી",
    tooltipImage: "છબી અપલોડ કરો",
    tooltipDoc: "દસ્તાવેજ અપલોડ કરો",
    tooltipVoice: "અવાજ ઇનપુટ",
  },
};

export function getStrings(langCode) {
  return UI_STRINGS[langCode] || UI_STRINGS[DEFAULT_LANGUAGE];
}

export function getSuggestedQuestions(langCode) {
  const strings = UI_STRINGS[langCode] || UI_STRINGS[DEFAULT_LANGUAGE];
  return strings.suggestedQuestions;
}

export function getResponses(langCode) {
  // Retaining existing responses from aiService mapping compatibility.
  return MULTILINGUAL_RESPONSES[langCode] || MULTILINGUAL_RESPONSES[DEFAULT_LANGUAGE];
}

export const MULTILINGUAL_RESPONSES = {
  en: {
    wheat: `## Wheat Cultivation Guide 🌾

Wheat is India's most important rabi crop, grown from October to March.

### 🌱 Sowing Guidelines
- **Best Time**: 15 Oct – 15 Nov (timely sown)
- **Seed Rate**: 100–125 kg/hectare
- **Row Spacing**: 22.5 cm

### 💧 Critical Irrigation Stages

| Growth Stage | Days After Sowing | Critical? |
|-------------|-------------------|-----------|
| Crown Root | 20–25 DAS | ✅ Yes |
| Tillering | 40–45 DAS | ✅ Yes |
| Jointing | 60–65 DAS | ✅ Yes |
| Flowering | 85–90 DAS | ✅ Yes |

### 🧪 Fertilizer: NPK 120:60:40 kg/ha

### 💡 Pro Tip
> HD-3086 and PBW-550 are high-yielding varieties. Treat seeds with Carboxin fungicide before sowing.`,

    cotton: `## Cotton Cultivation Guide 🌿

Cotton is a major kharif cash crop — India's "White Gold."

### 📅 Crop Calendar
| Activity | Month |
|----------|-------|
| Field Preparation | April–May |
| Sowing | June–July |
| Harvesting | October–February |

### 🐛 Common Pests
1. **Pink Bollworm** — Use Bt cotton, pheromone traps
2. **Whitefly** — Neem oil 3ml/L spray
3. **Jassid** — Yellow sticky traps

### 💡 Pro Tip
> Never skip picking at 7–8 day intervals. Delayed picking reduces grade and price.`,

    soil: `## Soil Health Guide 🌍

### 🧪 Ideal Soil Parameters

| Parameter | Ideal Range | Action if Deficient |
|-----------|------------|-------------------|
| pH | 6.5–7.5 | Add lime (acidic) / gypsum (alkaline) |
| Organic Carbon | >0.75% | Add FYM/compost 5–10 t/ha |
| Nitrogen | Medium–High | Add Urea/FYM |
| Zinc | >0.6 ppm | Add ZnSO₄ 25 kg/ha |

### 💡 Pro Tip
> Get a **Soil Health Card** from your local KVK — it's FREE and gives crop-specific recommendations.`,

    scheme: `## Government Schemes for Farmers 2024–25 📢

### 💰 Key Schemes
| Scheme | Benefit | Eligibility |
|--------|---------|-------------|
| PM-KISAN | ₹6,000/year | All landholding farmers |
| PMFBY | Crop insurance | Farmers with notified crops |
| KCC | Credit at 4% | Farmers with land records |

### 📞 Helplines
- **PM-KISAN**: 155261
- **Kisan Call Centre**: 1800-180-1551 (Free)`,

    general: `## 🌾 Smart Krishi AI Assistant

Hello! I'm your intelligent farming companion. I can help with:

- 🌾 **Crop Selection** — best crops for your soil and season
- 🧪 **Fertilizers** — NPK ratios, organic alternatives
- 💧 **Irrigation** — scheduling and water conservation
- 🐛 **Pest Control** — IPM strategies, organic solutions
- 📢 **Government Schemes** — subsidies, loans, insurance
- 📈 **Market Prices** — MSP, mandi rates, selling strategies

Ask me anything about farming — I'm available 24/7! 🚀`,
  },

  hi: {
    wheat: `## गेहूं की खेती गाइड 🌾

गेहूं भारत की सबसे महत्वपूर्ण रबी फसल है, जो अक्टूबर से मार्च तक उगाई जाती है।

### 🌱 बुवाई दिशानिर्देश
- **सर्वोत्तम समय**: 15 अक्टूबर – 15 नवंबर (समय पर बुवाई)
- **बीज दर**: 100–125 किग्रा/हेक्टेयर
- **पंक्ति की दूरी**: 22.5 सेमी

### 💧 महत्वपूर्ण सिंचाई चरण

| वृद्धि चरण | बुवाई के बाद दिन | महत्वपूर्ण? |
|-----------|----------------|-----------|
| क्राउन रूट | 20–25 दिन | ✅ हाँ |
| टिलरिंग | 40–45 दिन | ✅ हाँ |
| जोड़ | 60–65 दिन | ✅ हाँ |
| फूल आना | 85–90 दिन | ✅ हाँ |

### 🧪 उर्वरक: NPK 120:60:40 किग्रा/हेक्टेयर

### 💡 सलाह
> HD-3086 और PBW-550 उच्च उपज वाली किस्में हैं। बुवाई से पहले बीजों को कार्बोक्सिन फफूंदीनाशक से उपचारित करें।`,

    cotton: `## कपास की खेती गाइड 🌿

कपास एक प्रमुख खरीफ नकदी फसल है — भारत का "सफेद सोना"।

### 📅 फसल कैलेंडर
| गतिविधि | महीना |
|---------|-------|
| खेत की तैयारी | अप्रैल–मई |
| बुवाई | जून–जुलाई |
| कटाई | अक्टूबर–फरवरी |

### 🐛 सामान्य कीट
1. **गुलाबी बॉलवर्म** — Bt कपास, फेरोमोन ट्रैप का उपयोग करें
2. **सफेद मक्खी** — नीम का तेल 3ml/L स्प्रे
3. **जैसिड** — पीले चिपचिपे जाल

### 💡 सलाह
> 7–8 दिन के अंतराल पर चुनाई न चूकें। देरी से चुनाई से गुणवत्ता और भाव कम होता है।`,

    soil: `## मिट्टी स्वास्थ्य गाइड 🌍

### 🧪 आदर्श मिट्टी मापदंड

| मापदंड | आदर्श सीमा | कमी होने पर उपाय |
|--------|-----------|----------------|
| pH | 6.5–7.5 | चूना (अम्लीय) / जिप्सम (क्षारीय) |
| जैविक कार्बन | >0.75% | FYM/खाद 5–10 टन/हेक्टेयर |
| नाइट्रोजन | मध्यम–उच्च | यूरिया/FYM डालें |
| जस्ता | >0.6 ppm | ZnSO₄ 25 किग्रा/हेक्टेयर |

### 💡 सलाह
> अपने नजदीकी KVK से **मृदा स्वास्थ्य कार्ड** निःशुल्क प्राप्त करें — इसमें फसल-विशिष्ट सिफारिशें होती हैं।`,

    scheme: `## किसानों के लिए सरकारी योजनाएं 2024–25 📢

### 💰 प्रमुख योजनाएं
| योजना | लाभ | पात्रता |
|-------|-----|---------|
| PM-किसान | ₹6,000/वर्ष | सभी भूमिधारक किसान |
| PMFBY | फसल बीमा | अधिसूचित फसल वाले किसान |
| KCC | 4% पर ऋण | भूमि अभिलेख वाले किसान |

### 📞 हेल्पलाइन
- **PM-किसान**: 155261
- **किसान कॉल सेंटर**: 1800-180-1551 (निःशुल्क)`,

    general: `## 🌾 स्मार्ट कृषि AI सहायक

नमस्ते! मैं आपका बुद्धिमान कृषि साथी हूँ। मैं इनमें मदद कर सकता हूँ:

- 🌾 **फसल चयन** — आपकी मिट्टी और मौसम के लिए सर्वोत्तम फसलें
- 🧪 **उर्वरक** — NPK अनुपात, जैविक विकल्प
- 💧 **सिंचाई** — समय-सारणी और जल संरक्षण
- 🐛 **कीट नियंत्रण** — IPM रणनीतियाँ, जैविक समाधान
- 📢 **सरकारी योजनाएं** — सब्सिडी, ऋण, बीमा
- 📈 **बाजार भाव** — MSP,  मंडी दरें, बिक्री रणनीतियाँ

मुझसे खेती के बारे में कुछ भी पूछें — मैं 24/7 उपलब्ध हूँ! 🚀`,
  },

  gu: {
    wheat: `## ઘઉં ઉગાડવાની માર્ગદર્શિકા 🌾

ઘઉં ભારતનો સૌથી મહત્વપૂર્ણ રવી પાક છે, જે ઓક્ટોબરથી માર્ચ સુધી ઉગાડવામાં આવે છે।

### 🌱 વાવણી માર્ગદર્શિકા
- **શ્રેષ્ઠ સમય**: 15 ઓક્ટો – 15 નવે (સમયસર)
- **બીજ દર**: 100–125 કિ.ગ્રા/હેક્ટર
- **હારની અંતર**: 22.5 સેમી

### 💧 મહત્વના સિંચાઈ તબક્કા

| વૃદ્ધિ તબક્કો | વાવણી પછીના દિવસ | મહત્વનો? |
|-------------|-----------------|---------|
| ક્રાઉન રૂટ | 20–25 દિવસ | ✅ હા |
| ટિલરિંગ | 40–45 દિવસ | ✅ હા |
| જોઈન્ટિંગ | 60–65 દિવસ | ✅ હા |
| ફૂલ આવવા | 85–90 દિવસ | ✅ હા |

### 🧪 ખાતર: NPK 120:60:40 કિ.ગ્રા/હેક્ટર

### 💡 ટિપ
> GW-496 અને HD-3086 ઊંચી ઉત્પાદક જાતો છે. વાવણી પહેલા બીજને Carboxin ફૂગનાશક વડે ઉપચારિત કરો।`,

    cotton: `## કપાસ ઉગાડવાની માર્ગદર્શિકા 🌿

કપાસ ભારતનો "સફેદ સોનો" — મુખ્ય ખરીફ રોકડ પાક.

### 📅 પાક કૅલેન્ડર
| પ્રવૃત્તિ | મહિનો |
|---------|-------|
| ખેતર તૈયારી | એપ્રિલ–મે |
| વાવણી | જૂન–જુલાઈ |
| લણણી | ઓક્ટો–ફેબ્રુ |

### 🐛 સામાન્ય જીવાત
1. **ગુલાબી બૉલ વર્મ** — Bt કપાસ, ફૅરોમોન ટ્રૅપ
2. **સફેદ માખી** — લીમડાનું તેલ 3ml/L
3. **જૅસ્સીડ** — પીળા ચીકણા ટ્રૅપ

### 💡 ટિપ
> 7–8 દિવસના અંતરાળ પર વીણી ચૂકશો નહીં. મોડી વીણીથી ગ્રેડ અને ભાવ ઘટે છે।`,

    soil: `## જમીન આરોગ્ય માર્ગદર્શિકા 🌍

### 🧪 આદર્શ જમીન પ્રમાણ

| પ્રમાણ | આદર્શ | ઓછું હોય તો ઉપાય |
|-------|-------|----------------|
| pH | 6.5–7.5 | ચૂનો (એસિડ) / ગ્યુપ્સ (ક્ષારીય) |
| ઓર્ગૅનિક કાર્બન | >0.75% | FYM/ખાતર 5–10 ટન/હે |
| નાઈટ્રોજન | મધ્યમ–ઊંચું | યૂરિયા/FYM |
| જસ્ત | >0.6 ppm | ZnSO₄ 25 કિ.ગ્રા/હે |

### 💡 ટિપ
> નજીકના KVK પાસેથી **જમીન આરોગ્ય કાર્ડ** મફત મળે છે — પાક-વિશિષ્ટ ભલામણ સાથે.`,

    scheme: `## ખેડૂતો માટે સરકારી યોજનાઓ 2024–25 📢

### 💰 મુખ્ય યોજનાઓ
| યોજના | લાભ | પાત્રતા |
|-------|-----|---------|
| PM-કિસાન | ₹6,000/વર્ષ | બધા જમીન-ધારી ખેડૂત |
| PMFBY | પાક વીમો | જાહેર પાક ઉગાડનાર |
| KCC | 4% ઉધારી | જમીન-નોંધ ધારક |

### 📞 હૅલ્પલાઈન
- **PM-કિસાન**: 155261
- **કિસાન કૉલ સૅન્ટર**: 1800-180-1551 (મફત)`,

    general: `## 🌾 સ્માર્ટ કૃષિ AI સહાયક

નમસ્તે! હું તમારો AI ખેતી સાથી છું. આ વિષયોમાં મદદ કરી શકું:

- 🌾 **પાક પસંદગી** — તમારી જમીન અને ઋતુ માટે શ્રેષ્ઠ
- 🧪 **ખાતર** — NPK ગુણોત્તર, જૈવિક વિકલ્પ
- 💧 **સિંચાઈ** — શૅડ્યૂલ અને પાણી બચત
- 🐛 **જીવાત નિયંત્રણ** — IPM, જૈવિક ઉપાય
- 📢 **સરકારી યોજનાઓ** — સબ્સિડી, ઉધાર, વીમો
- 📈 **બજાર ભાવ** — MSP, મંડી, વેચાણ વ્યૂહ

ખેતી વિશે ગમે તે પૂછો — 24/7 ઉપલબ્ધ! 🚀`,
  },
};
