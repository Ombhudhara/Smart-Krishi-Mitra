import "dotenv/config";
import axios from "axios";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

async function testEndpoints() {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.startsWith("YOUR_")) {
    console.error("❌ OPENROUTER_API_KEY is not configured. Set it in your .env file.");
    return;
  }

  console.log("Testing using OpenRouter endpoint...\n");

  // Test 1: Basic text generation
  console.log("Test 1: Basic text generation (google/gemini-2.5-flash)...");
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: "Hello" }],
        max_tokens: 200
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );
    console.log(`  ✅ Success! Response: "${response.data?.choices?.[0]?.message?.content?.trim()}"\n`);
  } catch (error) {
    console.log(`  ❌ Failed: ${error.response ? error.response.status + " - " + JSON.stringify(error.response.data) : error.message}\n`);
  }

  // Test 2: Multimodal Image Analysis
  console.log("Test 2: Multimodal Image Analysis...");
  try {
    const mockImageBase64 = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Is this image data valid? Reply with a single word." },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${mockImageBase64}` } }
            ]
          }
        ],
        max_tokens: 1000
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );
    console.log(`  ✅ Success! Image Response: "${response.data?.choices?.[0]?.message?.content?.trim()}"\n`);
  } catch (error) {
    console.log(`  ❌ Image Failed: ${error.response ? error.response.status + " - " + JSON.stringify(error.response.data) : error.message}\n`);
  }
}

testEndpoints().catch(console.error);
