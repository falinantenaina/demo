import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { connectDB } from "./config/database.js";
import authRoutes from "./routes/auth.route.js";
import orderRoutes from "./routes/order.route.js";
import productRoutes from "./routes/product.route.js";

// Charger les variables d'environnement
dotenv.config();

// Importer les routes

// Initialiser Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Route de test
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "API Quincaillerie E-commerce",
    version: "1.0.0",
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée",
  });
});

// Connexion à MongoDB

// Démarrer le serveur
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📍 Environnement: ${process.env.NODE_ENV || "development"}`);
  });
};

startServer();

export default app;
