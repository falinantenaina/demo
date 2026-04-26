import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../src/models/product.model.js";
import User from "../src/models/user.model.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connecté à MongoDB");

    // Supprimer les données existantes
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log("🗑️  Données existantes supprimées");

    // Créer un admin
    const admin = await User.create({
      nom: "Administrateur",
      email: "admin@demo.mg",
      password: "Admin123",
      role: "admin",
      telephone: "+261 34 00 000 00",
      adresse: {
        rue: "123 Avenue de l'Indépendance",
        ville: "Antananarivo",
        codePostal: "101",
        pays: "Madagascar",
      },
    });

    // Créer un client test
    const client = await User.create({
      nom: "Jean Rakoto",
      email: "client@demo.mg",
      password: "client123",
      role: "client",
      telephone: "+261 34 11 111 11",
      adresse: {
        rue: "45 Rue du Commerce",
        ville: "Antananarivo",
        codePostal: "101",
        pays: "Madagascar",
      },
    });

    console.log("👥 Utilisateurs créés");

    // Créer des produits
    const products = [
      // Outillage
      {
        nom: "Perceuse à percussion 850W",
        description:
          "Perceuse professionnelle avec mandrin 13mm, vitesse variable et fonction percussion pour béton.",
        categorie: "Outillage",
        prix: 185000,
        stock: 15,
        image:
          "https://via.placeholder.com/400x400/2a2a2a/ff8c00?text=Perceuse",
        reference: "OUT-PERC-001",
        marque: "PowerTech",
        dimensions: "35 x 25 x 8 cm",
        poids: "2.5 kg",
      },
      {
        nom: "Kit de tournevis 12 pièces",
        description:
          "Ensemble complet avec tournevis plats et cruciformes, embouts magnétiques.",
        categorie: "Outillage",
        prix: 35000,
        stock: 30,
        image:
          "https://via.placeholder.com/400x400/2a2a2a/ff8c00?text=Tournevis",
        reference: "OUT-TOUR-001",
        marque: "ToolMaster",
        enPromo: true,
        prixPromo: 28000,
      },
      {
        nom: "Marteau rivoir 500g",
        description:
          "Marteau professionnel avec manche en fibre de verre anti-choc.",
        categorie: "Outillage",
        prix: 28000,
        stock: 25,
        image: "https://via.placeholder.com/400x400/2a2a2a/ff8c00?text=Marteau",
        reference: "OUT-MART-001",
        marque: "ProHammer",
      },

      // Visserie
      {
        nom: "Vis à bois 4x40mm (boîte de 200)",
        description:
          "Vis tête fraisée, acier zingué, idéal pour assemblages bois.",
        categorie: "Visserie",
        prix: 12000,
        stock: 50,
        image: "https://via.placeholder.com/400x400/2a2a2a/ff8c00?text=Vis",
        reference: "VIS-BOIS-001",
        marque: "FixPro",
      },
      {
        nom: "Chevilles universelles Ø8mm (boîte de 100)",
        description:
          "Chevilles nylon pour tous types de supports, avec vis incluses.",
        categorie: "Visserie",
        prix: 8500,
        stock: 40,
        image:
          "https://via.placeholder.com/400x400/2a2a2a/ff8c00?text=Chevilles",
        reference: "VIS-CHEV-001",
        marque: "WallFix",
        enPromo: true,
        prixPromo: 6500,
      },

      // Peinture
      {
        nom: "Peinture acrylique blanche 10L",
        description:
          "Peinture mate lavable pour intérieur, séchage rapide, sans odeur.",
        categorie: "Peinture",
        prix: 95000,
        stock: 20,
        image:
          "https://via.placeholder.com/400x400/2a2a2a/ff8c00?text=Peinture",
        reference: "PEIN-ACR-001",
        marque: "ColorPlus",
        poids: "12 kg",
      },
      {
        nom: "Rouleau de peinture 25cm",
        description: "Rouleau anti-goutte avec manche télescopique inclus.",
        categorie: "Peinture",
        prix: 18000,
        stock: 35,
        image: "https://via.placeholder.com/400x400/2a2a2a/ff8c00?text=Rouleau",
        reference: "PEIN-ROUL-001",
        marque: "PaintMaster",
      },

      // Électricité
      {
        nom: "Câble électrique 2x1.5mm² (rouleau 100m)",
        description:
          "Câble souple isolé PVC, normes NF, pour installation domestique.",
        categorie: "Électricité",
        prix: 145000,
        stock: 12,
        image: "https://via.placeholder.com/400x400/2a2a2a/ff8c00?text=Cable",
        reference: "ELEC-CAB-001",
        marque: "ElectroSafe",
      },
      {
        nom: "Interrupteur va-et-vient blanc",
        description:
          "Interrupteur simple installation, design moderne, garantie 5 ans.",
        categorie: "Électricité",
        prix: 8500,
        stock: 60,
        image:
          "https://via.placeholder.com/400x400/2a2a2a/ff8c00?text=Interrupteur",
        reference: "ELEC-INT-001",
        marque: "SwitchPro",
      },
      {
        nom: "Ampoule LED E27 12W",
        description:
          "Ampoule basse consommation, lumière blanche chaude, durée 25000h.",
        categorie: "Électricité",
        prix: 6500,
        stock: 80,
        image: "https://via.placeholder.com/400x400/2a2a2a/ff8c00?text=LED",
        reference: "ELEC-LED-001",
        marque: "BrightLight",
        enPromo: true,
        prixPromo: 5000,
      },

      // Plomberie
      {
        nom: "Robinet mitigeur cuisine",
        description: "Mitigeur chromé avec bec pivotant, cartouche céramique.",
        categorie: "Plomberie",
        prix: 75000,
        stock: 18,
        image: "https://via.placeholder.com/400x400/2a2a2a/ff8c00?text=Robinet",
        reference: "PLOM-ROB-001",
        marque: "AquaFlow",
      },
      {
        nom: "Tuyau PVC Ø32mm (barre 4m)",
        description:
          "Tuyau d'évacuation rigide, résistant aux UV et produits chimiques.",
        categorie: "Plomberie",
        prix: 12000,
        stock: 30,
        image: "https://via.placeholder.com/400x400/2a2a2a/ff8c00?text=Tuyau",
        reference: "PLOM-TUY-001",
        marque: "PipePro",
      },

      // Serrurerie
      {
        nom: "Serrure 3 points encastrable",
        description:
          "Serrure haute sécurité avec cylindre européen, 5 clés fournies.",
        categorie: "Serrurerie",
        prix: 185000,
        stock: 8,
        image: "https://via.placeholder.com/400x400/2a2a2a/ff8c00?text=Serrure",
        reference: "SERR-3PT-001",
        marque: "SecureMax",
      },
      {
        nom: "Cadenas acier haute sécurité 50mm",
        description:
          "Cadenas avec anse trempée, résistant à la coupe et au sciage.",
        categorie: "Serrurerie",
        prix: 35000,
        stock: 25,
        image: "https://via.placeholder.com/400x400/2a2a2a/ff8c00?text=Cadenas",
        reference: "SERR-CAD-001",
        marque: "LockGuard",
      },

      // Jardinage
      {
        nom: "Tuyau d'arrosage 25m",
        description: "Tuyau extensible avec pistolet multijet, anti-nœuds.",
        categorie: "Jardinage",
        prix: 42000,
        stock: 15,
        image:
          "https://via.placeholder.com/400x400/2a2a2a/ff8c00?text=Arrosage",
        reference: "JARD-TUY-001",
        marque: "GardenPro",
      },
      {
        nom: "Sécateur professionnel",
        description:
          "Lames en acier inoxydable, poignées ergonomiques antidérapantes.",
        categorie: "Jardinage",
        prix: 28000,
        stock: 20,
        image:
          "https://via.placeholder.com/400x400/2a2a2a/ff8c00?text=Secateur",
        reference: "JARD-SEC-001",
        marque: "CutMaster",
        enPromo: true,
        prixPromo: 22000,
      },
    ];

    await Product.insertMany(products);
    console.log("📦 Produits créés");

    console.log("\n✅ Base de données initialisée avec succès!");
    console.log("\n👤 Comptes créés:");
    console.log(
      "   Admin - email: admin@quincaillerie.mg | password: admin123",
    );
    console.log("   Client - email: client@example.mg | password: client123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }
};

seedData();
