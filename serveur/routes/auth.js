const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// --- ROUTE D'INSCRIPTION ---
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si c'est le TOUT PREMIER utilisateur (il devient admin automatiquement)
        const userCount = await User.countDocuments();
        const role = userCount === 0 ? 'admin' : 'lecteur';
        const isApproved = userCount === 0 ? true : false; // L'admin s'auto-approuve

        // Dans serveur/routes/auth.js (route /register)
        const newUser = new User({
            nom: req.body.nom || "Utilisateur Test", // On ajoute un nom par défaut ici
            email: req.body.email,
            password: req.body.password,
            role: isFirstUser ? 'admin' : 'lecteur',
            isApproved: isFirstUser
        });        await newUser.save();

        res.status(201).json({ message: "Utilisateur créé avec succès. En attente de validation par un admin." });
    } catch (error) {
        res.status(400).json({ error: "Erreur lors de l'inscription (email peut-être déjà utilisé)." });
    }
});

// --- ROUTE DE CONNEXION ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Chercher l'utilisateur par son email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "Utilisateur introuvable." });

        // 2. Vérifier s'il a été approuvé par un admin
        if (!user.isApproved) return res.status(403).json({ error: "Votre compte n'a pas encore été validé par un administrateur." });

        // 3. Comparer le mot de passe envoyé avec le mot de passe hashé
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Mot de passe incorrect." });

        // 4. Générer le token JWT (Valide 24h comme demandé)
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.json({ message: "Connexion réussie !", token, role: user.role });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur." });
    }
});

module.exports = router;