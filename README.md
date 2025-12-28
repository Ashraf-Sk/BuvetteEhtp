# Buvette EHTP - Food Ordering System

Application complète de commande de nourriture pour la Buvette de l'École Hassania des Travaux Publics (EHTP).

## 🚀 Fonctionnalités

### Pour les Étudiants
- 📱 Interface mobile-first et responsive
- 🍕 Catalogue de produits avec filtres et recherche
- 🛒 Panier de commande
- 💳 Paiement en espèces ou par carte
- 📊 Suivi de commande en temps réel
- ⭐ Système de favoris
- 📝 Historique des commandes
- 🌍 Support multilingue (FR, AR, EN)
- 🔔 Notifications push

### Pour les Employés
- 📊 Dashboard avec statistiques en temps réel
- 📦 Gestion des commandes
- 📈 Suivi de l'inventaire
- 📊 Rapports et analytics

## 🛠️ Stack Technique

### Backend
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Socket.io (temps réel)
- JWT Authentication
- Cloudinary (images)
- Nodemailer (emails)
- Web Push (notifications)

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- React Query
- React Router
- i18next (internationalisation)
- Socket.io Client

## 📁 Structure du Projet

```
BuvetteEHTP/
├── client/          # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── utils/
│   └── public/
└── server/          # Backend Express
    └── src/
        ├── config/
        ├── controllers/
        ├── models/
        ├── routes/
        ├── services/
        └── middleware/
```

## 🚀 Installation

### Prérequis
- Node.js 18+
- MongoDB (local ou Atlas)
- npm ou yarn

### Backend

```bash
cd server
npm install
cp .env.example .env
# Configurez vos variables d'environnement dans .env
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

### Frontend

```bash
cd client
npm install
cp .env.example .env
# Configurez vos variables d'environnement dans .env
npm run dev
```

L'application démarre sur `http://localhost:5173`

## ⚙️ Variables d'Environnement

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_VAPID_PUBLIC_KEY=...
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/verify-email` - Vérification email
- `GET /api/auth/me` - Profil utilisateur

### Products
- `GET /api/products` - Liste produits (avec filtres)
- `GET /api/products/:id` - Détails produit

### Orders
- `POST /api/orders` - Créer commande
- `GET /api/orders` - Liste commandes utilisateur
- `GET /api/orders/:id` - Détails commande
- `PATCH /api/orders/:id/status` - Mettre à jour statut (employé)

### User
- `GET /api/user/profile` - Profil
- `PUT /api/user/profile` - Mettre à jour profil
- `GET /api/user/favorites` - Favoris
- `POST /api/user/favorites/:productId` - Ajouter favori
- `DELETE /api/user/favorites/:productId` - Retirer favori

## 🎨 Design System

### Couleurs
- Primary (Bleu EHTP): `#4A7BA7`
- Secondary (Brun): `#8B4513`
- Accent (Orange): `#E89B3C`
- Success: `#10B981`
- Error: `#EF4444`

## 📄 License

ISC

## 👥 Auteurs

Équipe de développement Buvette EHTP

