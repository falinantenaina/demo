import bcrypt from "bcryptjs";
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["client", "admin"],
    default: "client",
  },
  telephone: String,
  adresse: {
    rue: String,
    ville: String,
    codePostal: String,
    pays: { type: String, default: "Madagascar" },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password avant sauvegarde
userSchema.pre("save", async function (n) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Méthode pour vérifier le mot de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
