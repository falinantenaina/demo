import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/database.js";
import authRoutes from "./routes/auth.route.js";
import orderRoutes from "./routes/order.route.js";
import productRoutes from "./routes/product.route.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, "public")));

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Route de test API
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "API Quincaillerie E-commerce",
    version: "1.0.0",
  });
});

// Toutes les autres routes → frontend
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📍 Environnement: ${process.env.NODE_ENV || "development"}`);
  });
};

startServer();

export default app;
