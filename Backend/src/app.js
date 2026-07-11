import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

// Configure CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// Logging middleware
app.use(morgan("dev"));

// Body parser middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files
app.use(express.static("public"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Smart Krishi Mitra backend is running.",
    timestamp: new Date().toISOString(),
  });
});

// Import routes
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import marketplaceRoutes from "./routes/marketplaceRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import governmentRoutes from "./routes/governmentRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import calculatorRoutes from "./routes/calculatorRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import marketPriceRoutes from "./routes/marketPriceRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/listings", marketplaceRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", messageRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/schemes", governmentRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/calculator", calculatorRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/market-prices", marketPriceRoutes);
app.use("/api/ai", aiRoutes);

export { app };
