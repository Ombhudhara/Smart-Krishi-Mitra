import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import Loader from '../../components/Loader/Loader';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
import './CropKnowledge.css';

/* ═══════════════════════════════════════════════════════════════════════════════
   DUMMY DATA — Realistic Indian crop database
   ═══════════════════════════════════════════════════════════════════════════════ */

const CROP_DATABASE = [
  {
    id: 1,
    name: 'Wheat',
    scientificName: 'Triticum aestivum',
    emoji: '🌾',
    season: 'Rabi',
    category: 'Cereal',
    soilType: 'Alluvial, Loamy',
    growthDuration: '120–150 days',
    expectedYield: '35–45 Q/Acre',
    marketPrice: '₹2,125–₹2,275/Q',
    waterReq: 'Moderate',
    temperature: '15–25°C',
    featured: true,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop',
    shortDesc: 'India\'s most important rabi cereal crop, grown extensively in the Indo-Gangetic Plains.',
    details: {
      overview: 'Wheat is India\'s second most important food crop after rice. It is a major source of carbohydrates and is cultivated in the Rabi season across northern and central India. Major producing states include Punjab, Haryana, Uttar Pradesh, and Madhya Pradesh.',
      soilReq: 'Well-drained loamy to clay loam soils with good moisture-holding capacity. Ideal pH range is 6.0–7.5. Alluvial soils of the Indo-Gangetic Plains are best suited for wheat cultivation.',
      climate: 'Cool and moist climate during the growing period with bright sunshine during ripening. Requires 15–25°C temperature during growth and 25–30°C during grain filling. About 400–500mm rainfall is ideal.',
      irrigation: '4–6 irrigations required at critical stages: Crown Root Initiation (CRI), tillering, jointing, flowering, milking, and dough stage. First irrigation at CRI (21 days after sowing) is most critical.',
      fertilizer: 'N:P:K ratio of 120:60:40 kg/ha. Apply full P & K at sowing. Split nitrogen into 3 doses — 50% at sowing, 25% at first irrigation, 25% at second irrigation. Apply 25 kg ZnSO4/ha if zinc deficient.',
      pests: 'Major pests: Aphids, Termites, Army worm. Diseases: Rust (Yellow, Brown, Black), Karnal Bunt, Powdery Mildew, Loose Smut. Use resistant varieties and seed treatment with Vitavax @ 2.5g/kg seed.',
      harvesting: 'Harvest when grains become hard and golden yellow, moisture content 14%. Use combine harvesters for timely harvesting. Delay causes shattering losses of 1–5%.',
      tips: [
        'Sow by mid-November for maximum yield',
        'Use HD-3226 or PBW-826 for higher productivity',
        'Apply first irrigation at CRI stage — never skip it',
        'Zero tillage reduces cost by ₹2,000–3,000/acre',
        'Residue mulching conserves moisture and suppresses weeds',
      ],
    },
  },
  {
    id: 2,
    name: 'Rice',
    scientificName: 'Oryza sativa',
    emoji: '🍚',
    season: 'Kharif',
    category: 'Cereal',
    soilType: 'Clay, Alluvial',
    growthDuration: '100–150 days',
    expectedYield: '40–60 Q/Acre',
    marketPrice: '₹2,183–₹2,203/Q',
    waterReq: 'High',
    temperature: '20–35°C',
    featured: true,
    image: 'https://images.unsplash.com/photo-1536304993881-460e03fa5160?w=600&h=400&fit=crop',
    shortDesc: 'Staple food for over half the world\'s population, primarily grown in the Kharif season.',
    details: {
      overview: 'Rice is the staple food for over 65% of India\'s population. It is primarily a Kharif crop cultivated in states like West Bengal, UP, Punjab, Tamil Nadu, and Andhra Pradesh. India is the world\'s second-largest rice producer.',
      soilReq: 'Heavy clay or clay loam soils with good water retention. pH 5.5–6.5 is ideal. Alluvial and laterite soils also support rice cultivation with proper water management.',
      climate: 'Hot and humid climate with temperature 20–35°C. Requires abundant rainfall (1250–2000mm) or assured irrigation. Long days during vegetative growth and short days during flowering.',
      irrigation: 'Requires standing water of 2–5 cm during most of the growth period. Critical stages: transplanting, tillering, panicle initiation, and grain filling. SRI method reduces water use by 40%.',
      fertilizer: 'N:P:K at 120:60:60 kg/ha. Apply full P & K as basal. Nitrogen in 3 splits: 50% basal, 25% at tillering, 25% at panicle initiation. Use neem-coated urea for slow release.',
      pests: 'Major pests: Stem Borer, BPH, Leaf Folder. Diseases: Blast, Sheath Blight, Bacterial Leaf Blight. IPM with light traps and Trichogramma cards reduces pesticide use by 50%.',
      harvesting: 'Harvest when 80% grains turn golden, moisture ~20-22%. Thresh within 24 hours of cutting. Dry to 14% moisture for safe storage.',
      tips: [
        'Transplant 20–25 day old seedlings for best results',
        'Maintain 2–5 cm standing water during tillering',
        'Use Pusa Basmati 1847 for premium quality',
        'Try SRI method to save 40% water',
        'Apply silicon to strengthen stems and resist lodging',
      ],
    },
  },
  {
    id: 3,
    name: 'Cotton',
    scientificName: 'Gossypium hirsutum',
    emoji: '🌿',
    season: 'Kharif',
    category: 'Cash Crop',
    soilType: 'Black, Alluvial',
    growthDuration: '150–180 days',
    expectedYield: '15–22 Q/Acre',
    marketPrice: '₹6,620–₹7,020/Q',
    waterReq: 'Moderate',
    temperature: '21–35°C',
    featured: true,
    image: 'https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=400&fit=crop',
    shortDesc: 'White gold of India — a vital cash crop for the textile industry, grown in deep black soils.',
    details: {
      overview: 'Cotton is India\'s most important fibre crop and is often called "White Gold." India is the world\'s largest cotton producer. Major producing states are Gujarat, Maharashtra, Telangana, Karnataka, and Madhya Pradesh.',
      soilReq: 'Deep black cotton soils (Vertisols) are ideal. Well-drained alluvial soils also suit cotton. pH 6.0–8.0. Requires good soil depth (>90cm) for deep root development.',
      climate: 'Warm climate with 21–35°C temperature. Requires at least 6 months frost-free period. Annual rainfall 700–1200mm. Clear skies during boll opening are crucial for fibre quality.',
      irrigation: 'Drip irrigation is most efficient — saves 40% water and increases yield by 20%. Critical stages: flowering, boll formation, and boll development. 6–8 irrigations for optimal yield.',
      fertilizer: 'N:P:K at 120:60:60 kg/ha for BT cotton. Apply full P & K as basal. Nitrogen in 3 splits. Foliar spray of 2% DAP at flowering stage boosts boll retention.',
      pests: 'Major pests: Pink Bollworm, Whitefly, Jassids, Thrips. Diseases: Bacterial Blight, Alternaria Leaf Spot. Use refuge crop (non-Bt cotton) on 20% area to prevent resistance.',
      harvesting: 'Pick cotton when bolls open fully and fibre is fluffy. First picking at 150 days, subsequent pickings every 15–20 days. Avoid moisture during picking to maintain quality.',
      tips: [
        'Plant refuge crop to prevent Bt resistance',
        'Use drip irrigation for 20% higher yield',
        'Apply 2% DAP foliar spray at flowering',
        'Intercrop with moong/soybean for extra income',
        'Monitor whitefly with yellow sticky traps',
      ],
    },
  },
  {
    id: 4,
    name: 'Soybean',
    scientificName: 'Glycine max',
    emoji: '🫘',
    season: 'Kharif',
    category: 'Oilseed',
    soilType: 'Black, Loamy',
    growthDuration: '85–120 days',
    expectedYield: '20–30 Q/Acre',
    marketPrice: '₹4,300–₹4,600/Q',
    waterReq: 'Low to Moderate',
    temperature: '20–30°C',
    featured: false,
    image: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=600&h=400&fit=crop',
    shortDesc: 'Golden bean of India — a versatile oilseed crop with high protein content and nitrogen-fixing ability.',
    details: {
      overview: 'Soybean is called the "Miracle Crop" due to its high protein (40%) and oil (20%) content. Madhya Pradesh alone accounts for 45% of India\'s soybean production. It is also an excellent crop for soil fertility improvement.',
      soilReq: 'Well-drained black or loamy soils with pH 6.0–7.5. Waterlogging is extremely harmful. Good drainage is critical especially during early growth stages.',
      climate: 'Warm and humid climate. Temperature 20–30°C is optimal. Sensitive to photoperiod (short-day plant). Requires 500–700mm well-distributed rainfall during the crop season.',
      irrigation: 'Mostly rainfed. If irrigation available, apply at critical stages: branching, flowering, and pod filling. Excess water causes root rot and yield loss.',
      fertilizer: 'Inoculate seeds with Rhizobium culture before sowing. N:P:K at 20:80:20 kg/ha. Low nitrogen due to nitrogen fixation capability. Apply sulphur at 20 kg/ha for oil content improvement.',
      pests: 'Major pests: Stem Fly, Girdle Beetle, Tobacco Caterpillar. Diseases: Yellow Mosaic, Anthracnose, Charcoal Rot. Use resistant varieties like JS 20-34 or JS 20-69.',
      harvesting: 'Harvest when leaves turn yellow and fall, pods turn brown. Moisture should be 15%. Delay causes pod shattering and yield loss up to 10%. Thresh immediately after drying.',
      tips: [
        'Always inoculate seed with Rhizobium culture',
        'Sow on ridges if field has drainage problems',
        'Use JS 20-34 variety for highest yield potential',
        'Intercrop with pigeon pea for double income',
        'Apply sulphur for better oil content',
      ],
    },
  },
  {
    id: 5,
    name: 'Sugarcane',
    scientificName: 'Saccharum officinarum',
    emoji: '🎋',
    season: 'Annual',
    category: 'Cash Crop',
    soilType: 'Alluvial, Loamy',
    growthDuration: '12–18 months',
    expectedYield: '700–1000 Q/Acre',
    marketPrice: '₹305–₹315/Q',
    waterReq: 'Very High',
    temperature: '20–35°C',
    featured: true,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop',
    shortDesc: 'India\'s most important sugar-producing crop with the highest per-hectare productivity.',
    details: {
      overview: 'India is the world\'s second largest sugarcane producer. It supports 50 million farmers and the entire sugar industry. Major states: UP, Maharashtra, Karnataka, Tamil Nadu. An annual/perennial crop with 12–18 month duration.',
      soilReq: 'Deep, well-drained, alluvial or loamy soils with pH 6.5–7.5. Good moisture retention capacity needed. Avoid waterlogged or highly alkaline soils.',
      climate: 'Tropical and subtropical climate. Hot and humid weather during growth (30–35°C), cool and dry weather during ripening (12–14°C). Frost is harmful. 1500–2500mm rainfall ideal.',
      irrigation: 'Requires 8–10 irrigations in plant crop. Drip irrigation saves 30–40% water. Critical periods: germination, tillering, and grand growth phase. Avoid waterlogging at all stages.',
      fertilizer: 'N:P:K at 300:85:60 kg/ha for plant crop. Apply nitrogen in 3–4 splits. Use FYM at 25 tonnes/ha as basal. Apply 25 kg ZnSO4/ha. Trash mulching reduces fertilizer need.',
      pests: 'Major pests: Shoot Borer, Top Borer, Woolly Aphid. Diseases: Red Rot, Smut, Wilt. Plant disease-free setts. Use hot water treatment of setts at 52°C for 30 minutes.',
      harvesting: 'Harvest at 12–14 months when Brix reading reaches 18–20%. Cut at ground level. Crush within 24 hours of cutting to prevent sugar loss. Ratoon crop possible for 2–3 cycles.',
      tips: [
        'Use drip irrigation to save 35% water',
        'Plant in spring (Feb-Mar) for best sugar recovery',
        'Apply trash mulching between rows',
        'Maintain ratoon for 2 cycles then replant',
        'Hot water treatment prevents Red Rot and Smut',
      ],
    },
  },
  {
    id: 6,
    name: 'Maize',
    scientificName: 'Zea mays',
    emoji: '🌽',
    season: 'Kharif',
    category: 'Cereal',
    soilType: 'Loamy, Sandy Loam',
    growthDuration: '80–110 days',
    expectedYield: '40–55 Q/Acre',
    marketPrice: '₹1,962–₹2,090/Q',
    waterReq: 'Moderate',
    temperature: '21–30°C',
    featured: false,
    image: 'https://images.unsplash.com/photo-1601312797232-1d36ecaecd97?w=600&h=400&fit=crop',
    shortDesc: 'Queen of cereals — a versatile crop used for food, feed, and industrial raw material.',
    details: {
      overview: 'Maize is the third most important cereal crop after rice and wheat. It is called the "Queen of Cereals" for its highest genetic yield potential. Used for food (25%), animal feed (12%), and starch industry (63%).',
      soilReq: 'Well-drained sandy loam to loamy soils. pH 5.5–7.0 is ideal. Maize is sensitive to waterlogging. Light-textured soils are preferred for Rabi maize.',
      climate: 'Warm weather crop. Optimum temperature 21–30°C. Can be grown in all three seasons (Kharif, Rabi, Spring). Sensitive to frost. Requires 500–800mm rainfall.',
      irrigation: 'Critical stages: knee-high (V6), tasseling, silking, and grain filling. Skip irrigation during these stages causes 30–40% yield loss. 5–6 irrigations in Rabi season.',
      fertilizer: 'N:P:K at 120:60:40 kg/ha. Apply full P & K at sowing. Nitrogen in 3 splits — 1/3 at sowing, 1/3 at knee-high, 1/3 at tasseling. ZnSO4 at 25 kg/ha.',
      pests: 'Major pests: Fall Armyworm (emerging threat), Stem Borer, Shoot Fly. Diseases: Maydis Leaf Blight, Downy Mildew, Stalk Rot. Pheromone traps for Fall Armyworm monitoring.',
      harvesting: 'Harvest when husks turn brown and grains are dented. Moisture content should be 20–25% at harvest, dry to 12–14% for storage. Mechanical harvesting saves labor cost.',
      tips: [
        'Never skip irrigation during silking stage',
        'Use pheromone traps for Fall Armyworm early detection',
        'Rabi maize gives 30% higher yield than Kharif',
        'Apply Zinc sulphate for better grain development',
        'Harvest at 20–25% moisture and dry properly',
      ],
    },
  },
  {
    id: 7,
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    emoji: '🍅',
    season: 'Rabi / Year-round',
    category: 'Vegetable',
    soilType: 'Sandy Loam, Loamy',
    growthDuration: '75–90 days',
    expectedYield: '200–350 Q/Acre',
    marketPrice: '₹800–₹2,500/Q',
    waterReq: 'Moderate',
    temperature: '18–27°C',
    featured: false,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=400&fit=crop',
    shortDesc: 'India\'s most important vegetable crop with high demand and significant price volatility.',
    details: {
      overview: 'Tomato is India\'s second most important vegetable after potato. India produces 21 million tonnes annually. Grown year-round under different conditions. High-value crop but subject to extreme price volatility.',
      soilReq: 'Well-drained sandy loam to loamy soils rich in organic matter. pH 6.0–7.0. Avoid heavy clay soils. Raised beds recommended in areas with heavy rainfall.',
      climate: 'Moderate temperature 18–27°C is ideal. Very sensitive to frost. High temperatures (>35°C) cause flower drop and poor fruit set. Protected cultivation extends production season.',
      irrigation: 'Drip irrigation is ideal — saves 40% water, reduces disease, and increases yield by 25%. Critical at flowering and fruit development. Avoid overhead irrigation to prevent foliar diseases.',
      fertilizer: 'N:P:K at 120:80:80 kg/ha. Apply full P & K at transplanting. Nitrogen in 3 splits. Foliar spray of calcium nitrate prevents blossom end rot. Micronutrients (B, Zn) important.',
      pests: 'Major pests: Fruit Borer (Helicoverpa), Whitefly (vectors ToLCV), Leaf Miner. Diseases: Early & Late Blight, Bacterial Wilt, ToLCV. Use ToLCV resistant hybrids in endemic areas.',
      harvesting: 'Harvest at breaker stage (pink tinge) for long-distance transport, fully ripe for local markets. 5–8 pickings over 2–3 months. Handle carefully to avoid damage.',
      tips: [
        'Use mulching to conserve moisture and suppress weeds',
        'Stake or trellis plants for better air circulation',
        'Spray calcium nitrate to prevent blossom end rot',
        'Install yellow sticky traps for whitefly monitoring',
        'Consider polyhouse cultivation for premium pricing',
      ],
    },
  },
  {
    id: 8,
    name: 'Groundnut',
    scientificName: 'Arachis hypogaea',
    emoji: '🥜',
    season: 'Kharif',
    category: 'Oilseed',
    soilType: 'Sandy Loam, Red',
    growthDuration: '100–130 days',
    expectedYield: '18–25 Q/Acre',
    marketPrice: '₹5,550–₹5,850/Q',
    waterReq: 'Low to Moderate',
    temperature: '25–30°C',
    featured: false,
    image: 'https://images.unsplash.com/photo-1567892320421-1c657571ea4a?w=600&h=400&fit=crop',
    shortDesc: 'King of oilseeds — a key edible oil source with rich protein content and soil enriching properties.',
    details: {
      overview: 'Groundnut is India\'s principal oilseed crop, popularly known as "King of Oilseeds." India is the world\'s second largest producer. Major states: Gujarat, Rajasthan, Tamil Nadu, Andhra Pradesh, and Karnataka.',
      soilReq: 'Light-textured, well-drained sandy loam soils with pH 6.0–6.5. Calcium-rich soils are preferred for pod development. Avoid heavy soils as they hinder pegging and pod formation.',
      climate: 'Warm climate with 25–30°C temperature. Well-distributed rainfall of 500–700mm. Excess rain during maturity causes aflatoxin contamination. Clear skies during harvest are essential.',
      irrigation: 'Mostly rainfed. If irrigation available, provide at pegging, pod development, and pod filling stages. Over-irrigation causes pod rot. Life-saving irrigations at critical stages improve yield by 25%.',
      fertilizer: 'N:P:K at 25:50:50 kg/ha. Rhizobium inoculation essential. Gypsum at 500 kg/ha at flowering for calcium. Basal application of FYM at 5 tonnes/ha. Micronutrients: Boron, Iron, Zinc.',
      pests: 'Major pests: White Grub, Aphids, Leaf Miner, Tobacco Caterpillar. Diseases: Tikka Leaf Spot, Rust, Collar Rot, Aflatoxin (post-harvest). Seed treatment with Trichoderma reduces soil-borne diseases.',
      harvesting: 'Harvest when leaves turn yellow, inside shell turns dark. Test by pressing kernel — if it makes a cracking sound, it\'s ready. Dry pods to 8–10% moisture. Avoid soil contact during drying.',
      tips: [
        'Apply gypsum at 500 kg/ha during flowering',
        'Inoculate seed with Rhizobium before sowing',
        'Use calcium-rich soils for better pod development',
        'Dry pods properly to prevent aflatoxin',
        'Intercrop with pigeon pea or pearl millet',
      ],
    },
  },
  {
    id: 9,
    name: 'Mustard',
    scientificName: 'Brassica juncea',
    emoji: '🌻',
    season: 'Rabi',
    category: 'Oilseed',
    soilType: 'Loamy, Sandy Loam',
    growthDuration: '110–140 days',
    expectedYield: '12–18 Q/Acre',
    marketPrice: '₹5,450–₹5,650/Q',
    waterReq: 'Low',
    temperature: '10–25°C',
    featured: false,
    image: 'https://images.unsplash.com/photo-1578307985320-34b61a66c195?w=600&h=400&fit=crop',
    shortDesc: 'India\'s most important rabi oilseed — produces cooking oil, mustard paste, and livestock feed.',
    details: {
      overview: 'Mustard is India\'s most important Rabi oilseed crop. Rajasthan alone produces 45% of India\'s mustard. Important for edible oil, condiment, and livestock feed. India is the 3rd largest producer globally.',
      soilReq: 'Well-drained loamy or sandy loam soils. pH 6.0–7.5. Saline and alkaline soils also tolerate mustard moderately. Good drainage is essential.',
      climate: 'Cool and dry climate with 10–25°C. Frost at flowering is very damaging. Low humidity reduces disease incidence. Excess rainfall causes Alternaria blight.',
      irrigation: 'One pre-sowing irrigation + 1–2 irrigations at branching and pod-filling. Avoid irrigation during flowering to prevent pollen washing and reduced seed set.',
      fertilizer: 'N:P:K at 80:40:40 kg/ha. Apply full P & K at sowing. Nitrogen in 2 splits. Sulphur at 40 kg/ha is crucial for oil content. Apply borax at 10 kg/ha.',
      pests: 'Major pests: Aphids (most destructive), Painted Bug, Sawfly. Diseases: Alternaria Blight, White Rust, Downy Mildew, Sclerotinia Rot. Neem oil spray effective against aphids.',
      harvesting: 'Harvest when 75% pods turn yellowish-brown. Early morning harvesting reduces shattering. Thresh after 3–4 days of sun drying. Store at 8% moisture.',
      tips: [
        'Apply sulphur at 40 kg/ha for better oil content',
        'Monitor aphids from December onwards',
        'Avoid irrigation during peak flowering period',
        'Sow by October 20–25 for best yield',
        'Use Pusa Bold or RH-749 for high yield',
      ],
    },
  },
  {
    id: 10,
    name: 'Potato',
    scientificName: 'Solanum tuberosum',
    emoji: '🥔',
    season: 'Rabi',
    category: 'Vegetable',
    soilType: 'Sandy Loam, Loamy',
    growthDuration: '80–120 days',
    expectedYield: '200–300 Q/Acre',
    marketPrice: '₹600–₹1,200/Q',
    waterReq: 'Moderate to High',
    temperature: '15–25°C',
    featured: false,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82ber633?w=600&h=400&fit=crop',
    shortDesc: 'World\'s most important non-cereal food crop with massive demand in Indian kitchens.',
    details: {
      overview: 'India is the world\'s 2nd largest potato producer. Uttar Pradesh leads production followed by West Bengal, Bihar, and Gujarat. Versatile crop used in food, processing, and starch industries.',
      soilReq: 'Well-drained, friable sandy loam soils rich in organic matter. pH 5.5–6.5. Avoid heavy clay soils. Good tilth is essential for tuber development and easy harvest.',
      climate: 'Cool climate with 15–25°C day temperature. Frost damages foliage. Short days promote tuberization. Night temperature below 20°C is essential for proper tuber bulking.',
      irrigation: 'Frequent but light irrigations at 7–10 day intervals. Drip or sprinkler irrigation saves 30% water. Critical stages: stolon formation, tuber initiation, and tuber bulking. Stop irrigation 10 days before harvest.',
      fertilizer: 'N:P:K at 180:80:100 kg/ha. Apply full P & K at planting. Nitrogen in 2 splits. FYM at 20 tonnes/ha as basal. Potassium improves tuber quality and storage life.',
      pests: 'Major pests: Cutworm, Potato Tuber Moth, Aphids (vector for viruses). Diseases: Late Blight (devastating), Early Blight, Common Scab, Black Leg. Prophylactic Mancozeb sprays prevent Late Blight.',
      harvesting: 'Harvest when foliage turns yellow and starts drying. Haulm cutting 10 days before harvest strengthens skin. Use mechanical diggers for large-scale harvest. Grade and store in cold storage at 2–4°C.',
      tips: [
        'Use certified disease-free seed tubers only',
        'Start prophylactic Late Blight spraying from 45 days',
        'Cut haulms 10 days before harvest for skin curing',
        'Store in cold storage at 2–4°C and 90% humidity',
        'Use Kufri Jyoti or Kufri Pukhraj for commercial farming',
      ],
    },
  },
  {
    id: 11,
    name: 'Onion',
    scientificName: 'Allium cepa',
    emoji: '🧅',
    season: 'Rabi / Kharif',
    category: 'Vegetable',
    soilType: 'Loamy, Sandy Loam',
    growthDuration: '130–150 days',
    expectedYield: '150–250 Q/Acre',
    marketPrice: '₹800–₹3,000/Q',
    waterReq: 'Moderate',
    temperature: '15–25°C',
    featured: false,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&h=400&fit=crop',
    shortDesc: 'Kitchen essential with volatile market prices — India\'s most important spice crop by volume.',
    details: {
      overview: 'India is the world\'s 2nd largest onion producer. Maharashtra (Nashik) produces 30% of India\'s onion. Onion prices are politically sensitive and subject to extreme volatility. Key export commodity.',
      soilReq: 'Well-drained, fertile loamy soils rich in humus. pH 6.0–7.0. Avoid waterlogged soils. Raised beds essential in high rainfall areas. Alluvial soils are well suited.',
      climate: 'Cool weather (15–25°C) during bulb development. Long days promote bulb formation. Hot weather at maturity helps curing. Excess rain causes neck rot and reduces storage quality.',
      irrigation: 'Light and frequent irrigations at 7–10 day intervals. Drip irrigation is best. Stop irrigation 15 days before harvest for better curing and storage. Over-irrigation causes splitting.',
      fertilizer: 'N:P:K at 100:50:50 kg/ha. Apply full P & K at transplanting. Nitrogen in 3 splits. Sulphur at 30 kg/ha improves pungency and storage life. Micronutrients: Boron, Zinc.',
      pests: 'Major pests: Thrips (most damaging), Onion Fly, Head Borer. Diseases: Purple Blotch, Stemphylium Blight, Basal Rot. Spray Fipronil for thrips. Rotate crops every 2–3 years.',
      harvesting: 'Harvest when 50–70% necks fall over. Cure in field for 3–5 days. Remove tops leaving 2 cm neck. Store in well-ventilated structures. Bottom-ventilated storage extends shelf life to 4–6 months.',
      tips: [
        'Late Kharif onion (Sept planting) fetches best prices',
        'Apply sulphur for better pungency and storage',
        'Cure onions properly — poor curing causes 30% storage loss',
        'Use bottom-ventilated structures for long-term storage',
        'Monitor thrips weekly using blue sticky traps',
      ],
    },
  },
  {
    id: 12,
    name: 'Chilli',
    scientificName: 'Capsicum annuum',
    emoji: '🌶️',
    season: 'Kharif / Rabi',
    category: 'Spice',
    soilType: 'Loamy, Black',
    growthDuration: '120–150 days',
    expectedYield: '10–20 Q/Acre (dry)',
    marketPrice: '₹8,000–₹18,000/Q',
    waterReq: 'Moderate',
    temperature: '20–30°C',
    featured: false,
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&h=400&fit=crop',
    shortDesc: 'India\'s most traded spice with high export value — essential in Indian and global cuisine.',
    details: {
      overview: 'India is the world\'s largest producer, consumer, and exporter of chilli. Andhra Pradesh produces 40% of India\'s chilli. Guntur is the chilli capital. Used fresh, dried, and in oleoresin extraction.',
      soilReq: 'Well-drained black or loamy soils with pH 6.0–7.0. Rich in organic matter. Avoid waterlogged areas. Raised beds recommended in heavy rainfall regions.',
      climate: 'Warm and humid climate (20–30°C). Sensitive to frost and waterlogging. Dry weather during fruit ripening ensures better colour development. Requires 600–1200mm rainfall.',
      irrigation: 'Drip irrigation ideal — saves 35% water and increases yield by 30%. Mulching with plastic reduces weed and conserves moisture. Critical at flowering and fruit development.',
      fertilizer: 'N:P:K at 120:60:60 kg/ha. Full P & K as basal. Nitrogen in 4 splits. Foliar sprays of micronutrients (B, Zn, Fe) improve fruit quality and colour. Calcium improves fruit firmness.',
      pests: 'Major pests: Thrips, Mites, Fruit Borer. Diseases: Anthracnose, Powdery Mildew, Leaf Curl Virus (vectors: Whitefly, Thrips). Neem-based products for organic pest control.',
      harvesting: 'Harvest green chilli at 45–50 days after transplanting. For dry chilli, harvest when fruits turn fully red. Dry under sun to 10% moisture. Mechanical drying maintains colour quality.',
      tips: [
        'Use plastic mulch + drip for 30% higher yield',
        'Spray neem oil for organic thrips management',
        'Dry under shade for better colour retention',
        'Use Byadagi or Guntur Sannam for commercial farming',
        'Apply calcium for firmer fruits and less cracking',
      ],
    },
  },
];

const SEASONS = ['All', 'Kharif', 'Rabi', 'Annual', 'Year-round'];
const CATEGORIES = ['All', 'Cereal', 'Cash Crop', 'Oilseed', 'Vegetable', 'Spice'];
const SOIL_TYPES_FILTER = ['All', 'Alluvial', 'Black', 'Loamy', 'Sandy Loam', 'Red', 'Clay', 'Laterite'];
const SORT_OPTIONS = ['Relevance', 'Name (A-Z)', 'Name (Z-A)', 'Season', 'Yield (High)', 'Yield (Low)'];

const AI_SUGGESTIONS = [
  { id: 1, icon: '🧠', title: 'Best crop for Black soil in Kharif', desc: 'Based on your soil profile and region, Cotton or Soybean are recommended with expected ROI of 60–80%.', type: 'soil' },
  { id: 2, icon: '🌧️', title: 'Weather-based crop suggestion', desc: 'Forecast shows above-normal monsoon this year. Rice, Maize, and Soybean will benefit from excess moisture.', type: 'weather' },
  { id: 3, icon: '🔄', title: 'Crop rotation advice', desc: 'After wheat, plant Moong (summer) → Rice (Kharif) → Wheat (Rabi) for optimal nutrient cycling and yield.', type: 'rotation' },
  { id: 4, icon: '📊', title: 'Market price trend alert', desc: 'Cotton prices trending +12% YoY. Consider expanding cotton acreage by 15–20% this season for higher returns.', type: 'market' },
];

const VIDEO_CARDS = [
  { id: 1, title: 'Modern Wheat Farming Techniques', channel: 'Krishi Darshan', duration: '12:34', views: '2.4M', thumbnail: '🌾', color: '#E8F5E9' },
  { id: 2, title: 'Drip Irrigation for Cotton — Complete Guide', channel: 'Smart Farmer India', duration: '18:22', views: '1.8M', thumbnail: '💧', color: '#E3F2FD' },
  { id: 3, title: 'Organic Pest Management in Tomatoes', channel: 'AgriTech Pro', duration: '15:45', views: '980K', thumbnail: '🍅', color: '#FFF3E0' },
];

const PDF_GUIDES = [
  { id: 1, title: 'Complete Wheat Cultivation Guide', pages: 42, size: '3.8 MB', icon: '📕', color: '#FFEBEE' },
  { id: 2, title: 'Cotton Farming Best Practices', pages: 36, size: '4.2 MB', icon: '📗', color: '#E8F5E9' },
  { id: 3, title: 'Organic Farming — A Complete Manual', pages: 58, size: '5.1 MB', icon: '📘', color: '#E3F2FD' },
  { id: 4, title: 'Government Subsidies for Farmers 2025', pages: 28, size: '2.4 MB', icon: '📙', color: '#FFF8E1' },
];

const POPULAR_CROPS = [
  { name: 'Wheat', emoji: '🌾', trend: '+12%' },
  { name: 'Rice', emoji: '🍚', trend: '+8%' },
  { name: 'Cotton', emoji: '🌿', trend: '+15%' },
  { name: 'Tomato', emoji: '🍅', trend: '-5%' },
  { name: 'Soybean', emoji: '🫘', trend: '+20%' },
  { name: 'Sugarcane', emoji: '🎋', trend: '+3%' },
  { name: 'Onion', emoji: '🧅', trend: '+25%' },
  { name: 'Chilli', emoji: '🌶️', trend: '+10%' },
];

// ─── Crop Detail Modal ────────────────────────────────────────────
function CropDetailModal({ crop, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!crop) return null;

  const TABS = [
    { id: 'overview', label: '📋 Overview', icon: '📋' },
    { id: 'soil', label: '🏔️ Soil & Climate', icon: '🏔️' },
    { id: 'cultivation', label: '🌱 Cultivation', icon: '🌱' },
    { id: 'protection', label: '🛡️ Protection', icon: '🛡️' },
    { id: 'harvest', label: '🎯 Harvest & Tips', icon: '🎯' },
  ];

  return (
    <div className="ck-modal-overlay" onClick={onClose}>
      <div className="ck-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal header */}
        <div className="ck-modal-header">
          <div className="ck-modal-header-bg" />
          <button className="ck-modal-close" onClick={onClose}>✕</button>
          <div className="ck-modal-crop-info">
            <span className="ck-modal-emoji">{crop.emoji}</span>
            <div>
              <h2 className="ck-modal-crop-name">{crop.name}</h2>
              <p className="ck-modal-sci-name">{crop.scientificName}</p>
            </div>
          </div>
          <div className="ck-modal-tags">
            <span className="ck-tag ck-tag--season">{crop.season}</span>
            <span className="ck-tag ck-tag--category">{crop.category}</span>
            <span className="ck-tag ck-tag--soil">{crop.soilType}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="ck-modal-stats">
          {[
            { label: 'Growth', value: crop.growthDuration, icon: '⏱️' },
            { label: 'Yield', value: crop.expectedYield, icon: '📦' },
            { label: 'Price', value: crop.marketPrice, icon: '💰' },
            { label: 'Water', value: crop.waterReq, icon: '💧' },
            { label: 'Temp', value: crop.temperature, icon: '🌡️' },
          ].map((s, i) => (
            <div key={i} className="ck-modal-stat">
              <span className="ck-modal-stat-icon">{s.icon}</span>
              <div>
                <div className="ck-modal-stat-value">{s.value}</div>
                <div className="ck-modal-stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="ck-modal-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`ck-modal-tab ${activeTab === tab.id ? 'ck-modal-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="ck-modal-body">
          {activeTab === 'overview' && (
            <div className="ck-tab-content ck-fade-in">
              <h3>About {crop.name}</h3>
              <p>{crop.details.overview}</p>
            </div>
          )}
          {activeTab === 'soil' && (
            <div className="ck-tab-content ck-fade-in">
              <h3>🏔️ Soil Requirements</h3>
              <p>{crop.details.soilReq}</p>
              <h3>🌤️ Climate & Weather</h3>
              <p>{crop.details.climate}</p>
            </div>
          )}
          {activeTab === 'cultivation' && (
            <div className="ck-tab-content ck-fade-in">
              <h3>💧 Irrigation</h3>
              <p>{crop.details.irrigation}</p>
              <h3>🧪 Fertilizer Management</h3>
              <p>{crop.details.fertilizer}</p>
            </div>
          )}
          {activeTab === 'protection' && (
            <div className="ck-tab-content ck-fade-in">
              <h3>🛡️ Pest & Disease Management</h3>
              <p>{crop.details.pests}</p>
            </div>
          )}
          {activeTab === 'harvest' && (
            <div className="ck-tab-content ck-fade-in">
              <h3>🎯 Harvesting</h3>
              <p>{crop.details.harvesting}</p>
              <h3>💡 Expert Farming Tips</h3>
              <ul className="ck-tips-list">
                {crop.details.tips.map((tip, i) => (
                  <li key={i}>
                    <span className="ck-tip-num">{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function CropKnowledge() {
  // Layout
  const [collapsed, setCollapsed] = useState(false);

  // Search / Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [soilFilter, setSoilFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Relevance');

  // UI State
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Carousel
  const carouselRef = useRef(null);

  // Simulate loading
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const showNotify = useCallback((msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Filter & Sort crops
  const filteredCrops = CROP_DATABASE
    .filter((c) => {
      if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !c.scientificName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (seasonFilter !== 'All' && !c.season.includes(seasonFilter)) return false;
      if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
      if (soilFilter !== 'All' && !c.soilType.includes(soilFilter)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'Name (A-Z)') return a.name.localeCompare(b.name);
      if (sortBy === 'Name (Z-A)') return b.name.localeCompare(a.name);
      return 0;
    });

  const featuredCrops = CROP_DATABASE.filter((c) => c.featured);

  const scrollCarousel = (dir) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSeasonFilter('All');
    setCategoryFilter('All');
    setSoilFilter('All');
    setSortBy('Relevance');
    showNotify('Filters have been reset.', 'info');
  };

  return (
    <div className="ck-root">
      {/* ── Toast ───────────────────────────────────── */}
      {notification && (
        <div className={`ck-toast ck-toast--${notification.type}`}>
          <span className="ck-toast-icon">{notification.type === 'success' ? '✅' : 'ℹ️'}</span>
          {notification.msg}
        </div>
      )}

      {/* ── Modal ───────────────────────────────────── */}
      {selectedCrop && (
        <CropDetailModal crop={selectedCrop} onClose={() => setSelectedCrop(null)} />
      )}

      {/* ═══ NAVBAR ═══════════════════════════════════ */}
      <Navbar 
        user={{ name: 'OM', role: 'Farmer', unreadNotifications: true }} 
        onToggleSidebar={() => setCollapsed(!collapsed)}
        notificationSlot={<NotificationBell notifications={[]} />}
      />

      {/* ═══ LAYOUT ═══════════════════════════════════ */}
      <div className="ck-layout">
        {/* ── Sidebar ────────────────────────────── */}
        <Sidebar 
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          activeItem="crops"
        />

        {/* ═══ MAIN ═══════════════════════════════════ */}
        <main className="ck-main">

          {/* ── Page Header ────────────────────── */}
          <div className="ck-page-header">
            <div className="ck-header-content">
              <div className="ck-header-text">
                <div className="ck-breadcrumb">Dashboard / <span>Crop Knowledge</span></div>
                <h1 className="ck-page-title">🌾 Crop Knowledge Center</h1>
                <p className="ck-page-subtitle">
                  Discover detailed information about crops, cultivation methods, soil conditions, irrigation, fertilizers, diseases, harvesting techniques, and market insights.
                </p>
              </div>
              <div className="ck-header-illus">
                <svg viewBox="0 0 220 160" className="ck-illus-svg" aria-hidden="true">
                  <defs>
                    <linearGradient id="ckSky" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E8F5E9" />
                      <stop offset="100%" stopColor="#C8E6C9" />
                    </linearGradient>
                    <linearGradient id="ckField" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#66BB6A" />
                      <stop offset="100%" stopColor="#2E7D32" />
                    </linearGradient>
                  </defs>
                  <rect width="220" height="160" fill="url(#ckSky)" rx="16" />
                  <circle cx="185" cy="32" r="20" fill="#FFD54F" opacity="0.9" />
                  <circle cx="185" cy="32" r="28" fill="#FFD54F" opacity="0.15" />
                  <ellipse cx="55" cy="28" rx="26" ry="10" fill="white" opacity="0.8" />
                  <ellipse cx="72" cy="22" rx="18" ry="8" fill="white" opacity="0.75" />
                  <ellipse cx="130" cy="36" rx="20" ry="8" fill="white" opacity="0.6" />
                  <rect x="0" y="108" width="220" height="52" fill="url(#ckField)" />
                  {/* Book / Knowledge icon */}
                  <g transform="translate(88,55)">
                    <rect x="0" y="0" width="44" height="52" rx="4" fill="white" opacity="0.95" />
                    <rect x="3" y="3" width="18" height="46" rx="2" fill="#E8F5E9" />
                    <rect x="23" y="3" width="18" height="46" rx="2" fill="#C8E6C9" />
                    <line x1="22" y1="3" x2="22" y2="49" stroke="#66BB6A" strokeWidth="2" />
                    {[10, 17, 24, 31, 38].map((y, i) => (
                      <g key={i}>
                        <line x1="6" y1={y} x2="18" y2={y} stroke="#A5D6A7" strokeWidth="1.5" />
                        <line x1="26" y1={y} x2="38" y2={y} stroke="#81C784" strokeWidth="1.5" />
                      </g>
                    ))}
                  </g>
                  {/* Plant decorations */}
                  {[18, 52, 90, 130, 165, 200].map((x, i) => (
                    <g key={i} transform={`translate(${x},90)`}>
                      <line x1="0" y1="20" x2="0" y2="2" stroke="#1B5E20" strokeWidth="2" />
                      <ellipse cx="0" cy="0" rx="5" ry="8" fill="#43A047" />
                    </g>
                  ))}
                  <rect x="140" y="112" width="70" height="34" rx="8" fill="white" opacity="0.92" />
                  <text x="152" y="127" fontSize="8" fill="#388E3C" fontWeight="700" fontFamily="Poppins,sans-serif">12 Crops</text>
                  <text x="152" y="139" fontSize="7" fill="#66BB6A" fontFamily="Poppins,sans-serif">Full Database →</text>
                </svg>
              </div>
            </div>
          </div>

          {/* ── Stats ──────────────────────────── */}
          <div className="ck-stats-row">
            {[
              { icon: '🌾', value: '12', label: 'Crops in Database', trend: 'Growing' },
              { icon: '📖', value: '60+', label: 'Farming Tips', trend: 'Updated' },
              { icon: '🤖', value: '4', label: 'AI Suggestions', trend: 'Live' },
              { icon: '📥', value: '4', label: 'PDF Guides', trend: 'Free' },
            ].map((s, i) => (
              <div key={i} className="ck-stat-chip">
                <span className="ck-stat-icon">{s.icon}</span>
                <div className="ck-stat-text">
                  <div className="ck-stat-value">{s.value}</div>
                  <div className="ck-stat-label">{s.label}</div>
                </div>
                <span className="ck-stat-trend">{s.trend}</span>
              </div>
            ))}
          </div>

          {/* ═══ SEARCH & FILTERS ════════════════════ */}
          <Card className="ck-search-section">
            <div className="ck-search-row">
              <div className="ck-search-bar">
                <span className="ck-search-icon">🔍</span>
                <input
                  type="text"
                  className="ck-search-input"
                  placeholder="Search by crop name, scientific name, or keyword…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="ck-search-clear" onClick={() => setSearchQuery('')}>✕</button>
                )}
              </div>
              <Button className="ck-filter-reset" onClick={resetFilters} text="🔄 Reset Filters" />
            </div>

            <div className="ck-filter-row">
              {/* Season Chips */}
              <div className="ck-filter-group">
                <label className="ck-filter-label">Season</label>
                <div className="ck-chip-row">
                  {SEASONS.map((s) => (
                    <button
                      key={s}
                      className={`ck-chip ${seasonFilter === s ? 'ck-chip--active' : ''}`}
                      onClick={() => setSeasonFilter(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Chips */}
              <div className="ck-filter-group">
                <label className="ck-filter-label">Category</label>
                <div className="ck-chip-row">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      className={`ck-chip ${categoryFilter === c ? 'ck-chip--active' : ''}`}
                      onClick={() => setCategoryFilter(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Soil Dropdown */}
              <div className="ck-filter-group ck-filter-group--select">
                <label className="ck-filter-label">Soil Type</label>
                <select className="ck-select" value={soilFilter} onChange={(e) => setSoilFilter(e.target.value)}>
                  {SOIL_TYPES_FILTER.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="ck-filter-group ck-filter-group--select">
                <label className="ck-filter-label">Sort By</label>
                <select className="ck-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  {SORT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="ck-filter-summary">
              Showing <strong>{filteredCrops.length}</strong> of {CROP_DATABASE.length} crops
              {(seasonFilter !== 'All' || categoryFilter !== 'All' || soilFilter !== 'All' || searchQuery) && (
                <span className="ck-filter-active-badge">Filters Active</span>
              )}
            </div>
          </Card>

          {/* ═══ FEATURED CROPS CAROUSEL ══════════════ */}
          <section className="ck-featured-section">
            <div className="ck-section-header">
              <h2 className="ck-section-title">⭐ Featured Crops</h2>
              <div className="ck-carousel-nav">
                <button className="ck-carousel-btn" onClick={() => scrollCarousel(-1)}>←</button>
                <button className="ck-carousel-btn" onClick={() => scrollCarousel(1)}>→</button>
              </div>
            </div>
            <div className="ck-carousel" ref={carouselRef}>
              {featuredCrops.map((crop) => (
                <div key={crop.id} className="ck-featured-card">
                  <div className="ck-featured-img-wrap">
                    <div className="ck-featured-img" style={{ backgroundImage: `url(${crop.image})` }}>
                      <span className="ck-featured-season">{crop.season}</span>
                    </div>
                  </div>
                  <div className="ck-featured-body">
                    <div className="ck-featured-name">
                      <span>{crop.emoji}</span> {crop.name}
                    </div>
                    <p className="ck-featured-desc">{crop.shortDesc}</p>
                    <button className="ck-featured-btn" onClick={() => setSelectedCrop(crop)}>
                      Learn More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ CROP GRID ════════════════════════════ */}
          <section className="ck-grid-section">
            <div className="ck-section-header">
              <h2 className="ck-section-title">📚 All Crops</h2>
              <span className="ck-section-badge">{filteredCrops.length} results</span>
            </div>

            {isLoading ? (
              <div className="ck-crop-grid">
                {[...Array(8)].map((_, i) => <Loader key={i} variant="card" />)}
              </div>
            ) : filteredCrops.length === 0 ? (
              <div className="ck-empty-state">
                <span className="ck-empty-icon">🔍</span>
                <h3>No crops found</h3>
                <p>Try adjusting your filters or search query.</p>
                <Button variant="primary" onClick={resetFilters} text="Reset Filters" />
              </div>
            ) : (
              <div className="ck-crop-grid">
                {filteredCrops.map((crop) => (
                  <div key={crop.id} className="ck-crop-card">
                    <div className="ck-crop-img-wrap">
                      <div className="ck-crop-img" style={{ backgroundImage: `url(${crop.image})` }}>
                        <span className="ck-crop-season-badge">{crop.season}</span>
                        <span className="ck-crop-category-badge">{crop.category}</span>
                      </div>
                    </div>
                    <div className="ck-crop-body">
                      <div className="ck-crop-name-row">
                        <span className="ck-crop-emoji">{crop.emoji}</span>
                        <div>
                          <h3 className="ck-crop-name">{crop.name}</h3>
                          <p className="ck-crop-sci">{crop.scientificName}</p>
                        </div>
                      </div>
                      <div className="ck-crop-meta-grid">
                        <div className="ck-crop-meta">
                          <span className="ck-meta-label">🏔️ Soil</span>
                          <span className="ck-meta-value">{crop.soilType}</span>
                        </div>
                        <div className="ck-crop-meta">
                          <span className="ck-meta-label">⏱️ Duration</span>
                          <span className="ck-meta-value">{crop.growthDuration}</span>
                        </div>
                        <div className="ck-crop-meta">
                          <span className="ck-meta-label">📦 Yield</span>
                          <span className="ck-meta-value">{crop.expectedYield}</span>
                        </div>
                        <div className="ck-crop-meta">
                          <span className="ck-meta-label">💰 Price</span>
                          <span className="ck-meta-value">{crop.marketPrice}</span>
                        </div>
                      </div>
                      <Button className="ck-crop-detail-btn" onClick={() => setSelectedCrop(crop)} text="View Details →" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ═══ AI RECOMMENDATIONS ══════════════════ */}
          <section className="ck-ai-section">
            <div className="ck-section-header">
              <h2 className="ck-section-title">🤖 AI Crop Advisor</h2>
              <span className="ck-section-badge ck-badge--ai">✨ Powered by Gemini</span>
            </div>
            <div className="ck-ai-grid">
              {AI_SUGGESTIONS.map((rec) => (
                <div key={rec.id} className={`ck-ai-card ck-ai-card--${rec.type}`}>
                  <div className="ck-ai-top">
                    <span className="ck-ai-icon">{rec.icon}</span>
                    <span className={`ck-ai-type-badge ck-ai-type--${rec.type}`}>
                      {rec.type === 'soil' ? 'Soil Based' : rec.type === 'weather' ? 'Weather' : rec.type === 'rotation' ? 'Rotation' : 'Market'}
                    </span>
                  </div>
                  <h3 className="ck-ai-title">{rec.title}</h3>
                  <p className="ck-ai-desc">{rec.desc}</p>
                  <Button className="ck-ai-ask-btn" onClick={() => showNotify('AI advisor feature coming soon!', 'info')} text="🤖 Ask AI →" />
                </div>
              ))}
            </div>
          </section>

          {/* ═══ VIDEO + PDF ROW ═════════════════════ */}
          <div className="ck-media-grid">
            {/* Videos */}
            <Card 
              className="ck-media-section"
              title="Related Videos"
              subtitle="Educational farming videos curated for you"
              icon="🎥"
            >
              <div className="ck-video-list">
                {VIDEO_CARDS.map((v) => (
                  <div key={v.id} className="ck-video-card" onClick={() => showNotify('Video playback coming soon!', 'info')}>
                    <div className="ck-video-thumb" style={{ background: v.color }}>
                      <span className="ck-video-emoji">{v.thumbnail}</span>
                      <span className="ck-video-play">▶</span>
                      <span className="ck-video-duration">{v.duration}</span>
                    </div>
                    <div className="ck-video-info">
                      <h4 className="ck-video-title">{v.title}</h4>
                      <div className="ck-video-meta">{v.channel} · {v.views} views</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* PDFs */}
            <Card 
              className="ck-media-section"
              title="Download Guides"
              subtitle="Free PDF farming manuals &amp; references"
              icon="📥"
            >
              <div className="ck-pdf-list">
                {PDF_GUIDES.map((g) => (
                  <div key={g.id} className="ck-pdf-card" onClick={() => showNotify('PDF download coming soon!', 'info')}>
                    <span className="ck-pdf-icon" style={{ background: g.color }}>{g.icon}</span>
                    <div className="ck-pdf-info">
                      <h4 className="ck-pdf-title">{g.title}</h4>
                      <div className="ck-pdf-meta">{g.pages} pages · {g.size}</div>
                    </div>
                    <span className="ck-pdf-download">⬇️</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* ═══ POPULAR / TRENDING CROPS ════════════ */}
          <Card 
            className="ck-popular-section"
            title="Trending Crops"
            subtitle="Most searched and popular crops this season"
            icon="🔥"
          >
            <div className="ck-popular-grid">
              {POPULAR_CROPS.map((crop, i) => (
                <div
                  key={i}
                  className="ck-popular-chip"
                  onClick={() => {
                    const full = CROP_DATABASE.find((c) => c.name === crop.name);
                    if (full) setSelectedCrop(full);
                  }}
                >
                  <span className="ck-popular-emoji">{crop.emoji}</span>
                  <span className="ck-popular-name">{crop.name}</span>
                  <span className={`ck-popular-trend ${crop.trend.startsWith('+') ? 'ck-trend-up' : 'ck-trend-down'}`}>
                    {crop.trend}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* ═══ FOOTER ══════════════════════════════ */}
          <Footer />

        </main>
      </div>
    </div>
  );
}
