// ─────────────────────────────────────────────────────────────────────────────
// dummyMessages.js
// Realistic farming conversations and keyword-based AI response map
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sample conversation sessions (used to populate the sidebar history)
 */
export const dummyConversations = [
  {
    id: "conv-001",
    title: "Best crop for black soil?",
    preview: "Cotton and soybean are excellent choices for black soil...",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hrs ago
    pinned: true,
    category: "today",
    messages: [
      {
        id: "m1",
        role: "user",
        text: "Which crop is best for black soil?",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "m2",
        role: "ai",
        text: `## Best Crops for Black Soil (Regur Soil)

Black soil (also called Regur or Cotton Soil) is rich in clay and retains moisture well. It is ideal for:

### 🌾 Top Recommended Crops
- **Cotton** — thrives in black soil, highest economic return
- **Soybean** — nitrogen-fixing, improves soil health
- **Wheat** — excellent yield in well-drained black soil
- **Sugarcane** — ideal for deep black soils with good moisture
- **Jowar (Sorghum)** — drought-tolerant, suitable for shallow black soils
- **Groundnut** — good option in lighter black soils

### 📊 Crop Comparison Table

| Crop | Water Need | Expected Yield | Market Price |
|------|-----------|---------------|-------------|
| Cotton | Medium | 15–20 qtl/acre | ₹6,500/qtl |
| Soybean | Low | 8–12 qtl/acre | ₹4,200/qtl |
| Wheat | Medium | 20–25 qtl/acre | ₹2,450/qtl |
| Sugarcane | High | 300–350 qtl/acre | ₹350/qtl |

### 💡 Pro Tip
> Cotton and soybean rotation is highly recommended for black soil as it replenishes nitrogen levels and prevents soil degradation.

### ⚠️ Warning
> Avoid waterlogging in black soil as it becomes sticky and impermeable when wet. Ensure proper drainage before sowing.`,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 3000).toISOString(),
      },
    ],
  },
  {
    id: "conv-002",
    title: "Wheat fertilizer recommendations",
    preview: "For wheat cultivation, NPK fertilizers are commonly recommended...",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    pinned: false,
    category: "today",
    messages: [
      {
        id: "m3",
        role: "user",
        text: "Which fertilizer is best for wheat?",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "m4",
        role: "ai",
        text: `## Fertilizer Recommendations for Wheat

For optimal wheat cultivation, a balanced NPK fertilizer approach is recommended based on your soil test.

### 🧪 Recommended NPK Ratio: 120:60:40 kg/hectare

### 📅 Application Schedule

| Stage | Fertilizer | Quantity | Method |
|-------|-----------|---------|--------|
| Basal (Before sowing) | DAP + MOP | 120 kg/acre | Broadcast |
| Crown Root (21 days) | Urea | 65 kg/acre | Top dress |
| Tillering (45 days) | Urea | 35 kg/acre | Top dress |
| Booting Stage | Micronutrients | As per soil test | Foliar spray |

### 🌿 Organic Options
- **Vermicompost**: 2–3 tonnes/acre improves soil structure
- **FYM (Farm Yard Manure)**: 10–12 tonnes/acre before sowing
- **Neem-coated Urea**: Reduces nitrogen loss by 10–15%

### 💡 Pro Tip
> Always conduct a soil health card test before applying fertilizers. Over-application of nitrogen causes lodging (stem fall) in wheat.

### 📢 Government Scheme
> PM Kisan Samman Nidhi provides ₹6,000/year. Check eligibility at pmkisan.gov.in`,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000 + 2000).toISOString(),
      },
    ],
  },
  {
    id: "conv-003",
    title: "Aphid pest control",
    preview: "To control aphids naturally, use neem oil spray...",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    pinned: false,
    category: "yesterday",
    messages: [
      {
        id: "m5",
        role: "user",
        text: "How do I control aphids naturally?",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "m6",
        role: "ai",
        text: `## Natural Aphid Control Methods

Aphids are soft-bodied insects that suck plant sap, causing yellowing and wilting. Here are **proven organic solutions**:

### 🌿 Biological Control
- **Ladybugs & Lacewings** — natural predators, encourage by planting marigolds
- **Parasitic wasps** — naturally occur when pesticide use is minimized
- **Birds** — sparrows and tits feed heavily on aphid colonies

### 🧴 Organic Sprays

| Solution | Recipe | Interval |
|---------|--------|---------|
| Neem Oil Spray | 5ml neem oil + 1ml soap + 1L water | Every 5–7 days |
| Garlic Water Spray | 10 cloves blended + 1L water | Every 3–5 days |
| Soap Water | 5ml liquid soap + 1L water | Every 5 days |
| Chili-Garlic Extract | 50g chili + 20 cloves + 2L water | Weekly |

### 💡 Pro Tip
> Spray in the early morning or late evening to avoid leaf burn and increase effectiveness. Always spray the underside of leaves where aphids cluster.

### ⚠️ Warning
> Never use chemical pesticides near flowering crops — it kills pollinators like bees and reduces fruit set.

### 🌾 Companion Planting
Plant **marigolds, fennel, and dill** near your crops to attract aphid predators and repel aphids naturally.`,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 2500).toISOString(),
      },
    ],
  },
  {
    id: "conv-004",
    title: "Government farming schemes",
    preview: "There are several central and state government schemes...",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 3600000).toISOString(),
    pinned: false,
    category: "yesterday",
    messages: [
      {
        id: "m7",
        role: "user",
        text: "Which government schemes are available for farmers?",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 3600000).toISOString(),
      },
      {
        id: "m8",
        role: "ai",
        text: `## Government Schemes for Farmers 2024–25

Here are the key Central Government schemes you can benefit from:

### 💰 Income Support
| Scheme | Benefit | Eligibility |
|--------|---------|-------------|
| PM-KISAN | ₹6,000/year in 3 installments | All small & marginal farmers |
| PMFBY (Crop Insurance) | Full crop loss coverage | All farmers growing notified crops |
| KCC (Kisan Credit Card) | Short-term credit at 4% interest | Farmers with land records |

### 🌱 Agricultural Development
- **PMKSY** (Pradhan Mantri Krishi Sinchayee Yojana) — irrigation infrastructure subsidy
- **PKVY** (Paramparagat Krishi Vikas Yojana) — ₹50,000/ha for organic farming
- **e-NAM** — national online agricultural marketplace for better prices
- **Soil Health Card** — free soil testing and fertilizer recommendations

### 🏦 Credit & Insurance
- **NABARD loans** at 7% for farm equipment purchase
- **PM-FABY** — Fasal Bima Yojana for area-specific weather risks
- **Interest subvention scheme** — 2% additional subvention on prompt repayment

### 📢 How to Apply
1. Visit your nearest **Common Service Centre (CSC)**
2. Call the PM-KISAN helpline: **155261**
3. Visit **pmkisan.gov.in** or **agricoop.gov.in**

### 💡 Pro Tip
> Keep your Aadhaar, bank passbook, land records (7/12 extract), and caste certificate ready for all scheme registrations.`,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 3600000 + 3000).toISOString(),
      },
    ],
  },
  {
    id: "conv-005",
    title: "Cotton cultivation cost",
    preview: "The estimated cultivation cost for cotton per acre...",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    pinned: false,
    category: "lastWeek",
    messages: [
      {
        id: "m9",
        role: "user",
        text: "Estimate cultivation cost for cotton per acre",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "m10",
        role: "ai",
        text: `## Cotton Cultivation Cost Estimation (Per Acre)

Here is a detailed cost breakdown for cotton cultivation in Central India:

### 📋 Input Cost Breakdown

| Input | Cost (₹) |
|-------|---------|
| Land Preparation (ploughing + levelling) | 2,500 |
| Seeds (Bt Cotton hybrid) | 900 |
| Fertilizers (NPK + micronutrients) | 3,200 |
| Pesticides & herbicides | 2,800 |
| Irrigation (8–10 rounds) | 3,500 |
| Labour (sowing, weeding, picking) | 5,500 |
| Miscellaneous | 600 |
| **Total Input Cost** | **19,000** |

### 📈 Expected Returns

| Parameter | Value |
|-----------|-------|
| Average Yield | 15–18 qtl/acre |
| Current MSP | ₹6,620/qtl |
| Gross Revenue | ₹99,300–₹1,19,160 |
| **Net Profit** | **₹80,300–₹1,00,160** |

### 💡 Cost Reduction Tips
- **Use Neem-coated Urea** — reduces fertilizer waste
- **Drip irrigation** — saves 40% water cost
- **Intercropping with Moong** — additional ₹5,000–8,000 income
- **Self-help group seeds** — reduce seed cost by 30%

### ⚠️ Risk Factors
> Pink Bollworm and Whitefly infestations can reduce yield by 30–40%. Apply timely pest management.`,
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 3000).toISOString(),
      },
    ],
  },
  {
    id: "conv-006",
    title: "Irrigation schedule for sugarcane",
    preview: "Sugarcane requires about 1500–2500mm of water over its growing period...",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    pinned: false,
    category: "lastWeek",
    messages: [],
  },
  {
    id: "conv-007",
    title: "Organic farming practices",
    preview: "For certified organic farming, follow these key principles...",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    pinned: true,
    category: "lastWeek",
    messages: [],
  },
];

/**
 * Keyword-to-response map for the mock AI service
 * Each entry matches keywords and returns a rich markdown response
 */
export const keywordResponses = {
  wheat: `## Wheat Cultivation Guide 🌾

Wheat is India's most important rabi crop, grown primarily from October to March.

### 🌱 Sowing Guidelines
- **Best Time**: 15 Oct – 15 Nov (timely sown), up to 25 Dec (late sown)
- **Seed Rate**: 100–125 kg/hectare for timely sowing
- **Depth**: 5–6 cm for optimal germination
- **Row Spacing**: 22.5 cm for optimum density

### 💧 Irrigation Schedule

| Growth Stage | Days After Sowing | Critical? |
|-------------|-------------------|-----------|
| Crown Root Initiation | 20–25 DAS | ✅ Yes |
| Tillering | 40–45 DAS | ✅ Yes |
| Jointing | 60–65 DAS | ✅ Yes |
| Flowering | 85–90 DAS | ✅ Yes |
| Grain Filling | 100–105 DAS | ✅ Yes |

### 🧪 Fertilizer Recommendation
**NPK: 120:60:40 kg/hectare**
- Apply full P & K + half N as basal
- Remaining N split in two top dressings

### 💡 Pro Tip
> HD-3086 and PBW-550 are high-yielding varieties suitable for most regions. Always treat seeds with Carboxin or Thiram fungicide before sowing to prevent loose smut.`,

  cotton: `## Cotton Cultivation Guide 🌿

Cotton is a major kharif cash crop, often called "White Gold" of Indian agriculture.

### 📅 Crop Calendar
| Activity | Month |
|----------|-------|
| Field Preparation | April–May |
| Sowing | June–July |
| First Irrigation | 3–4 weeks after sowing |
| Pest Monitoring | August–October |
| Harvesting | October–February |

### 🧪 Fertilizer Schedule (per acre)
- **Basal**: 25 kg DAP + 25 kg MOP
- **30 DAS**: 25 kg Urea
- **60 DAS**: 20 kg Urea + 10 kg MOP
- **90 DAS**: 15 kg Urea (if crop is vigorous)

### 🐛 Common Pests
1. **Pink Bollworm** — Use Bt cotton, pheromone traps
2. **Whitefly** — Neem oil 3ml/L spray
3. **Jassid** — Yellow sticky traps, imidacloprid 0.5ml/L
4. **American Bollworm** — NPV (Nuclear Polyhedrosis Virus) spray

### 💡 Pro Tip
> Never skip picking at 7–8 day intervals during peak harvest. Delayed picking reduces grade and price significantly.

### ⚠️ Warning
> Pink Bollworm resistance to Bt cotton is increasing. Monitor for square and boll damage from 45 DAS onwards.`,

  soil: `## Soil Health & Management Guide 🌍

Healthy soil is the foundation of productive farming. Here's how to assess and improve your soil:

### 🧪 Soil Testing — What to Check

| Parameter | Ideal Range | If Deficient |
|-----------|------------|-------------|
| pH | 6.5 – 7.5 | Add lime (acidic) or gypsum (alkaline) |
| Organic Carbon | > 0.75% | Add FYM/compost 5–10 t/ha |
| Nitrogen (N) | Medium–High | Add Urea/FYM |
| Phosphorus (P) | 11–22 kg/ha | Add DAP or SSP |
| Potassium (K) | > 108 kg/ha | Add MOP |
| Zinc | > 0.6 ppm | Add ZnSO₄ 25 kg/ha |

### 🌿 Soil Improvement Methods
1. **Green Manuring** — Grow Dhaincha or Sunhemp and plough in before flowering
2. **Crop Rotation** — Legumes → Cereals to fix nitrogen naturally
3. **Vermicomposting** — 2 tonnes/acre restores microbial life
4. **Zero Tillage** — Preserves soil structure and reduces erosion
5. **Cover Cropping** — Prevents bare soil between seasons

### 💡 Pro Tip
> Get a **Soil Health Card** from your local Krishi Vigyan Kendra (KVK) — it's FREE and gives crop-specific fertilizer recommendations.

### 🔬 Where to Test
- Local KVK or Agricultural Office
- IARI (New Delhi) labs
- Private labs: ₹200–500 per sample`,

  irrigation: `## Irrigation Management Guide 💧

Efficient irrigation is crucial for crop yield and water conservation.

### 🚿 Irrigation Methods Comparison

| Method | Water Saving | Cost | Best For |
|--------|-------------|------|---------|
| Flood Irrigation | 0% | Low | Rice, Sugarcane |
| Sprinkler | 25–30% | Medium | Wheat, Vegetables |
| Drip Irrigation | 40–50% | High (subsidized) | Horticulture, Cotton |
| Mulching + Drip | 60–70% | Medium-High | All crops |

### 📊 Water Requirements by Crop (mm/season)
- **Rice**: 1200–2000mm
- **Wheat**: 400–600mm  
- **Cotton**: 700–900mm
- **Sugarcane**: 1500–2500mm
- **Vegetables**: 300–600mm

### 💡 Drip Irrigation Subsidy
Under **PMKSY (Per Drop More Crop)** scheme:
- **General farmers**: 45% subsidy
- **SC/ST/Small Marginal**: 55% subsidy
- Apply through your State Agriculture Department

### ⚠️ Warning
> Over-irrigation is as harmful as under-irrigation. It causes waterlogging, root rot, and leaches nutrients deep into soil layers.

### 🌡️ Smart Irrigation Tips
1. Irrigate in **early morning or late evening** to minimize evaporation
2. Use **tensiometers** to measure soil moisture accurately
3. Monitor **evapotranspiration (ET)** for precision irrigation scheduling`,

  pest: `## Integrated Pest Management (IPM) Guide 🐛

IPM combines biological, cultural, and chemical methods to manage pests efficiently and sustainably.

### 🔍 IPM Approach (4 Steps)
1. **Monitor** — Regular scouting, at least twice a week
2. **Identify** — Correctly identify the pest (not all insects are harmful!)
3. **Set Action Threshold** — Treat only when pest numbers exceed economic threshold
4. **Choose Method** — Prefer biological → cultural → chemical (last resort)

### 🌿 Biological Control Options

| Pest | Natural Enemy | Application |
|------|--------------|------------|
| Aphids | Ladybird beetles | Release 500/acre |
| Bollworm | Trichogramma wasp | 50,000 eggs/acre |
| Whitefly | Encarsia parasitoid | Commercial product |
| Caterpillars | Bacillus thuringiensis (Bt) | 1kg/200L water |

### 🧪 Safe Organic Sprays
- **Neem Oil (3%)** — broad spectrum, safe for bees
- **Spinosad** — effective for thrips and leafminers
- **Beauveria bassiana** — fungal biopesticide for soil pests
- **NSKE (5%)** — Neem Seed Kernel Extract

### ⚠️ Pesticide Resistance Warning
> Rotating pesticide classes prevents resistance. Never apply the same chemical family more than twice in a season.`,

  disease: `## Plant Disease Management Guide 🌿

Early detection and correct identification of plant diseases is critical for effective management.

### 🔍 Common Disease Identification

| Disease | Symptoms | Crop Affected | Treatment |
|---------|---------|--------------|-----------|
| Powdery Mildew | White powder on leaves | Wheat, Pea | Sulphur 2g/L |
| Late Blight | Brown water-soaked lesions | Potato, Tomato | Mancozeb 2.5g/L |
| Leaf Rust | Orange/red pustules on leaves | Wheat, Barley | Propiconazole 1ml/L |
| Root Rot | Wilting, root darkening | Cotton, Soybean | Soil drench with Carbendazim |
| Bacterial Wilt | Sudden wilting, ooze test | Potato, Brinjal | No cure — remove infected plants |

### 💊 Disease Prevention Strategies
1. **Seed Treatment** — Treat with Thiram or Trichoderma before sowing
2. **Crop Rotation** — Breaks disease cycles
3. **Resistant Varieties** — Use certified disease-resistant cultivars
4. **Sanitation** — Remove and burn infected crop debris
5. **Balanced Nutrition** — Potassium strengthens cell walls against infection

### 💡 Pro Tip
> Take a clear photo of affected leaves and bring to your nearest KVK for accurate diagnosis before spending on fungicides.

### 🧪 Preventive Spray Schedule
- **Copper Oxychloride (0.3%)** spray at 30 and 60 DAS for fungal prevention
- **Bordeaux Mixture (1%)** for broad-spectrum bacterial/fungal protection`,

  weather: `## Weather & Climate Advisory 🌦

Real-time weather integration is coming soon. Here are the current forecasts for your region (Demo Data):

### 📅 7-Day Forecast (Sample — Central India)

| Day | Condition | Max | Min | Humidity | Advisory |
|-----|-----------|-----|-----|---------|---------|
| Today | ☀️ Sunny | 36°C | 24°C | 45% | Good for field work |
| Tomorrow | 🌤 Partly Cloudy | 34°C | 23°C | 55% | Good for spraying |
| Day 3 | 🌧 Light Rain | 29°C | 22°C | 80% | Avoid pesticide spray |
| Day 4 | ⛈ Thunderstorm | 27°C | 21°C | 90% | Stay indoors |
| Day 5 | 🌦 Showers | 30°C | 22°C | 75% | Check drainage |
| Day 6 | 🌤 Partly Cloudy | 32°C | 23°C | 60% | Resume field work |
| Day 7 | ☀️ Sunny | 35°C | 24°C | 48% | Ideal for harvesting |

### 🌡️ Seasonal Advisory
- **Kharif Season (Jun–Oct)**: Monitor for excess rain and waterlogging
- **Rabi Season (Oct–Mar)**: Watch for cold waves affecting germination
- **Zaid (Mar–Jun)**: High evapotranspiration — increase irrigation frequency

### 💡 Weather-Based Tips
> Never apply pesticides or fertilizers before predicted rain — it causes runoff and waste. Schedule sprays for wind-free, dry mornings.`,

  organic: `## Organic Farming Guide 🌿

Organic farming produces healthier food, improves soil health, and commands premium market prices.

### 🌱 Getting Started with Organic Farming

#### Step 1: Conversion Period
- **Minimum 2–3 years** of organic management before certification
- Stop all synthetic chemicals from Day 1
- Register under **PKVY scheme** for ₹50,000/ha support

#### Step 2: Soil Building
| Input | Application Rate | Frequency |
|-------|-----------------|---------|
| Vermicompost | 2–3 tonnes/acre | Every season |
| FYM | 10–12 tonnes/acre | Before sowing |
| Jeevamrit | 200L/acre | Monthly |
| Beejamrit | Seed treatment | Each season |

#### Step 3: Pest & Disease Management
- **Panchagavya spray** — immunity booster
- **Neem-based products** — NSKE 5%, Neem oil 3%
- **Trichoderma** — soil application for root rot prevention
- **Trap crops** — Marigold, Sunflower to attract pest insects

### 📜 Organic Certification
- **PGS-India** (Participatory Guarantee System) — grassroots certification
- **Third-party certification** — APEDA recognized agencies
- Certification unlocks premium export markets

### 💡 Market Premium
> Certified organic produce commands **20–50% price premium** in urban markets, organic stores, and direct-to-consumer sales.`,

  scheme: `## Government Farming Schemes 2024–25 📢

### 🏆 Top Priority Schemes

#### 1. PM-KISAN (Prime Minister Kisan Samman Nidhi)
- **Benefit**: ₹6,000/year in 3 installments of ₹2,000
- **Eligibility**: All landholding farmers (family)
- **Apply**: pmkisan.gov.in or CSC Centre

#### 2. PMFBY (Pradhan Mantri Fasal Bima Yojana)
- **Benefit**: Full crop loss compensation based on area
- **Premium**: 1.5% (Rabi) / 2% (Kharif) of sum insured
- **Apply**: Through local bank or insurance company

#### 3. KCC (Kisan Credit Card)
- **Benefit**: Short-term agricultural credit at 4% interest
- **Limit**: Up to ₹3 lakh without collateral
- **Apply**: SBI, BOI, or any nationalized bank

### 💧 Irrigation Schemes
| Scheme | Subsidy | For |
|--------|---------|-----|
| PMKSY – Per Drop More Crop | 45–55% | Drip/Sprinkler systems |
| PMKSY – Har Khet Ko Pani | 100% | Irrigation infrastructure |
| Ground Water Development | 50% | Bore wells for small farmers |

### 🌿 Organic & Sustainable
- **PKVY**: ₹50,000/ha for 3 years for organic cluster farming
- **NMSA**: Soil health, water conservation funding
- **Zero Budget Natural Farming**: Training and input support

### 📞 Helplines
- PM-KISAN: **155261**
- Kisan Call Centre: **1800-180-1551** (Free, 6am–10pm)
- Crop Insurance: **14447**`,

  market: `## Market Price Information 📈

Here are the current approximate market prices (Mandiwise data — Demo):

### 🌾 Grain Prices (per quintal)

| Crop | MSP 2024–25 | Mandi Price | Trend |
|------|------------|------------|-------|
| Wheat | ₹2,275 | ₹2,450 | 📈 +7.7% |
| Paddy (Common) | ₹2,183 | ₹2,050 | 📉 -6.1% |
| Maize | ₹2,090 | ₹2,200 | 📈 +5.3% |
| Soybean | ₹4,892 | ₹4,600 | 📉 -6.0% |
| Mustard | ₹5,950 | ₹5,800 | 📉 -2.5% |

### 💰 Cash Crop Prices

| Crop | MSP | Mandi | State |
|------|-----|-------|-------|
| Cotton (Long Staple) | ₹7,521 | ₹8,200 | MP/Maharashtra |
| Sugarcane (FRP) | ₹340/qtl | — | All States |
| Turmeric | — | ₹12,500 | Nizamabad |
| Onion | — | ₹1,800 | Nashik |
| Tomato | — | ₹3,200 | Kolar |

### 📢 Where to Sell at Best Price
1. **e-NAM Platform** — online bidding, better price discovery
2. **FPO (Farmer Producer Organisation)** — collective bargaining power
3. **Direct to Agri-companies** — contract farming arrangements
4. **Organic markets** — premium for certified organic produce

### 💡 Pro Tip
> Register on **e-NAM (enam.gov.in)** to access 1,000+ mandis across India. You can sell your produce without physically transporting it to the mandi.`,

  rice: `## Rice (Paddy) Cultivation Guide 🌾

Rice is the staple food of over 60% of India's population and is grown in kharif season.

### 📅 Cultivation Timeline

| Activity | Timeline |
|----------|---------|
| Nursery Preparation | May–June |
| Transplanting | June–July |
| Active Tillering | 20–40 DAT |
| Panicle Initiation | 60–70 DAT |
| Flowering | 80–90 DAT |
| Harvest | 100–120 DAT |

### 💧 Water Management
- Maintain 2–5 cm standing water during vegetative stage
- Drain field completely 10 days before harvest
- **AWD (Alternate Wetting & Drying)** saves 30% water with no yield loss

### 🧪 Fertilizer (per hectare)
- **N**: 120 kg | **P**: 60 kg | **K**: 60 kg
- Apply Zinc Sulfate 25 kg/ha as basal

### 🐛 Common Pests
- **Brown Plant Hopper (BPH)** — most destructive, use resistant varieties
- **Stem Borer** — coarse turmeric, Trichogramma release
- **Blast Disease** — fungicide Tricyclazole 75 WP

### 💡 SRI Method
> System of Rice Intensification (SRI) can increase yield by 20–50% using fewer seeds, younger seedlings, and intermittent irrigation.`,

  general: `## 🌾 Smart Krishi AI Assistant

Hello! I'm your intelligent farming companion. I can help you with:

### 📚 Topics I Can Help With
- 🌾 **Crop Selection** — best crops for your soil, climate, and season
- 🧪 **Soil Health** — testing, improvement, and nutrient management
- 💊 **Fertilizers** — NPK ratios, organic alternatives, application timing
- 💧 **Irrigation** — scheduling, methods, water conservation
- 🐛 **Pest Control** — IPM strategies, organic solutions, thresholds
- 🌿 **Plant Diseases** — identification, prevention, treatment
- 🌦️ **Weather** — forecasts, advisories, climate-smart farming
- 📢 **Government Schemes** — subsidies, loans, insurance, helplines
- 📈 **Market Prices** — MSP, mandi rates, e-NAM, selling strategies
- 🌱 **Organic Farming** — transition, certification, premium markets
- 💰 **Cost Estimation** — input costs, profit calculation, break-even
- 🚜 **Farm Machinery** — selection, hire, government subsidies

### 💡 Try asking me:
- *"Which fertilizer should I use for wheat in sandy soil?"*
- *"How do I identify and treat powdery mildew in peas?"*
- *"What is the PM-KISAN scheme and how do I apply?"*
- *"Estimate the cost of cultivating tomatoes per acre."*

I'm here 24/7 to help you grow smarter! 🚀`,
};

/**
 * Suggested quick-question chips for the empty chat state and suggestions bar
 */
export const suggestedQuestions = [
  { id: "sq1", icon: "🌾", text: "Which crop is best for black soil?" },
  { id: "sq2", icon: "💧", text: "How much water does wheat need?" },
  { id: "sq3", icon: "🐛", text: "How do I control aphids naturally?" },
  { id: "sq4", icon: "🌦", text: "Will it rain tomorrow in my area?" },
  { id: "sq5", icon: "💰", text: "Estimate cultivation cost for cotton" },
  { id: "sq6", icon: "📢", text: "Which government schemes are available?" },
  { id: "sq7", icon: "🌿", text: "How to start organic farming?" },
  { id: "sq8", icon: "📈", text: "What is the current wheat MSP price?" },
  { id: "sq9", icon: "🧪", text: "Best fertilizer for paddy cultivation" },
  { id: "sq10", icon: "🐚", text: "How to treat soil for next season?" },
];
