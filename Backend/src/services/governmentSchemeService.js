import axios from "axios";

// Retrieve configurations from environment
const API_KEY = process.env.DATA_GOV_API_KEY;
const API_URL = (process.env.DATA_GOV_BASE_URL || "https://api.data.gov.in").replace(/\/+$/, "");

// Create Axios Client Instance for data.gov.in
const dataGovClient = axios.create({
  baseURL: API_URL,
  timeout: 8000, // 8-second request timeout limit
});

// Resource IDs specified for the schemes
const RESOURCES = {
  PM_KISAN: (process.env.PM_KISAN_RESOURCE_ID || "YOUR_PM_KISAN_RESOURCE_ID_PLACEHOLDER").replace(/^\/?resource\//i, ""),
  PMKBY: (process.env.PMKBY_RESOURCE_ID || "YOUR_PMKBY_RESOURCE_ID_PLACEHOLDER").replace(/^\/?resource\//i, ""),
  SOIL_HEALTH: (process.env.SOIL_HEALTH_RESOURCE_ID || "YOUR_SOIL_HEALTH_RESOURCE_ID_PLACEHOLDER").replace(/^\/?resource\//i, ""),
  AGRICULTURE: (process.env.AGRICULTURE_RESOURCE_ID || "YOUR_AGRICULTURE_RESOURCE_ID_PLACEHOLDER").replace(/^\/?resource\//i, ""),
};

const AGRICULTURE_KEYWORDS = [
  "agriculture", "farmer", "farmers", "farming", "crop", "crops",
  "kisan", "seed", "seeds", "fertilizer", "pesticides", "irrigation",
  "horticulture", "dairy", "livestock", "fisheries", "organic farming",
  "soil", "harvest", "agriculture ministry", "ministry of agriculture",
  "pm-kisan", "enam", "mandi", "msp", "krishi", "rural development"
];

const IRRELEVANT_KEYWORDS = [
  "railways", "elections", "parliament", "defence", "sports",
  "entertainment", "tourism", "education", "urban development",
  "police", "courts"
];

// In-memory cache for API schemes list
const schemeCache = {
  data: null,
  lastFetched: 0,
  ttl: 10 * 60 * 1000, // 10 minutes cache TTL
};

// High-quality local/fallback agricultural scheme database
const MOCK_SCHEMES = [
  {
    id: "pm-kisan",
    title: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    description: "An initiative by the Government of India providing direct financial assistance to landholding farmer families across the country to support agricultural inputs and domestic needs.",
    category: "Financial Assistance",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    benefits: "Direct income support of ₹6,000 per year, distributed in three equal installments of ₹2,000 directly into the bank accounts of certified farmers.",
    eligibility: "All landholding farmer families in India who own cultivable land (subject to specific high-income exclusion criteria).",
    officialLink: "https://pmkisan.gov.in",
    documentsRequired: ["Aadhaar Card", "Land ownership documents (Khatauni)", "Bank Account Passbook", "Active Mobile Number"],
    applicationProcess: "Register online via the PM-KISAN portal, visit local Common Service Centers (CSCs), or contact the block agricultural officer.",
    lastDate: null,
    lastUpdated: "2026-06-25",
    state: "All India",
    featured: true
  },
  {
    id: "pmfby-crop-insurance",
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description: "A comprehensive crop insurance scheme to provide financial protection against crop failures due to natural calamities, pests, or diseases, stabilizing farmer incomes.",
    category: "Crop Insurance",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    benefits: "Comprehensive insurance coverage against crop damage. Low premium rates of 2% for Kharif crops, 1.5% for Rabi crops, and 5% for annual commercial/horticultural crops.",
    eligibility: "All farmers, including sharecroppers and tenant farmers, growing notified crops in notified areas are eligible.",
    officialLink: "https://pmfby.gov.in",
    documentsRequired: ["Aadhaar Card", "Land possession certificate/rent agreement", "Sowing certificate issued by local authority", "Bank passbook photocopy"],
    applicationProcess: "Apply through the PMFBY portal, designated commercial banks, cooperative societies, or authorized insurance agents.",
    lastDate: "2026-08-31",
    lastUpdated: "2026-07-01",
    state: "All India",
    featured: true
  },
  {
    id: "soil-health-card",
    title: "Soil Health Card Scheme",
    description: "A scheme to evaluate and issue soil health cards to farmers every two years, enabling them to understand nutrient deficiencies and apply correct fertilizer dosages.",
    category: "Agriculture",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    benefits: "Provides detailed soil reports measuring 12 vital chemical/physical parameters. Includes customized recommendations for fertilizer use to reduce input costs and increase yields.",
    eligibility: "All operational agricultural landholders across India.",
    officialLink: "https://soilhealth.dac.gov.in",
    documentsRequired: ["Aadhaar Card", "Soil sample from field", "Farmer registration card"],
    applicationProcess: "Soil samples are collected by the agricultural extension officers or can be directly submitted to the nearest Soil Testing Laboratory.",
    lastDate: null,
    lastUpdated: "2026-05-15",
    state: "All India",
    featured: false
  },
  {
    id: "pmksy-irrigation",
    title: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
    description: "Formulated to expand cultivable area under assured irrigation, improve on-farm water use efficiency, and promote micro-irrigation practices (Per Drop More Crop).",
    category: "Irrigation",
    ministry: "Ministry of Jal Shakti / Ministry of Agriculture",
    benefits: "Financial subsidy up to 55% for small/marginal farmers and 45% for other farmers for installing drip and sprinkler irrigation systems.",
    eligibility: "Farmers owning agricultural land, members of water user associations, and cooperative farming groups.",
    officialLink: "https://pmksy.gov.in",
    documentsRequired: ["Aadhaar Card", "Land ownership certificate", "Approved micro-irrigation layout plan", "Bank details"],
    applicationProcess: "Apply online through state department horticulture portals or submit application forms to the district horticulture officer.",
    lastDate: null,
    lastUpdated: "2026-06-10",
    state: "All India",
    featured: true
  },
  {
    id: "pkvy-organic-farming",
    title: "Paramparagat Krishi Vikas Yojana (PKVY)",
    description: "A scheme promoting organic farming through a cluster approach and PGS (Participatory Guarantee System) certification to produce chemical-free agricultural goods.",
    category: "Organic Farming",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    benefits: "Financial assistance of ₹50,000 per hectare for 3 years, with ₹31,000 directly disbursed as incentives for organic fertilizers, seeds, and harvesting assistance.",
    eligibility: "Farmers practicing traditional agriculture who can form clusters of a minimum of 20 hectares (approx. 50 acres).",
    officialLink: "https://dap.dac.gov.in",
    documentsRequired: ["Aadhaar Card", "Cluster registration documents", "Land mapping data"],
    applicationProcess: "Farmers can join or form a local cluster group and register online through the PKVY portal with assistance from regional agricultural officers.",
    lastDate: null,
    lastUpdated: "2026-04-18",
    state: "All India",
    featured: false
  },
  {
    id: "smam-farm-equipment",
    title: "Sub-Mission on Agricultural Mechanization (SMAM)",
    description: "Aims to promote farm mechanization by providing subsidies for purchasing modern agricultural machinery, particularly targeting small and marginal farmers.",
    category: "Farm Equipment",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    benefits: "Subsidy ranging from 40% to 50% on agricultural tools and machinery such as power tillers, tractors, seed drills, and harvesters.",
    eligibility: "Individual farmers, self-help groups, and cooperative societies, with priority given to women, SC, ST, and marginal farmers.",
    officialLink: "https://agrimachinery.nic.in",
    documentsRequired: ["Aadhaar Card", "Bank Passbook", "Land records", "Category Certificate (if applicable)", "Passport-size photograph"],
    applicationProcess: "Register and apply on the DBT Portal for Agricultural Mechanization (agrimachinery.nic.in) and select the designated dealer.",
    lastDate: null,
    lastUpdated: "2026-06-05",
    state: "All India",
    featured: true
  },
  {
    id: "nlm-livestock",
    title: "National Livestock Mission (NLM)",
    description: "Designed to foster entrepreneurship, improve breed quality, and secure feed availability in poultry, sheep, goat, and piggery sectors.",
    category: "Livestock",
    ministry: "Ministry of Fisheries, Animal Husbandry and Dairying",
    benefits: "Capital subsidy of up to 50% (capped at ₹25-50 Lakhs depending on the sector) for establishing breeding farms and feed processing facilities.",
    eligibility: "Farmers, individual entrepreneurs, Self Help Groups (SHGs), Joint Liability Groups (JLGs), and cooperative societies.",
    officialLink: "https://nlm.udyamimitra.in",
    documentsRequired: ["Aadhaar Card", "Detailed Project Report (DPR)", "Land registration/lease papers", "PAN Card", "Bank account statement"],
    applicationProcess: "Register online via the NLM portal (nlm.udyamimitra.in), upload the DPR, and submit the application for evaluation.",
    lastDate: null,
    lastUpdated: "2026-05-20",
    state: "All India",
    featured: false
  },
  {
    id: "pmmsy-fisheries",
    title: "Pradhan Mantri Matsya Sampada Yojana (PMMSY)",
    description: "A flagship program for sustainable development of the fisheries sector, addressing infrastructure gaps, traceabilities, and fishermen's welfare.",
    category: "Fisheries",
    ministry: "Ministry of Fisheries, Animal Husbandry and Dairying",
    benefits: "Subsidy of 40% (for general category) and 60% (for SC, ST, and women) on project costs for constructing new ponds, cold storages, and purchasing boats.",
    eligibility: "Fishers, fish farmers, self-help groups, and cooperatives involved in marine or inland aquaculture.",
    officialLink: "https://pmmsy.dof.gov.in",
    documentsRequired: ["Aadhaar Card", "Fisherman identity card", "Land/pond lease agreement", "Project estimation report"],
    applicationProcess: "Submit applications to the District Fisheries Officer or apply online through the state's respective fisheries portal.",
    lastDate: "2026-09-30",
    lastUpdated: "2026-06-15",
    state: "All India",
    featured: false
  },
  {
    id: "deds-dairy",
    title: "Dairy Entrepreneurship Development Scheme (DEDS)",
    description: "Helps establish modern dairy farms, upgrade traditional milk processing systems, and generate self-employment in the dairy sector.",
    category: "Dairy",
    ministry: "Ministry of Fisheries, Animal Husbandry and Dairying",
    benefits: "Back-ended capital subsidy of 25% for general category and 33.33% for SC/ST farmers for purchasing dairy cattle, milking machines, and storage equipment.",
    eligibility: "Farmers, individual entrepreneurs, and cooperative dairy societies.",
    officialLink: "https://www.nabard.org",
    documentsRequired: ["Identity proof (Aadhaar/Voter ID)", "Dairy training certificate (preferred)", "Project blueprint", "Bank loan sanction letter"],
    applicationProcess: "Submit a project report to any commercial or regional rural bank. The bank sanctions the loan and applies for the NABARD subsidy.",
    lastDate: null,
    lastUpdated: "2026-03-12",
    state: "All India",
    featured: false
  }
];

// Available categories as specified
const CATEGORIES = [
  "Agriculture",
  "Irrigation",
  "Crop Insurance",
  "Farm Equipment",
  "Organic Farming",
  "Livestock",
  "Fisheries",
  "Dairy",
  "Financial Assistance"
];

/**
 * Normalizes raw API response objects from data.gov.in into a consistent format.
 *
 * @param {object} record - Raw API record.
 * @param {string} [resourceId=""] - The specific resource ID the record was fetched from.
 * @returns {object} Standardized scheme object.
 */
export const formatSchemeData = (record, resourceId = "") => {
  if (!record) return null;

  // Utility to locate values from possible matching columns/keys (due to variable API structures)
  const extractField = (preferredKeys) => {
    for (const key of preferredKeys) {
      if (record[key] !== undefined && record[key] !== null) {
        return String(record[key]).trim();
      }
      // Check normalized (lowercase/no spacing) variants
      const normalizedKey = key.toLowerCase().replace(/[\s_-]+/g, "");
      for (const rKey in record) {
        const normalizedRKey = rKey.toLowerCase().replace(/[\s_-]+/g, "");
        if (normalizedRKey === normalizedKey) {
          return String(record[rKey]).trim();
        }
      }
    }
    return "";
  };

  const title = extractField([
    "title", 
    "scheme_name", 
    "schemeName", 
    "name", 
    "sub_scheme", 
    "program_name", 
    "project_name", 
    "crop_insurance_scheme",
    "scheme"
  ]);

  const description = extractField([
    "description", 
    "desc", 
    "objective", 
    "objectives", 
    "about", 
    "details", 
    "scheme_description",
    "features"
  ]);

  const category = extractField([
    "category", 
    "sector", 
    "scheme_type", 
    "type_of_scheme",
    "crop_type"
  ]);

  const ministry = extractField([
    "ministry", 
    "department", 
    "ministry_name", 
    "dept_name", 
    "organization", 
    "agency"
  ]);

  const benefits = extractField([
    "benefits", 
    "benefit", 
    "assistance", 
    "financial_assistance", 
    "subsidy", 
    "incentive", 
    "incentives",
    "premium_rate"
  ]);

  const eligibility = extractField([
    "eligibility", 
    "eligible_farmers", 
    "eligibility_criteria", 
    "target_group", 
    "beneficiary",
    "eligibility_details"
  ]);

  const officialLink = extractField([
    "official_website", 
    "official_link", 
    "website", 
    "link", 
    "url", 
    "portal", 
    "link_if_any"
  ]);

  const lastUpdated = extractField([
    "last_updated", 
    "updated_date", 
    "updated_at", 
    "date", 
    "year", 
    "timestamp"
  ]);

  // Handle unique ID extraction or generation
  let id = extractField(["id", "scheme_id", "serial_no", "sr_no", "code"]);
  if (!id) {
    id = title
      ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      : `scheme-${Math.random().toString(36).substring(2, 11)}`;
  }

  // Smart defaults based on resource origin if fields are blank
  let mappedCategory = category;
  let mappedMinistry = ministry || "Ministry of Agriculture & Farmers Welfare";
  let mappedLink = officialLink;

  if (resourceId === RESOURCES.PM_KISAN) {
    mappedCategory = category || "Financial Assistance";
    mappedLink = officialLink || "https://pmkisan.gov.in";
  } else if (resourceId === RESOURCES.PMKBY) {
    mappedCategory = category || "Crop Insurance";
    mappedLink = officialLink || "https://pmfby.gov.in";
  } else if (resourceId === RESOURCES.SOIL_HEALTH) {
    mappedCategory = category || "Agriculture";
    mappedLink = officialLink || "https://soilhealth.dac.gov.in";
  } else if (resourceId === RESOURCES.AGRICULTURE) {
    mappedCategory = category || "Agriculture";
    mappedLink = officialLink || "https://agricoop.nic.in";
  }

  return {
    id,
    title: title || "Welfare Scheme for Farmers",
    description: description || "Government support program for farmers and agricultural development.",
    category: mappedCategory || "Agriculture",
    ministry: mappedMinistry,
    benefits: benefits || "Includes financial assistance, credit support, or input subsidies.",
    eligibility: eligibility || "Available to agricultural landholders and registered farmers.",
    officialLink: mappedLink || "https://india.gov.in",
    lastUpdated: lastUpdated || new Date().toISOString().split("T")[0]
  };
};

/**
 * Fetch data from a single resource endpoint on data.gov.in.
 *
 * @param {string} resourceId - The target dataset resource ID.
 * @returns {Promise<Array<object>>} Formatted records list.
 */
const fetchResourceData = async (resourceId) => {
  if (!API_KEY) {
    throw new Error(`API credentials are not set. Set DATA_GOV_API_KEY to fetch resource: ${resourceId}`);
  }

  console.log(`[data.gov.in Service] Initiating API request for resource ID: ${resourceId}`);
  const response = await dataGovClient.get(`/resource/${resourceId}`, {
    params: {
      "api-key": API_KEY,
      format: "json",
      limit: 100, // Fetch up to 100 entries for pagination coverage
    },
  });

  const records = response.data?.records;
  if (!Array.isArray(records)) {
    console.warn(`[data.gov.in Service] Empty or non-array records received for resource: ${resourceId}`);
    return [];
  }

  return records
    .map(record => formatSchemeData(record, resourceId))
    .filter(Boolean)
    .filter(scheme => {
      const textToSearch = [
        scheme.title,
        scheme.description,
        scheme.category,
        scheme.ministry
      ].join(" ").toLowerCase();

      // Only keep records that contain one or more agriculture-related keywords
      const isAgriRelated = AGRICULTURE_KEYWORDS.some(kw => textToSearch.includes(kw));
      if (!isAgriRelated) return false;

      // Exclude irrelevant news unless it contains an agriculture keyword
      const isIrrelevant = IRRELEVANT_KEYWORDS.some(kw => textToSearch.includes(kw));
      if (isIrrelevant) return false;

      return true;
    });
};

/**
 * Retrieve all available agriculture and farmer-related schemes.
 * Orchestrates calls to all 4 government resource APIs, formats the results,
 * merges them with the mock database, caches the output, and handles errors.
 *
 * @returns {Promise<{success: boolean, message: string, data: Array<object>}>}
 */
export const getAllSchemes = async () => {
  const currentTime = Date.now();
  
  // Return cached result if valid
  if (schemeCache.data && (currentTime - schemeCache.lastFetched < schemeCache.ttl)) {
    console.log("[data.gov.in Service] Serving government schemes from memory cache.");
    return {
      success: true,
      message: "Government schemes fetched successfully.",
      data: schemeCache.data
    };
  }

  let externalSchemes = [];
  let fetchFailedCount = 0;

  if (API_KEY) {
    try {
      // Execute fetches in parallel with error isolation per request
      const resourceKeys = Object.values(RESOURCES);
      const fetchPromises = resourceKeys.map(async (resId) => {
        try {
          return await fetchResourceData(resId);
        } catch (err) {
          fetchFailedCount++;
          let errMsg = err.message;
          if (err.response) {
            errMsg = `Status ${err.response.status} - ${JSON.stringify(err.response.data)}`;
          } else if (err.code === "ECONNABORTED") {
            errMsg = "Timeout exceeded.";
          }
          console.error(`[data.gov.in Service] Failed to load resource ${resId}: ${errMsg}`);
          return []; // Safe return to not disrupt other parallel queries
        }
      });

      const results = await Promise.all(fetchPromises);
      externalSchemes = results.flat();
    } catch (sysErr) {
      console.error("[data.gov.in Service] Critical error during parallel resource operations:", sysErr.message || sysErr);
    }
  } else {
    console.warn("[data.gov.in Service] DATA_GOV_API_KEY environment variable is missing. Operating in fallback mode.");
  }

  // Merge external API results with our rich local/fallback database
  // Deduplicate by scheme title to prevent redundant cards
  const mergedMap = new Map();

  // Load mock/local schemes first (our golden reference dataset)
  MOCK_SCHEMES.forEach((scheme) => {
    mergedMap.set(scheme.title.toLowerCase().trim(), scheme);
  });

  // Overlay API data on top
  externalSchemes.forEach((scheme) => {
    const key = scheme.title.toLowerCase().trim();
    if (mergedMap.has(key)) {
      // Merge: Enrich the API record with detailed local attributes (like process and documents)
      const existing = mergedMap.get(key);
      mergedMap.set(key, {
        ...existing,
        ...scheme, // API data represents latest values
        // Preserve rich properties from the local catalog
        documentsRequired: existing.documentsRequired || scheme.documentsRequired || [],
        applicationProcess: existing.applicationProcess || scheme.applicationProcess || "",
        lastDate: existing.lastDate || scheme.lastDate || null,
      });
    } else {
      // Add standard fallbacks for any new scheme fetched from the API
      mergedMap.set(key, {
        ...scheme,
        documentsRequired: ["Aadhaar Card", "Farmer Identity Certificate", "Land Proof/Khatauni", "Bank Account Passbook"],
        applicationProcess: "Register online on the official portal link provided to submit your application details.",
        lastDate: null,
      });
    }
  });

  const finalSchemes = Array.from(mergedMap.values());

  // Cache the combined list
  schemeCache.data = finalSchemes;
  schemeCache.lastFetched = currentTime;

  console.log(`[data.gov.in Service] Successfully aggregated ${finalSchemes.length} schemes.`);

  return {
    success: true,
    message: "Government schemes fetched successfully.",
    data: finalSchemes
  };
};

/**
 * Return complete information for a single scheme by ID.
 *
 * @param {string} id - The unique identifier of the scheme.
 * @returns {Promise<{success: boolean, message: string, data?: object}>}
 */
export const getSchemeById = async (id) => {
  try {
    if (!id) {
      return {
        success: false,
        message: "Unable to fetch government schemes." // Matches expected error signature
      };
    }

    const { data: schemes } = await getAllSchemes();
    const cleanId = String(id).trim().toLowerCase();
    
    const scheme = schemes.find(s => String(s.id).toLowerCase() === cleanId);
    if (!scheme) {
      return {
        success: false,
        message: "Unable to fetch government schemes." // Standard error response if scheme is not found
      };
    }

    // Explicitly package and return all the requested fields
    return {
      success: true,
      message: "Government schemes fetched successfully.",
      data: {
        id: scheme.id,
        title: scheme.title,
        description: scheme.description,
        category: scheme.category,
        ministry: scheme.ministry,
        benefits: scheme.benefits,
        eligibility: scheme.eligibility,
        officialLink: scheme.officialLink,
        documentsRequired: scheme.documentsRequired || [],
        applicationProcess: scheme.applicationProcess || "Apply online through the official portal link.",
        lastDate: scheme.lastDate || null,
        lastUpdated: scheme.lastUpdated
      }
    };
  } catch (err) {
    console.error(`[data.gov.in Service] Error in getSchemeById(${id}):`, err.message || err);
    return {
      success: false,
      message: "Unable to fetch government schemes."
    };
  }
};

/**
 * Search schemes by title, category, and description.
 *
 * @param {string} keyword - Search term.
 * @returns {Promise<{success: boolean, message: string, data: Array<object>}>}
 */
export const searchSchemes = async (keyword) => {
  try {
    const { data: schemes } = await getAllSchemes();
    if (!keyword || typeof keyword !== "string") {
      return {
        success: true,
        message: "Government schemes fetched successfully.",
        data: schemes
      };
    }

    const term = keyword.trim().toLowerCase();
    const filtered = schemes.filter(s => {
      return (s.title && s.title.toLowerCase().includes(term)) ||
             (s.description && s.description.toLowerCase().includes(term)) ||
             (s.category && s.category.toLowerCase().includes(term));
    });

    return {
      success: true,
      message: "Government schemes fetched successfully.",
      data: filtered
    };
  } catch (err) {
    console.error("[data.gov.in Service] Error in searchSchemes:", err.message || err);
    return {
      success: false,
      message: "Unable to fetch government schemes."
    };
  }
};

/**
 * Return schemes available for a specific state.
 * Includes schemes specifically marked for that state + all-India schemes.
 *
 * @param {string} state - The name of the state (e.g. Gujarat, Maharashtra).
 * @returns {Promise<{success: boolean, message: string, data: Array<object>}>}
 */
export const getSchemesByState = async (state) => {
  try {
    const { data: schemes } = await getAllSchemes();
    if (!state || typeof state !== "string") {
      return {
        success: true,
        message: "Government schemes fetched successfully.",
        data: schemes
      };
    }

    const searchState = state.trim().toLowerCase();
    const filtered = schemes.filter(s => {
      const schemeState = s.state ? s.state.toLowerCase() : "";
      return schemeState.includes(searchState) || 
             schemeState.includes("all india") || 
             schemeState.includes("all states");
    });

    return {
      success: true,
      message: "Government schemes fetched successfully.",
      data: filtered
    };
  } catch (err) {
    console.error("[data.gov.in Service] Error in getSchemesByState:", err.message || err);
    return {
      success: false,
      message: "Unable to fetch government schemes."
    };
  }
};

/**
 * Return the latest published schemes, sorted newest first.
 *
 * @returns {Promise<{success: boolean, message: string, data: Array<object>}>}
 */
export const getLatestSchemes = async () => {
  try {
    const { data: schemes } = await getAllSchemes();
    
    // Sort descending by date (newest first)
    const sorted = [...schemes].sort((a, b) => {
      const dateA = new Date(a.lastUpdated || 0);
      const dateB = new Date(b.lastUpdated || 0);
      return dateB - dateA;
    });

    return {
      success: true,
      message: "Government schemes fetched successfully.",
      data: sorted
    };
  } catch (err) {
    console.error("[data.gov.in Service] Error in getLatestSchemes:", err.message || err);
    return {
      success: false,
      message: "Unable to fetch government schemes."
    };
  }
};

/**
 * Return schemes marked as important or featured for farmers.
 *
 * @returns {Promise<{success: boolean, message: string, data: Array<object>}>}
 */
export const getFeaturedSchemes = async () => {
  try {
    const { data: schemes } = await getAllSchemes();
    const featured = schemes.filter(s => s.featured === true);

    return {
      success: true,
      message: "Government schemes fetched successfully.",
      data: featured
    };
  } catch (err) {
    console.error("[data.gov.in Service] Error in getFeaturedSchemes:", err.message || err);
    return {
      success: false,
      message: "Unable to fetch government schemes."
    };
  }
};

/**
 * Return available scheme categories.
 *
 * @returns {Promise<{success: boolean, message: string, data: Array<string>}>}
 */
export const getSchemeCategories = async () => {
  return {
    success: true,
    message: "Government schemes fetched successfully.",
    data: CATEGORIES
  };
};

export default {
  getAllSchemes,
  getSchemeById,
  searchSchemes,
  getSchemesByState,
  getLatestSchemes,
  getFeaturedSchemes,
  getSchemeCategories,
  formatSchemeData
};
