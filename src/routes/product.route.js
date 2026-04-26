import express from "express";
import { adminOnly, protect } from "../middleware/auth.middleware.js";
import Product from "../models/product.model.js";
const router = express.Router();

// @route   GET /api/products
// @desc    Récupérer tous les produits (avec filtres optionnels)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { categorie, search, enPromo } = req.query;
    let query = {};

    if (categorie) {
      query.categorie = categorie;
    }

    if (search) {
      query.$or = [
        { nom: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { marque: { $regex: search, $options: "i" } },
      ];
    }

    if (enPromo === "true") {
      query.enPromo = true;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des produits.",
      error: error.message,
    });
  }
});

// @route   GET /api/products/:id
// @desc    Récupérer un produit par ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé.",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du produit.",
      error: error.message,
    });
  }
});

// @route   POST /api/products
// @desc    Créer un nouveau produit
// @access  Private (Admin)
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du produit.",
      error: error.message,
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Mettre à jour un produit
// @access  Private (Admin)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé.",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du produit.",
      error: error.message,
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Supprimer un produit
// @access  Private (Admin)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé.",
      });
    }

    res.json({
      success: true,
      message: "Produit supprimé avec succès.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du produit.",
      error: error.message,
    });
  }
});

// @route   PATCH /api/products/:id/stock
// @desc    Mettre à jour le stock d'un produit
// @access  Private (Admin)
router.patch("/:id/stock", protect, adminOnly, async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true },
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé.",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du stock.",
      error: error.message,
    });
  }
});

export default router;
