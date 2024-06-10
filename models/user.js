// Import de Mongoose
const mongoose = require("mongoose");

// Définition du schéma de l'utilisateur
const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Champ 'name' de type String, requis
  email: { type: String, required: true, unique: true }, // Champ 'email' de type String, requis et unique
  age: { type: Number, required: true }, // Champ 'age' de type Number, requis
});

// Création du modèle User basé sur le schéma défini
const User = mongoose.model("User", userSchema);

// Export du modèle User
module.exports = User;
