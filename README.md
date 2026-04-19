# 🌳 Genoa - Application d'Arbre Généalogique Intelligent

## 🎯 Introduction
Genoa est une application de gestion avancée d’arbre généalogique familial réalisée dans le cadre du projet *Développement d'applications pour terminaux mobiles* (ENSEIRB-MATMECA).
L'objectif est de permettre de construire, visualiser et analyser dynamiquement un arbre généalogique via une interface mobile sécurisée.

> **Note Pédagogique** : J'ai réalisé ce projet de manière individuelle. Afin de couvrir l'ensemble des contraintes, j'ai opté pour une architecture minimaliste mais redoutablement efficace : Node.js/Express, SQLite piloté via Prisma, et une application Expo (React Native).

## 🧩 Fonctionnalités & Auteur
*Étant seul sur ce projet, toutes les fonctionnalités ont été pensées et codées par* **Mehdi**.

- [x] **Inscription & Authentification** : JWT valide 24h, premier inscrit automatiquement Admin.
- [x] **Gestion des utilisateurs** : Validation d'inscription et promotion de rôles par les Administrateurs.
- [x] **Gestion des membres** : CRUD complet de nœuds (nom, sexe, dates...).
- [x] **Gestion des relations** : Ajouts de couples et de liaisons Parent-Enfant, prévention anti-cycles avec l'algorithme "hasCycle".
- [x] **Visualisation de l'arbre** : Affichage interactif avec D3.js hébergé dans une `WebView` au sein du client React Native.
- [x] **Recherche & Navigation** : Formulaire multicritères (nom, prénom) pour accéder aux données.
- [x] **Statistiques familiales** : Calcul dynamique de la répartition hommes/femmes et de l'espérance de vie.
- [x] **Confidentialité et Synchronisation** : Intégration de vérifications de rôles, de flags `isPrivate`, et de synchronisations temps-réél + verrous sur **Socket.IO**.

## 🚀 Installation & Lancement Rapide

Assurez-vous de posséder **Node.js** v16+.

### 1️⃣ Lancement du Backend (API REST)
\`\`\`bash
cd backend
npm install
# La base de données SQLite (dev.db) est utilisée par défaut.
# Initialiser avec quelques membres fictifs de démonstration :
node seed.js

# Lancer en mode dev
npm run dev
\`\`\`
Le serveur va tourner sur `http://localhost:3000`. 
*(L'utilisateur de test généré est `admin@genoa.com` / `admin123`)*.

### 2️⃣ Lancement du Frontend (Application Mobile Expo)
\`\`\`bash
cd frontend
npm install

# Lancer le serveur Expo
npx expo start
\`\`\`
Scannez le QR-Code avec l'application "Expo Go" (sur iOS ou Android) ou ouvrez l'émulateur avec `i` pour iOS / `a` pour Android.

---
**Développé par Mehdi.**