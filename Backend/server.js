import dotenv from "dotenv";
import dns from "node:dns";
import connectDB from "./src/db/index.js";
import { app } from "./src/app.js";
import { seedDatabase } from "./src/db/seeder.js";

// Force Node.js to use public DNS servers to resolve MongoDB SRV records reliably
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Load environment variables as early as possible
dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8000;

// Connect to Database and start server
connectDB()
  .then(async () => {
    // Seed initial collections
    await seedDatabase();

    const server = app.listen(PORT, () => {
      console.log(`⚙️ Server is running at port : ${PORT}`);
      console.log(`🏥 Health check URL: http://localhost:${PORT}/health`);
    });

    // Handle express-level server errors
    server.on("error", (error) => {
      console.error("Express server failed to start: ", error);
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error("Database connection failed, server cannot start! ", err);
    process.exit(1);
  });
