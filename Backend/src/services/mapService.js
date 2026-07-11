import axios from "axios";

// Retrieve configurations from environment
const BASE_URL = (process.env.NOMINATIM_BASE_URL || "https://nominatim.openstreetmap.org").replace(/\/+$/, "");
const API_KEY = process.env.NOMINATIM_API_KEY || process.env.MAP_API_KEY;

// Create Axios Client for Geocoding APIs
const mapClient = axios.create({
  baseURL: BASE_URL,
  timeout: 8000, // 8-second request timeout limit
  headers: {
    // OSM Nominatim policy requires a identifiable User-Agent
    "User-Agent": "SmartKrishiMitra/1.0.0 (https://smartkrishimitra.org; contact@smartkrishimitra.org)",
  },
});

// Cache for geocoding queries (30 minutes TTL)
const locationCache = new Map();
const CACHE_TTL = 30 * 60 * 1000;

// High-quality local/fallback geocoding database for common Indian locations
const MOCK_GEOCODE = {
  ahmedabad: {
    lat: "23.0225",
    lon: "72.5714",
    display_name: "Ahmedabad, Gujarat, India",
    address: { city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat", country: "India", postcode: "380001" }
  },
  surat: {
    lat: "21.1702",
    lon: "72.8311",
    display_name: "Surat, Gujarat, India",
    address: { city: "Surat", district: "Surat", state: "Gujarat", country: "India", postcode: "395003" }
  },
  rajkot: {
    lat: "22.3039",
    lon: "70.8022",
    display_name: "Rajkot, Gujarat, India",
    address: { city: "Rajkot", district: "Rajkot", state: "Gujarat", country: "India", postcode: "360001" }
  },
  vadodara: {
    lat: "22.3072",
    lon: "73.1812",
    display_name: "Vadodara, Gujarat, India",
    address: { city: "Vadodara", district: "Vadodara", state: "Gujarat", country: "India", postcode: "390001" }
  },
  delhi: {
    lat: "28.6139",
    lon: "77.2090",
    display_name: "New Delhi, Delhi, India",
    address: { city: "New Delhi", district: "New Delhi", state: "Delhi", country: "India", postcode: "110001" }
  }
};

// Target list of Indian markets for nearby location queries
const MOCK_MANDIS = [
  { name: "Rajkot Mandi", lat: 22.3039, lon: 70.8022, category: "Grains & Vegetables", state: "Gujarat", district: "Rajkot" },
  { name: "Ahmedabad Agro Mandi", lat: 23.0225, lon: 72.5714, category: "Fruits & Vegetables", state: "Gujarat", district: "Ahmedabad" },
  { name: "Surat Central Mandi", lat: 21.1702, lon: 72.8311, category: "Textiles & Grains", state: "Gujarat", district: "Surat" },
  { name: "Vadodara APMC", lat: 22.3072, lon: 73.1812, category: "General Crops", state: "Gujarat", district: "Vadodara" },
  { name: "Delhi Azadpur Mandi", lat: 28.6139, lon: 77.2090, category: "Asia's Largest Fruit & Vegetable Market", state: "Delhi", district: "New Delhi" }
];

/**
 * Checks cache for a given key, returning cached data if within TTL.
 *
 * @param {string} key - Unique cache key.
 * @returns {object|null} Cached data or null.
 */
const checkCache = (key) => {
  const cached = locationCache.get(key);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    console.log(`[Map Service] Cache Hit for key: ${key}`);
    return cached.data;
  }
  return null;
};

/**
 * Populates geocoding responses into memory cache.
 *
 * @param {string} key - Unique cache key.
 * @param {object} data - Formatted response object.
 */
const populateCache = (key, data) => {
  locationCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// ── EXPORTED SERVICE MODULES ──────────────────────────────────────────────────

/**
 * 1. Validate latitude and longitude coordinates.
 *
 * @param {number} latitude - Latitude in degrees.
 * @param {number} longitude - Longitude in degrees.
 * @returns {boolean} True if coordinates are in range.
 */
export const validateCoordinates = (latitude, longitude) => {
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  
  if (isNaN(lat) || isNaN(lon)) return false;
  if (lat < -90 || lat > 90) return false;
  if (lon < -180 || lon > 180) return false;
  
  return true;
};

/**
 * 2. Convert raw Nominatim response into standardized coordinate/address layout.
 *
 * @param {object} raw - Raw OSM response item.
 * @returns {object} Normalized location object.
 */
export const formatLocation = (raw) => {
  if (!raw) return null;
  
  const address = raw.address || {};
  
  // Extract village or town or city district
  const village = address.village || address.town || address.suburb || address.city_district || address.city || "";
  const district = address.district || address.county || address.state_district || "";
  const state = address.state || "";
  const country = address.country || "";
  const pincode = address.postcode || "";
  const displayName = raw.display_name || "";
  const latitude = parseFloat(raw.lat || raw.latitude);
  const longitude = parseFloat(raw.lon || raw.longitude);

  return {
    displayName,
    latitude,
    longitude,
    village,
    district,
    state,
    country,
    pincode
  };
};

/**
 * 3. Calculate distance between two coordinate nodes using the Haversine formula.
 *
 * @param {number} lat1 - Latitude of start point.
 * @param {number} lon1 - Longitude of start point.
 * @param {number} lat2 - Latitude of destination.
 * @param {number} lon2 - Longitude of destination.
 * @returns {{distanceKm: number, distanceMiles: number}} Calculated values.
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!validateCoordinates(lat1, lon1) || !validateCoordinates(lat2, lon2)) {
    throw new Error("Invalid coordinate values provided for distance calculation.");
  }

  const R = 6371; // Radius of the Earth in Kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;
  const distanceMiles = distanceKm * 0.621371;

  return {
    distanceKm: parseFloat(distanceKm.toFixed(2)),
    distanceMiles: parseFloat(distanceMiles.toFixed(2))
  };
};

/**
 * 4. Search locations matching a specific query string.
 *
 * @param {string} query - Target place name (e.g. Ahmedabad).
 * @returns {Promise<{success: boolean, message: string, data: Array<object>}>}
 */
export const searchLocation = async (query) => {
  try {
    if (!query || typeof query !== "string") {
      return {
        success: false,
        message: "Invalid query. Search query must be a non-empty string."
      };
    }

    const cacheKey = `search-${query.toLowerCase().trim()}`;
    const cached = checkCache(cacheKey);
    if (cached) {
      return {
        success: true,
        message: "Location fetched successfully",
        data: cached
      };
    }

    let results = [];
    
    // Check if the base URL points to a Nominatim API requiring API Key
    const params = {
      q: query,
      format: "json",
      addressdetails: 1,
      limit: 5
    };

    // If base URL is customized or LocationIQ API, send API Key
    if (BASE_URL.includes("locationiq") || BASE_URL.includes("api.data.gov.in")) {
      params.key = API_KEY;
    }

    try {
      console.log(`[Map Service] Initiating search API request for: ${query}`);
      const response = await mapClient.get("/search", { params });
      
      if (Array.isArray(response.data) && response.data.length > 0) {
        results = response.data.map(formatLocation).filter(Boolean);
      }
    } catch (apiErr) {
      console.warn(`[Map Service] External Geocode API failed: ${apiErr.message}. Operating in fallback mode.`);
      
      // Fallback search mapping from local dictionary
      const normQuery = query.toLowerCase().trim();
      const matchKey = Object.keys(MOCK_GEOCODE).find(k => normQuery.includes(k) || k.includes(normQuery));
      
      if (matchKey) {
        results = [formatLocation(MOCK_GEOCODE[matchKey])];
      } else {
        throw new Error("Unable to fetch location from API or local fallback database.");
      }
    }

    if (results.length === 0) {
      return {
        success: false,
        message: "Unable to fetch location"
      };
    }

    populateCache(cacheKey, results);

    return {
      success: true,
      message: "Location fetched successfully",
      data: results
    };
  } catch (error) {
    console.error("Error in searchLocation service:", error.message || error);
    return {
      success: false,
      message: "Unable to fetch location"
    };
  }
};

/**
 * 5. Convert Address details into GPS coordinates.
 *
 * @param {string} address - Structured address text ("Village, District, State").
 * @returns {Promise<{success: boolean, message: string, data: {latitude: number, longitude: number}}>}
 */
export const getCoordinates = async (address) => {
  try {
    if (!address) {
      return {
        success: false,
        message: "Unable to fetch location"
      };
    }

    const response = await searchLocation(address);
    if (!response.success || !response.data || response.data.length === 0) {
      return {
        success: false,
        message: "Unable to fetch location"
      };
    }

    const targetLocation = response.data[0];
    return {
      success: true,
      message: "Location fetched successfully",
      data: {
        latitude: targetLocation.latitude,
        longitude: targetLocation.longitude
      }
    };
  } catch (error) {
    console.error("Error in getCoordinates service:", error.message || error);
    return {
      success: false,
      message: "Unable to fetch location"
    };
  }
};

/**
 * 6. Convert GPS coordinates into a readable structured address.
 *
 * @param {number} latitude - Latitude in degrees.
 * @param {number} longitude - Longitude in degrees.
 * @returns {Promise<{success: boolean, message: string, data: object}>}
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (!validateCoordinates(lat, lon)) {
      return {
        success: false,
        message: "Unable to fetch location"
      };
    }

    const cacheKey = `rev-${lat.toFixed(4)},${lon.toFixed(4)}`;
    const cached = checkCache(cacheKey);
    if (cached) {
      return {
        success: true,
        message: "Location fetched successfully",
        data: cached
      };
    }

    const params = {
      lat,
      lon,
      format: "json",
      addressdetails: 1
    };

    if (BASE_URL.includes("locationiq")) {
      params.key = API_KEY;
    }

    let result = null;

    try {
      console.log(`[Map Service] Initiating reverse-geocode request for: ${lat}, ${lon}`);
      const response = await mapClient.get("/reverse", { params });
      if (response.data && response.data.lat) {
        result = formatLocation(response.data);
      }
    } catch (apiErr) {
      console.warn(`[Map Service] External Reverse API failed: ${apiErr.message}. Operating in fallback mode.`);
      
      // Calculate distances to local fallback coordinates and return the closest city match
      let closestKey = null;
      let minDistance = Infinity;
      
      for (const [key, val] of Object.entries(MOCK_GEOCODE)) {
        const dist = calculateDistance(lat, lon, parseFloat(val.lat), parseFloat(val.lon)).distanceKm;
        if (dist < minDistance) {
          minDistance = dist;
          closestKey = key;
        }
      }
      
      // If within a reasonable distance (e.g. 200km) return the fallback geocode
      if (closestKey && minDistance < 200) {
        result = formatLocation(MOCK_GEOCODE[closestKey]);
      } else {
        throw new Error("Coordinates too far from any local fallback reference.");
      }
    }

    if (!result) {
      return {
        success: false,
        message: "Unable to fetch location"
      };
    }

    populateCache(cacheKey, result);

    return {
      success: true,
      message: "Location fetched successfully",
      data: result
    };
  } catch (error) {
    console.error("Error in reverseGeocode service:", error.message || error);
    return {
      success: false,
      message: "Unable to fetch location"
    };
  }
};

/**
 * 7. Retrieve nearby markets/mandis based on coordinates.
 * Integrates distance calculations to filter market nodes.
 *
 * @param {number} latitude - User latitude.
 * @param {number} longitude - User longitude.
 * @returns {Promise<{success: boolean, message: string, data: Array<object>}>}
 */
export const getNearbyMarkets = async (latitude, longitude) => {
  try {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (!validateCoordinates(lat, lon)) {
      return {
        success: false,
        message: "Unable to fetch location"
      };
    }

    // Calculate distance from user coordinates to all mock mandis
    const mandisWithDistance = MOCK_MANDIS.map((mandi) => {
      const { distanceKm, distanceMiles } = calculateDistance(lat, lon, mandi.lat, mandi.lon);
      return {
        ...mandi,
        distanceKm,
        distanceMiles
      };
    });

    // Sort mandis closest first
    const sorted = mandisWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);

    return {
      success: true,
      message: "Location fetched successfully",
      data: sorted
    };
  } catch (error) {
    console.error("Error in getNearbyMarkets service:", error.message || error);
    return {
      success: false,
      message: "Unable to fetch location"
    };
  }
};

/**
 * 8. Retrieve nearest address details for current coordinate inputs.
 * Accepts coordinate parameters, runs validation, and performs reverse lookup.
 *
 * @param {number} latitude - User latitude.
 * @param {number} longitude - User longitude.
 * @returns {Promise<{success: boolean, message: string, data: object}>}
 */
export const getCurrentUserLocation = async (latitude, longitude) => {
  return await reverseGeocode(latitude, longitude);
};

export default {
  validateCoordinates,
  formatLocation,
  calculateDistance,
  searchLocation,
  getCoordinates,
  reverseGeocode,
  getNearbyMarkets,
  getCurrentUserLocation
};
