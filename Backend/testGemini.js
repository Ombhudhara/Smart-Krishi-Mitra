import "dotenv/config";
import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function testEndpoints() {
  if (GEMINI_API_KEY && GEMINI_API_KEY.startsWith("sk-or-v1-")) {
    console.log("Testing using OpenRouter endpoint (OpenRouter API Key detected)...");
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
            "Authorization": `Bearer ${GEMINI_API_KEY}`,
            "Content-Type": "application/json"
          },
          timeout: 10000
        }
      );
      console.log(`  Success! OpenRouter response: "${response.data?.choices?.[0]?.message?.content?.trim()}"\n`);
      return;
    } catch (error) {
      console.log(`  Failed: ${error.response ? error.response.status + " - " + JSON.stringify(error.response.data) : error.message}\n`);
      return;
    }
  }

  const tests = [
    {
      name: "v1beta gemini-2.5-flash",
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`
    },
    {
      name: "v1beta gemini-2.0-flash",
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`
    },
    {
      name: "v1beta gemini-flash-latest",
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`
    }
  ];

  for (const test of tests) {
    console.log(`Testing endpoint: ${test.name}`);
    try {
      const response = await axios.post(
        test.url,
        {
          contents: [{ parts: [{ text: "Hello" }] }]
        },
        { headers: { "Content-Type": "application/json" }, timeout: 5000 }
      );
      console.log(`  Success! Text response: "${response.data?.candidates?.[0]?.content?.parts?.[0]?.text.trim()}"\n`);
      return test.url; // Stop on first success
    } catch (error) {
      console.log(`  Failed: ${error.response ? error.response.status + " - " + JSON.stringify(error.response.data) : error.message}\n`);
    }
  }
}

testEndpoints().catch(console.error);
