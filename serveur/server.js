require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Ajout de Mongoose

const app = express();

app.use(cors());
app.use(express.json());

// --- CONNEXION À LA BASE DE DONNÉES ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('📦 Connecté à MongoDB avec succès !'))
  .catch((err) => console.error('❌ Erreur de connexion MongoDB :', err));

// Route de test
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);
app.get('/', (req, res) => {
    res.json({ message: "Bienvenue sur l'API de Genoa !" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});