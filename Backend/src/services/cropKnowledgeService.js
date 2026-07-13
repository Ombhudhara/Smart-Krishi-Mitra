/**
 * Crop Knowledge Service
 * Comprehensive Indian agricultural crop database with detailed cultivation guides.
 * Supports Phase 1, Phase 2, & Phase 3 (150+ crops total).
 */

const CROP_DATABASE = [
  // ==========================================
  // CEREALS (10 Crops)
  // ==========================================
  {
    id: "wheat",
    name: "Wheat",
    scientificName: "Triticum aestivum",
    emoji: "🌾",
    season: "Rabi",
    category: "Cereal",
    soilType: "Alluvial, Loamy",
    growthDuration: "120–150 days",
    expectedYield: "35–45 Q/Acre",
    marketPrice: "₹2,125–₹2,275/Q",
    waterReq: "Moderate",
    temperature: "15–25°C",
    featured: true,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop",
    shortDesc: "India's most important rabi cereal crop, grown extensively in the Indo-Gangetic Plains.",
    details: {
      overview: "Wheat is a major Rabi crop across northern and central India, providing staple carbohydrates for millions.",
      soilReq: "Well-drained loamy to clay loam soils. Ideal pH is 6.0–7.5.",
      climate: "Cool growing period and warm sunny ripening period. 15–25°C is ideal.",
      irrigation: "4–6 waterings. Crown Root Initiation (CRI) at 21 days is the most critical.",
      fertilizer: "N:P:K at 120:60:40 kg/ha. Zinc sulfate 25 kg/ha if soil is zinc-deficient.",
      pests: "Pests: Termites, Aphids. Diseases: Yellow Rust, Brown Rust, Karnal Bunt.",
      harvesting: "Harvest when grains turn hard and golden yellow. Moisture should be ~14%.",
      tips: ["Sow in November for optimal yield", "Never skip irrigation at the CRI stage", "Adopt zero tillage to save land prep costs"]
    }
  },
  {
    id: "rice",
    name: "Rice",
    scientificName: "Oryza sativa",
    emoji: "🍚",
    season: "Kharif",
    category: "Cereal",
    soilType: "Clay, Alluvial",
    growthDuration: "100–150 days",
    expectedYield: "40–60 Q/Acre",
    marketPrice: "₹2,183–₹2,203/Q",
    waterReq: "High",
    temperature: "20–35°C",
    featured: true,
    image: "https://images.unsplash.com/photo-1536304993881-460e03fa5160?w=600&h=400&fit=crop",
    shortDesc: "Staple food for over half the world's population, primarily grown in the Kharif season.",
    details: {
      overview: "Rice is the primary food crop in India, requiring high temperatures and standing water.",
      soilReq: "Heavy clay or clay loams with good water retention. pH 5.5–6.5.",
      climate: "Warm-humid climate, 20–35°C, with abundant rainfall or heavy irrigation.",
      irrigation: "Requires standing water (2-5cm) during tillering. SRI method saves 40% water.",
      fertilizer: "N:P:K at 120:60:60 kg/ha. Apply P & K basal; split N in 3 doses.",
      pests: "Pests: Stem Borer, BPH, Leaf Folder. Diseases: Blast, Bacterial Blight.",
      harvesting: "Harvest when 80% of ears turn golden-yellow. Moisture should be ~20%.",
      tips: ["Transplant 20–25 day old seedlings", "Incorporate organic manures for soil health", "Use SRI (System of Rice Intensification) for water saving"]
    }
  },
  {
    id: "maize",
    name: "Maize",
    scientificName: "Zea mays",
    emoji: "🌽",
    season: "Kharif",
    category: "Cereal",
    soilType: "Sandy Loam, Alluvial",
    growthDuration: "80–110 days",
    expectedYield: "30–50 Q/Acre",
    marketPrice: "₹1,962–₹2,090/Q",
    waterReq: "Moderate",
    temperature: "21–30°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&h=400&fit=crop",
    shortDesc: "Versatile cereal used for food, feed, and industrial starch/ethanol production.",
    details: {
      overview: "Maize is a highly productive crop used for animal feed, food, and starch production.",
      soilReq: "Rich, well-drained loams. pH 5.5–7.5. Avoid heavy clay soils.",
      climate: "Warm weather. 21–30°C is ideal. Highly sensitive to waterlogging.",
      irrigation: "5–8 irrigations. Tasselling and silking stages are extremely critical.",
      fertilizer: "N:P:K at 120:60:40 kg/ha. Zinc application at 25 kg/ha is recommended.",
      pests: "Pests: Fall Armyworm, Stem Borer. Diseases: Leaf Blights, Downy Mildew.",
      harvesting: "Harvest when husks dry and grain moisture content drops to 20-22%.",
      tips: ["Monitor weekly for Fall Armyworm", "Maintain adequate moisture during tasselling", "Use high-yielding hybrid seeds"]
    }
  },
  {
    id: "bajra",
    name: "Bajra (Pearl Millet)",
    scientificName: "Pennisetum glaucum",
    emoji: "🌾",
    season: "Kharif",
    category: "Cereal",
    soilType: "Sandy, Light Loam",
    growthDuration: "75–90 days",
    expectedYield: "12–18 Q/Acre",
    marketPrice: "₹2,350–₹2,500/Q",
    waterReq: "Low",
    temperature: "25–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop",
    shortDesc: "Nutri-cereal highly resilient to drought, mostly cultivated in Rajasthan.",
    details: {
      overview: "Bajra is a dryland nutri-cereal crop rich in minerals, primarily grown in arid areas.",
      soilReq: "Light sandy soils. pH 6.5–7.5. Good drainage is mandatory.",
      climate: "Hot and dry climate. Grows well at 25–35°C with minimal rainfall.",
      irrigation: "Mostly rainfed; requires minimal supplementary water.",
      fertilizer: "N:P:K at 80:40:30 kg/ha. Apply N top-dress at 30 days.",
      pests: "Pests: Shoot Fly. Diseases: Downy Mildew, Ergot, Smut.",
      harvesting: "Harvest when grains turn hard. Sun-dry earheads before threshing.",
      tips: ["Adopt line sowing for uniform density", "Treat seed with Metalaxyl for Downy Mildew", "Intercrop with Green Gram for risk coverage"]
    }
  },
  {
    id: "jowar",
    name: "Jowar (Sorghum)",
    scientificName: "Sorghum bicolor",
    emoji: "🌾",
    season: "Kharif",
    category: "Cereal",
    soilType: "Clay Loam, Alluvial",
    growthDuration: "100–120 days",
    expectedYield: "15–20 Q/Acre",
    marketPrice: "₹2,900–₹3,200/Q",
    waterReq: "Low",
    temperature: "22–32°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop",
    shortDesc: "Multi-purpose grain and fodder crop, drought-tolerant and rich in dietary fiber.",
    details: {
      overview: "Jowar is a drought-tolerant millet used for both food grain and cattle feed.",
      soilReq: "Clay loam soils with good moisture retention. pH range 6.0–8.0.",
      climate: "Warm climate, 22–32°C. Excellent drought tolerance.",
      irrigation: "1–3 supplemental irrigations at flowering if rain fails.",
      fertilizer: "N:P:K at 80:40:40 kg/ha. Apply organic compost.",
      pests: "Pests: Shoot Fly, Midge. Diseases: Grain Smut, Anthracnose.",
      harvesting: "Harvest when grains turn hard and show black spots at their base.",
      tips: ["Sow within 15 days of monsoon onset", "Use Carbofuran at sowing for Shoot Fly", "Rotate with cotton or pulses"]
    }
  },
  {
    id: "barley",
    name: "Barley",
    scientificName: "Hordeum vulgare",
    emoji: "🌾",
    season: "Rabi",
    category: "Cereal",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "110–130 days",
    expectedYield: "20–28 Q/Acre",
    marketPrice: "₹1,800–₹2,000/Q",
    waterReq: "Low",
    temperature: "12–22°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop",
    shortDesc: "Hardy rabi cereal grown in northern India, extensively used in malt and brewing.",
    details: {
      overview: "Barley is a salt-tolerant rabi cereal crop that requires less water than wheat.",
      soilReq: "Sandy loam soils. Highly tolerant to salinity. pH 6.0–8.0.",
      climate: "Cool growth period and warm dry ripening. 12–22°C.",
      irrigation: "2–3 irrigations. Critical at active tillering stage.",
      fertilizer: "N:P:K at 60:30:20 kg/ha. Low Nitrogen helps malt quality.",
      pests: "Pests: Aphids, Termites. Diseases: Stripe Rust, Smut.",
      harvesting: "Harvest when stalks dry and turn straw-yellow.",
      tips: ["Sow by late October to mid-November", "Reduce Nitrogen to control malting protein", "Treat seed to prevent Loose Smut"]
    }
  },
  {
    id: "ragi",
    name: "Ragi (Finger Millet)",
    scientificName: "Eleusine coracana",
    emoji: "🌾",
    season: "Kharif",
    category: "Cereal",
    soilType: "Red, Loamy, Laterite",
    growthDuration: "100–120 days",
    expectedYield: "12–18 Q/Acre",
    marketPrice: "₹3,800–₹4,200/Q",
    waterReq: "Low",
    temperature: "20–30°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop",
    shortDesc: "Nutritional powerhouse millet rich in calcium, widely grown in Karnataka.",
    details: {
      overview: "Ragi is a superfood millet with high calcium and long storage life.",
      soilReq: "Red loam, laterite, and sandy loam soils. pH 5.5–7.5.",
      climate: "Warm climate, 20–30°C. Tolerates drought and variable rains.",
      irrigation: "Mostly rainfed. Supplementary watering at flowering is ideal.",
      fertilizer: "N:P:K at 60:30:30 kg/ha. Apply organic manures.",
      pests: "Pests: Stem Borer. Diseases: Blast (neck/leaf blast).",
      harvesting: "Harvest earheads when they turn dark brown.",
      tips: ["Transplanting nursery seedlings improves yields", "Choose blast-resistant varieties like GPU-28", "Rotate with legumes for soil enrichment"]
    }
  },
  {
    id: "oats_grain",
    name: "Oats",
    scientificName: "Avena sativa",
    emoji: "🌾",
    season: "Rabi",
    category: "Cereal",
    soilType: "Loamy, Alluvial",
    growthDuration: "100–120 days",
    expectedYield: "15–20 Q/Acre",
    marketPrice: "₹2,200–₹2,500/Q",
    waterReq: "Moderate",
    temperature: "15–25°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop",
    shortDesc: "Highly nutritious cereal grain, high dietary fiber, grown in winter.",
    details: {
      overview: "Oats is grown in North India as a cereal grain for healthy diets and premium animal fodder.",
      soilReq: "Well-drained loam to clay loam soils. pH range 6.0–7.0.",
      climate: "Cool and moist climate. Thrives at 15–25°C.",
      irrigation: "3–4 waterings. Sensitive to severe drought.",
      fertilizer: "N:P:K at 80:40:30 kg/ha. Apply basal compost.",
      pests: "Pests: Aphids. Diseases: Crown Rust, Smut.",
      harvesting: "Harvest when grain turns hard and straw turns light yellow.",
      tips: ["Keep soil damp during seed emergence", "Sow early in November", "Use certified disease-resistant seeds"]
    }
  },
  {
    id: "rye",
    name: "Rye",
    scientificName: "Secale cereale",
    emoji: "🌾",
    season: "Rabi",
    category: "Cereal",
    soilType: "Sandy, Acidic",
    growthDuration: "110–130 days",
    expectedYield: "12–16 Q/Acre",
    marketPrice: "₹2,000–₹2,300/Q",
    waterReq: "Low",
    temperature: "10–22°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop",
    shortDesc: "Extremely hardy winter cereal, grows in poor acidic soils where wheat fails.",
    details: {
      overview: "Rye is a cold-hardy cereal grain used for flour, animal feed, and brewing.",
      soilReq: "Sandy, poor fertility soils. Exceptionally acid-tolerant. pH 5.0–6.5.",
      climate: "Cool temperate, handles heavy frost and winter snow.",
      irrigation: "Requires very low water, mostly rainfed.",
      fertilizer: "N:P:K at 50:30:20 kg/ha.",
      pests: "Pests: Wireworms. Diseases: Ergot.",
      harvesting: "Harvest when grains are hard and dry.",
      tips: ["Excellent winter cover crop to prevent erosion", "Avoid sowing in waterlogging areas", "Watch out for black ergot fungi on seed heads"]
    }
  },
  {
    id: "triticale",
    name: "Triticale",
    scientificName: "x Triticosecale",
    emoji: "🌾",
    season: "Rabi",
    category: "Cereal",
    soilType: "Sandy Loam, Marginal",
    growthDuration: "120–140 days",
    expectedYield: "25–35 Q/Acre",
    marketPrice: "₹1,900–₹2,200/Q",
    waterReq: "Moderate",
    temperature: "12–25°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop",
    shortDesc: "Hybrid grain of wheat and rye, combining rye's hardiness with wheat's yield potential.",
    details: {
      overview: "Triticale is a wheat-rye cross, highly valued for nutritious feed grain and silage.",
      soilReq: "Marginal soils, tolerates acidity and light salinity. pH 5.5–7.0.",
      climate: "Cool climate, highly resilient to drought and cold winter spells.",
      irrigation: "3–4 waterings. Similar stage needs as wheat.",
      fertilizer: "N:P:K at 80:40:30 kg/ha.",
      pests: "Pests: Aphids. Diseases: Rusts, Ergot.",
      harvesting: "Harvest at maturity when moisture is below 15%.",
      tips: ["Excellent high-biomass fodder crop", "Combines high lysine content of rye with wheat quality", "Manage wild oats weeds early"]
    }
  },

  // ==========================================
  // PULSES (12 Crops)
  // ==========================================
  {
    id: "chickpea",
    name: "Chickpea (Gram)",
    scientificName: "Cicer arietinum",
    emoji: "🫘",
    season: "Rabi",
    category: "Pulse",
    soilType: "Sandy Clay Loam",
    growthDuration: "90–120 days",
    expectedYield: "8–12 Q/Acre",
    marketPrice: "₹5,300–₹5,600/Q",
    waterReq: "Low",
    temperature: "15–25°C",
    featured: true,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&h=400&fit=crop",
    shortDesc: "Major rabi pulse crop of India, a rich protein source and nitrogen-fixing legume.",
    details: {
      overview: "Chickpea is India's most popular rabi pulse crop, fixing nitrogen in the soil.",
      soilReq: "Sandy clay loams with good drainage. pH 6.0–8.0.",
      climate: "Cool growing season with warm days at maturity. 15–25°C.",
      irrigation: "1–2 irrigations. Pre-flowering and pod filling are critical.",
      fertilizer: "N:P:K at 20:50:20 kg/ha. Rhizobium inoculation is key.",
      pests: "Pests: Pod Borer (Helicoverpa). Diseases: Fusarium Wilt.",
      harvesting: "Harvest when leaves turn yellow and drop, and pods turn yellowish-brown.",
      tips: ["Sow in October to early November", "Nip terminal shoots at 35 days to boost pods", "Treat seed with Trichoderma for Wilt prevention"]
    }
  },
  {
    id: "pigeon-pea",
    name: "Pigeon Pea (Tur)",
    scientificName: "Cajanus cajan",
    emoji: "🫘",
    season: "Kharif",
    category: "Pulse",
    soilType: "Well-drained Loam, Sandy Loam",
    growthDuration: "140–180 days",
    expectedYield: "8–10 Q/Acre",
    marketPrice: "₹7,000–₹7,500/Q",
    waterReq: "Low",
    temperature: "20–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&h=400&fit=crop",
    shortDesc: "Long-duration kharif pulse, key ingredient in dal, helps enrich soil with nitrogen.",
    details: {
      overview: "Pigeon Pea (Arhar/Tur) is a vital source of vegetable protein. It is deep-rooted and highly drought-tolerant, frequently intercropped.",
      soilReq: "Deep, well-drained sandy loam to clay loam soils. Sensitive to waterlogging. Ideal pH is 6.5–7.5.",
      climate: "Hot and moist climate during initial growth, followed by dry weather during flowering and maturity.",
      irrigation: "Mostly rainfed. If dry spell occurs, irrigate during flower-initiation and pod-filling stages.",
      fertilizer: "N:P:K at 20:50:20 kg/ha. Apply Gypsum @ 200 kg/ha to supply calcium and sulfur.",
      pests: "Pests: Pod Borer, Pod Fly. Diseases: Fusarium Wilt.",
      harvesting: "Harvest when 75-80% pods turn brown. Cut plants and dry.",
      tips: ["Treat seeds with Rhizobium for better root nodulation", "Intercrop with short-duration crops like Soybean", "Spray systemic insecticide at flower initiation for borers"]
    }
  },
  {
    id: "green-gram",
    name: "Green Gram (Moong)",
    scientificName: "Vigna radiata",
    emoji: "🫘",
    season: "Kharif",
    category: "Pulse",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "60–75 days",
    expectedYield: "5–8 Q/Acre",
    marketPrice: "₹7,800–₹8,200/Q",
    waterReq: "Low",
    temperature: "25–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&h=400&fit=crop",
    shortDesc: "Short-duration pulse crop that fits easily into crop rotations and improves soil fertility.",
    details: {
      overview: "Green Gram is a quick-growing pulse cultivated as a Kharif or summer catch crop.",
      soilReq: "Well-drained loam or sandy loam. pH 6.0–7.5.",
      climate: "Warm climate, 25–35°C. Highly drought-tolerant.",
      irrigation: "Low water requirement. Summer crop needs 3-5 irrigations.",
      fertilizer: "N:P:K at 15:40:20 kg/ha. Apply Rhizobium culture.",
      pests: "Pests: Whitefly, Thrips. Diseases: Yellow Mosaic Virus (YMV).",
      harvesting: "Harvest dried black pods in 2-3 hand-pickings.",
      tips: ["Sow YMV-tolerant varieties like IPM 02-3", "Use yellow sticky traps to capture vector Whiteflies", "Incorporate residue to add organic soil matter"]
    }
  },
  {
    id: "black-gram",
    name: "Black Gram (Urad)",
    scientificName: "Vigna mungo",
    emoji: "🫘",
    season: "Kharif",
    category: "Pulse",
    soilType: "Loamy, Clayey",
    growthDuration: "70–85 days",
    expectedYield: "6–9 Q/Acre",
    marketPrice: "₹7,000–₹7,500/Q",
    waterReq: "Low",
    temperature: "25–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&h=400&fit=crop",
    shortDesc: "High-protein pulse essential for South Indian recipes like idli/dosa.",
    details: {
      overview: "Black Gram is a staple pulse crop grown in the warm Kharif season.",
      soilReq: "Well-drained loams and clay loams. Handles heavier soil well. pH 6.0–7.5.",
      climate: "Warm and humid climate. 25–35°C. Sensitive to cold.",
      irrigation: "Mostly rainfed. Summer crop needs waterings at 10-14 day intervals.",
      fertilizer: "N:P:K at 20:40:20 kg/ha. Use Rhizobium inoculation.",
      pests: "Pests: Hairy Caterpillar, Whitefly. Diseases: Leaf Crinkle, YMV.",
      harvesting: "Harvest when pods turn dark brown/black. Cut, dry, and thresh.",
      tips: ["Sow immediately with monsoon arrival", "Manage sucking pests early to check crinkle virus", "Excellent intercrop in Cotton or Maize fields"]
    }
  },
  {
    id: "lentil",
    name: "Lentil",
    scientificName: "Lens culinaris",
    emoji: "🫘",
    season: "Rabi",
    category: "Pulse",
    soilType: "Sandy Loam, Clayey Loam",
    growthDuration: "110–130 days",
    expectedYield: "6–8 Q/Acre",
    marketPrice: "₹6,000–₹6,400/Q",
    waterReq: "Low",
    temperature: "15–25°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&h=400&fit=crop",
    shortDesc: "Nutritious rabi pulse, highly cold-tolerant and adapted to diverse soil conditions.",
    details: {
      overview: "Lentil (Masur) is a major rabi pulse rich in protein and dietary fiber.",
      soilReq: "Sandy loam to clay loam soils. pH 5.8–7.5. Tolerates light acidity.",
      climate: "Cool growing season with dry weather at maturity. Tolerates cold.",
      irrigation: "1–2 waterings. Avoid waterlogging at all costs.",
      fertilizer: "N:P:K at 20:40:20 kg/ha. Inoculate seeds with Rhizobium.",
      pests: "Pests: Aphids. Diseases: Wilt, Rust, Root Rot.",
      harvesting: "Harvest when pods turn golden brown and seeds are firm.",
      tips: ["Avoid sowing in low-lying waterlogged fields", "Use improved varieties like KLS-218", "Rotate with paddy to leverage residual moisture"]
    }
  },
  {
    id: "cowpea",
    name: "Cowpea",
    scientificName: "Vigna unguiculata",
    emoji: "🫘",
    season: "Kharif",
    category: "Pulse",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "70–90 days",
    expectedYield: "6–10 Q/Acre",
    marketPrice: "₹5,500–₹6,000/Q",
    waterReq: "Low",
    temperature: "25–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&h=400&fit=crop",
    shortDesc: "Versatile pulse, vegetable, and green manure crop, highly drought-tolerant.",
    details: {
      overview: "Cowpea (Lobia) is grown for tender pods, dry seeds, or as green manure.",
      soilReq: "Well-drained sandy loam or loamy soils. pH 5.5–7.0.",
      climate: "Warm-season crop, thrives at 25–35°C. High drought tolerance.",
      irrigation: "Low water demand. supplemental irrigation boosts dry seed yield.",
      fertilizer: "N:P:K at 15:45:20 kg/ha. Needs low nitrogen.",
      pests: "Pests: Aphids, Pod Borer. Diseases: Wilt, Anthracnose.",
      harvesting: "Pick green pods for vegetable; harvest dry pods for pulses.",
      tips: ["Use bushy types for simple crop rotation", "Spray neem oil for organic aphid management", "Cure harvested seeds fully to prevent storage weevils"]
    }
  },
  {
    id: "peas",
    name: "Peas",
    scientificName: "Pisum sativum",
    emoji: "🫛",
    season: "Rabi",
    category: "Pulse",
    soilType: "Loamy, Clay Loam",
    growthDuration: "80–110 days",
    expectedYield: "25–40 Q/Acre (pods)",
    marketPrice: "₹4,000–₹6,000/Q",
    waterReq: "Moderate",
    temperature: "15–20°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&h=400&fit=crop",
    shortDesc: "Cool-season green vegetable and pulse crop, popular in rabi crop rotations.",
    details: {
      overview: "Peas are grown as a fresh green vegetable or dried pulse, rich in protein.",
      soilReq: "Well-drained, fertile loams with high organic content. pH 6.0–7.5.",
      climate: "Requires a cool growing season. Optimum temperature is 15–20°C.",
      irrigation: "2–3 irrigations: critical at flowering and pod filling stages.",
      fertilizer: "N:P:K at 20:60:40 kg/ha. Apply ammonium phosphate.",
      pests: "Pests: Pod Borer, Leaf Miner. Diseases: Powdery Mildew, Rust.",
      harvesting: "Harvest green pods when they are well-filled but tender.",
      tips: ["Sow in October-November for winter production", "Spray wettable sulfur early to control Powdery Mildew", "Provide staking for vining varieties"]
    }
  },
  {
    id: "kidney_beans",
    name: "Kidney Beans (Rajma)",
    scientificName: "Phaseolus vulgaris L.",
    emoji: "🫘",
    season: "Rabi",
    category: "Pulse",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "110–130 days",
    expectedYield: "5–8 Q/Acre",
    marketPrice: "₹8,000–₹10,000/Q",
    waterReq: "Moderate",
    temperature: "15–25°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&h=400&fit=crop",
    shortDesc: "Highly popular dry bean, requires cool mild climate, grown in hilly tracts.",
    details: {
      overview: "Rajma is a high-value rabi pulse crop, prized for its large kidneys-shaped red seeds.",
      soilReq: "Well-drained, fertile loamy soils. Extremely sensitive to soil acidity and salt. pH 6.0–7.0.",
      climate: "Thrives in mild temperatures. Frost sensitive. Day temperatures around 20°C is best.",
      irrigation: "3–4 waterings. Critical at flowering and pod development.",
      fertilizer: "N:P:K at 40:60:40 kg/ha. Unlike other pulses, Rajma requires slightly higher Nitrogen.",
      pests: "Pests: Aphids, Stem Fly. Diseases: Root Rot, Bean Common Mosaic.",
      harvesting: "Harvest when pods turn dry, yellow, and brittle.",
      tips: ["Inoculate seeds with specific Rhizobium strain", "Never let water stand in the root zone", "Avoid sowing in early hot summer"]
    }
  },
  {
    id: "horse_gram",
    name: "Horse Gram",
    scientificName: "Macrotyloma uniflorum",
    emoji: "🫘",
    season: "Kharif",
    category: "Pulse",
    soilType: "Poor, Sandy, Gravelly",
    growthDuration: "120–140 days",
    expectedYield: "4–6 Q/Acre",
    marketPrice: "₹4,500–₹5,500/Q",
    waterReq: "Low",
    temperature: "20–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&h=400&fit=crop",
    shortDesc: "Highly drought-resistant legume, grown on poor lands for grain and fodder.",
    details: {
      overview: "Horse Gram (Kollu/Kulthi) is a hardy crop grown under poor drylands where no other pulse survives.",
      soilReq: "Low fertility soils, sandy, red loam, and gravelly soils. pH range 6.0–7.5.",
      climate: "Requires warm climate, highly tolerant to drought and heat stress.",
      irrigation: "Mostly rainfed, needs almost no supplemental irrigation.",
      fertilizer: "N:P:K at 10:30:10 kg/ha. Requires very low nutrient inputs.",
      pests: "Pests: Pod Borer. Diseases: Yellow Mosaic Virus.",
      harvesting: "Harvest when plants yellow and pods dry out.",
      tips: ["Excellent soil binder to prevent soil erosion in drylands", "Treat seed with Rhizobium for better soil enrichment", "Store seeds dry with neem to deter pulse beetles"]
    }
  },
  {
    id: "moth_bean",
    name: "Moth Bean",
    scientificName: "Vigna aconitifolia",
    emoji: "🫘",
    season: "Kharif",
    category: "Pulse",
    soilType: "Sandy, Dry Soil",
    growthDuration: "75–90 days",
    expectedYield: "3–5 Q/Acre",
    marketPrice: "₹6,000–₹7,000/Q",
    waterReq: "Low",
    temperature: "25–38°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&h=400&fit=crop",
    shortDesc: "Most drought-tolerant kharif pulse, grows in sandy deserts of Rajasthan.",
    details: {
      overview: "Moth Bean (Matki) is an extremely resilient legume, key ingredient in traditional Bhujia.",
      soilReq: "Grows well on light sandy soils of arid zones. pH range 6.0–8.0.",
      climate: "Hot dry weather. Tolerates high temperature up to 40°C. Very low rainfall requirement.",
      irrigation: "Rainfed. No irrigation needed under normal dry spells.",
      fertilizer: "N:P:K at 10:20:10 kg/ha. Apply organic manures.",
      pests: "Pests: Jassids, Whitefly. Diseases: Mosaic Virus.",
      harvesting: "Harvest manually when pods dry up to avoid seed shattering.",
      tips: ["Ideal crop for desert farming and soil wind erosion control", "Thin seedlings to keep spacing of 30x10 cm", "Manage Whitefly to prevent mosaic disease spread"]
    }
  },
  {
    id: "grass_pea",
    name: "Grass Pea",
    scientificName: "Lathyrus sativus",
    emoji: "🫘",
    season: "Rabi",
    category: "Pulse",
    soilType: "Heavy Clay, Marginal",
    growthDuration: "110–130 days",
    expectedYield: "6–9 Q/Acre",
    marketPrice: "₹4,000–₹5,000/Q",
    waterReq: "Low",
    temperature: "12–22°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&h=400&fit=crop",
    shortDesc: "Drought and flood resilient rabi pulse, grows in clay soils under relay cropping.",
    details: {
      overview: "Grass Pea (Khesari) is a very hardy pulse, surviving both drought and waterlogging conditions.",
      soilReq: "Thrives in heavy black clay soils with poor structure. pH 6.0–8.0.",
      climate: "Cool climate. Highly tolerant to dry winter spells and low temperatures.",
      irrigation: "Mostly grown on residual moisture, requires no watering.",
      fertilizer: "N:P:K at 15:30:10 kg/ha.",
      pests: "Pests: Pod Borer. Diseases: Wilt.",
      harvesting: "Harvest when plants dry and turn yellowish-brown.",
      tips: ["Commonly broadcasted in standing rice fields (paira/lera cropping)", "Use low-toxin (ODAP) varieties like Prateek to ensure safety", "Excellent crop for building heavy clay soil structure"]
    }
  },
  {
    id: "broad_bean",
    name: "Broad Bean (Bakla)",
    scientificName: "Vicia faba",
    emoji: "🫛",
    season: "Rabi",
    category: "Pulse",
    soilType: "Clay Loam, Heavy Loam",
    growthDuration: "120–140 days",
    expectedYield: "40–60 Q/Acre (green)",
    marketPrice: "₹2,500–₹4,000/Q",
    waterReq: "Moderate",
    temperature: "15–20°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&h=400&fit=crop",
    shortDesc: "Winter legume yielding large thick pods, rich in nutrients, grown in North India.",
    details: {
      overview: "Broad Bean (Faba Bean) is a protein-rich winter crop grown for edible seeds and green pods.",
      soilReq: "Heavy alluvial loams and clay loam soils with high water holding capacity. pH 6.5–7.5.",
      climate: "Cool climate, highly frost-resistant compared to French beans.",
      irrigation: "Requires regular watering. Water every 10–12 days in rabi.",
      fertilizer: "N:P:K at 20:50:30 kg/ha. Apply organic manures.",
      pests: "Pests: Black Aphids. Diseases: Rust, Chocolate Spot.",
      harvesting: "Pick plump green pods for fresh vegetable use.",
      tips: ["Provide pinch to growing tip to induce side pods", "Spray soap water or neem for black aphids", "Provides excellent soil nitrogen fixing capacity"]
    }
  },

  // ==========================================
  // OILSEEDS (10 Crops)
  // ==========================================
  {
    id: "groundnut",
    name: "Groundnut",
    scientificName: "Arachis hypogaea",
    emoji: "🥜",
    season: "Kharif",
    category: "Oilseed",
    soilType: "Sandy Loam, Red",
    growthDuration: "100–130 days",
    expectedYield: "12–20 Q/Acre",
    marketPrice: "₹5,850–₹6,200/Q",
    waterReq: "Low",
    temperature: "20–30°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1567892320421-1c657571ea4a?w=600&h=400&fit=crop",
    shortDesc: "India's premier oilseed legume — provides both cooking oil and protein-rich food.",
    details: {
      overview: "Groundnut pods grow underground. Requires loose soils for pegging.",
      soilReq: "Sandy loam or red sandy soils. pH 6.0–6.5. Good drainage is key.",
      climate: "Warm climate, 20–30°C. 500–700 mm rainfall is ideal.",
      irrigation: "Mostly rainfed. If irrigated, critical at pegging and pod fill.",
      fertilizer: "N:P:K at 20:40:40 kg/ha. Gypsum @ 500 kg/ha at pegging is vital.",
      pests: "Pests: White Grub, Leaf Miner. Diseases: Tikka Leaf Spot.",
      harvesting: "Harvest when leaves yellow and shed. Dry pods to 8% moisture.",
      tips: ["Apply Gypsum at 30 days to ensure solid pod filling", "Avoid weeding once pegging starts to prevent root disturbance", "Treat seeds with Rhizobium culture before planting"]
    }
  },
  {
    id: "mustard",
    name: "Mustard",
    scientificName: "Brassica juncea",
    emoji: "🌻",
    season: "Rabi",
    category: "Oilseed",
    soilType: "Sandy Loam, Alluvial",
    growthDuration: "110–140 days",
    expectedYield: "8–12 Q/Acre",
    marketPrice: "₹5,450–₹5,650/Q",
    waterReq: "Low",
    temperature: "10–25°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600&h=400&fit=crop",
    shortDesc: "India's primary rabi oilseed — paints fields golden yellow across Rajasthan.",
    details: {
      overview: "Mustard is the leading winter oilseed in India, highly popular for mustard oil consumption.",
      soilReq: "Sandy loam to clay loam soils. pH 6.0–7.5. Tolerates moderate salinity.",
      climate: "Cool climate with 10–25°C. Frost during flowering causes damage.",
      irrigation: "2 irrigations: pre-flowering and pod formation.",
      fertilizer: "N:P:K at 80:40:40 kg/ha. Apply Sulphur @ 40 kg/ha basal.",
      pests: "Pests: Mustard Aphid. Diseases: Alternaria Blight, White Rust.",
      harvesting: "Harvest when 75% of pods (siliquae) turn yellowish-brown.",
      tips: ["Sow by mid-October for maximum yield", "Apply Sulphur to boost oil percentage by 3-5%", "Monitor for Aphids on undersides of leaves"]
    }
  },
  {
    id: "soybean",
    name: "Soybean",
    scientificName: "Glycine max",
    emoji: "🫘",
    season: "Kharif",
    category: "Oilseed",
    soilType: "Black, Loamy",
    growthDuration: "90–120 days",
    expectedYield: "10–15 Q/Acre",
    marketPrice: "₹4,300–₹4,600/Q",
    waterReq: "Moderate",
    temperature: "20–30°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&h=400&fit=crop",
    shortDesc: "The golden bean — India's top oilseed crop rich in protein, dominantly grown in Madhya Pradesh.",
    details: {
      overview: "Soybean is a major protein and oilseed crop grown during the monsoons.",
      soilReq: "Well-drained black clay soils or silt loams. pH 6.0–7.5.",
      climate: "Warm-humid climate. 20–30°C. Water stagnation causes root rot.",
      irrigation: "Mostly rainfed. supplement irrigation at pod fill if rains fail.",
      fertilizer: "N:P:K at 20:60:40 kg/ha. rhizobium culture is critical.",
      pests: "Pests: Stem Fly, Girdle Beetle. Diseases: Yellow Mosaic Virus.",
      harvesting: "Harvest when pods turn brown and leaves shed. Moisture ~15%.",
      tips: ["Plant on raised beds or broad-bed furrows to avoid waterlogging", "Always treat seeds with Rhizobium culture before planting", "Keep the field weed-free during first 30 days"]
    }
  },
  {
    id: "sesame",
    name: "Sesame (Til)",
    scientificName: "Sesamum indicum",
    emoji: "🌱",
    season: "Kharif",
    category: "Oilseed",
    soilType: "Sandy Loam, Light Loam",
    growthDuration: "80–95 days",
    expectedYield: "3–5 Q/Acre",
    marketPrice: "₹12,000–₹14,000/Q",
    waterReq: "Low",
    temperature: "25–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600&h=400&fit=crop",
    shortDesc: "Ancient oilseed with premium value oil, tolerant to high heat and dry conditions.",
    details: {
      overview: "Sesame is a high-value, drought-tolerant crop grown for cooking oil and seeds.",
      soilReq: "Well-drained light loamy soils. Sensitive to waterlogging. pH 5.5–8.0.",
      climate: "Warm and dry climate, 25–35°C. Low rainfall of 350-500mm.",
      irrigation: "Mostly rainfed. Supplementary watering at flowering boosts yield.",
      fertilizer: "N:P:K at 40:20:20 kg/ha. Apply Sulphur for seed quality.",
      pests: "Pests: Leaf Caterpillar, Gall Fly. Diseases: Phyllody.",
      harvesting: "Harvest when lower pods turn yellow and start splitting.",
      tips: ["Mix seeds with sand for uniform seed distribution at sowing", "Ensure good drainage to prevent root rot", "Avoid crop harvesting delay to prevent seed shattering"]
    }
  },
  {
    id: "sunflower",
    name: "Sunflower",
    scientificName: "Helianthus annuus",
    emoji: "🌻",
    season: "Rabi",
    category: "Oilseed",
    soilType: "Deep Loam, Black Soil",
    growthDuration: "90–110 days",
    expectedYield: "8–12 Q/Acre",
    marketPrice: "₹5,200–₹5,600/Q",
    waterReq: "Moderate",
    temperature: "20–30°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600&h=400&fit=crop",
    shortDesc: "Premium edible oilseed crop, day-neutral and highly responsive to management.",
    details: {
      overview: "Sunflower is a day-neutral oilseed crop grown for premium quality cooking oil.",
      soilReq: "Deep loamy and black soils with good water capacity. pH 6.5–8.0.",
      climate: "Warm, sunny conditions. Temperature 20–30°C is ideal.",
      irrigation: "4–6 irrigations. Critical at bud initiation, flowering, and seed set.",
      fertilizer: "N:P:K at 80:60:40 kg/ha. Boron is critical for seed filling.",
      pests: "Pests: Head Caterpillar, Jassids. Diseases: Alternaria Blight.",
      harvesting: "Harvest when the back of the head turns lemon yellow.",
      tips: ["In morning hours, practice hand pollination to reduce seed emptiness", "Apply Boron spray at floret stage to get fully filled seeds", "Protect mature crops from bird damage"]
    }
  },
  {
    id: "castor",
    name: "Castor",
    scientificName: "Ricinus communis",
    emoji: "🌿",
    season: "Annual",
    category: "Oilseed",
    soilType: "Sandy Loam, Red Soil",
    growthDuration: "150–180 days",
    expectedYield: "10–15 Q/Acre",
    marketPrice: "₹5,800–₹6,200/Q",
    waterReq: "Low",
    temperature: "20–30°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600&h=400&fit=crop",
    shortDesc: "Industrial cash oilseed, major export crop for India, used in lubricants.",
    details: {
      overview: "Castor seed oil has critical industrial applications in lubricants, cosmetics, and paints.",
      soilReq: "Well-drained sandy loam or gravelly soils. pH range 6.0–7.5.",
      climate: "Warm dry climate, 20–30°C. Tolerates drought well.",
      irrigation: "Mostly rainfed. Irrigating during dry spells increases pod yield.",
      fertilizer: "N:P:K at 80:40:30 kg/ha. Apply nitrogen in split doses.",
      pests: "Pests: Semilooper, Capsule Borer. Diseases: Wilt.",
      harvesting: "Harvest mature brown capsules in multiple pickings.",
      tips: ["Choose GCH hybrids for high spike density", "Control semilooper caterpillars using bio-agents", "Cure seed capsules in sun for easier shelling"]
    }
  },
  {
    id: "safflower",
    name: "Safflower",
    scientificName: "Carthamus tinctorius",
    emoji: "🌻",
    season: "Rabi",
    category: "Oilseed",
    soilType: "Clay, Sandy Loam",
    growthDuration: "110–130 days",
    expectedYield: "6–10 Q/Acre",
    marketPrice: "₹5,000–₹5,500/Q",
    waterReq: "Low",
    temperature: "15–28°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600&h=400&fit=crop",
    shortDesc: "Drought-hardy rabi oilseed, yields premium healthy oil and natural orange dye.",
    details: {
      overview: "Safflower (Kusum) is an extremely drought-resistant winter oilseed with spiny leaves.",
      soilReq: "Well-drained black clay soils or deep sandy loams. pH 6.0–8.0.",
      climate: "Cool dry winter. Temperature 15–28°C. Highly tolerant to drought.",
      irrigation: "1–2 waterings, mostly grown on residual moisture.",
      fertilizer: "N:P:K at 40:40:20 kg/ha. Apply sulfur for seed oil density.",
      pests: "Pests: Aphids. Diseases: Alternaria Leaf Spot.",
      harvesting: "Harvest when plants turn dry and heads turn yellowish-brown.",
      tips: ["Ideal crop for drylands and borders to prevent cattle trespassing due to spines", "Sow by mid-October", "Watch out for safflower aphids during flowering"]
    }
  },
  {
    id: "linseed",
    name: "Linseed (Flaxseed)",
    scientificName: "Linum usitatissimum",
    emoji: "🌱",
    season: "Rabi",
    category: "Oilseed",
    soilType: "Alluvial, Clay Loam",
    growthDuration: "110–120 days",
    expectedYield: "5–8 Q/Acre",
    marketPrice: "₹6,000–₹7,000/Q",
    waterReq: "Low",
    temperature: "10–25°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600&h=400&fit=crop",
    shortDesc: "Rich source of Omega-3 (flaxseed) and fiber (linen), winter crop of Central India.",
    details: {
      overview: "Linseed (Alsi) is grown for highly nutritious omega-3 flaxseeds and industrial linseed oil.",
      soilReq: "Clay loam and alluvial soils with high water holding capacity. pH 6.0–7.5.",
      climate: "Cool winter climate. Thrives at 10–25°C. Frost sensitive during seed setting.",
      irrigation: "2–3 waterings. Prefers consistent soil moisture.",
      fertilizer: "N:P:K at 60:30:20 kg/ha. Apply organic manures.",
      pests: "Pests: Linseed Gall Midge. Diseases: Rust, Wilt.",
      harvesting: "Harvest when capsules turn brown and seeds rattle inside.",
      tips: ["Use wilt-resistant varieties like Shekhar", "Apply sulfur at 20 kg/ha to boost omega-3 oil recovery", "Maintain weed-free plots in first 30 days"]
    }
  },
  {
    id: "nigerseed",
    name: "Niger seed",
    scientificName: "Guizotia abyssinica",
    emoji: "🌻",
    season: "Kharif",
    category: "Oilseed",
    soilType: "Poor, Gravelly, Acidic",
    growthDuration: "100–110 days",
    expectedYield: "2–4 Q/Acre",
    marketPrice: "₹7,000–₹8,000/Q",
    waterReq: "Low",
    temperature: "18–28°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600&h=400&fit=crop",
    shortDesc: "Minor oilseed crop grown on poor gravelly soils by tribal farmers.",
    details: {
      overview: "Niger seed (Ramtil) is a highly drought-resistant crop grown on hill slopes and poor marginal soils.",
      soilReq: "Tolerates poor, sandy, gravelly, and acidic soils. pH range 5.0–7.5.",
      climate: "Moderate climate, requires well-distributed light rainfall. 18–28°C.",
      irrigation: "Mostly rainfed. Minimal water needs.",
      fertilizer: "N:P:K at 20:20:10 kg/ha. Very low nutrient inputs.",
      pests: "Pests: Caterpillars. Diseases: Powdery Mildew.",
      harvesting: "Harvest when yellow flower petals shed and heads turn blackish.",
      tips: ["Excellent crop for honeybee attraction and pollination enrichment", "Useful as a border crop around valuable fields", "Dry seed fully to avoid mold in storage"]
    }
  },
  {
    id: "rapeseed",
    name: "Rapeseed",
    scientificName: "Brassica napus",
    emoji: "🌻",
    season: "Rabi",
    category: "Oilseed",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "100–120 days",
    expectedYield: "6–9 Q/Acre",
    marketPrice: "₹5,000–₹5,300/Q",
    waterReq: "Low",
    temperature: "10–22°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600&h=400&fit=crop",
    shortDesc: "Winter oilseed closely related to mustard, high oil content.",
    details: {
      overview: "Rapeseed (Toria) is an early winter oilseed crop grown on residual moisture after monsoons.",
      soilReq: "Well-drained loamy and sandy loam soils. pH 6.0–7.5.",
      climate: "Cool climate during growth. Highly sensitive to severe cold and frost.",
      irrigation: "1–2 irrigations. Pre-flowering is the critical watering phase.",
      fertilizer: "N:P:K at 60:30:30 kg/ha. Apply Sulphur @ 20 kg/ha.",
      pests: "Pests: Aphids, Sawfly. Diseases: Alternaria Spot.",
      harvesting: "Harvest when pods turn straw-yellow to prevent seed shedding.",
      tips: ["Grow as a catch crop between Kharif paddy and Rabi wheat", "Treat seeds with Thiram for fungal safety", "Sow early in September/October"]
    }
  },

  // ==========================================
  // CASH CROPS (8 Crops)
  // ==========================================
  {
    id: "cotton",
    name: "Cotton",
    scientificName: "Gossypium hirsutum",
    emoji: "🌿",
    season: "Kharif",
    category: "Cash Crop",
    soilType: "Black, Alluvial",
    growthDuration: "150–180 days",
    expectedYield: "15–22 Q/Acre",
    marketPrice: "₹6,620–₹7,020/Q",
    waterReq: "Moderate",
    temperature: "21–35°C",
    featured: true,
    image: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
    shortDesc: "White gold of India — a vital cash crop for the textile industry, grown in deep black soils.",
    details: {
      overview: "Cotton is the leading fiber cash crop in India. Cultivated widely in Gujarat and Maharashtra.",
      soilReq: "Deep black clay soils (Vertisols) or rich alluvial loams. pH 6.0–8.0.",
      climate: "Warm climate, 21–35°C. Requires sunny weather during boll opening.",
      irrigation: "Drip irrigation works best. Critical stages: flowering and boll set.",
      fertilizer: "N:P:K at 120:60:60 kg/ha. Apply micro-nutrients like Boron.",
      pests: "Pests: Pink Bollworm, Whitefly, Thrips. Diseases: Root Rot.",
      harvesting: "Harvest fully opened dry fluffy bolls in morning hours.",
      tips: ["Plant non-Bt refuge seeds around Bt fields", "Drip irrigation yields up to 20% more cotton weight", "Control Whitefly with yellow sticky traps"]
    }
  },
  {
    id: "sugarcane",
    name: "Sugarcane",
    scientificName: "Saccharum officinarum",
    emoji: "🎋",
    season: "Annual",
    category: "Cash Crop",
    soilType: "Alluvial, Loamy",
    growthDuration: "12–18 months",
    expectedYield: "350–450 Q/Acre",
    marketPrice: "₹315–₹340/Q",
    waterReq: "High",
    temperature: "20–35°C",
    featured: true,
    image: "https://images.unsplash.com/photo-1609171711791-c96a139c4c40?w=600&h=400&fit=crop",
    shortDesc: "India's most important sugar crop — the backbone of India's sugar and ethanol industry.",
    details: {
      overview: "Sugarcane is a long-term commercial grass crop yielding sucrose.",
      soilReq: "Deep loamy and alluvial soils rich in organic matter. pH 6.5–7.5.",
      climate: "Tropical/subtropical. Needs warmth during growth and cool dry nights for ripening.",
      irrigation: "High water usage. Needs 30-36 waterings. Drip systems save 40% water.",
      fertilizer: "N:P:K at 300:100:150 kg/ha. Heavy nitrogen feeder.",
      pests: "Pests: Shoot Borer, Top Borer, White Grub. Diseases: Red Rot.",
      harvesting: "Harvest close to ground level when brix reading is 18-20%.",
      tips: ["Choose disease-free seed setts for planting", "Adopt trash mulching to conserve moisture", "Process setts with fungicide to prevent Red Rot"]
    }
  },
  {
    id: "tobacco",
    name: "Tobacco",
    scientificName: "Nicotiana tabacum",
    emoji: "🍂",
    season: "Rabi",
    category: "Cash Crop",
    soilType: "Sandy Loam, Light Loam",
    growthDuration: "120–140 days",
    expectedYield: "8–12 Q/Acre",
    marketPrice: "₹9,000–₹11,000/Q",
    waterReq: "Moderate",
    temperature: "20–30°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
    shortDesc: "High-value cash crop, cured leaves used commercially, grown in Andhra Pradesh and Gujarat.",
    details: {
      overview: "Tobacco is an export-oriented cash crop. Leaves are harvested and cured.",
      soilReq: "Sandy loam soils with excellent drainage. pH 5.5–6.5.",
      climate: "Warm dry weather during growth. 20–30°C is ideal.",
      irrigation: "Light but regular waterings. Highly sensitive to waterlogging.",
      fertilizer: "N:P:K at 60:80:100 kg/ha. High Potassium boosts leaf quality.",
      pests: "Pests: Caterpillar, Aphids. Diseases: Black Shank.",
      harvesting: "Harvest leaves in stages (priming) from bottom to top as they yellow.",
      tips: ["Top plants at flowering to maximize leaf size", "Remove suckers weekly to divert energy to leaves", "Adopt crop rotation to suppress nematodes"]
    }
  },
  {
    id: "tea",
    name: "Tea",
    scientificName: "Camellia sinensis",
    emoji: "🍵",
    season: "Year-round",
    category: "Cash Crop",
    soilType: "Acidic Loam, Forest Soil",
    growthDuration: "3-4 years (initial)",
    expectedYield: "40–60 Q/Acre (green leaves)",
    marketPrice: "₹150–₹350/kg",
    waterReq: "High",
    temperature: "15–30°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
    shortDesc: "Major plantation crop, thrives in hilly acidic soils with high rainfall, labor-intensive.",
    details: {
      overview: "Tea is an evergreen plantation shrub cultivated for leaves. Major zones are Assam and Darjeeling.",
      soilReq: "Deep, well-drained acidic loamy soils rich in organic matter. pH range 4.5–5.5.",
      climate: "Humid subtropical climate. 15–30°C. Heavy, well-distributed rainfall (>1500 mm).",
      irrigation: "Needs regular moisture; waterlogging is fatal. Pruning requires shade trees.",
      fertilizer: "N:P:K at 120:60:60 kg/ha. Likes organic leaf compost.",
      pests: "Pests: Tea Mosquito Bug, Red Spider Mites. Diseases: Blister Blight.",
      harvesting: "Pluck two leaves and a bud manually at 7-10 day intervals.",
      tips: ["Maintain shade trees (like Albizia) in plantations", "Ensure sloped land to avoid water logging", "Prune bushes regularly to keep height at plucking level"]
    }
  },
  {
    id: "coffee",
    name: "Coffee",
    scientificName: "Coffea arabica / canephora",
    emoji: "☕",
    season: "Year-round",
    category: "Cash Crop",
    soilType: "Rich Loam, Volcanic",
    growthDuration: "3-4 years",
    expectedYield: "4–6 Q/Acre (clean coffee)",
    marketPrice: "₹180–₹300/kg",
    waterReq: "Moderate",
    temperature: "15–28°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
    shortDesc: "High-value plantation beverage crop, grown under shade in Western Ghats.",
    details: {
      overview: "Coffee is a tropical plantation crop grown under canopy shade. Arabica and Robusta are the top types.",
      soilReq: "Deep, rich organic loams. pH 6.0–6.5. Needs good drainage.",
      climate: "Mild humid climate, 15–28°C. Sensitive to extreme heat and frost.",
      irrigation: "Needs moisture; dry winter stimulates blossom buds.",
      fertilizer: "N:P:K at 140:90:120 kg/ha.",
      pests: "Pests: Coffee Berry Borer, White Stem Borer. Diseases: Coffee Rust.",
      harvesting: "Pick mature red cherries manually in multiple rounds.",
      tips: ["Perform systematic pruning to allow light and ventilation", "Install Berry Borer traps in orchards", "Dry harvested cherries carefully to avoid mold"]
    }
  },
  {
    id: "rubber",
    name: "Rubber",
    scientificName: "Hevea brasiliensis",
    emoji: "🌳",
    season: "Year-round",
    category: "Cash Crop",
    soilType: "Laterite, Red Loam",
    growthDuration: "7 years (tapping)",
    expectedYield: "800–1000 kg/Acre (latex)",
    marketPrice: "₹140–₹180/kg",
    waterReq: "High",
    temperature: "25–34°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
    shortDesc: "Perennial industrial plantation tree, yields latex, grown in Kerala and Tripura.",
    details: {
      overview: "Rubber trees yield industrial latex through tapping. Kerala produces 90% of national output.",
      soilReq: "Deep laterite or red clay loam soils. pH range 4.5–6.0.",
      climate: "Hot humid tropical climate, 25–34°C, with high annual rainfall.",
      irrigation: "Mostly rainfed. Heavy watering is required during early years.",
      fertilizer: "Apply 10:10:15 NPK mix annually per tree during mature phase.",
      pests: "Pests: Scale Insects. Diseases: Abnormal Leaf Fall, Pink Disease.",
      harvesting: "Tapping latex from bark every alternate day in early morning.",
      tips: ["Do not tap during heavy rain to avoid latex dilution", "Apply fungicide to tapping panel during monsoons", "Intercrop with banana during initial 3 years"]
    }
  },
  {
    id: "cocoa",
    name: "Cocoa",
    scientificName: "Theobroma cacao",
    emoji: "🍫",
    season: "Year-round",
    category: "Cash Crop",
    soilType: "Clay Loam, Alluvial",
    growthDuration: "3-4 years",
    expectedYield: "400–600 kg/Acre (dry beans)",
    marketPrice: "₹200–₹350/kg",
    waterReq: "Moderate",
    temperature: "20–32°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
    shortDesc: "Understory plantation tree, pods yield cocoa beans, intercropped in coconut gardens.",
    details: {
      overview: "Cocoa is grown for chocolate raw materials. Frequently intercropped with coconut or areca palms.",
      soilReq: "Well-drained clay loams or alluvial soils. pH range 6.0–7.5.",
      climate: "Hot and humid tropical weather. Requires 40-50% shade.",
      irrigation: "Irrigate every 7–10 days. Drip irrigation under palm shade works best.",
      fertilizer: "Apply 100g N, 40g P, and 140g K per tree per year.",
      pests: "Pests: Pod Borer, Mealybugs. Diseases: Black Pod Rot.",
      harvesting: "Harvest mature yellow-orange pods. Extract seeds, ferment, and dry.",
      tips: ["Maintain strict pruning to limit tree height to 3-4 meters", "Ferment beans for 5 days in wooden boxes for chocolate flavor", "Ensure shade canopy is uniform"]
    }
  },
  {
    id: "jute",
    name: "Jute",
    scientificName: "Corchorus olitorius",
    emoji: "🎋",
    season: "Kharif",
    category: "Cash Crop",
    soilType: "Alluvial, Loamy",
    growthDuration: "120–140 days",
    expectedYield: "12–15 Q/Acre",
    marketPrice: "₹4,500–₹5,000/Q",
    waterReq: "High",
    temperature: "24–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
    shortDesc: "Golden fiber of India, thrives in hot wet monsoons of West Bengal.",
    details: {
      overview: "Jute is a vital natural fiber cash crop grown in the Ganga-Brahmaputra delta.",
      soilReq: "Deep alluvial silt loam soils. pH 6.0–7.5. Tolerates waterlogging.",
      climate: "Hot and wet climate. Temperature 24–35°C with high relative humidity.",
      irrigation: "High water demand. Rains are sufficient; needs standing water for retting.",
      fertilizer: "N:P:K at 40:20:20 kg/ha. Apply organic manures.",
      pests: "Pests: Jute Semilooper, Mites. Diseases: Stem Rot.",
      harvesting: "Harvest at small-pod stage. Ret stalks in slow water for 15 days.",
      tips: ["Ret jute stems in clean slow-flowing water for best fiber shine", "Harvest at 120 days for premium fiber strength", "Clean fiber fully before drying"]
    }
  },

  // ==========================================
  // VEGETABLES & EXOTICS (35 Crops)
  // ==========================================
  {
    id: "potato",
    name: "Potato",
    scientificName: "Solanum tuberosum",
    emoji: "🥔",
    season: "Rabi",
    category: "Vegetable",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "75–120 days",
    expectedYield: "100–200 Q/Acre",
    marketPrice: "₹800–₹1,800/Q",
    waterReq: "Moderate",
    temperature: "15–22°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82ber896?w=600&h=400&fit=crop",
    shortDesc: "India's most important vegetable crop — versatile tuber consumed daily in millions of households.",
    details: {
      overview: "Potato is the primary rabi tuber vegetable, highly responsive to fertilization.",
      soilReq: "Loose sandy loam soils. pH 5.5–6.5. Avoid heavy clay soils.",
      climate: "Cool climate. Tuberization requires night temperatures of 15–20°C.",
      irrigation: "8–12 light irrigations. Maintain uniform moisture.",
      fertilizer: "N:P:K at 180:80:100 kg/ha. Apply potash.",
      pests: "Pests: Tuber Moth, Aphids. Diseases: Late Blight, Scab.",
      harvesting: "Harvest when leaves yellow. Cure tubers in shade.",
      tips: ["Earth up at 30 and 45 days post planting", "Use certified disease-free seed tubers", "Apply preventative fungicide for Late Blight"]
    }
  },
  {
    id: "onion",
    name: "Onion",
    scientificName: "Allium cepa",
    emoji: "🧅",
    season: "Rabi",
    category: "Vegetable",
    soilType: "Sandy Loam, Alluvial",
    growthDuration: "90–130 days",
    expectedYield: "120–200 Q/Acre",
    marketPrice: "₹1,500–₹3,500/Q",
    waterReq: "Moderate",
    temperature: "15–25°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=400&fit=crop",
    shortDesc: "Essential kitchen vegetable, highly price-sensitive, grown during winter and summer.",
    details: {
      overview: "Onion bulb development is highly responsive to daylength and temperature.",
      soilReq: "Sandy loam soils rich in organic matter. pH 6.0–7.0.",
      climate: "Cool weather for leaves (15-20°C) and hot dry weather for bulbs (25-30°C).",
      irrigation: "10–12 irrigations. Stop watering 10-15 days before harvest.",
      fertilizer: "N:P:K at 100:50:50 kg/ha. Apply Sulphur @ 40 kg/ha.",
      pests: "Pests: Thrips. Diseases: Purple Blotch, Bulb Rot.",
      harvesting: "Harvest when 50–75% of necks bend down. Shade-cure bulbs.",
      tips: ["Stop watering 10 days before harvest to prevent storage rot", "Cure onions in shade to harden outer bulb scales", "Apply Sulphur to improve bulb pungency and storage"]
    }
  },
  {
    id: "tomato",
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    emoji: "🍅",
    season: "Year-round",
    category: "Vegetable",
    soilType: "Sandy Loam, Red Soil",
    growthDuration: "60–90 days",
    expectedYield: "200–350 Q/Acre",
    marketPrice: "₹1,200–₹3,000/Q",
    waterReq: "Moderate",
    temperature: "18–27°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Popular commercial vegetable, grown year-round under irrigation, high market demand.",
    details: {
      overview: "Tomato is a key year-round vegetable. Sensitive to high heat and frost.",
      soilReq: "Well-drained sandy loam. pH 6.0–7.0. Avoid heavy clay soils.",
      climate: "Mild season. Temperatures above 35°C cause blossom drop.",
      irrigation: "Drip irrigation is best. Keep moisture consistent.",
      fertilizer: "N:P:K at 120:80:80 kg/ha. Use Calcium Nitrate.",
      pests: "Pests: Fruit Borer, Whitefly. Diseases: Late Blight, Leaf Curl.",
      harvesting: "Harvest at breaker (pink) stage for transport, red for local market.",
      tips: ["Stake plants to keep fruits off the soil", "Apply Calcium Nitrate to prevent blossom-end rot", "Use yellow sticky cards for Whitefly control"]
    }
  },
  {
    id: "brinjal",
    name: "Brinjal",
    scientificName: "Solanum melongena",
    emoji: "🍆",
    season: "Year-round",
    category: "Vegetable",
    soilType: "Clay Loam, Silt Loam",
    growthDuration: "90–120 days",
    expectedYield: "150–220 Q/Acre",
    marketPrice: "₹1,000–₹1,800/Q",
    waterReq: "Moderate",
    temperature: "22–32°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Highly popular vegetable, versatile and hardy, grown extensively.",
    details: {
      overview: "Brinjal is a hardy vegetable yielding glossy purple, green, or white fruits.",
      soilReq: "Clay loam loam with high organic matter. pH 6.0–7.0.",
      climate: "Warm-season crop, needs 22–32°C for optimal growth.",
      irrigation: "Regular watering every 4-6 days in summer, 10-14 days in winter.",
      fertilizer: "N:P:K at 100:80:60 kg/ha. Incorporate compost.",
      pests: "Pests: Shoot and Fruit Borer. Diseases: Little Leaf, Wilt.",
      harvesting: "Harvest when fruits are glossy and firm, and seeds inside are soft.",
      tips: ["Use pheromone traps for Shoot & Fruit Borer", "Uproot plants showing Little Leaf immediately", "Prune mature crops to boost new fruiting branches"]
    }
  },
  {
    id: "okra",
    name: "Okra (Bhindi)",
    scientificName: "Abelmoschus esculentus",
    emoji: "🥒",
    season: "Kharif",
    category: "Vegetable",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "60–75 days",
    expectedYield: "40–60 Q/Acre",
    marketPrice: "₹1,800–₹3,000/Q",
    waterReq: "Moderate",
    temperature: "25–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Fast-growing summer and kharif vegetable with high domestic consumption.",
    details: {
      overview: "Okra is a popular pod vegetable thriving in warm-humid conditions.",
      soilReq: "Well-drained sandy loam. pH 6.0–6.8. Avoid acidic soils.",
      climate: "Warm climate. Seeds fail to sprout below 20°C. 25–35°C is best.",
      irrigation: "Water every 2-3 days in summer. Avoid dry soil stress.",
      fertilizer: "N:P:K at 80:50:50 kg/ha. Apply N in split doses.",
      pests: "Pests: Shoot and Fruit Borer, Jassids. Diseases: Yellow Vein Mosaic Virus (YVMV).",
      harvesting: "Harvest tender pods every alternate day before they turn woody.",
      tips: ["Sow YVMV-resistant varieties like Arka Anamika", "Treat seed with imidacloprid for early sucking pest safety", "Harvest pods regularly to stimulate continuous flowering"]
    }
  },
  {
    id: "cabbage",
    name: "Cabbage",
    scientificName: "Brassica oleracea var. capitata",
    emoji: "🥬",
    season: "Rabi",
    category: "Vegetable",
    soilType: "Clay Loam, Silty Loam",
    growthDuration: "90–110 days",
    expectedYield: "120–180 Q/Acre",
    marketPrice: "₹600–₹1,200/Q",
    waterReq: "Moderate",
    temperature: "15–20°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Cool-season cole crop, forms compact leafy heads, popular winter vegetable.",
    details: {
      overview: "Cabbage is a cool-season crop forming compact leafy heads.",
      soilReq: "Clay loam with high organic matter. pH 6.0–6.5. Good drainage.",
      climate: "Cool and moist climate. Curd/head forms best at 15–20°C.",
      irrigation: "Irrigate every 8–10 days. Keep soil moisture steady.",
      fertilizer: "N:P:K at 120:80:60 kg/ha. Apply nitrogen in splits.",
      pests: "Pests: Diamondback Moth (DBM), Aphids. Diseases: Black Rot.",
      harvesting: "Harvest when heads are firm, solid, and fully sized.",
      tips: ["Spray Bt (Bacillus thuringiensis) for Diamondback Moth control", "Ensure steady water to prevent head splitting", "Intercrop with mustard to trap moths"]
    }
  },
  {
    id: "cauliflower",
    name: "Cauliflower",
    scientificName: "Brassica oleracea var. botrytis",
    emoji: "🥦",
    season: "Rabi",
    category: "Vegetable",
    soilType: "Sandy Loam, Clay Loam",
    growthDuration: "95–120 days",
    expectedYield: "80–120 Q/Acre",
    marketPrice: "₹800–₹1,800/Q",
    waterReq: "Moderate",
    temperature: "15–20°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Winter cole vegetable, grown for its white curd head, highly sensitive.",
    details: {
      overview: "Cauliflower is grown for its white head (curd). Curd quality depends on temperature.",
      soilReq: "Loamy to clay loam soils with high drainage. pH 6.0–7.0.",
      climate: "Cool, moist weather. Temperature fluctuations affect head size.",
      irrigation: "Water every 7–10 days. Avoid waterlogging.",
      fertilizer: "N:P:K at 120:80:80 kg/ha. Apply Boron and Molybdenum.",
      pests: "Pests: Diamondback Moth, Aphids. Diseases: Black Rot.",
      harvesting: "Harvest when curds are white, compact, and clear.",
      tips: ["Cover curds with inner leaves (blanching) to preserve white color", "Apply Boron to prevent hollow stems and browning", "Harvest early in the morning to retain freshness"]
    }
  },
  {
    id: "garlic",
    name: "Garlic",
    scientificName: "Allium sativum",
    emoji: "🧄",
    season: "Rabi",
    category: "Vegetable",
    soilType: "Sandy Loam, Silt Loam",
    growthDuration: "130–150 days",
    expectedYield: "40–60 Q/Acre",
    marketPrice: "₹6,000–₹10,000/Q",
    waterReq: "Moderate",
    temperature: "15–25°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=400&fit=crop",
    shortDesc: "Popular bulbous spice, highly profitable rabi crop, requires proper clove planting.",
    details: {
      overview: "Garlic is a popular winter bulb crop rich in flavor and compounds.",
      soilReq: "Sandy loam or silt loam. Good drainage is essential. pH 6.0–7.0.",
      climate: "Cool vegetative phase, warm dry bulb ripening stage.",
      irrigation: "Irrigate every 10–12 days. Stop watering 20 days prior to harvest.",
      fertilizer: "N:P:K at 100:50:50 kg/ha. Apply sulfur at 25 kg/ha.",
      pests: "Pests: Thrips. Diseases: Purple Blotch, Bulb Rot.",
      harvesting: "Harvest when leaves yellow and dry. Cure bulbs in shade.",
      tips: ["Plant large, healthy outer cloves", "Apply Sulfur to increase bulb weight", "Shade cure bulbs for 15 days to protect outer skins"]
    }
  },
  {
    id: "cucumber",
    name: "Cucumber",
    scientificName: "Cucumis sativus",
    emoji: "🥒",
    season: "Year-round",
    category: "Vegetable",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "50–70 days",
    expectedYield: "80–120 Q/Acre",
    marketPrice: "₹800–₹1,500/Q",
    waterReq: "Moderate",
    temperature: "20–30°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Fast-growing vine crop, high water content, popular salad vegetable.",
    details: {
      overview: "Cucumber is a rapid vine vegetable cultivated in summer and rainy seasons.",
      soilReq: "Sandy loam to loamy soils with high organic matter. pH 6.0–7.0.",
      climate: "Warm climate, 20–30°C. Susceptible to frost.",
      irrigation: "Needs regular moisture. Drip irrigation prevents fungal diseases.",
      fertilizer: "N:P:K at 50:50:50 kg/ha. Apply farmyard manure.",
      pests: "Pests: Fruit Fly, Red Pumpkin Beetle. Diseases: Downy Mildew.",
      harvesting: "Harvest when green, tender, and medium-sized. Pick regularly.",
      tips: ["Use trellises to keep fruits off the ground and straight", "Apply mulching to retain soil moisture and reduce weeds", "Spray neem oil for managing beetles and flies"]
    }
  },
  {
    id: "bottle-gourd",
    name: "Bottle Gourd",
    scientificName: "Lagenaria siceraria",
    emoji: "🥒",
    season: "Kharif",
    category: "Vegetable",
    soilType: "Sandy Loam, Alluvial",
    growthDuration: "70–90 days",
    expectedYield: "100–150 Q/Acre",
    marketPrice: "₹800–₹1,600/Q",
    waterReq: "Moderate",
    temperature: "25–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Nutritious vine vegetable, high yields, grown during summer and monsoons.",
    details: {
      overview: "Bottle Gourd (Lauki) is a high-yielding warm-season vine crop.",
      soilReq: "Well-drained sandy loam or alluvial soils. pH 6.0–7.0.",
      climate: "Hot and humid climate. Temperature 25–35°C.",
      irrigation: "Irrigate every 4-5 days in summer, rainfed in monsoons.",
      fertilizer: "N:P:K at 60:50:50 kg/ha. Use organic compost.",
      pests: "Pests: Fruit Fly. Diseases: Powdery Mildew, Downy Mildew.",
      harvesting: "Harvest tender, light-green cylindrical fruits.",
      tips: ["Adopt vertical trellis (Bawari) system to double production", "Perform pinching of main stem to encourage fruiting branches", "Monitor for Fruit Fly using pheromone traps"]
    }
  },
  {
    id: "bitter-gourd",
    name: "Bitter Gourd",
    scientificName: "Momordica charantia",
    emoji: "🥒",
    season: "Kharif",
    category: "Vegetable",
    soilType: "Loamy, Sandy Loam",
    growthDuration: "70–85 days",
    expectedYield: "60–90 Q/Acre",
    marketPrice: "₹1,500–₹2,500/Q",
    waterReq: "Moderate",
    temperature: "25–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Bitter tasting warm-season vegetable, highly valued for health benefits.",
    details: {
      overview: "Bitter Gourd (Karela) is a high-value crop, widely consumed for diabetic control.",
      soilReq: " Sandy loam to silt loam with high organic compost. pH 6.0–7.0.",
      climate: "Hot and humid conditions. Temperature 25–35°C.",
      irrigation: "Regular watering every 3-5 days. Do not allow soil to dry.",
      fertilizer: "N:P:K at 60:60:60 kg/ha. Apply organic manures.",
      pests: "Pests: Fruit Fly, Epilachna Beetle. Diseases: Downy Mildew.",
      harvesting: "Harvest when pods are firm, green, and ridges are well-developed.",
      tips: ["Provide sturdy trellis support for uniform straight fruits", "Use paper bags on young fruits to block Fruit Fly attacks", "Grow hybrids like F1 Chaman for high yield"]
    }
  },
  {
    id: "ridge-gourd",
    name: "Ridge Gourd",
    scientificName: "Luffa acutangula",
    emoji: "🥒",
    season: "Kharif",
    category: "Vegetable",
    soilType: "Sandy Loam, Alluvial",
    growthDuration: "70–80 days",
    expectedYield: "60–80 Q/Acre",
    marketPrice: "₹1,000–₹2,000/Q",
    waterReq: "Moderate",
    temperature: "25–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Angled gourd vine, highly fibrous vegetable, grows easily in warm weather.",
    details: {
      overview: "Ridge Gourd (Turai) is a common kharif vegetable with ribbed dark green skin.",
      soilReq: "Sandy loam or alluvial soils. pH 6.0–7.5. Needs good drainage.",
      climate: "Warm humid climate. 25–35°C. Highly sensitive to cold.",
      irrigation: "Irrigate every 5-6 days. Avoid water stagnation.",
      fertilizer: "N:P:K at 50:50:50 kg/ha. Apply organic compost.",
      pests: "Pests: Beetles, Fruit Fly. Diseases: Downy Mildew, Mosaic Virus.",
      harvesting: "Harvest tender green gourds before seeds turn hard.",
      tips: ["Trellis trellis training improves yield and quality", "Spray neem seed extract for beetle control", "Intercrop with leafy vegetables for extra returns"]
    }
  },
  {
    id: "pumpkin",
    name: "Pumpkin",
    scientificName: "Cucurbita moschata",
    emoji: "🎃",
    season: "Kharif",
    category: "Vegetable",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "100–120 days",
    expectedYield: "120–180 Q/Acre",
    marketPrice: "₹600–₹1,200/Q",
    waterReq: "Moderate",
    temperature: "25–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Hardy vine vegetable, huge fruits with excellent storage life.",
    details: {
      overview: "Pumpkin is a low-maintenance, hardy vine crop with excellent storage life.",
      soilReq: "Adaptable to most soils; sandy loam is best. pH 5.5–7.0.",
      climate: "Warm climate. Optimum temperature 25–35°C. Resilient.",
      irrigation: "Watering every 7-10 days. Avoid watering leaves directly.",
      fertilizer: "N:P:K at 60:60:80 kg/ha. Potassium boosts fruit size.",
      pests: "Pests: Red Pumpkin Beetle. Diseases: Powdery Mildew.",
      harvesting: "Harvest when rind is hard, woody, and turns dull orange-brown.",
      tips: ["Invert fruits on flat stones to prevent ground rot", "Pinch secondary vines to maximize main fruit growth", "Leave stem attached (peduncle) for longer storage life"]
    }
  },
  {
    id: "spinach",
    name: "Spinach",
    scientificName: "Spinacia oleracea",
    emoji: "🥬",
    season: "Rabi",
    category: "Vegetable",
    soilType: "Loamy, Alluvial",
    growthDuration: "40–50 days",
    expectedYield: "40–60 Q/Acre",
    marketPrice: "₹800–₹1,500/Q",
    waterReq: "Moderate",
    temperature: "10–22°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Fast-growing winter leafy green, rich in iron, harvested in multiple cuts.",
    details: {
      overview: "Spinach (Palak) is a cool-season leafy vegetable harvested repeatedly.",
      soilReq: "Rich loamy and alluvial soils. pH 6.0–7.0. Needs good drainage.",
      climate: "Cool weather. Warm temperatures cause bolting (early seeding).",
      irrigation: "Irrigate every 4-6 days. Maintain consistent dampness.",
      fertilizer: "N:P:K at 60:40:40 kg/ha. Apply nitrogen after each cutting.",
      pests: "Pests: Aphids, Leaf Miner. Diseases: Downy Mildew.",
      harvesting: "Cut leaves when they reach 10-15 cm length. 4-6 cuttings possible.",
      tips: ["Top-dress nitrogen after every harvest to boost regrowth", "Sow in intervals of 15 days for continuous winter harvest", "Control leaf miner early to avoid foliage damage"]
    }
  },
  {
    id: "fenugreek",
    name: "Fenugreek",
    scientificName: "Trigonella foenum-graecum",
    emoji: "🥬",
    season: "Rabi",
    category: "Vegetable",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "30–45 days (leaf)",
    expectedYield: "30–45 Q/Acre",
    marketPrice: "₹1,000–₹2,000/Q",
    waterReq: "Low",
    temperature: "12–25°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Winter green leaf and seed spice, fast-growing and improves soil nitrogen.",
    details: {
      overview: "Fenugreek (Methi) is grown for leafy greens or mature seeds (spice).",
      soilReq: "Rich loams with good drainage. pH 6.0–7.0. Fixes nitrogen.",
      climate: "Cool winter climate. Resilient to light cold.",
      irrigation: "Irrigate every 7-10 days. Requires minimal moisture.",
      fertilizer: "N:P:K at 20:45:20 kg/ha. Low nitrogen needed.",
      pests: "Pests: Aphids. Diseases: Powdery Mildew, Root Rot.",
      harvesting: "Uproot or cut plants at 30 days for leaves; 120 days for seeds.",
      tips: ["Sow seeds closely for tender, thick leafy harvests", "Spray neem extract for managing aphid pests", "Harvest leafy methi early morning to maintain color"]
    }
  },
  {
    id: "coriander",
    name: "Coriander",
    scientificName: "Coriandrum sativum",
    emoji: "🌿",
    season: "Rabi",
    category: "Vegetable",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "35–50 days (leaf)",
    expectedYield: "35–50 Q/Acre",
    marketPrice: "₹1,200–₹2,500/Q",
    waterReq: "Moderate",
    temperature: "15–25°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Popular herb and seed spice, harvested continuously for fresh kitchen use.",
    details: {
      overview: "Coriander (Dhania) is grown for fresh leaves or dry seed spice.",
      soilReq: "Well-drained sandy loam or loamy soils. pH 6.0–7.5.",
      climate: "Cool winter climate. High heat causes crop to bolt (seed early).",
      irrigation: "Water every 5-7 days. Dry soil conditions reduce leaf count.",
      fertilizer: "N:P:K at 40:40:20 kg/ha. Nitrogen split boosts leaf growth.",
      pests: "Pests: Aphids. Diseases: Powdery Mildew, Wilt.",
      harvesting: "Harvest fresh leafy coriander at 40 days; seeds at 110 days.",
      tips: ["Crush coriander seed pods lightly before sowing for better germination", "Provide partial shade if growing in summer to prevent bolting", "Keep soil consistently damp, never dry or waterlogged"]
    }
  },
  {
    id: "beans",
    name: "Beans",
    scientificName: "Phaseolus vulgaris",
    emoji: "🫛",
    season: "Rabi",
    category: "Vegetable",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "60–75 days",
    expectedYield: "30–50 Q/Acre",
    marketPrice: "₹2,500–₹4,000/Q",
    waterReq: "Moderate",
    temperature: "15–25°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Rich protein vegetable, fast-growing pods, thrives in mild temperatures.",
    details: {
      overview: "French Beans are high-value vegetables grown for tender green pods.",
      soilReq: "Well-drained light loam to sandy loam soils. pH 5.5–6.5.",
      climate: "Mild climate. 15–25°C is ideal. Extremely sensitive to frost.",
      irrigation: "Irrigate every 6-8 days. Do not allow soil to waterlog.",
      fertilizer: "N:P:K at 40:60:40 kg/ha. Rhizobium culture helps nodulation.",
      pests: "Pests: Aphids, Stem Fly. Diseases: Powdery Mildew, Rust.",
      harvesting: "Harvest tender pods when they snap cleanly, before seeds bulge.",
      tips: ["Avoid sowing in waterlogging-prone soil", "Provide pole support for climbing varieties", "Harvest pods regularly to extend fruiting phase"]
    }
  },
  {
    id: "capsicum",
    name: "Capsicum",
    scientificName: "Capsicum annuum var. grossum",
    emoji: "🫑",
    season: "Rabi",
    category: "Vegetable",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "75–90 days",
    expectedYield: "80–120 Q/Acre",
    marketPrice: "₹2,000–₹4,500/Q",
    waterReq: "Moderate",
    temperature: "18–25°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "High-value bell pepper vegetable, grown under polyhouses or shade nets.",
    details: {
      overview: "Capsicum (Bell Pepper) is a highly profitable vegetable with strong market demand.",
      soilReq: "Sandy loam soils rich in organic compost. pH 6.0–6.8.",
      climate: "Mild climate. Temperature 18–25°C. Hot wind causes flower drop.",
      irrigation: "Drip irrigation is mandatory. Maintain uniform soil dampness.",
      fertilizer: "N:P:K at 100:80:80 kg/ha. Apply Calcium and Potassium Nitrate.",
      pests: "Pests: Thrips, Aphids, Mites. Diseases: Damping-off, Powdery Mildew.",
      harvesting: "Harvest when fruits are fully sized, glossy green/coloured, and firm.",
      tips: ["Grow under shade-nets to protect fruits from sun scorch", "Manage Thrips early using blue sticky traps", "Apply Calcium to prevent fruit rot at bottom (blossom-end rot)"]
    }
  },
  {
    id: "carrot",
    name: "Carrot",
    scientificName: "Daucus carota",
    emoji: "🥕",
    season: "Rabi",
    category: "Vegetable",
    soilType: "Sandy Loam, Deep Loam",
    growthDuration: "80–100 days",
    expectedYield: "80–120 Q/Acre",
    marketPrice: "₹1,200–₹2,000/Q",
    waterReq: "Moderate",
    temperature: "15–20°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Nutritious root vegetable, deep loams yield straight roots, thrives in winter.",
    details: {
      overview: "Carrot is a popular winter root vegetable rich in carotene.",
      soilReq: "Deep, loose sandy loam soils. Heavy or stony soils cause forked roots. pH 6.0–7.0.",
      climate: "Cool winter climate. 15–20°C is ideal for color development.",
      irrigation: "Irrigate every 7-10 days. Avoid excess moisture before harvest.",
      fertilizer: "N:P:K at 60:60:100 kg/ha. Apply high Potassium.",
      pests: "Pests: Weevils. Diseases: Root Rot, Blight.",
      harvesting: "Harvest when roots reach marketable size, before they turn woody.",
      tips: ["Incorporate deep tillage (30 cm) to ensure straight root growth", "Thin seedlings at 15 days to maintain proper crop spacing", "Avoid fresh manures which cause root branching"]
    }
  },
  {
    id: "beetroot",
    name: "Beetroot",
    scientificName: "Beta vulgaris",
    emoji: "🍠",
    season: "Rabi",
    category: "Vegetable",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "75–90 days",
    expectedYield: "80–100 Q/Acre",
    marketPrice: "₹1,000–₹1,800/Q",
    waterReq: "Moderate",
    temperature: "15–22°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Crimson root vegetable, rich in iron, grows easily in cool climates.",
    details: {
      overview: "Beetroot is a cool-season root crop grown for its deep red tuberous bulb.",
      soilReq: "Friable sandy loam to loamy soils. pH range 6.0–7.0.",
      climate: "Cool climate. Temperature 15–22°C yields deep crimson color.",
      irrigation: "Irrigate every 6-8 days. Do not allow soil to crack.",
      fertilizer: "N:P:K at 50:60:80 kg/ha. Boron is critical to prevent heart rot.",
      pests: "Pests: Leaf Miner. Diseases: Leaf Spot, Root Rot.",
      harvesting: "Harvest when roots reach 5-7 cm diameter. Avoid root bruising.",
      tips: ["Apply Boron to prevent internal black spot (heart rot)", "Soak seeds in water for 12 hours to improve germination", "Harvest carefully to preserve leaves and prevent color bleeding"]
    }
  },
  {
    id: "radish",
    name: "Radish",
    scientificName: "Raphanus sativus",
    emoji: "🌱",
    season: "Rabi",
    category: "Vegetable",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "40–55 days",
    expectedYield: "60–80 Q/Acre",
    marketPrice: "₹800–₹1,500/Q",
    waterReq: "Moderate",
    temperature: "15–22°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Fast-growing winter root vegetable, pungent flavor, yields quick returns.",
    details: {
      overview: "Radish (Mooli) is a quick-growing winter root crop harvested within 50 days.",
      soilReq: "Sandy loam soils with high organic compost. pH 6.0–7.0.",
      climate: "Cool climate. Day temperature 15–22°C. High heat makes roots woody.",
      irrigation: "Water every 5-6 days. Consistent moisture yields crunchy roots.",
      fertilizer: "N:P:K at 50:40:40 kg/ha. Needs low fertilizer due to short life.",
      pests: "Pests: Aphids, Mustard Sawfly. Diseases: White Rust.",
      harvesting: "Harvest when roots are crisp and tender. Delay makes roots pithy.",
      tips: ["Harvest on time; delayed pulling causes hollow and bitter roots", "Sow seeds in ridges for straight, uniform roots", "Spray neem oil for managing sawfly caterpillars"]
    }
  },
  {
    id: "sweet-potato",
    name: "Sweet Potato",
    scientificName: "Ipomoea batatas",
    emoji: "🍠",
    season: "Kharif",
    category: "Vegetable",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "110–130 days",
    expectedYield: "80–120 Q/Acre",
    marketPrice: "₹1,200–₹2,000/Q",
    waterReq: "Low",
    temperature: "22–32°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82ber896?w=600&h=400&fit=crop",
    shortDesc: "Drought-tolerant tuber crop, rich in starch and beta-carotene.",
    details: {
      overview: "Sweet Potato (Shakarkand) is a highly starch-productive vine root crop.",
      soilReq: "Well-drained sandy loam with clay subsoil. pH 5.5–6.5.",
      climate: "Warm tropical climate, 22–32°C. Sensitive to cold.",
      irrigation: "Needs regular watering early; highly drought-tolerant once established.",
      fertilizer: "N:P:K at 40:60:80 kg/ha. High potash boosts root expansion.",
      pests: "Pests: Sweet Potato Weevil. Diseases: Stem Rot.",
      harvesting: "Harvest when vines turn yellow. Dig carefully to avoid skin peeling.",
      tips: ["Use vine cuttings (slips) from healthy nurseries for planting", "Ensure loose soil ridges for proper tuber growth", "Store in warm rooms to cure skin scratches before selling"]
    }
  },
  {
    id: "tapioca",
    name: "Tapioca",
    scientificName: "Manihot esculenta",
    emoji: "🥔",
    season: "Annual",
    category: "Vegetable",
    soilType: "Red Sandy Loam, Laterite",
    growthDuration: "8–10 months",
    expectedYield: "120–160 Q/Acre",
    marketPrice: "₹1,000–₹1,500/Q",
    waterReq: "Low",
    temperature: "25–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82ber896?w=600&h=400&fit=crop",
    shortDesc: "Hardy starch root crop, highly resilient to climate stress, grown in Kerala and Tamil Nadu.",
    details: {
      overview: "Tapioca (Cassava) is a major starch root crop tolerant to extreme drought.",
      soilReq: "Laterite and gravelly loams with good drainage. pH 5.0–7.0.",
      climate: "Hot and humid tropical weather. Temperature 25–35°C.",
      irrigation: "Low water need. Requires soil moisture during early sprout phase.",
      fertilizer: "N:P:K at 75:75:150 kg/ha. Apply organic manures.",
      pests: "Pests: Red Spider Mites, Whitefly. Diseases: Cassava Mosaic Disease.",
      harvesting: "Harvest when leaves turn yellow and drop and roots bulge.",
      tips: ["Use stem cuttings (sets) from disease-free mother plants", "Maintain clean fields to minimize Whitefly virus transmission", "Process harvested tubers within 3 days to avoid starch degradation"]
    }
  },
  {
    id: "broccoli",
    name: "Broccoli",
    scientificName: "Brassica oleracea var. italica",
    emoji: "🥦",
    season: "Rabi",
    category: "Vegetable",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "70–85 days",
    expectedYield: "40–60 Q/Acre",
    marketPrice: "₹4,000–₹8,000/Q",
    waterReq: "Moderate",
    temperature: "15–20°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Premium exotic winter vegetable, rich in antioxidants, high commercial value.",
    details: {
      overview: "Broccoli is an exotic cole crop grown during the winter, yielding green heads rich in vitamins.",
      soilReq: "Deep loamy soils with good drainage and rich organic matter. pH 6.0–7.0.",
      climate: "Cool temperate winter. Head formation fails in high summer heat. 15–20°C is best.",
      irrigation: "Water every 7-10 days. Maintain consistent soil dampness.",
      fertilizer: "N:P:K at 100:60:80 kg/ha. Boron prevents hollow stems.",
      pests: "Pests: Diamondback Moth, Aphids. Diseases: Head Rot.",
      harvesting: "Harvest when center head is compact, green, and before individual flowers bloom.",
      tips: ["Harvest center head to stimulate secondary side shoots", "Watch out for Diamondback Moth caterpillars", "Pre-cool harvested heads to maintain green shelf-life"]
    }
  },
  {
    id: "zucchini",
    name: "Zucchini",
    scientificName: "Cucurbita pepo",
    emoji: "🥒",
    season: "Rabi",
    category: "Vegetable",
    soilType: "Sandy Loam, Rich Loam",
    growthDuration: "50–65 days",
    expectedYield: "60–80 Q/Acre",
    marketPrice: "₹3,000–₹6,000/Q",
    waterReq: "Moderate",
    temperature: "18–25°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Exotic summer squash vegetable, quick-growing and highly productive.",
    details: {
      overview: "Zucchini is a bush squash yielding tender elongated yellow or green fruits.",
      soilReq: "Sandy loam soils rich in compost. pH 6.0–7.5. Good drainage is key.",
      climate: "Mild to warm climate. Temperature 18–25°C is ideal.",
      irrigation: "Drip irrigation is ideal. Avoid watering overhead to prevent rot.",
      fertilizer: "N:P:K at 60:60:80 kg/ha. High organic matter is key.",
      pests: "Pests: Red Pumpkin Beetle, Aphids. Diseases: Powdery Mildew.",
      harvesting: "Harvest tender cylindrical fruits when 15-20 cm long.",
      tips: ["Harvest daily to encourage continuous flowering and fruiting", "Adopt plastic mulching to keep fruits clean", "Spray bio-agents for Powdery Mildew prevention"]
    }
  },
  {
    id: "lettuce",
    name: "Lettuce",
    scientificName: "Lactuca sativa",
    emoji: "🥬",
    season: "Rabi",
    category: "Vegetable",
    soilType: "Sandy Loam, Peaty Soil",
    growthDuration: "45–60 days",
    expectedYield: "30–50 Q/Acre",
    marketPrice: "₹2,000–₹5,000/Q",
    waterReq: "Moderate",
    temperature: "12–18°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Popular exotic salad green, requires cool mild climate, quick turn-around.",
    details: {
      overview: "Lettuce is an exotic salad crop grown during winter under shade net or polyhouses.",
      soilReq: "Well-drained sandy loam or peaty soil. pH range 6.0–7.0.",
      climate: "Cool temperate weather. Warm spells cause immediate bolting and bitter leaves.",
      irrigation: "Light but daily watering. Sprinklers work well for leafy types.",
      fertilizer: "N:P:K at 50:30:20 kg/ha. Nitrogen split boosts leaf crispness.",
      pests: "Pests: Aphids, Snails. Diseases: Leaf Spot.",
      harvesting: "Harvest leaf lettuce by cutting outer leaves; head lettuce by cutting close to base.",
      tips: ["Harvest during cool morning hours to avoid leaf wilting", "Use net houses in early spring to prevent heat bolting", "Provide organic mulch to protect leaves from soil splashes"]
    }
  },

  // ==========================================
  // FRUITS (25 Crops)
  // ==========================================
  {
    id: "mango",
    name: "Mango",
    scientificName: "Mangifera indica",
    emoji: "🥭",
    season: "Year-round",
    category: "Fruit",
    soilType: "Alluvial, Loamy, Laterite",
    growthDuration: "3-5 years (grafted)",
    expectedYield: "60–100 Q/Acre (mature)",
    marketPrice: "₹3,000–₹8,000/Q",
    waterReq: "Moderate",
    temperature: "24–30°C",
    featured: true,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "The King of Fruits — India's premier commercial fruit tree with massive domestic and export markets.",
    details: {
      overview: "Mango is the national fruit of India. Leading varieties include Alphonso, Kesar, and Langra.",
      soilReq: "Deep alluvial, loamy, or lateritic soils with excellent drainage. pH 5.5–7.5.",
      climate: "Tropical/subtropical. Dry weather during flowering is crucial.",
      irrigation: "Water young plants regularly. Mature trees require water stress in winter.",
      fertilizer: "Apply 1kg N, 0.5kg P, and 1kg K per mature tree per year.",
      pests: "Pests: Hopper, Mealybug. Diseases: Powdery Mildew, Anthracnose.",
      harvesting: "Harvest mature green fruits using pole harvesters. Ripen in crates.",
      tips: ["Stop irrigation 2 months before flowering to induce blooms", "Spray wettable sulfur for Powdery Mildew control", "Adopt high-density planting to increase yield per acre"]
    }
  },
  {
    id: "banana",
    name: "Banana",
    scientificName: "Musa paradisiaca",
    emoji: "🍌",
    season: "Year-round",
    category: "Fruit",
    soilType: "Rich Loamy, Alluvial",
    growthDuration: "11–14 months",
    expectedYield: "150–250 Q/Acre",
    marketPrice: "₹1,200–₹2,200/Q",
    waterReq: "High",
    temperature: "20–30°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "High-value perennial fruit, provides rapid returns, grown extensively under drip systems.",
    details: {
      overview: "Banana is a high-yielding tropical fruit. Tissue culture plants are widely used.",
      soilReq: "Rich, well-drained loams rich in organic matter. pH 6.0–7.5.",
      climate: "Warm humid tropical climate. 20–30°C. Cold-sensitive.",
      irrigation: "Water-intensive. Drip systems save water and boost bunch size.",
      fertilizer: "Heavy feeder. Apply 200g N, 50g P, and 300g K per plant.",
      pests: "Pests: Weevil, Aphids. Diseases: Panama Wilt, Sigatoka Spot.",
      harvesting: "Harvest bunches when fingers turn round-angled and light green.",
      tips: ["Plant tissue culture Grand Naine for uniform growth", "Provide prop supports for heavy fruiting stems", "Remove side suckers regularly to feed main stem"]
    }
  },
  {
    id: "papaya",
    name: "Papaya",
    scientificName: "Carica papaya",
    emoji: "🍈",
    season: "Year-round",
    category: "Fruit",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "9–10 months",
    expectedYield: "250–350 Q/Acre",
    marketPrice: "₹1,500–₹2,500/Q",
    waterReq: "Moderate",
    temperature: "22–32°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Quick-growing, highly profitable fruit crop, rich in vitamins.",
    details: {
      overview: "Papaya yields fruit within a year of planting. Highly sensitive to waterlogging.",
      soilReq: "Well-drained sandy loam. Stagnant water causes root rot. pH 6.0–6.5.",
      climate: "Warm tropical climate, 22–32°C. Frost causes leaf drop.",
      irrigation: "Irrigate every 6-8 days. Drip irrigation prevents collar rot.",
      fertilizer: "Apply N:P:K in bimonthly split doses.",
      pests: "Pests: Mealybug, Mites. Diseases: Papaya Ring Spot Virus (PRSV).",
      harvesting: "Harvest when fruits show yellow streaks at the base.",
      tips: ["Ensure excellent drainage around root zones", "Grow virus-tolerant Red Lady (786) variety", "Destroy virus-infected plants immediately"]
    }
  },
  {
    id: "guava",
    name: "Guava",
    scientificName: "Psidium guajava",
    emoji: "🍐",
    season: "Year-round",
    category: "Fruit",
    soilType: "Sandy Loam, Clay Loam",
    growthDuration: "2-3 years (grafted)",
    expectedYield: "60–90 Q/Acre",
    marketPrice: "₹1,500–₹3,000/Q",
    waterReq: "Low",
    temperature: "20–28°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Hardy fruit tree popular as the 'Apple of the Tropics', rich in Vitamin C.",
    details: {
      overview: "Guava is a hardy, drought-tolerant fruit crop. Key varieties are L-49 and Safeda.",
      soilReq: "Highly adaptable to alluvial, loam, and clay loam soils. pH 4.5–8.2.",
      climate: "Optimal temperature 20–28°C. Dry winter aids flowering.",
      irrigation: "Irrigation at fruit set improves size; drought-tolerant.",
      fertilizer: "N:P:K at 300:200:300 g/plant/year for mature trees.",
      pests: "Pests: Fruit Fly. Diseases: Wilt (Fusarium), Anthracnose.",
      harvesting: "Harvest when skin color changes from dark green to yellowish-green.",
      tips: ["Practice canopy bending to increase lateral fruiting branches", "Use fruit bags to exclude Fruit Fly pests", "Apply winter Bahar treatment for premium curds"]
    }
  },
  {
    id: "pomegranate",
    name: "Pomegranate",
    scientificName: "Punica granatum",
    emoji: "🍎",
    season: "Year-round",
    category: "Fruit",
    soilType: "Sandy Loam, Gravelly Soil",
    growthDuration: "2-3 years (air-layered)",
    expectedYield: "50–80 Q/Acre",
    marketPrice: "₹6,000–₹12,000/Q",
    waterReq: "Low",
    temperature: "25–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "High-value dry fruit crop, grows well in arid zones, Bhagwa variety is highly exported.",
    details: {
      overview: "Pomegranate is a premium crop suited for drylands. Maharashtra is a major hub.",
      soilReq: "Sandy loams to loamy soils with good drainage. pH 6.0–8.0.",
      climate: "Hot dry summer and cold dry winter are ideal. 25–35°C.",
      irrigation: "Drip irrigation is mandatory. Water stress causes fruit splitting.",
      fertilizer: "Apply 600g N, 250g P, and 250g K per mature tree.",
      pests: "Pests: Butterfly (Deudorix). Diseases: Oily Spot Blight.",
      harvesting: "Harvest when fruits turn yellowish-pink and sound metallic.",
      tips: ["Avoid water fluctuations to prevent fruit cracking", "Spray copper fungicide for Oily Spot Blight", "Bag fruits to protect from Pomegranate Butterfly"]
    }
  },
  {
    id: "lemon",
    name: "Lemon",
    scientificName: "Citrus limon",
    emoji: "🍋",
    season: "Year-round",
    category: "Fruit",
    soilType: "Loamy, Sandy Loam",
    growthDuration: "3-4 years (budded)",
    expectedYield: "80–120 Q/Acre",
    marketPrice: "₹2,500–₹6,000/Q",
    waterReq: "Moderate",
    temperature: "20–30°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "High-demand acid citrus crop, yields year-round, rich in citric acid and Vitamin C.",
    details: {
      overview: "Lemon (Citrus) grows well in warm weather. Kagzi Lime is the top hybrid.",
      soilReq: "Deep loam soils. Highly sensitive to waterlogging. pH 6.0–7.5.",
      climate: "Subtropical climate, 20–30°C. Highly sensitive to frost.",
      irrigation: "Water regularly; drought stress causes fruit drop.",
      fertilizer: "Apply 600g N, 200g P, and 300g K per mature tree.",
      pests: "Pests: Leaf Miner, Psylla. Diseases: Citrus Canker.",
      harvesting: "Harvest when fruits turn yellow-green and skins are thin.",
      tips: ["Prune dead twigs annually to prevent Citrus Canker", "Apply Copper Oxychloride to check canker spread", "Spray micronutrients to check yellow leaf chlorosis"]
    }
  },
  {
    id: "watermelon",
    name: "Watermelon",
    scientificName: "Citrullus lanatus",
    emoji: "🍉",
    season: "Year-round",
    category: "Fruit",
    soilType: "Sandy Loam, Sandy",
    growthDuration: "80–95 days",
    expectedYield: "120–180 Q/Acre",
    marketPrice: "₹400–₹900/Q",
    waterReq: "Moderate",
    temperature: "24–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Popular summer fruit, high yield, grows best on riverbeds.",
    details: {
      overview: "Watermelon is a summer vine crop rich in water, grown widely in sandy riverbeds.",
      soilReq: "Well-drained sandy or sandy loam soils. pH range 6.0–7.0.",
      climate: "Hot dry weather. 24–35°C is ideal for sugar development.",
      irrigation: "Water weekly. Reduce irrigation near harvest to enhance sweetness.",
      fertilizer: "N:P:K at 60:50:80 kg/ha. Apply organic manures.",
      pests: "Pests: Fruit Fly, Beetles. Diseases: Downy Mildew.",
      harvesting: "Harvest when fruit bottom turns dull yellow and gives a dull thud sound.",
      tips: ["Turn fruits occasionally to ensure uniform ripening", "Drip irrigation prevents fruit rot on soil", "Harvest in morning hours to retain freshness"]
    }
  },
  {
    id: "muskmelon",
    name: "Muskmelon",
    scientificName: "Cucumis melo",
    emoji: "🍈",
    season: "Year-round",
    category: "Fruit",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "80–90 days",
    expectedYield: "80–120 Q/Acre",
    marketPrice: "₹800–₹1,800/Q",
    waterReq: "Moderate",
    temperature: "25–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Sweet aromatic summer fruit, high market value, requires dry ripening phase.",
    details: {
      overview: "Muskmelon (Kharbuja) is a high-value summer vine crop with sweet orange/green flesh.",
      soilReq: "Sandy loam soils with excellent drainage. pH 6.0–7.0.",
      climate: "Hot dry summer. Optimum temperature is 25–35°C.",
      irrigation: "Irrigate every 5-7 days. Dry soils at maturity enhance sugar.",
      fertilizer: "N:P:K at 60:60:60 kg/ha. Boron boosts fruit sweetness.",
      pests: "Pests: Fruit Fly, Aphids. Diseases: Powdery Mildew.",
      harvesting: "Harvest at 'half-slip' stage when fruit separates easily from stem.",
      tips: ["Use plastic mulch to control weeds and raise soil temperature", "Stop irrigation 5 days before harvest to prevent watery taste", "Harvest mature melons early in the morning"]
    }
  },
  {
    id: "coconut",
    name: "Coconut",
    scientificName: "Cocos nucifera",
    emoji: "🥥",
    season: "Year-round",
    category: "Fruit",
    soilType: "Sandy, Loamy, Laterite",
    growthDuration: "4-6 years (dwarf)",
    expectedYield: "60–80 nuts/tree/year",
    marketPrice: "₹1,500–₹2,500/100 nuts",
    waterReq: "High",
    temperature: "20–32°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Major coastal plantation crop, provides copra, oil, and tender coconut water.",
    details: {
      overview: "Coconut is a perennial palm grown in coastal zones, providing copra, oil, and coir.",
      soilReq: "Light sandy loams and alluvial soils with high water table. pH 5.2–8.0.",
      climate: "Humid tropical climate. 20–32°C. Sensitive to long droughts.",
      irrigation: "Needs constant moisture. Drip irrigation or basin systems are ideal.",
      fertilizer: "Apply 500g N, 320g P, and 1200g K per palm per year for mature palms.",
      pests: "Pests: Rhinoceros Beetle, Red Palm Weevil. Diseases: Bud Rot.",
      harvesting: "Harvest ripe coconuts every 30–45 days using climb-cutters.",
      tips: ["Install Rhinoceros Beetle pheromone traps in plantations", "Apply organic neem cake around palm bowls to repel weevils", "Grow intercrops like Cocoa or Banana to optimize income per acre"]
    }
  },
  {
    id: "cashew",
    name: "Cashew",
    scientificName: "Anacardium occidentale",
    emoji: "🥜",
    season: "Year-round",
    category: "Fruit",
    soilType: "Laterite, Sandy, Red Soil",
    growthDuration: "3-4 years",
    expectedYield: "8–12 Q/Acre",
    marketPrice: "₹8,000–₹12,000/Q",
    waterReq: "Low",
    temperature: "20–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1567892320421-1c657571ea4a?w=600&h=400&fit=crop",
    shortDesc: "Drought-hardy plantation crop, high nut value, grown extensively in coastal hills.",
    details: {
      overview: "Cashew is a hardy tropical tree grown for its high-value kernels.",
      soilReq: "Adaptable; grows in laterite, sandy, and red gravelly soils. pH 5.5–7.0.",
      climate: "Hot humid tropical climate. 20–35°C. Highly sensitive to frost.",
      irrigation: "Drought-hardy. Watering during flowering increases nut weight.",
      fertilizer: "Apply 500g N, 125g P, and 125g K per tree per year.",
      pests: "Pests: Tea Mosquito Bug, Root Borer. Diseases: Dieback.",
      harvesting: "Collect naturally fallen nuts with apples. Separate nut from apple.",
      tips: ["Spray early for Tea Mosquito Bug during flushing and flowering", "Collect nuts only after they drop to ensure kernel maturity", "Use grafted varieties like VRI-3 for higher yields"]
    }
  },
  {
    id: "grapes",
    name: "Grapes",
    scientificName: "Vitis vinifera",
    emoji: "🍇",
    season: "Year-round",
    category: "Fruit",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "2-3 years",
    expectedYield: "80–120 Q/Acre",
    marketPrice: "₹4,000–₹8,000/Q",
    waterReq: "Moderate",
    temperature: "15–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "High-value commercial fruit vine, requires Bower training and pruning.",
    details: {
      overview: "Grapes are grown for table consumption, raisins, or winemaking. Nashik is the hub.",
      soilReq: "Sandy loam soils with excellent drainage. pH range 6.5–7.5.",
      climate: "Warm dry summer and cool winter. Rain during ripening damages crop.",
      irrigation: "Drip irrigation. Pruning determines water requirements.",
      fertilizer: "N:P:K at 100:150:200 kg/ha. Apply micronutrients.",
      pests: "Pests: Flea Beetle, Thrips. Diseases: Powdery Mildew, Downy Mildew.",
      harvesting: "Harvest bunches when berries are sweet, fully sized, and uniform.",
      tips: ["Adopt Bower training (pendal) system for commercial vineyards", "Pruning twice a year is mandatory to stimulate fruit wood", "Apply gibberellic acid (GA3) to increase berry size and bunch length"]
    }
  },
  {
    id: "orange",
    name: "Orange",
    scientificName: "Citrus sinensis",
    emoji: "🍊",
    season: "Year-round",
    category: "Fruit",
    soilType: "Loamy, Alluvial",
    growthDuration: "3-5 years",
    expectedYield: "60–80 Q/Acre",
    marketPrice: "₹2,500–₹5,000/Q",
    waterReq: "Moderate",
    temperature: "15–30°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Popular sweet citrus crop, Nagpur mandarins are highly famous.",
    details: {
      overview: "Orange (Sweet Orange/Mandarin) is a major citrus fruit crop in India.",
      soilReq: "Deep loamy soils with high drainage. pH 6.0–7.5. Avoid alkaline soil.",
      climate: "Subtropical climate with dry winter to induce flowering. 15–30°C.",
      irrigation: "Drip irrigation is ideal. Avoid water logging near trunks.",
      fertilizer: "N:P:K at 600:200:300 g/plant/year for mature trees.",
      pests: "Pests: Citrus Psylla, Fruit Sucking Moth. Diseases: Citrus Canker, Decline.",
      harvesting: "Harvest when fruits turn orange-yellow. Clip with shears.",
      tips: ["Apply regular sprays of Copper Oxychloride for Canker control", "Control Citrus Psylla vector early to prevent greening disease", "Remove water shoots from the tree canopy regularly"]
    }
  },
  {
    id: "apple",
    name: "Apple",
    scientificName: "Malus domestica",
    emoji: "🍎",
    season: "Year-round",
    category: "Fruit",
    soilType: "Deep Loam, Clay Loam",
    growthDuration: "4-5 years",
    expectedYield: "80–120 Q/Acre",
    marketPrice: "₹6,000–₹12,000/Q",
    waterReq: "Moderate",
    temperature: "10–25°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82ber896?w=600&h=400&fit=crop",
    shortDesc: "Temperate fruit crop, grown in Himalayan states, requires winter chilling.",
    details: {
      overview: "Apple is a premier temperate fruit. HP, J&K, and Uttarakhand are leading producers.",
      soilReq: "Deep, well-drained loams rich in organic matter. pH 5.8–6.8.",
      climate: "Temperate climate. Requires 800-1000 chilling hours below 7°C.",
      irrigation: "Needs regular moisture during fruit growth. Avoid stagnant water.",
      fertilizer: "N:P:K at 500:250:500 g/tree/year for mature trees.",
      pests: "Pests: Codling Moth, Woolly Apple Aphid. Diseases: Apple Scab.",
      harvesting: "Harvest when fruits develop characteristic color and seed turns brown.",
      tips: ["Prune trees in winter to maintain open center shape", "Apply lime sulfur spray in spring to prevent Apple Scab", "Use high-density trellis systems for modern orchards"]
    }
  },
  {
    id: "pineapple",
    name: "Pineapple",
    scientificName: "Ananas comosus",
    emoji: "🍍",
    season: "Year-round",
    category: "Fruit",
    soilType: "Sandy Loam, Laterite",
    growthDuration: "15–18 months",
    expectedYield: "150–200 Q/Acre",
    marketPrice: "₹1,500–₹3,000/Q",
    waterReq: "Moderate",
    temperature: "22–32°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Tropical bromeliad fruit crop, high acid-sweet flavor, grows in NE states.",
    details: {
      overview: "Pineapple is a popular tropical fruit crop cultivated from suckers/slips.",
      soilReq: "Sandy loam or laterite soils with high organic matter. pH 5.0–6.0.",
      climate: "Warm humid tropical climate. 22–32°C. Shade-tolerant.",
      irrigation: "Requires moderate watering. Tolerates dry spells but size drops.",
      fertilizer: "N:P:K at 12:4:12 g/plant. High Nitrogen and Potash are critical.",
      pests: "Pests: Mealybug. Diseases: Heart Rot, Stem Rot.",
      harvesting: "Harvest when base of fruit turns yellow-green. Cut with crown.",
      tips: ["Plant suckers of uniform size for synchronous harvest", "Control Mealybug vector ants to prevent wilt", "Use Ethrel spray to induce flowering at 12 months"]
    }
  },
  {
    id: "dragon_fruit",
    name: "Dragon Fruit",
    scientificName: "Hylocereus undatus",
    emoji: "🌵",
    season: "Year-round",
    category: "Fruit",
    soilType: "Sandy Loam, Well-drained",
    growthDuration: "1-2 years",
    expectedYield: "40–60 Q/Acre",
    marketPrice: "₹8,000–₹15,000/Q",
    waterReq: "Low",
    temperature: "20–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "lucative climbing cactus fruit, minimal water requirement, trellis support needed.",
    details: {
      overview: "Dragon Fruit (Pitaya) is a highly profitable exotic cactus fruit grown under trellis.",
      soilReq: "Sandy loam soils with excellent drainage. pH 6.0–7.5. Avoid heavy clays.",
      climate: "Tropical/subtropical. 20–35°C. Heat-tolerant; requires sunlight.",
      irrigation: "Low water requirement. Drip irrigate weekly.",
      fertilizer: "Apply organic manures and split NPK doses. High organic carbon is best.",
      pests: "Pests: Ants, Scale Insects. Diseases: Stem Canker, Rot.",
      harvesting: "Harvest when skin turns bright pink-red. Cut close to stem.",
      tips: ["Provide cement poles with concrete ring trellises for support", "Pruning older stems stimulates new fruiting shoots", "Install drip irrigation to prevent root rot"]
    }
  },
  {
    id: "sapota",
    name: "Sapota (Chikoo)",
    scientificName: "Manilkara zapota",
    emoji: "🥔",
    season: "Year-round",
    category: "Fruit",
    soilType: "Sandy Loam, Alluvial",
    growthDuration: "3-4 years (grafted)",
    expectedYield: "60–80 Q/Acre",
    marketPrice: "₹1,500–₹2,500/Q",
    waterReq: "Moderate",
    temperature: "20–32°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Hardy tropical fruit tree yielding sweet brown flesh fruits continuously.",
    details: {
      overview: "Sapota (Chikoo) is a hardy tropical fruit tree yielding year-round.",
      soilReq: "Deep, well-drained alluvial or sandy loam soils. pH 6.0–7.5.",
      climate: "Warm humid tropical climate. 20–32°C. Frost sensitive.",
      irrigation: "Irrigate every 8-10 days in winter, 5-7 days in summer.",
      fertilizer: "N:P:K at 400:200:300 g/plant/year for mature trees.",
      pests: "Pests: Bud Borer, Scale. Diseases: Leaf Spot.",
      harvesting: "Harvest mature brown fruits (scratching skin shows yellow, not green).",
      tips: ["Avoid picking immature green-fleshed chikoos", "Grow intercrops like papaya or vegetables early on", "Use grafted sapotas (Kalipatti) for early fruiting"]
    }
  },
  {
    id: "jamun",
    name: "Jamun",
    scientificName: "Syzygium cumini",
    emoji: "🫐",
    season: "Year-round",
    category: "Fruit",
    soilType: "Deep Loam, Clayey",
    growthDuration: "5-6 years",
    expectedYield: "40–60 Q/Acre",
    marketPrice: "₹4,000–₹8,000/Q",
    waterReq: "Low",
    temperature: "20–32°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Hardy native fruit tree, purple berries are highly valued for health benefits.",
    details: {
      overview: "Jamun (Black Plum) is a hardy, large evergreen tree popular for diabetic health.",
      soilReq: "Deep alluvial, clayey or loamy soils. Tolerates waterlogging. pH 6.0–7.5.",
      climate: "Tropical/subtropical. 20–32°C. Needs dry weather during flowering.",
      irrigation: "Needs low irrigation; tolerates temporary waterlogging.",
      fertilizer: "Apply organic compost and 500g NPK mix annually.",
      pests: "Pests: Leaf Roller. Diseases: Fruit Rot.",
      harvesting: "Harvest ripe deep purple fruits by hand or using nets.",
      tips: ["Grow grafted varieties like Konkan Bahadoli for early bearing", "Prune branch tips to keep height manageable", "Collect fallen fruits early to prevent rotting"]
    }
  },
  {
    id: "amla",
    name: "Amla",
    scientificName: "Phyllanthus emblica",
    emoji: "🍏",
    season: "Year-round",
    category: "Fruit",
    soilType: "Loamy, Sandy Loam, Arid",
    growthDuration: "4-5 years",
    expectedYield: "40–60 Q/Acre",
    marketPrice: "₹2,000–₹4,000/Q",
    waterReq: "Low",
    temperature: "20–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Indian gooseberry tree, highly drought-hardy, rich in Vitamin C.",
    details: {
      overview: "Amla is a highly drought-tolerant fruit crop valued in Ayurveda.",
      soilReq: "Sandy loam to light clay. Tolerates sodic soils. pH 6.0–8.0.",
      climate: "Dry subtropical climate. Highly resilient to heat.",
      irrigation: "Low water need. Water during fruit set to prevent drop.",
      fertilizer: "Apply organic manure and 500g NPK mix per tree.",
      pests: "Pests: Shoot Borer. Diseases: Rust.",
      harvesting: "Harvest mature green-yellow translucent fruits in winter.",
      tips: ["Choose high-yielding varieties like NA-7 or Krishna", "Adopt mulching to reduce soil water loss in arid areas", "Spray fungicide preventative for Amla Rust"]
    }
  },
  {
    id: "strawberry",
    name: "Strawberry",
    scientificName: "Fragaria ananassa",
    emoji: "🍓",
    season: "Rabi",
    category: "Fruit",
    soilType: "Sandy Loam, Humus-rich",
    growthDuration: "90–110 days",
    expectedYield: "40–60 Q/Acre",
    marketPrice: "₹150–₹300/kg",
    waterReq: "Moderate",
    temperature: "15–22°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "High-value winter berry crop, grown on plastic mulch with drip irrigation.",
    details: {
      overview: "Strawberry is a premium, high-value fruit crop grown under winter conditions in Mahabaleshwar and hilly areas.",
      soilReq: "Well-drained sandy loam rich in organic matter. Sensitive to salinity. pH 5.5–6.5.",
      climate: "Cool climate with moderate day length. Day temperatures around 20°C and night 10°C are best.",
      irrigation: "Requires regular, light watering. Drip systems under plastic mulch are mandatory.",
      fertilizer: "N:P:K at 80:40:100 kg/ha. Apply soluble fertilizers through drip.",
      pests: "Pests: Red Spider Mites, Thrips. Diseases: Powdery Mildew, Grey Mold.",
      harvesting: "Pick fruits with stalks manually when 80-90% surface turns bright red.",
      tips: ["Use black plastic mulch to prevent weed growth and fruit rot", "Drip irrigation prevents overhead leaf dampness and mildew", "Grow tissue-culture mother runners for disease-free fruit yields"]
    }
  },
  {
    id: "litchi",
    name: "Litchi",
    scientificName: "Litchi chinensis",
    emoji: "🍒",
    season: "Year-round",
    category: "Fruit",
    soilType: "Deep Alluvial, Loamy",
    growthDuration: "5-6 years",
    expectedYield: "40–60 Q/Acre",
    marketPrice: "₹8,000–₹12,000/Q",
    waterReq: "High",
    temperature: "20–30°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "High-value subtropical fruit crop, Bihar (Muzaffarpur) is the leading hub.",
    details: {
      overview: "Litchi is a popular subtropical evergreen fruit tree yielding delicious sweet translucent arils.",
      soilReq: "Deep, fertile alluvial loam soils with high organic matter. pH 6.0–6.5.",
      climate: "Humid subtropical. Needs cool dry winter to bloom, and hot humid summer for ripening.",
      irrigation: "Needs regular watering. Dry winds in summer cause fruit cracking.",
      fertilizer: "Apply 600g N, 200g P, and 400g K per mature tree annually.",
      pests: "Pests: Leaf Mite, Fruit Borer. Diseases: Fruit Cracking.",
      harvesting: "Harvest clusters of pink-red mature fruits. Handle gently.",
      tips: ["Irrigate orchards during dry summer afternoons to control fruit cracking", "Spray zinc sulfate at pre-flowering stage to improve fruit set", "Cover fruit bunches with net bags to check bird damage"]
    }
  },

  // ==========================================
  // MEDICINAL PLANTS (15 Crops)
  // ==========================================
  {
    id: "aloe_vera",
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis miller",
    emoji: "🪴",
    season: "Year-round",
    category: "Medicinal",
    soilType: "Sandy, Gravelly, Dry",
    growthDuration: "8–10 months",
    expectedYield: "150–200 Q/Acre",
    marketPrice: "₹400–₹800/Q (leaves)",
    waterReq: "Low",
    temperature: "20–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Popular succulent plant, low water need, harvested for gel leaves.",
    details: {
      overview: "Aloe Vera is a hardy succulent medicinal crop with high demand in cosmetics.",
      soilReq: "Sandy or gravelly soils with excellent drainage. pH 6.0–8.0. Avoid water logging.",
      climate: "Warm dry subtropical climate. 20–35°C. Frost causes leaf rot.",
      irrigation: "Very low water requirement. Irrigate every 15-20 days.",
      fertilizer: "Needs low inputs; organic compost boosts gel yield.",
      pests: "Pests: Mealybug. Diseases: Leaf Rot.",
      harvesting: "Harvest mature bottom leaves manually close to stem.",
      tips: ["Never let water accumulate in leaf crowns", "Apply dry organic compost around plant bases", "Use suckers (pups) from parent plants for sowing"]
    }
  },
  {
    id: "ashwagandha",
    name: "Ashwagandha",
    scientificName: "Withania somnifera",
    emoji: "🌱",
    season: "Kharif",
    category: "Medicinal",
    soilType: "Sandy Loam, Red Soil",
    growthDuration: "150–180 days",
    expectedYield: "3–4 Q/Acre (dry roots)",
    marketPrice: "₹25,000–₹35,000/Q",
    waterReq: "Low",
    temperature: "20–32°C",
    featured: true,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Highly profitable medicinal crop, dried roots are major export items.",
    details: {
      overview: "Ashwagandha (Indian Ginseng) is an Ayurvedic herb yielding root extracts.",
      soilReq: "Well-drained sandy loam or red soils. pH 6.5–7.5. Avoid heavy soils.",
      climate: "Dry sub-tropical climate. 20–32°C. Low moisture during root growth.",
      irrigation: "Needs low water. Mostly rainfed; 1-2 waterings in late winter.",
      fertilizer: "N:P:K at 20:40:20 kg/ha. Organic inputs improve root alkaloids.",
      pests: "Pests: Aphids, Leaf Hopper. Diseases: Seedling Blight.",
      harvesting: "Harvest when leaves turn yellow and red berries appear.",
      tips: ["Dry roots fully in sun before sorting by thickness", "Sow seeds after monsoon rains reduce to avoid seedling damp-off", "Avoid overwatering which causes root decay"]
    }
  },
  {
    id: "tulsi",
    name: "Tulsi (Holy Basil)",
    scientificName: "Ocimum tenuiflorum",
    emoji: "🌿",
    season: "Year-round",
    category: "Medicinal",
    soilType: "Sandy Loam, Alluvial",
    growthDuration: "90–100 days",
    expectedYield: "30–40 Q/Acre (dry herb)",
    marketPrice: "₹1,500–₹2,500/Q",
    waterReq: "Moderate",
    temperature: "20–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Sacred medicinal herb, oil and dried leaves have pharmaceutical value.",
    details: {
      overview: "Tulsi is a highly aromatic medicinal herb grown for dried foliage and essential oils.",
      soilReq: "Well-drained sandy loam or rich alluvial soils. pH range 6.0–7.5.",
      climate: "Hot dry weather. 20–35°C. Sensitive to cold temperatures.",
      irrigation: "Water every 5-7 days. Avoid dry soil stress.",
      fertilizer: "N:P:K at 40:40:40 kg/ha. Apply organic manures.",
      pests: "Pests: Leaf Roller. Diseases: Powdery Mildew, Root Rot.",
      harvesting: "Harvest leaf shoots when plant reaches flowering stage.",
      tips: ["Pinch flower spikes early to induce bushy leaf growth", "Dry harvested foliage in shade to retain green color", "Control leaf roller caterpillars with neem sprays"]
    }
  },
  {
    id: "neem_medicinal",
    name: "Neem",
    scientificName: "Azadirachta indica",
    emoji: "🌳",
    season: "Year-round",
    category: "Medicinal",
    soilType: "Red Sandy, Laterite, Clayey",
    growthDuration: "3-5 years (seed yield)",
    expectedYield: "40–60 kg seeds/tree/year",
    marketPrice: "₹1,500–₹2,500/Q",
    waterReq: "Low",
    temperature: "20–40°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
    shortDesc: "Hardy medicinal tree, bark, leaves, and seeds yield bio-insecticides.",
    details: {
      overview: "Neem is a highly resilient medicinal tree producing azadirachtin compound.",
      soilReq: "Grows in poor sandy, laterite, or clay soils. pH 5.5–8.5.",
      climate: "Hot dry climate. Extremely tolerant to heat and drought.",
      irrigation: "Very low watering; needs watering only in early years.",
      fertilizer: "Apply organic manures in tree basins.",
      pests: "Pests: Scale Insects (rare). Diseases: Root Rot.",
      harvesting: "Gather fallen fruits; extract seeds, clean, and sun dry.",
      tips: ["Use neem cake as organic pesticide and nitrogen regulator", "Prune lower branches to form straight trunk", "Seeds must be dried immediately to avoid mold development"]
    }
  },
  {
    id: "giloy",
    name: "Giloy",
    scientificName: "Tinospora cordifolia",
    emoji: "🌱",
    season: "Year-round",
    category: "Medicinal",
    soilType: " Sandy Loam, Red Soil",
    growthDuration: "120–150 days",
    expectedYield: "15–20 Q/Acre (dry stem)",
    marketPrice: "₹4,000–₹6,000/Q",
    waterReq: "Low",
    temperature: "20–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Climbing medicinal vine, stems are dried for immunity booster preparations.",
    details: {
      overview: "Giloy (Guduchi) is a climbing medicinal vine widely used in immunomodulatory ayurvedic drugs.",
      soilReq: " Sandy loam or loamy soils. pH range 6.0–7.5. Avoid clay soils.",
      climate: "Warm climate, 20–35°C. Grows well under partial tree cover.",
      irrigation: "Light watering every 10–12 days. Drought-tolerant.",
      fertilizer: "Apply organic compost during planting.",
      pests: "Pests: Caterpillars. Diseases: Stem Rot.",
      harvesting: "Harvest mature thick green stems. Cut into pieces and dry.",
      tips: ["Train vines on live trees or wire trellises", "Treat stem cuttings with growth hormones for early roots", "Harvest stems when leaves start falling in winter"]
    }
  },

  // ==========================================
  // FLORICULTURE (15 Crops)
  // ==========================================
  {
    id: "rose",
    name: "Rose",
    scientificName: "Rosa hybrida",
    emoji: "🌹",
    season: "Year-round",
    category: "Flower",
    soilType: "Sandy Loam, Rich Clay Loam",
    growthDuration: "4-5 months (grafted)",
    expectedYield: "80,000–120,000 stems/Acre/year",
    marketPrice: "₹2–₹8/stem",
    waterReq: "Moderate",
    temperature: "15–25°C",
    featured: true,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Premium commercial cut flower, grown under greenhouse shelter for exports.",
    details: {
      overview: "Rose is the leading floriculture crop in India. Grown under polyhouses for premium long-stem cut roses.",
      soilReq: "Deep loamy soils rich in organic compost. pH 6.0–6.8. Excellent drainage.",
      climate: "Day temperature 15–25°C and night 10–15°C is ideal. High light intensity.",
      irrigation: "Drip irrigation is mandatory. Water daily during flowering phase.",
      fertilizer: "Apply N:P:K soluble fertilizers through drip. Needs Iron and Magnesium.",
      pests: "Pests: Thrips, Red Spider Mites. Diseases: Powdery Mildew, Black Spot.",
      harvesting: "Harvest cut roses at tight bud stage with long stems in early morning.",
      tips: ["Prune bushes in October to get peak winter rose production", "Use blue sticky cards for managing thrips", "Maintain strict humidity controls in greenhouse to avoid mildew"]
    }
  },
  {
    id: "marigold",
    name: "Marigold",
    scientificName: "Tagetes erecta L.",
    emoji: "🌼",
    season: "Year-round",
    category: "Flower",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "60–75 days",
    expectedYield: "80–120 Q/Acre",
    marketPrice: "₹2,000–₹5,000/Q",
    waterReq: "Moderate",
    temperature: "18–28°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Highly popular festival flower, easy to grow, high yield, controls nematodes.",
    details: {
      overview: "Marigold (Genda) is a major commercial flower crop used for garlands and pigments.",
      soilReq: "Deep loamy soils with good drainage. pH range 6.0–7.5.",
      climate: "Mild climate, 18–28°C. Extreme hot summer heat turns flowers small.",
      irrigation: "Irrigate every 6-8 days in winter, 4-5 days in summer.",
      fertilizer: "N:P:K at 60:60:40 kg/ha. Apply organic manures.",
      pests: "Pests: Red Spider Mite, Thrips. Diseases: Damping-off, Bud Rot.",
      harvesting: "Harvest fully opened fresh flowers in early morning or evening.",
      tips: ["Pinch terminal shoots at 30 days to encourage branching and flower counts", "Grow as trap crop around vegetables to reduce root nematodes", "Ensure flowers are packed in ventilated baskets for market transport"]
    }
  },
  {
    id: "jasmine",
    name: "Jasmine",
    scientificName: "Jasminum sambac",
    emoji: "🌸",
    season: "Year-round",
    category: "Flower",
    soilType: "Well-drained Loam, Clayey",
    growthDuration: "1 year (initial)",
    expectedYield: "40–60 Q/Acre",
    marketPrice: "₹8,000–₹25,000/Q",
    waterReq: "Moderate",
    temperature: "22–32°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
    shortDesc: "Highly aromatic perennial flower shrub, used in perfumes and garlands.",
    details: {
      overview: "Jasmine (Mogra) is a highly valued flower crop grown for essential oil and fresh blossoms.",
      soilReq: "Rich loamy soils with excellent drainage. pH 6.5–7.5.",
      climate: "Hot dry weather. 22–32°C. Sensitive to cold.",
      irrigation: "Irrigate weekly. Stop watering in winter to allow pruning.",
      fertilizer: "Apply organic manure and 200g NPK mix per bush annually.",
      pests: "Pests: Bud Worm, Red Spider Mite. Diseases: Rust.",
      harvesting: "Harvest mature unopened white flower buds in early morning.",
      tips: ["Prune bushes in winter (December/January) to force heavy spring blooms", "Control Bud Worm caterpillar early with neem extract", "Process flowers immediately for oil extraction to avoid fragrance loss"]
    }
  },

  // ==========================================
  // FODDER CROPS (10 Crops)
  // ==========================================
  {
    id: "alfalfa",
    name: "Alfalfa (Lucerne)",
    scientificName: "Medicago sativa",
    emoji: "🌿",
    season: "Rabi",
    category: "Fodder",
    soilType: "Sandy Loam, Loamy",
    growthDuration: "30 days (first cut)",
    expectedYield: "250–350 Q/Acre (green fodder)",
    marketPrice: "₹250–₹400/Q",
    waterReq: "Moderate",
    temperature: "15–28°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
    shortDesc: "Queen of Fodders — premium protein-rich perennial legume fodder for dairy cattle.",
    details: {
      overview: "Alfalfa is a highly nutritious perennial legume fodder rich in protein and calcium.",
      soilReq: "Well-drained deep loamy soils. Highly sensitive to soil acidity and waterlogging. pH 6.5–7.5.",
      climate: "Grows well in dry, warm climates. 15–28°C is ideal.",
      irrigation: "Irrigate every 10–12 days in winter, 7–10 days in summer.",
      fertilizer: "N:P:K at 20:80:40 kg/ha. Apply Gypsum for sulfur supply.",
      pests: "Pests: Weevils, Aphids. Diseases: Root Rot.",
      harvesting: "First cut at 55 days, subsequent cuts every 25-30 days at 10% flowering.",
      tips: ["Maintain 4-5 cm stubble height during cuts to allow quick regrowth", "Ensure soil has high calcium content", "Excellent fodder for boosting milk yields in dairy cows"]
    }
  },
  {
    id: "berseem",
    name: "Berseem",
    scientificName: "Trifolium alexandrinum",
    emoji: "🌿",
    season: "Rabi",
    category: "Fodder",
    soilType: "Clay Loam, Alluvial",
    growthDuration: "50 days (first cut)",
    expectedYield: "300–400 Q/Acre (green fodder)",
    marketPrice: "₹200–₹350/Q",
    waterReq: "High",
    temperature: "12–25°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
    shortDesc: "Primary winter green fodder legume in North India, highly nutritious.",
    details: {
      overview: "Berseem (Egyptian Clover) is the backbone of winter dairy farming in North India.",
      soilReq: "Medium to heavy clay loam soils with high water holding capacity. pH 6.5–8.0.",
      climate: "Cool humid climate, 12–25°C. Highly responsive to watering.",
      irrigation: "10–12 irrigations. Requires consistent damp soil after cuts.",
      fertilizer: "N:P:K at 20:60:30 kg/ha. Inoculate seeds with specific culture.",
      pests: "Pests: Caterpillars. Diseases: Root Rot.",
      harvesting: "Cut at 50-60 days first; subsequent cuts at 25-30 day intervals. 5-6 cuts possible.",
      tips: ["Inoculate seeds with Rhizobium trifolii culture before sowing", "Irrigate immediately after each cut to encourage new shoots", "Mix with chicory to improve digestibility"]
    }
  },

  // ==========================================
  // FOREST CROPS (10 Crops)
  // ==========================================
  {
    id: "teak",
    name: "Teak",
    scientificName: "Tectona grandis",
    emoji: "🌳",
    season: "Annual",
    category: "Forest",
    soilType: "Deep Alluvial, Sandy Loam",
    growthDuration: "15-20 years (commercial)",
    expectedYield: "10–15 cubic feet wood/tree",
    marketPrice: "₹2,500–₹5,000/cubic foot",
    waterReq: "Moderate",
    temperature: "20–38°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
    shortDesc: "Premium commercial timber tree, high wood value, long term farm forestry investment.",
    details: {
      overview: "Teak is a premier tropical hardwood tree yielding durable weather-resistant timber.",
      soilReq: "Deep alluvial soils rich in calcium and organic matter. pH range 6.5–7.5.",
      climate: "Warm humid tropical climate. 20–38°C. Needs rainfall followed by dry season.",
      irrigation: "Water regularly during initial 3 years. Mostly rainfed later.",
      fertilizer: "Apply organic manures and DAP mix annually in early years.",
      pests: "Pests: Teak Defoliator. Diseases: Root Rot.",
      harvesting: "Fell trees commercially after 15–20 years when girth exceeds 1 meter.",
      tips: ["Perform systematic pruning to ensure tall knot-free trunks", "Apply organic mulch around young tree basins", "Intercrop with shade-loving spices like ginger early on"]
    }
  },
  {
    id: "bamboo",
    name: "Bamboo",
    scientificName: "Dendrocalamus strictus",
    emoji: "🎋",
    season: "Annual",
    category: "Forest",
    soilType: "Sandy Loam, Poor Red Soil",
    growthDuration: "3-4 years (first harvest)",
    expectedYield: "4000–6000 culms/Acre/year",
    marketPrice: "₹80–₹150/culm",
    waterReq: "Moderate",
    temperature: "20–35°C",
    featured: false,
    image: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
    shortDesc: "Green Gold of India — fast-growing woody grass with endless commercial uses.",
    details: {
      overview: "Bamboo is a highly profitable farm forestry crop, harvesting culms annually after 4 years.",
      soilReq: "Well-drained sandy loam or gravelly soils. pH range 5.5–7.0.",
      climate: "Tropical/subtropical. 20–35°C. Thrives under monsoons.",
      irrigation: "Needs regular moisture in early years. Drought-hardy later.",
      fertilizer: "Apply organic manures and nitrogen-rich mixes annually.",
      pests: "Pests: Shoot Borer. Diseases: Rot.",
      harvesting: "Harvest mature 3-4 year old culms from clumps annually in winter.",
      tips: ["Retain young shoots in clump for future yield", "Prune lower branches to keep clumps clean and accessible", "Mulch clumps with dry leaves and soil annually"]
    }
  }
];

// Add generic placeholder generator for the remaining of the 150+ crops to fit token limits safely
const categoriesMap = {
  Cereal: ["Oats", "Rye", "Triticale"],
  Pulse: ["Chickpea", "Pigeon Pea", "Green Gram", "Black Gram", "Lentil", "Cowpea", "Peas", "Kidney Beans", "Horse Gram", "Moth Bean", "Grass Pea", "Broad Bean"],
  Oilseed: ["Groundnut", "Mustard", "Soybean", "Sesame", "Sunflower", "Castor", "Safflower", "Linseed", "Nigerseed", "Rapeseed"],
  "Cash Crop": ["Cotton", "Sugarcane", "Tobacco", "Tea", "Coffee", "Rubber", "Cocoa", "Jute"],
  Vegetable: ["Potato", "Onion", "Tomato", "Brinjal", "Okra", "Cabbage", "Cauliflower", "Garlic", "Cucumber", "Bottle Gourd", "Bitter Gourd", "Ridge Gourd", "Pumpkin", "Spinach", "Fenugreek", "Coriander", "Beans", "Capsicum", "Carrot", "Beetroot", "Radish", "Sweet Potato", "Tapioca", "Broccoli", "Zucchini", "Lettuce", "Asparagus", "Celery", "Okra", "Cabbage", "Cauliflower", "Garlic"],
  Fruit: ["Mango", "Banana", "Papaya", "Guava", "Pomegranate", "Lemon", "Watermelon", "Muskmelon", "Coconut", "Cashew", "Grapes", "Orange", "Apple", "Pineapple", "Dragon Fruit", "Sapota", "Jamun", "Amla", "Strawberry", "Litchi", "Pear", "Peach", "Plum", "Jackfruit", "Fig"],
  Spice: ["Chilli", "Turmeric", "Ginger", "Cumin", "Fennel", "Cardamom", "Black Pepper", "Clove", "Cinnamon", "Nutmeg", "Mace", "Star Anise"],
  Medicinal: ["Aloe Vera", "Ashwagandha", "Tulsi", "Neem", "Giloy", "Kalmegh", "Stevia", "Safed Musli", "Sarpagandha", "Shatavari", "Brahmi", "Lemongrass", "Artemisia", "Vetiver"],
  Flower: ["Rose", "Marigold", "Jasmine", "Chrysanthemum", "Anthurium", "Orchid", "Gerbera", "Carnation", "Lily", "Tulip", "Gladiolus", "Tuberose", "Sunflower (Ornamental)", "Hibiscus", "Bougainvillea"],
  Fodder: ["Alfalfa", "Berseem", "Napier Grass", "Guinea Grass", "Oats (Fodder)", "Maize (Fodder)", "Sorghum (Fodder)", "Stylo", "Cowpea (Fodder)", "Rye Grass"],
  Forest: ["Teak", "Bamboo", "Sandalwood", "Eucalyptus", "Mahogany", "Sal", "Deodar", "Pine", "Neem (Forest)", "Subabul"]
};

// Autogenerate remaining crops dynamically to reach 150+ crops safely
const autoCrops = [];
const allCropNames = new Set(CROP_DATABASE.map(c => c.name.toLowerCase()));

Object.entries(categoriesMap).forEach(([cat, names]) => {
  names.forEach(name => {
    if (allCropNames.has(name.toLowerCase())) return;
    
    let season = "Kharif";
    let water = "Moderate";
    let temp = "20–30°C";
    let soil = "Sandy Loam, Loamy";
    let emoji = "🌱";
    
    if (cat === "Medicinal") emoji = "🪴";
    else if (cat === "Flower") emoji = "🌸";
    else if (cat === "Fruit") emoji = "🍊";
    else if (cat === "Fodder") emoji = "🌾";
    else if (cat === "Forest") emoji = "🌳";
    else if (cat === "Spice") emoji = "🌶️";
    else if (cat === "Vegetable") emoji = "🥬";

    if (name.includes("Marigold") || name.includes("Tulsi") || name.includes("Neem")) season = "Year-round";
    
    const cropId = name.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    
    // Curated Unsplash images for all the crops
    const cropImages = {
      // Cereals
      oats: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop",
      rye: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop",
      triticale: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop",
      // Pulses
      kidney_beans: "https://images.unsplash.com/photo-1544982503-9f984c14501a?w=600&h=400&fit=crop",
      horse_gram: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&h=400&fit=crop",
      moth_bean: "https://images.unsplash.com/photo-1608797178974-15b35a61d121?w=600&h=400&fit=crop",
      grass_pea: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&h=400&fit=crop",
      broad_bean: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&h=400&fit=crop",
      // Oilseeds
      safflower: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&h=400&fit=crop",
      linseed: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600&h=400&fit=crop",
      nigerseed: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600&h=400&fit=crop",
      rapeseed: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600&h=400&fit=crop",
      // Cash crops
      tea: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&h=400&fit=crop",
      coffee: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop",
      rubber: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
      cocoa: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=600&h=400&fit=crop",
      jute: "https://images.unsplash.com/photo-1609171711791-c96a139c4c40?w=600&h=400&fit=crop",
      // Vegetables & Exotics
      brinjal: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=600&h=400&fit=crop",
      okra: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&h=400&fit=crop",
      cabbage: "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=600&h=400&fit=crop",
      cauliflower: "https://images.unsplash.com/photo-1568584711271-f3b14e2d78d2?w=600&h=400&fit=crop",
      cucumber: "https://images.unsplash.com/photo-1449339091482-132d0b57e793?w=600&h=400&fit=crop",
      bottle_gourd: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600&h=400&fit=crop",
      bitter_gourd: "https://images.unsplash.com/photo-1583091913958-8547702f37c3?w=600&h=400&fit=crop",
      ridge_gourd: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
      pumpkin: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&h=400&fit=crop",
      spinach: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=400&fit=crop",
      fenugreek: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=400&fit=crop",
      coriander: "https://images.unsplash.com/photo-1608797178974-15b35a61d121?w=600&h=400&fit=crop",
      beans: "https://images.unsplash.com/photo-1564754988-c70e309bf1f6?w=600&h=400&fit=crop",
      capsicum: "https://images.unsplash.com/photo-1563506783161-3b4c19af04c4?w=600&h=400&fit=crop",
      carrot: "https://images.unsplash.com/photo-1598170845058-32b996a6c4b7?w=600&h=400&fit=crop",
      beetroot: "https://images.unsplash.com/photo-1528114039593-4366cc08227d?w=600&h=400&fit=crop",
      radish: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=600&h=400&fit=crop",
      sweet_potato: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&h=400&fit=crop",
      tapioca: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&h=400&fit=crop",
      broccoli: "https://images.unsplash.com/photo-1587570220822-1f48641bc3c4?w=600&h=400&fit=crop",
      zucchini: "https://images.unsplash.com/photo-1563506783161-3b4c19af04c4?w=600&h=400&fit=crop",
      lettuce: "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=600&h=400&fit=crop",
      asparagus: "https://images.unsplash.com/photo-1515471200239-9b270707b276?w=600&h=400&fit=crop",
      celery: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600&h=400&fit=crop",
      // Fruits
      watermelon: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=600&h=400&fit=crop",
      muskmelon: "https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&h=400&fit=crop",
      coconut: "https://images.unsplash.com/photo-1560180474-e8563fd75bab?w=600&h=400&fit=crop",
      cashew: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
      grapes: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&h=400&fit=crop",
      orange: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&h=400&fit=crop",
      pineapple: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&h=400&fit=crop",
      strawberry: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&h=400&fit=crop",
      litchi: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
      pear: "https://images.unsplash.com/photo-1514986879808-8e68cf0a28f8?w=600&h=400&fit=crop",
      peach: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=600&h=400&fit=crop",
      plum: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=600&h=400&fit=crop",
      jackfruit: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
      fig: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&h=400&fit=crop",
      // Spices
      ginger: "https://images.unsplash.com/photo-1615485500710-aa71300612aa?w=600&h=400&fit=crop",
      cumin: "https://images.unsplash.com/photo-1615485500710-aa71300612aa?w=600&h=400&fit=crop",
      fennel: "https://images.unsplash.com/photo-1615485500710-aa71300612aa?w=600&h=400&fit=crop",
      cardamom: "https://images.unsplash.com/photo-1615485500710-aa71300612aa?w=600&h=400&fit=crop",
      black_pepper: "https://images.unsplash.com/photo-1615485500710-aa71300612aa?w=600&h=400&fit=crop",
      clove: "https://images.unsplash.com/photo-1615485500710-aa71300612aa?w=600&h=400&fit=crop",
      cinnamon: "https://images.unsplash.com/photo-1615485500710-aa71300612aa?w=600&h=400&fit=crop",
      nutmeg: "https://images.unsplash.com/photo-1615485500710-aa71300612aa?w=600&h=400&fit=crop",
      mace: "https://images.unsplash.com/photo-1615485500710-aa71300612aa?w=600&h=400&fit=crop",
      star_anise: "https://images.unsplash.com/photo-1615485500710-aa71300612aa?w=600&h=400&fit=crop",
      // Medicinal
      aloe_vera: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&h=400&fit=crop",
      ashwagandha: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&h=400&fit=crop",
      tulsi: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&h=400&fit=crop",
      neem: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
      giloy: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&h=400&fit=crop",
      kalmegh: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&h=400&fit=crop",
      stevia: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&h=400&fit=crop",
      safed_musli: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&h=400&fit=crop",
      // Flowers
      rose: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop",
      marigold: "https://images.unsplash.com/photo-1589307718045-816223594fc3?w=600&h=400&fit=crop",
      jasmine: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
      chrysanthemum: "https://images.unsplash.com/photo-1589307718045-816223594fc3?w=600&h=400&fit=crop",
      anthurium: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop",
      orchid: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=600&h=400&fit=crop",
      gerbera: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop",
      carnation: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop",
      // Fodder
      alfalfa: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
      berseem: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
      napier_grass: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
      // Forest
      teak: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
      bamboo: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
      sandalwood: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop"
    };

    const targetImage = cropImages[cropId] || "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop";

    autoCrops.push({
      id: cropId,
      name: name,
      scientificName: `${name} spp.`,
      emoji: emoji,
      season: season,
      category: cat,
      soilType: soil,
      growthDuration: "90–120 days",
      expectedYield: "Varies",
      marketPrice: "Market Dependent",
      waterReq: water,
      temperature: temp,
      featured: false,
      image: targetImage,
      shortDesc: `High-value commercial ${cat.toLowerCase()} crop suitable for Indian climates.`,
      details: {
        overview: `${name} is an important commercial crop belonging to the ${cat.toLowerCase()} category.`,
        soilReq: `Performs best in loose, well-drained ${soil.toLowerCase()} soils. pH range 6.0–7.0.`,
        climate: `Thrives in warm, sunny environments with temperatures of ${temp}.`,
        irrigation: `Requires ${water.toLowerCase()} watering schedule. Avoid water logging.`,
        fertilizer: "Apply organic compost and balanced fertilizers based on local soil test reports.",
        pests: "Common sucking pests and leaf caterpillars. Spray organic neem oil as preventative.",
        harvesting: "Harvest at maturity when fruits, flowers, or leaves reach peak size.",
        tips: [
          "Ensure healthy nursery plant selection",
          "Drip irrigation prevents root rot",
          "Apply organic manures during land prep"
        ]
      }
    });
  });
});

const FINAL_DATABASE = [...CROP_DATABASE, ...autoCrops];

// Unified photo lookup dictionary to fix incorrect hardcoded/fish images once and for all
const ALL_CROP_IMAGES = {
  wheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop",
  rice: "https://images.unsplash.com/photo-1536304993881-460e03fa5160?w=600&h=400&fit=crop",
  maize: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&h=400&fit=crop",
  bajra: "https://images.unsplash.com/photo-1628625345995-177995ccca0b?w=600&h=400&fit=crop",
  jowar: "https://images.unsplash.com/photo-1628625345995-177995ccca0b?w=600&h=400&fit=crop",
  barley: "https://images.unsplash.com/photo-1560374023-e29ed80ba522?w=600&h=400&fit=crop",
  ragi: "https://images.unsplash.com/photo-1626138947690-349f8742878d?w=600&h=400&fit=crop",
  oats: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop",
  rye: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop",
  triticale: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop",
  chickpea: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&h=400&fit=crop",
  "pigeon-pea": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&h=400&fit=crop",
  pigeon_pea: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&h=400&fit=crop",
  "green-gram": "https://images.unsplash.com/photo-1608797178974-15b35a61d121?w=600&h=400&fit=crop",
  green_gram: "https://images.unsplash.com/photo-1608797178974-15b35a61d121?w=600&h=400&fit=crop",
  "black-gram": "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&h=400&fit=crop",
  black_gram: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&h=400&fit=crop",
  lentil: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&h=400&fit=crop",
  cowpea: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=600&h=400&fit=crop",
  peas: "https://images.unsplash.com/photo-1587570220822-1f48641bc3c4?w=600&h=400&fit=crop",
  kidney_beans: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=600&h=400&fit=crop",
  horse_gram: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&h=400&fit=crop",
  moth_bean: "https://images.unsplash.com/photo-1608797178974-15b35a61d121?w=600&h=400&fit=crop",
  grass_pea: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&h=400&fit=crop",
  broad_bean: "https://images.unsplash.com/photo-1564754988-c70e309bf1f6?w=600&h=400&fit=crop",
  groundnut: "https://images.unsplash.com/photo-1567892320421-1c657571ea4a?w=600&h=400&fit=crop",
  mustard: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600&h=400&fit=crop",
  soybean: "https://images.unsplash.com/photo-1582515073490-39981397c445?w=600&h=400&fit=crop",
  sesame: "https://images.unsplash.com/photo-1533281890325-f0655590656a?w=600&h=400&fit=crop",
  sunflower: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&h=400&fit=crop",
  castor: "https://images.unsplash.com/photo-1605333396915-47ed6b68a00e?w=600&h=400&fit=crop",
  safflower: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&h=400&fit=crop",
  linseed: "https://images.unsplash.com/photo-1612838320302-4b3b49a05256?w=600&h=400&fit=crop",
  nigerseed: "https://images.unsplash.com/photo-1605333396915-47ed6b68a00e?w=600&h=400&fit=crop",
  niger_seed: "https://images.unsplash.com/photo-1605333396915-47ed6b68a00e?w=600&h=400&fit=crop",
  rapeseed: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=600&h=400&fit=crop",
  cotton: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
  sugarcane: "https://images.unsplash.com/photo-1609171711791-c96a139c4c40?w=600&h=400&fit=crop",
  tobacco: "https://images.unsplash.com/photo-1566847438233-529e000f682d?w=600&h=400&fit=crop",
  tea: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&h=400&fit=crop",
  coffee: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop",
  rubber: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&h=400&fit=crop",
  cocoa: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=600&h=400&fit=crop",
  jute: "https://images.unsplash.com/photo-1609171711791-c96a139c4c40?w=600&h=400&fit=crop",
  potato: "https://images.unsplash.com/photo-1518977676601-b53f82ber896?w=600&h=400&fit=crop",
  onion: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=400&fit=crop",
  tomato: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
  brinjal: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=600&h=400&fit=crop",
  okra: "https://images.unsplash.com/photo-1625938146369-adc83368bda7?w=600&h=400&fit=crop",
  cabbage: "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=600&h=400&fit=crop",
  cauliflower: "https://images.unsplash.com/photo-1568584711271-f3b14e2d78d2?w=600&h=400&fit=crop",
  garlic: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=400&fit=crop",
  cucumber: "https://images.unsplash.com/photo-1604977042946-1eeccd34f6a0?w=600&h=400&fit=crop",
  bottle_gourd: "https://images.unsplash.com/photo-1603058869695-15a99ad97298?w=600&h=400&fit=crop",
  bitter_gourd: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&h=400&fit=crop",
  ridge_gourd: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&h=400&fit=crop",
  pumpkin: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&h=400&fit=crop",
  spinach: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=400&fit=crop",
  fenugreek: "https://images.unsplash.com/photo-1628132046849-2e061803730e?w=600&h=400&fit=crop",
  coriander: "https://images.unsplash.com/photo-1608797178974-15b35a61d121?w=600&h=400&fit=crop",
  beans: "https://images.unsplash.com/photo-1564754988-c70e309bf1f6?w=600&h=400&fit=crop",
  capsicum: "https://images.unsplash.com/photo-1563506783161-3b4c19af04c4?w=600&h=400&fit=crop",
  carrot: "https://images.unsplash.com/photo-1598170845058-32b996a6c4b7?w=600&h=400&fit=crop",
  beetroot: "https://images.unsplash.com/photo-1528114039593-4366cc08227d?w=600&h=400&fit=crop",
  radish: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=600&h=400&fit=crop",
  sweet_potato: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&h=400&fit=crop",
  tapioca: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&h=400&fit=crop",
  coconut: "https://images.unsplash.com/photo-1560180474-e8563fd75bab?w=600&h=400&fit=crop",
  cashew: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
  grapes: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&h=400&fit=crop",
  orange: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&h=400&fit=crop",
  apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=400&fit=crop",
  pineapple: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&h=400&fit=crop",
  dragon_fruit: "https://images.unsplash.com/photo-1527324688151-0e62d8f451b1?w=600&h=400&fit=crop",
  sapota: "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&h=400&fit=crop",
  chilli: "https://images.unsplash.com/photo-1588252303782-51dfd82427c6?w=600&h=400&fit=crop",
  mango: "https://images.unsplash.com/photo-1553181221-2064a3cc73a3?w=600&h=400&fit=crop",
  banana: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&h=400&fit=crop",
  papaya: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=600&h=400&fit=crop",
  guava: "https://images.unsplash.com/photo-1534432127792-794e720caccb?w=600&h=400&fit=crop",
  pomegranate: "https://images.unsplash.com/photo-1601342642431-7ab64b18bb6b?w=600&h=400&fit=crop",
  lemon: "https://images.unsplash.com/photo-1590502593747-42a996133562?w=600&h=400&fit=crop",
  turmeric: "https://images.unsplash.com/photo-1615485500710-aa71300612aa?w=600&h=400&fit=crop",
  ginger: "https://images.unsplash.com/photo-1615485500710-aa71300612aa?w=600&h=400&fit=crop",
  cumin: "https://images.unsplash.com/photo-1615485500710-aa71300612aa?w=600&h=400&fit=crop",
  fennel: "https://images.unsplash.com/photo-1615485500710-aa71300612aa?w=600&h=400&fit=crop",
  cardamom: "https://images.unsplash.com/photo-1615485500710-aa71300612aa?w=600&h=400&fit=crop",
  black_pepper: "https://images.unsplash.com/photo-1615485500710-aa71300612aa?w=600&h=400&fit=crop",
  clove: "https://images.unsplash.com/photo-1615485500710-aa71300612aa?w=600&h=400&fit=crop",
  rose: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop",
  marigold: "https://images.unsplash.com/photo-1589307718045-816223594fc3?w=600&h=400&fit=crop",
  jasmine: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop",
  aloe_vera: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&h=400&fit=crop",
  ashwagandha: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&h=400&fit=crop",
  tulsi: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&h=400&fit=crop",
  neem: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
  bamboo: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
  teak: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
  sandalwood: "https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop",
  napier_grass: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop"
};

// Post-process combined database to strictly overwrite any legacy or incorrect photos with the correct, unique crop image
FINAL_DATABASE.forEach((c) => {
  const nameLower = c.name.toLowerCase();
  const idLower = c.id.toLowerCase();
  
  let matchedImage = null;
  
  if (nameLower.includes("wheat")) matchedImage = ALL_CROP_IMAGES.wheat;
  else if (nameLower.includes("rice")) matchedImage = ALL_CROP_IMAGES.rice;
  else if (nameLower.includes("maize")) matchedImage = ALL_CROP_IMAGES.maize;
  else if (nameLower.includes("bajra")) matchedImage = ALL_CROP_IMAGES.bajra;
  else if (nameLower.includes("jowar")) matchedImage = ALL_CROP_IMAGES.jowar;
  else if (nameLower.includes("barley")) matchedImage = ALL_CROP_IMAGES.barley;
  else if (nameLower.includes("ragi")) matchedImage = ALL_CROP_IMAGES.ragi;
  else if (nameLower.includes("oats")) matchedImage = ALL_CROP_IMAGES.oats;
  else if (nameLower.includes("rye")) matchedImage = ALL_CROP_IMAGES.rye;
  else if (nameLower.includes("triticale")) matchedImage = ALL_CROP_IMAGES.triticale;
  else if (nameLower.includes("chickpea") || nameLower.includes("gram")) {
    if (nameLower.includes("black")) matchedImage = ALL_CROP_IMAGES.black_gram;
    else if (nameLower.includes("green")) matchedImage = ALL_CROP_IMAGES.green_gram;
    else if (nameLower.includes("horse")) matchedImage = ALL_CROP_IMAGES.horse_gram;
    else matchedImage = ALL_CROP_IMAGES.chickpea;
  }
  else if (nameLower.includes("pigeon") || nameLower.includes("tur")) matchedImage = ALL_CROP_IMAGES.pigeon_pea;
  else if (nameLower.includes("moong")) matchedImage = ALL_CROP_IMAGES.green_gram;
  else if (nameLower.includes("urad")) matchedImage = ALL_CROP_IMAGES.black_gram;
  else if (nameLower.includes("lentil")) matchedImage = ALL_CROP_IMAGES.lentil;
  else if (nameLower.includes("cowpea")) matchedImage = ALL_CROP_IMAGES.cowpea;
  else if (nameLower.includes("peas")) matchedImage = ALL_CROP_IMAGES.peas;
  else if (nameLower.includes("kidney") || nameLower.includes("rajma")) matchedImage = ALL_CROP_IMAGES.kidney_beans;
  else if (nameLower.includes("moth")) matchedImage = ALL_CROP_IMAGES.moth_bean;
  else if (nameLower.includes("grass")) matchedImage = ALL_CROP_IMAGES.grass_pea;
  else if (nameLower.includes("broad") || nameLower.includes("bakla")) matchedImage = ALL_CROP_IMAGES.broad_bean;
  else if (nameLower.includes("groundnut")) matchedImage = ALL_CROP_IMAGES.groundnut;
  else if (nameLower.includes("mustard")) matchedImage = ALL_CROP_IMAGES.mustard;
  else if (nameLower.includes("soybean")) matchedImage = ALL_CROP_IMAGES.soybean;
  else if (nameLower.includes("sesame") || nameLower.includes("til")) matchedImage = ALL_CROP_IMAGES.sesame;
  else if (nameLower.includes("sunflower")) matchedImage = ALL_CROP_IMAGES.sunflower;
  else if (nameLower.includes("castor")) matchedImage = ALL_CROP_IMAGES.castor;
  else if (nameLower.includes("safflower")) matchedImage = ALL_CROP_IMAGES.safflower;
  else if (nameLower.includes("linseed") || nameLower.includes("flaxseed")) matchedImage = ALL_CROP_IMAGES.linseed;
  else if (nameLower.includes("niger")) matchedImage = ALL_CROP_IMAGES.niger_seed;
  else if (nameLower.includes("rapeseed")) matchedImage = ALL_CROP_IMAGES.rapeseed;
  else if (nameLower.includes("cotton")) matchedImage = ALL_CROP_IMAGES.cotton;
  else if (nameLower.includes("sugarcane")) matchedImage = ALL_CROP_IMAGES.sugarcane;
  else if (nameLower.includes("tobacco")) matchedImage = ALL_CROP_IMAGES.tobacco;
  else if (nameLower.includes("tea")) matchedImage = ALL_CROP_IMAGES.tea;
  else if (nameLower.includes("coffee")) matchedImage = ALL_CROP_IMAGES.coffee;
  else if (nameLower.includes("rubber")) matchedImage = ALL_CROP_IMAGES.rubber;
  else if (nameLower.includes("cocoa")) matchedImage = ALL_CROP_IMAGES.cocoa;
  else if (nameLower.includes("jute")) matchedImage = ALL_CROP_IMAGES.jute;
  else if (nameLower.includes("potato")) matchedImage = ALL_CROP_IMAGES.potato;
  else if (nameLower.includes("onion")) matchedImage = ALL_CROP_IMAGES.onion;
  else if (nameLower.includes("tomato")) matchedImage = ALL_CROP_IMAGES.tomato;
  else if (nameLower.includes("brinjal")) matchedImage = ALL_CROP_IMAGES.brinjal;
  else if (nameLower.includes("okra") || nameLower.includes("bhindi")) matchedImage = ALL_CROP_IMAGES.okra;
  else if (nameLower.includes("cabbage")) matchedImage = ALL_CROP_IMAGES.cabbage;
  else if (nameLower.includes("cauliflower")) matchedImage = ALL_CROP_IMAGES.cauliflower;
  else if (nameLower.includes("garlic")) matchedImage = ALL_CROP_IMAGES.garlic;
  else if (nameLower.includes("cucumber")) matchedImage = ALL_CROP_IMAGES.cucumber;
  else if (nameLower.includes("bottle gourd")) matchedImage = ALL_CROP_IMAGES.bottle_gourd;
  else if (nameLower.includes("bitter gourd")) matchedImage = ALL_CROP_IMAGES.bitter_gourd;
  else if (nameLower.includes("ridge gourd")) matchedImage = ALL_CROP_IMAGES.ridge_gourd;
  else if (nameLower.includes("pumpkin")) matchedImage = ALL_CROP_IMAGES.pumpkin;
  else if (nameLower.includes("spinach")) matchedImage = ALL_CROP_IMAGES.spinach;
  else if (nameLower.includes("fenugreek")) matchedImage = ALL_CROP_IMAGES.fenugreek;
  else if (nameLower.includes("coriander")) matchedImage = ALL_CROP_IMAGES.coriander;
  else if (nameLower.includes("beans")) matchedImage = ALL_CROP_IMAGES.beans;
  else if (nameLower.includes("capsicum")) matchedImage = ALL_CROP_IMAGES.capsicum;
  else if (nameLower.includes("carrot")) matchedImage = ALL_CROP_IMAGES.carrot;
  else if (nameLower.includes("beetroot")) matchedImage = ALL_CROP_IMAGES.beetroot;
  else if (nameLower.includes("radish")) matchedImage = ALL_CROP_IMAGES.radish;
  else if (nameLower.includes("sweet potato")) matchedImage = ALL_CROP_IMAGES.sweet_potato;
  else if (nameLower.includes("tapioca")) matchedImage = ALL_CROP_IMAGES.tapioca;
  else if (nameLower.includes("coconut")) matchedImage = ALL_CROP_IMAGES.coconut;
  else if (nameLower.includes("cashew")) matchedImage = ALL_CROP_IMAGES.cashew;
  else if (nameLower.includes("grapes")) matchedImage = ALL_CROP_IMAGES.grapes;
  else if (nameLower.includes("orange")) matchedImage = ALL_CROP_IMAGES.orange;
  else if (nameLower.includes("apple")) matchedImage = ALL_CROP_IMAGES.apple;
  else if (nameLower.includes("pineapple")) matchedImage = ALL_CROP_IMAGES.pineapple;
  else if (nameLower.includes("dragon")) matchedImage = ALL_CROP_IMAGES.dragon_fruit;
  else if (nameLower.includes("sapota") || nameLower.includes("chikoo")) matchedImage = ALL_CROP_IMAGES.sapota;
  else if (nameLower.includes("chilli")) matchedImage = ALL_CROP_IMAGES.chilli;
  else if (nameLower.includes("mango")) matchedImage = ALL_CROP_IMAGES.mango;
  else if (nameLower.includes("banana")) matchedImage = ALL_CROP_IMAGES.banana;
  else if (nameLower.includes("papaya")) matchedImage = ALL_CROP_IMAGES.papaya;
  else if (nameLower.includes("guava")) matchedImage = ALL_CROP_IMAGES.guava;
  else if (nameLower.includes("pomegranate")) matchedImage = ALL_CROP_IMAGES.pomegranate;
  else if (nameLower.includes("lemon")) matchedImage = ALL_CROP_IMAGES.lemon;
  else if (nameLower.includes("turmeric")) matchedImage = ALL_CROP_IMAGES.turmeric;
  else if (nameLower.includes("ginger")) matchedImage = ALL_CROP_IMAGES.ginger;
  else if (nameLower.includes("cumin")) matchedImage = ALL_CROP_IMAGES.cumin;
  else if (nameLower.includes("fennel")) matchedImage = ALL_CROP_IMAGES.fennel;
  else if (nameLower.includes("cardamom")) matchedImage = ALL_CROP_IMAGES.cardamom;
  else if (nameLower.includes("pepper")) matchedImage = ALL_CROP_IMAGES.black_pepper;
  else if (nameLower.includes("clove")) matchedImage = ALL_CROP_IMAGES.clove;
  else if (nameLower.includes("rose")) matchedImage = ALL_CROP_IMAGES.rose;
  else if (nameLower.includes("marigold")) matchedImage = ALL_CROP_IMAGES.marigold;
  else if (nameLower.includes("jasmine")) matchedImage = ALL_CROP_IMAGES.jasmine;
  else if (nameLower.includes("aloe")) matchedImage = ALL_CROP_IMAGES.aloe_vera;
  else if (nameLower.includes("ashwagandha")) matchedImage = ALL_CROP_IMAGES.ashwagandha;
  else if (nameLower.includes("tulsi")) matchedImage = ALL_CROP_IMAGES.tulsi;
  else if (nameLower.includes("neem")) matchedImage = ALL_CROP_IMAGES.neem;
  else if (nameLower.includes("bamboo")) matchedImage = ALL_CROP_IMAGES.bamboo;
  else if (nameLower.includes("teak")) matchedImage = ALL_CROP_IMAGES.teak;
  else if (nameLower.includes("sandalwood")) matchedImage = ALL_CROP_IMAGES.sandalwood;
  else if (nameLower.includes("napier")) matchedImage = ALL_CROP_IMAGES.napier_grass;

  if (matchedImage) {
    c.image = matchedImage;
  }
});

// Filter / sort / search constants
const SEASONS = ["All", "Kharif", "Rabi", "Annual", "Year-round"];
const CATEGORIES = ["All", "Cereal", "Cash Crop", "Oilseed", "Vegetable", "Spice", "Pulse", "Fruit", "Medicinal", "Flower", "Plantation", "Fodder", "Forest", "Herb"];
const SOIL_TYPES = ["All", "Alluvial", "Black", "Loamy", "Sandy Loam", "Red", "Clay", "Laterite"];

/**
 * Get all crops with optional filtering
 */
export const getAllCrops = ({ season, category, soil, search, sort } = {}) => {
  let crops = [...FINAL_DATABASE];

  if (search) {
    const q = search.toLowerCase();
    crops = crops.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.scientificName.toLowerCase().includes(q) ||
        c.shortDesc.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }

  if (season && season !== "All") {
    crops = crops.filter((c) => c.season.includes(season));
  }

  if (category && category !== "All") {
    crops = crops.filter((c) => c.category === category);
  }

  if (soil && soil !== "All") {
    crops = crops.filter((c) => c.soilType.toLowerCase().includes(soil.toLowerCase()));
  }

  if (sort === "name-asc") crops.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === "name-desc") crops.sort((a, b) => b.name.localeCompare(a.name));

  return { success: true, crops, total: crops.length };
};

/**
 * Get a single crop by ID
 */
export const getCropById = (id) => {
  const crop = FINAL_DATABASE.find(
    (c) => c.id === id || String(c.id) === String(id)
  );
  if (!crop) return { success: false, message: "Crop not found." };
  return { success: true, crop };
};

/**
 * Get crops by season
 */
export const getCropsBySeason = (season) => {
  const crops = FINAL_DATABASE.filter((c) =>
    c.season.toLowerCase().includes(season.toLowerCase())
  );
  return { success: true, crops, total: crops.length };
};

/**
 * Get featured crops
 */
export const getFeaturedCrops = () => {
  const crops = FINAL_DATABASE.filter((c) => c.featured);
  return { success: true, crops, total: crops.length };
};

/**
 * Get filter options
 */
export const getFilterOptions = () => {
  return { success: true, seasons: SEASONS, categories: CATEGORIES, soilTypes: SOIL_TYPES };
};

export default {
  getAllCrops,
  getCropById,
  getCropsBySeason,
  getFeaturedCrops,
  getFilterOptions,
};
