import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  categorie: {
    type: String,
    required: true,
    enum: [
      "Outillage",
      "Visserie",
      "Peinture",
      "Électricité",
      "Plomberie",
      "Serrurerie",
      "Jardinage",
      "Sécurité",
    ],
  },
  prix: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  image: {
    type: String,
    default:
      "https://via.placeholder.com/400x400/1a1a1a/ffa500?text=Quincaillerie",
  },
  reference: {
    type: String,
    unique: true,
    required: true,
  },
  marque: String,
  dimensions: String,
  poids: String,
  enPromo: {
    type: Boolean,
    default: false,
  },
  prixPromo: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Mise à jour automatique de updatedAt
productSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
