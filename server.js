// Import des modules nécessaires
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/user"); // Import du modèle User

dotenv.config(); // Charge les variables d'environnement depuis .env
const app = express(); // Création de l'application Express
const port = process.env.PORT || 3000; // Définition du port, utilisera le port défini dans .env ou 3000 par défaut

app.use(express.json()); // Middleware pour parser les données JSON des requêtes

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Routes

// Route GET pour récupérer tous les utilisateurs
app.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // Requête pour récupérer tous les utilisateurs dans la base de données
    res.json(users); // Répond avec les utilisateurs au format JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Si une erreur survient, répond avec le statut 500 et un message d'erreur
  }
});

// Route POST pour ajouter un nouvel utilisateur
app.post("/users", async (req, res) => {
  const user = new User({
    // Crée une nouvelle instance de User avec les données de la requête
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
  });

  try {
    const newUser = await user.save(); // Enregistre le nouvel utilisateur dans la base de données
    res.status(201).json(newUser); // Répond avec le statut 201 (Created) et les données du nouvel utilisateur
  } catch (err) {
    res.status(400).json({ message: err.message }); // Si une erreur survient, répond avec le statut 400 et un message d'erreur
  }
});

// Route PUT pour éditer un utilisateur par son ID
app.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Recherche l'utilisateur par son ID dans la base de données
    if (user) {
      // Met à jour les données de l'utilisateur avec les données de la requête, s'il existe
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.age = req.body.age || user.age;

      const updatedUser = await user.save(); // Enregistre les modifications dans la base de données
      res.json(updatedUser); // Répond avec les données de l'utilisateur mis à jour
    } else {
      res.status(404).json({ message: "User not found" }); // Si l'utilisateur n'est pas trouvé, répond avec le statut 404 et un message d'erreur
    }
  } catch (err) {
    res.status(500).json({ message: err.message }); // Si une erreur survient, répond avec le statut 500 et un message d'erreur
  }
});

// Route DELETE pour supprimer un utilisateur par son ID
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Recherche l'utilisateur par son ID dans la base de données
    if (user) {
      await user.remove(); // Supprime l'utilisateur de la base de données
      res.json({ message: "User removed" }); // Répond avec un message de succès
    } else {
      res.status(404).json({ message: "User not found" }); // Si l'utilisateur n'est pas trouvé, répond avec le statut 404 et un message d'erreur
    }
  } catch (err) {
    res.status(500).json({ message: err.message }); // Si une erreur survient, répond avec le statut 500 et un message d'erreur
  }
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
