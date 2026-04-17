const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editeur', 'lecteur'], default: 'lecteur' },
    // D'après ton cahier des charges, l'inscription doit être validée
    isApproved: { type: Boolean, default: false } 
});

// Middleware Mongoose : Crypter le mot de passe AVANT de sauvegarder
userSchema.pre('save', async function(next) {
    // Si le mot de passe n'a pas été modifié, on passe à la suite
    if (!this.isModified('password')) return next();
    
    // Hashage du mot de passe avec bcrypt (10 "tours" de salage, c'est très sécurisé)
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);