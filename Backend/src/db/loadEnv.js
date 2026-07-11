import dotenv from "dotenv";

// Load environment variables immediately at import evaluation time
dotenv.config({
  path: "./.env",
});

console.log("⚙️ Env Preloader: Environment variables loaded.");
