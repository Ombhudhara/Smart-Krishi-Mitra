import User from "../models/User.js";
import Listing from "../models/Listing.js";
import Scheme from "../models/Scheme.js";
import News from "../models/News.js";

/**
 * Seeds default data into the database if the collections are empty.
 * Ensures the frontend displays active schemes, listings, and news instantly.
 */
export const seedDatabase = async () => {
  try {
    // 1. Seed default user if none exist
    let seller = await User.findOne({ role: "Farmer" });
    if (!seller) {
      seller = await User.create({
        fullName: "Rajesh Kumar",
        email: "rajesh@krishimitra.com",
        phone: "9898989898",
        password: "password123", // Will be hashed by pre-save hook
        role: "Farmer",
        address: "12, Green Field Road",
        state: "Punjab",
        district: "Amritsar",
        village: "Ajnala",
        farmSize: "5 Acres",
        soilType: "Alluvial",
        cropsGrown: ["Wheat", "Rice"],
        accountStatus: "Active",
      });
      console.log("🌱 Seeder: Default seller user created.");
    }

    // 2. Seed Listings if none exist
    const listingsCount = await Listing.countDocuments();
    if (listingsCount === 0) {
      await Listing.create([
        {
          cropName: "Organic Wheat",
          description: "Freshly harvested organic Sharbati wheat, grown without synthetic pesticides. High gluten content, perfect for chapatis.",
          price: 24,
          quantity: 1500,
          unit: "kg",
          category: "Grains",
          images: ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400"],
          location: "Amritsar, Punjab",
          state: "Punjab",
          district: "Amritsar",
          isOrganic: true,
          seller: seller._id,
          stock: 1500,
          minimumOrder: 50,
          pricePerUnit: 24,
        },
        {
          cropName: "Red Potatoes",
          description: "Premium quality red potatoes, direct from the fields. Ideal for making chips or everyday cooking. Well-sorted and cleaned.",
          price: 18,
          quantity: 2000,
          unit: "kg",
          category: "Vegetables",
          images: ["https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=400"],
          location: "Jalandhar, Punjab",
          state: "Punjab",
          district: "Jalandhar",
          isOrganic: false,
          seller: seller._id,
          stock: 2000,
          minimumOrder: 100,
          pricePerUnit: 18,
        },
        {
          cropName: "Basmati Rice",
          description: "Long-grain traditional aromatic Basmati rice, aged for 1 year. Hand-harvested and processed with care.",
          price: 75,
          quantity: 800,
          unit: "kg",
          category: "Grains",
          images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"],
          location: "Karnal, Haryana",
          state: "Haryana",
          district: "Karnal",
          isOrganic: true,
          seller: seller._id,
          stock: 800,
          minimumOrder: 20,
          pricePerUnit: 75,
        },
        {
          cropName: "Fresh Alphonso Mangos",
          description: "Sweet and pulpy Alphonso mangos. Naturally ripened using grass bedding. Grade A quality exports.",
          price: 120,
          quantity: 400,
          unit: "kg",
          category: "Fruits",
          images: ["https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400"],
          location: "Ratnagiri, Maharashtra",
          state: "Maharashtra",
          district: "Ratnagiri",
          isOrganic: false,
          seller: seller._id,
          stock: 400,
          minimumOrder: 10,
          pricePerUnit: 120,
        }
      ]);
      console.log("🌾 Seeder: Default marketplace listings created.");
    }

    // 3. Seed Welfare Schemes if none exist
    const schemesCount = await Scheme.countDocuments();
    if (schemesCount === 0) {
      await Scheme.create([
        {
          title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
          description: "An initiative by the Government of India that provides up to ₹6,000 per year in three equal installments as minimum income support to all small and marginal farmers.",
          benefits: "Financial benefit of ₹6,000 per year, transferred directly into the bank accounts of farmers.",
          eligibility: "All small and marginal landholding farmer families who have cultivable landholding in their names.",
          category: "Finance",
          officialLink: "https://pmkisan.gov.in/",
          documentsRequired: ["Aadhaar Card", "Land Records", "Bank Passbook"],
        },
        {
          title: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
          description: "A government-sponsored crop insurance scheme that integrates multiple stakeholders and aims to support sustainable production in agriculture sector.",
          benefits: "Financial support to farmers suffering crop loss/damage arising out of unforeseen events. Low premium rates (1.5% to 5%).",
          eligibility: "All farmers growing notified crops in notified areas including sharecroppers and tenant farmers.",
          category: "Insurance",
          officialLink: "https://pmfby.gov.in/",
          documentsRequired: ["Aadhaar Card", "Crop Sowing Certificate", "Bank Passbook"],
        },
        {
          title: "Per Drop More Crop (Micro Irrigation Fund)",
          description: "Focuses on enhancing water use efficiency at the farm level through micro-irrigation technologies like drip and sprinkler irrigation systems.",
          benefits: "Subsidy of up to 45% to 55% for installing drip and sprinkler systems. Enhances crop yields while saving water and fertilizer costs.",
          eligibility: "All categories of farmers having cultivable land are eligible to receive subsidy assistance.",
          category: "Irrigation",
          officialLink: "https://pmksy.gov.in/",
          documentsRequired: ["Aadhaar Card", "Land Possession Proof"],
        },
        {
          title: "Agriculture Infrastructure Fund (AIF)",
          description: "A financing facility for creation of post-harvest management infrastructure and community farming assets.",
          benefits: "3% interest subvention per annum on loans up to ₹2 crore for a maximum period of 7 years, plus credit guarantee coverage.",
          eligibility: "Primary Agricultural Credit Societies (PACS), Marketing Cooperative Societies, FPOs, SHGs, Farmers, and Agri-entrepreneurs.",
          category: "Finance",
          officialLink: "https://agriinfra.dac.gov.in/",
          documentsRequired: ["Project Report", "Aadhaar Card", "Bank NOC"],
        }
      ]);
      console.log("📢 Seeder: Default government schemes created.");
    }

    // 4. Seed News Articles if none exist
    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      await News.create([
        {
          title: "New Eco-Friendly Fertiliser Approved for Small Farms",
          content: "The Ministry of Agriculture has approved a new bio-fertiliser designed to increase crop yields by 15% while reducing soil toxicity. The product utilizes organic materials and local microbes to enhance root absorption, offering an affordable option for small-scale farms.",
          category: "Technology",
          imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=400",
          featured: true,
        },
        {
          title: "Monsoon Forecast: Normal Rainfall Expected This Season",
          content: "The Meteorological Department has issued its forecast indicating a normal monsoon season. Farmers are advised to plan crop rotations accordingly, focusing on timely sowing of paddy and cotton in the northern regions. Local reservoirs are currently at stable levels.",
          category: "General",
          imageUrl: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&q=80&w=400",
          featured: false,
        },
        {
          title: "Market Analysis: Wheat Demand Surges in Export Markets",
          content: "A global supply shortage has driven up international demand for Indian Sharbati and Durum wheat. Prices in wholesale markets (Mandis) have seen an 8% increase over the last month, providing higher profit margins for farmers who kept stock in warehouse storage facilities.",
          category: "Market",
          imageUrl: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=400",
          featured: true,
        }
      ]);
      console.log("📰 Seeder: Default news articles created.");
    }
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
  }
};
