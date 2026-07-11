import "dotenv/config";
import mapService from "./src/services/mapService.js";

async function runTests() {
  console.log("==========================================");
  console.log("   MAP SERVICE INTEGRATION TEST RUNNER     ");
  console.log("==========================================\n");

  try {
    // 1. Validate Coordinates
    console.log("[Test] Checking validateCoordinates...");
    console.log("  Valid (22.3, 70.8):", mapService.validateCoordinates(22.3, 70.8));
    console.log("  Invalid Lat (95.0, 70.8):", mapService.validateCoordinates(95.0, 70.8));
    console.log("  Invalid Lon (22.3, -190.0):", mapService.validateCoordinates(22.3, -190.0));
    console.log("  Invalid string input ('abc', 70.8):", mapService.validateCoordinates("abc", 70.8));

    // 2. Distance Calculations (Ahmedabad to Rajkot)
    console.log("\n[Test] Calculating Distance between Ahmedabad and Rajkot...");
    const ahmedabad = { lat: 23.0225, lon: 72.5714 };
    const rajkot = { lat: 22.3039, lon: 70.8022 };
    const distanceResult = mapService.calculateDistance(
      ahmedabad.lat,
      ahmedabad.lon,
      rajkot.lat,
      rajkot.lon
    );
    console.log("  Distance in Kilometers:", distanceResult.distanceKm, "KM");
    console.log("  Distance in Miles:", distanceResult.distanceMiles, "Miles");

    // 3. Forward Geocoding (searchLocation)
    console.log("\n[Test] Searching Location ('Surat')...");
    const searchRes = await mapService.searchLocation("Surat");
    console.log("  Success status:", searchRes.success);
    console.log("  Message:", searchRes.message);
    if (searchRes.data && searchRes.data.length > 0) {
      console.log("  Location result:", searchRes.data[0]);
    }

    // 4. Get Coordinates (getCoordinates)
    console.log("\n[Test] Getting Coordinates for address text ('Delhi, India')...");
    const coordRes = await mapService.getCoordinates("Delhi, India");
    console.log("  Success status:", coordRes.success);
    console.log("  Coordinates found:", coordRes.data);

    // 5. Reverse Geocoding (reverseGeocode)
    console.log("\n[Test] Reverse Geocoding (lat: 22.3072, lon: 73.1812)...");
    const reverseRes = await mapService.reverseGeocode(22.3072, 73.1812);
    console.log("  Success status:", reverseRes.success);
    console.log("  Address matched:", reverseRes.data?.displayName);
    console.log("  Address breakdown:", {
      village: reverseRes.data?.village,
      district: reverseRes.data?.district,
      state: reverseRes.data?.state,
      pincode: reverseRes.data?.pincode
    });

    // 6. Nearby Mandi markets (getNearbyMarkets)
    console.log("\n[Test] Fetching Nearby Mandis relative to Rajkot coordinates...");
    const nearbyRes = await mapService.getNearbyMarkets(rajkot.lat, rajkot.lon);
    console.log("  Total mandis found:", nearbyRes.data?.length);
    if (nearbyRes.data && nearbyRes.data.length > 0) {
      console.log("  Closest Mandi:", nearbyRes.data[0].name, `(${nearbyRes.data[0].distanceKm} KM away)`);
      console.log("  Farthest Mandi:", nearbyRes.data[nearbyRes.data.length - 1].name, `(${nearbyRes.data[nearbyRes.data.length - 1].distanceKm} KM away)`);
    }

    console.log("\n==========================================");
    console.log("   MAP SERVICE TESTS COMPLETED SUCCESSFULLY! ");
    console.log("==========================================");
  } catch (error) {
    console.error("Test execution failed:", error);
  }
}

runTests();
