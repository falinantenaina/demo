import express from "express";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

import { adminOnly, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// @route   POST /api/orders
// @desc    Créer une nouvelle commande
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { produits, adresseLivraison, methodePaiement, notes } = req.body;

    // Vérifier que des produits sont fournis
    if (!produits || produits.length === 0) {
      return res.status(400).json({
        success: false,
        message: "La commande doit contenir au moins un produit.",
      });
    }

    // Calculer le montant total et vérifier le stock
    let montantTotal = 0;
    const produitsCommande = [];

    for (const item of produits) {
      const product = await Product.findById(item.produit);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Produit ${item.produit} non trouvé.`,
        });
      }

      if (product.stock < item.quantite) {
        return res.status(400).json({
          success: false,
          message: `Stock insuffisant pour ${product.nom}. Stock disponible: ${product.stock}`,
        });
      }

      const prixUnitaire = product.enPromo ? product.prixPromo : product.prix;
      montantTotal += prixUnitaire * item.quantite;

      produitsCommande.push({
        produit: product._id,
        quantite: item.quantite,
        prixUnitaire,
      });

      // Réduire le stock
      product.stock -= item.quantite;
      await product.save();
    }

    // Créer la commande
    const order = await Order.create({
      client: req.user._id,
      produits: produitsCommande,
      montantTotal,
      adresseLivraison,
      methodePaiement,
      notes,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("client", "nom email telephone")
      .populate("produits.produit", "nom reference image");

    res.status(201).json({
      success: true,
      data: populatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la commande.",
      error: error.message,
    });
  }
});

// @route   GET /api/orders
// @desc    Récupérer toutes les commandes (Admin) ou les commandes de l'utilisateur
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    let query = {};

    // Si ce n'est pas un admin, afficher uniquement ses commandes
    if (req.user.role !== "admin") {
      query.client = req.user._id;
    }

    const orders = await Order.find(query)
      .populate("client", "nom email telephone")
      .populate("produits.produit", "nom reference image")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des commandes.",
      error: error.message,
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Récupérer une commande par ID
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("client", "nom email telephone")
      .populate("produits.produit", "nom reference image");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée.",
      });
    }

    // Vérifier que l'utilisateur a le droit de voir cette commande
    if (
      req.user.role !== "admin" &&
      order.client._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Accès non autorisé à cette commande.",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la commande.",
      error: error.message,
    });
  }
});

// @route   PATCH /api/orders/:id/status
// @desc    Mettre à jour le statut d'une commande
// @access  Private (Admin)
router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { statutCommande, statutPaiement } = req.body;

    const updateData = {};
    if (statutCommande) updateData.statutCommande = statutCommande;
    if (statutPaiement) updateData.statutPaiement = statutPaiement;

    // Mettre à jour les dates
    if (statutPaiement === "Payé" && !req.body.datePaiement) {
      updateData.datePaiement = new Date();
    }
    if (statutCommande === "Livrée" && !req.body.dateLivraison) {
      updateData.dateLivraison = new Date();
    }

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    })
      .populate("client", "nom email")
      .populate("produits.produit", "nom");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée.",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du statut.",
      error: error.message,
    });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Annuler une commande
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée.",
      });
    }

    // Vérifier les droits
    if (
      req.user.role !== "admin" &&
      order.client.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Accès non autorisé.",
      });
    }

    // Seules les commandes en attente peuvent être annulées
    if (order.statutCommande !== "En attente") {
      return res.status(400).json({
        success: false,
        message: "Cette commande ne peut plus être annulée.",
      });
    }

    // Remettre les produits en stock
    for (const item of order.produits) {
      await Product.findByIdAndUpdate(item.produit, {
        $inc: { stock: item.quantite },
      });
    }

    order.statutCommande = "Annulée";
    await order.save();

    res.json({
      success: true,
      message: "Commande annulée avec succès.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'annulation de la commande.",
      error: error.message,
    });
  }
});

export default router;
