# 🌳 Genoa - Application d'Arbre Généalogique Intelligent

## 🎯 Introduction
Genoa est une application de gestion avancée d’arbre généalogique familial réalisée dans le cadre du projet **Développement d'applications pour terminaux mobiles** . 

L'objectif est de permettre à une famille de construire, visualiser et analyser dynamiquement son arbre généalogique via une interface interactive sur mobile. Le projet suit une architecture stricte client-serveur.

*Projet réalisé individuellement.*

---

## 🧩 Fonctionnalités Implémentées & Répartition (Auteurs)

Puisque ce projet initialement prévu en binôme a été réalisé seul, toutes les fonctionnalités ont été développées et committées par Mehdi SAADI (GitHub : `mehdisaadi1`).

| Fonctionnalité / Tâche | Description de l'implémentation | Auteur |
|-------------------------|--------------------------------|--------|
| **Base de Données & Architecture** | Création du serveur Express et paramétrage de SQLite via **Prisma ORM**. Schémas de DB `User`, `Member`, `Relation`, et `Couple`. | Mehdi SAADI |
| **Authentification & Sécurité** | Inscription, Connexion, Hashage des mots de passe (bcrypt) et émission de JWT (validité 24h). | Mehdi SAADI |
| **Gestion des Rôles (Admin)** | Création d'un Panel Administrateur (`AdminScreen`). Validation manuelle des nouveaux comptes (Lecteurs) et promotion en Éditeurs. | Mehdi SAADI |
| **Arbre et Graphe Interactif** | Affichage interactif avec Zoom. Injection native de **D3.js** (Force-Directed Graph) au sein d'une `WebView` React Native pour des calculs fluides de répulsion physique inter-membres. | Mehdi SAADI |
| **Système de Membres (CRUD)** | Formulaire dynamique (`MemberFormScreen`) permettant d'ajouter, modifier et gérer les membres. (Logique relationnelle prête côté base de données). | Mehdi SAADI |
| **Moteur de Recherche** | Écran mobile de recherche avec filtrage direct via API multicritères. | Mehdi SAADI |
| **Statistiques Dynamiques** | Génération de calculs mathématiques (Répartition Hommes/Femmes et Espérance de vie globale) via l'API, restitués sur l'écran Stats. | Mehdi SAADI |
| **Prévention des Conflits (Temps Réel)** | Conception de la mécanique de blocage de session et verrouillage de membres en direct avec **Socket.IO**. | Mehdi SAADI |

---

## 🚀 Installation & Lancement Rapide (Démonstration)

Afin de pouvoir réaliser la démonstration de 15 minutes, l'environnement nécessite l'ouverture de deux terminaux locaux.

### 1️⃣ Initialisation de l'API REST (Backend)
```bash
cd backend
npm install
npx prisma generate
npx prisma db push --accept-data-loss

# Initialiser l'arbre de test "Famille Dupont" (Recommandé) :
node seed.js

# Démarrer le serveur HTTP et Socket.io (Port 3000)
npm run dev
```

### 2️⃣ Initialisation de l'Application Mobile (Frontend Expo)
Ouvrez un nouveau terminal dédié :
```bash
cd frontend
npm install

# Démarrer le packager
npx expo start
```
💡 *Note : Appuyez sur la touche `w` du terminal pour l'ouvrir nativement (et parfaire le rendu SVG D3.js) sur navigateur Web, ou testez-le sur iOS/Android avec Expo Go.*

---

## 🔑 Identifiants Administrateur de Test
Si vous avez lancé `node seed.js` au préalable, l'utilisateur d'amorçage ayant les droits administrateurs sera créé ainsi :
- **Email** : `admin@genoa.com`
- **Mot de passe** : `admin123`