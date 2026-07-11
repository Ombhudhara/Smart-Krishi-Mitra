import "dotenv/config";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
  console.log("Calling ListModels API...");
  try {
    const response = await axios.get(url);
    console.log("Response models count:", response.data?.models?.length || 0);
    console.log("Supported Models:\n", JSON.stringify(response.data?.models?.map(m => ({ name: m.name, methods: m.supportedGenerationMethods })), null, 2));
  } catch (error) {
    console.log("Error listing models:", error.response ? error.response.status + " - " + JSON.stringify(error.response.data) : error.message);
  }
}

listModels();
