import express from "express";
import { generateToken, protect } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";
const router = express.Router();

// @route   POST /api/auth/register
// @desc    Inscription d'un nouvel utilisateur
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { nom, email, password, telephone, adresse } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Un compte existe déjà avec cet email.",
      });
    }

    // Créer l'utilisateur
    const user = await User.create({
      nom,
      email,
      password,
      telephone,
      adresse,
    });

    // Générer le token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'inscription.",
      error: error.message,
    });
  }
});

// @route   POST /api/auth/login
// @desc    Connexion utilisateur
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier l'email et le mot de passe
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Veuillez fournir un email et un mot de passe.",
      });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect.",
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect.",
      });
    }

    // Générer le token
    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion.",
      error: error.message,
    });
  }
});

// @route   GET /api/auth/me
// @desc    Récupérer l'utilisateur connecté
// @access  Private
router.get("/me", protect, async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

export default router;
