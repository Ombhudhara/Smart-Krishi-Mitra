import "dotenv/config";
import axios from "axios";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function listModels() {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.startsWith("YOUR_")) {
    console.error("❌ OPENROUTER_API_KEY is not configured. Set it in your .env file.");
    return;
  }

  console.log("Fetching available models from OpenRouter...\n");
  try {
    const response = await axios.get("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: 8000
    });

    const models = response.data?.data || [];
    console.log(`✅ Total models available: ${models.length}`);
    console.log("\nSample models (first 10):");
    models.slice(0, 10).forEach(m => {
      console.log(`  - ${m.id} (context: ${m.context_length || "N/A"} tokens)`);
    });
  } catch (error) {
    console.log("❌ Error listing models:", error.response
      ? error.response.status + " - " + JSON.stringify(error.response.data)
      : error.message
    );
  }
}

listModels();
