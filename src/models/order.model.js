import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  numeroCommande: {
    type: String,
    unique: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  produits: [
    {
      produit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantite: {
        type: Number,
        required: true,
        min: 1,
      },
      prixUnitaire: {
        type: Number,
        required: true,
      },
    },
  ],
  montantTotal: {
    type: Number,
    required: true,
    min: 0,
  },
  adresseLivraison: {
    nom: String,
    telephone: String,
    rue: String,
    ville: String,
    codePostal: String,
    pays: String,
  },
  statutCommande: {
    type: String,
    enum: [
      "En attente",
      "Confirmée",
      "En préparation",
      "Expédiée",
      "Livrée",
      "Annulée",
    ],
    default: "En attente",
  },
  statutPaiement: {
    type: String,
    enum: ["En attente", "Payé", "Échoué", "Remboursé"],
    default: "En attente",
  },
  methodePaiement: {
    type: String,
    enum: ["Espèces", "Carte bancaire", "Virement", "Mobile Money"],
    required: true,
  },
  datePaiement: Date,
  dateLivraison: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Générer un numéro de commande unique
orderSchema.pre("save", async function () {
  if (!this.numeroCommande) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const count = await this.constructor.countDocuments();
    this.numeroCommande = `CMD-${year}${month}-${String(count + 1).padStart(5, "0")}`;
  }
  this.updatedAt = Date.now();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
