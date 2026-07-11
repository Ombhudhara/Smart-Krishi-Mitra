import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import recommendationService from "./src/services/recommendationService.js";

async function runTests() {
  console.log("==========================================");
  console.log("   RECOMMENDATION ENGINE INTEGRATION TEST ");
  console.log("==========================================\n");

  try {
    const dbUri = process.env.MONGO_URI || "mongodb+srv://ombhudhara20_db_user:KEEPSMILEOM30@cluster0.sopibwy.mongodb.net/smart_krishi_mitra?appName=Cluster0";
    console.log("Connecting to database:", dbUri.split("@")[1] || dbUri);
    await mongoose.connect(dbUri);
    console.log("Connected to MongoDB successfully.\n");

    // 1. Fetch any Farmer or User to test recommendations
    let user = await User.findOne({ role: "Farmer" });
    if (!user) {
      user = await User.findOne({});
    }

    if (!user) {
      console.warn("  [Warning] No users found in database to run integration tests.");
      await mongoose.connection.close();
      return;
    }

    console.log(`[Test] Generating Recommendations for User: ${user.fullName} (${user.role})`);
    console.log(`  Location: District: ${user.district || "Not Specified"}, State: ${user.state || "Not Specified"}`);
    console.log(`  Soil Type: ${user.soilType || "Alluvial"}`);
    console.log(`  Crops Grown: ${user.cropsGrown?.join(", ") || "None"}\n`);

    // 2. Execute getDashboardRecommendation
    console.log("Calling getDashboardRecommendation()...");
    const response = await recommendationService.getDashboardRecommendation(user._id);

    console.log("\nResponse Structure:");
    console.log("  Success Status:", response.success);
    console.log("  Message:", response.message);
    
    if (response.success && response.data) {
      console.log("\n1. Weather Recommendations:");
      console.log(JSON.stringify(response.data.weather, null, 2));

      console.log("\n2. Market Recommendations:");
      console.log(JSON.stringify(response.data.market, null, 2));

      console.log("\n3. Crop Recommendations:");
      console.log(JSON.stringify(response.data.crop, null, 2));

      console.log("\n4. Fertilizer Recommendations:");
      console.log(JSON.stringify(response.data.fertilizer, null, 2));

      console.log("\n5. Harvesting Recommendations:");
      console.log(JSON.stringify(response.data.harvest, null, 2));

      console.log("\n6. Selling Recommendations:");
      console.log(JSON.stringify(response.data.selling, null, 2));

      console.log("\n7. AI Advisor Summary Insights:");
      console.log(`"${response.data.summary}"`);
    }

    await mongoose.connection.close();
    console.log("\n=== Test successfully completed. Database connections closed. ===");
  } catch (error) {
    console.error("Test execution failed:", error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
}

runTests().catch(console.error);
