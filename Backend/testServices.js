import "dotenv/config";
import governmentSchemeService from "./src/services/governmentSchemeService.js";
import newsService from "./src/services/newsService.js";

async function runTests() {
  console.log("==========================================");
  console.log("   SMART KRISHI MITRA SERVICE TESTER      ");
  console.log("==========================================\n");

  console.log("Checking Environment Status:");
  console.log(`- DATA_GOV_API_KEY: ${process.env.DATA_GOV_API_KEY ? "CONFIGURED (API Mode)" : "MISSING (Fallback Mock Mode)"}`);
  console.log(`- GNEWS_API_KEY: ${process.env.GNEWS_API_KEY ? "CONFIGURED (API Mode)" : "MISSING (Fallback Mock Mode)"}`);
  console.log("------------------------------------------\n");

  try {
    console.log(">>> 1. TESTING GOVERNMENT SCHEME SERVICE <<<\n");

    console.log("[Testing] getSchemeCategories()...");
    const categories = await governmentSchemeService.getSchemeCategories();
    console.log("  Categories found:", categories.data);

    console.log("\n[Testing] getAllSchemes()...");
    const allSchemes = await governmentSchemeService.getAllSchemes();
    console.log("  Success status:", allSchemes.success);
    console.log("  Total schemes loaded:", allSchemes.data.length);

    console.log("\n[Testing] getSchemeById('pm-kisan')...");
    const pmKisan = await governmentSchemeService.getSchemeById("pm-kisan");
    console.log("  PM-Kisan Title:", pmKisan.data?.title);

    console.log("\n------------------------------------------\n");
    console.log(">>> 2. TESTING NEWS SERVICE <<<\n");

    console.log("[Testing] getTopHeadlines()...");
    const headlines = await newsService.getTopHeadlines();
    console.log("  Success status:", headlines.success);
    console.log("  Total headlines loaded:", headlines.data.length);
    if (headlines.data.length > 0) {
      console.log("  Headline 1 Title:", headlines.data[0].title);
      console.log("  Headline 1 Source:", headlines.data[0].source);
    }

    console.log("\n==========================================");
    console.log("   ALL SERVICES VERIFIED SUCCESSFULLY!   ");
    console.log("==========================================");
  } catch (error) {
    console.error("\n[Error during test run]:", error);
  }
}

runTests();
