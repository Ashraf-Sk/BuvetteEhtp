# Guide de Configuration et Démarrage

## 📋 Étapes pour Démarrer le Projet

### 1. Installation des Dépendances

#### Backend (Server)
```bash
cd server
npm install
```

#### Frontend (Client)
```bash
cd client
npm install
```

### 2. Configuration des Variables d'Environnement

#### Backend (.env)
Créez un fichier `.env` dans le dossier `server/` :

```env
NODE_ENV=development
PORT=5000

# MongoDB (utilisez MongoDB Atlas ou local)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/buvette-ehtp?retryWrites=true&w=majority

# JWT
JWT_SECRET=votre-secret-jwt-super-securise-changez-moi
JWT_EXPIRES_IN=7d

# Email (Gmail avec App Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-app-password
EMAIL_FROM=noreply@buvette-ehtp.ac.ma

# Cloudinary (pour les images)
CLOUDINARY_CLOUD_NAME=votre-cloud-name
CLOUDINARY_API_KEY=votre-api-key
CLOUDINARY_API_SECRET=votre-api-secret

# Payment - CMI (optionnel)
CMI_MERCHANT_ID=
CMI_SECRET_KEY=
CMI_API_URL=https://payment.cmi.ma/

# Payment - Stripe (pour Visa/Mastercard)
STRIPE_SECRET_KEY=sk_test_51SlrugRBqZMgxLz9... (votre clé complète)
STRIPE_PUBLISHABLE_KEY=pk_test_51SlrugRBqZMgxLz91D6wYUITOLvYSfiKsGladwTKICmwOPiSJHmw9Ui0ktpOdExLI574JjRuBLJoPppgLFzbt6uX00M15sraZg
STRIPE_WEBHOOK_SECRET=whsec_... (optionnel, pour les webhooks)

# Client URL
CLIENT_URL=http://localhost:5173

# VAPID Keys (pour notifications push - optionnel)
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
```

**Comment obtenir ces valeurs :**
- **MongoDB Atlas** : Créez un cluster gratuit sur [mongodb.com/atlas](https://www.mongodb.com/atlas)
- **Email Gmail** : Activez la "validation en 2 étapes" puis créez un "Mot de passe d'application"
- **Cloudinary** : Inscrivez-vous gratuitement sur [cloudinary.com](https://cloudinary.com)
- **VAPID Keys** : Utilisez `web-push generate-vapid-keys` (npm install -g web-push)

#### Frontend (.env)
Créez un fichier `.env` dans le dossier `client/` :

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_VAPID_PUBLIC_KEY=votre-vapid-public-key

# Stripe (pour paiement par carte)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51SlrugRBqZMgxLz91D6wYUITOLvYSfiKsGladwTKICmwOPiSJHmw9Ui0ktpOdExLI574JjRuBLJoPppgLFzbt6uX00M15sraZg
```

**Note** : Pour plus de détails sur la configuration Stripe, consultez [STRIPE_SETUP.md](./STRIPE_SETUP.md)

### 3. Base de Données MongoDB

#### Option A : MongoDB Atlas (Recommandé)
1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Créez un cluster gratuit (M0)
3. Créez un utilisateur de base de données
4. Ajoutez votre IP (0.0.0.0/0 pour développement)
5. Copiez la connection string dans `MONGODB_URI`

#### Option B : MongoDB Local
```bash
# Installation MongoDB local (Windows)
# Téléchargez depuis mongodb.com/download

# Ou utilisez Docker
docker run -d -p 27017:27017 --name mongodb mongo

# MONGODB_URI=mongodb://localhost:27017/buvette-ehtp
```

### 4. Démarrage des Serveurs

#### Terminal 1 - Backend
```bash
cd server
npm run dev
```
Le serveur devrait démarrer sur `http://localhost:5000`

#### Terminal 2 - Frontend
```bash
cd client
npm run dev
```
L'application devrait démarrer sur `http://localhost:5173`

### 5. Vérification

1. **Backend** : Visitez `http://localhost:5000/health` - devrait retourner `{"status":"ok"}`
2. **Frontend** : Visitez `http://localhost:5173` - devrait afficher la page de connexion

## 🔧 Prochaines Étapes de Développement

### Priorité 1 : Faire Fonctionner l'Authentification

1. **Testez l'inscription** :
   - Utilisez un email @ehtp.ac.ma valide
   - Format studentId: EHTP-1234
   - Vérifiez que l'email de vérification est envoyé

2. **Vérifiez la connexion** :
   - Connectez-vous avec les identifiants créés
   - Vérifiez que le token est stocké dans localStorage

### Priorité 2 : Données de Test

Créez quelques produits de test dans MongoDB :

```javascript
// Dans MongoDB Compass ou via script
db.products.insertMany([
  {
    name: { fr: "Msemen", ar: "مسمن", en: "Msemen" },
    description: { 
      fr: "Pain traditionnel marocain", 
      ar: "خبز تقليدي مغربي",
      en: "Traditional Moroccan bread"
    },
    price: 5,
    category: "petit-dejeuner",
    image: "https://example.com/msemen.jpg",
    stock: 50,
    preparationTime: 5,
    isAvailable: true,
    isPopular: true,
    averageRating: 4.5,
    totalReviews: 10
  },
  // Ajoutez plus de produits...
])
```

### Priorité 3 : Tests Fonctionnels

1. **Parcours Utilisateur Complet** :
   - ✅ Inscription → Vérification email
   - ✅ Connexion
   - ✅ Navigation dans le menu
   - ✅ Ajout au panier
   - ✅ Passage de commande
   - ✅ Suivi de commande

2. **Fonctionnalités à Tester** :
   - Filtres produits
   - Recherche
   - Favoris
   - Panier (ajout, modification, suppression)
   - Profil utilisateur

### Priorité 4 : Améliorations et Fonctionnalités Manquantes

#### Frontend
- [ ] Service Worker (PWA) - pour fonctionnement offline
- [ ] Notifications push (configurez VAPID keys)
- [ ] Socket.io client (temps réel)
- [ ] Gestion des erreurs réseau
- [ ] Loading states améliorés
- [ ] Animations et transitions
- [ ] Responsive design (tests mobile)

#### Backend
- [ ] Endpoint pour générer QR codes
- [ ] Intégration paiement CMI/Payzone
- [ ] Webhooks pour notifications push
- [ ] Tests unitaires
- [ ] Documentation API (Swagger/OpenAPI)
- [ ] Rate limiting plus fin
- [ ] Logging structuré

#### Base de Données
- [ ] Indexes MongoDB optimisés
- [ ] Seeding script pour données de test
- [ ] Migrations (si nécessaire)

### Priorité 5 : Interface Employé

1. **Dashboard Employé** :
   - Connectez-vous avec un compte `role: "employee"`
   - Implémentez la logique de gestion des commandes
   - Ajoutez les actions (confirmer, préparer, marquer prêt)

2. **Gestion Inventaire** :
   - CRUD produits
   - Mise à jour stock
   - Upload images

### Priorité 6 : Déploiement

#### Frontend (Vercel)
1. Créez un compte Vercel
2. Connectez votre repository GitHub
3. Configurez les variables d'environnement
4. Deploy automatique

#### Backend (Railway/Render)
1. Créez un compte Railway ou Render
2. Connectez votre repository
3. Configurez MongoDB Atlas (production)
4. Ajoutez les variables d'environnement
5. Deploy

## 🐛 Dépannage

### Erreurs Communes

1. **MongoDB Connection Error** :
   - Vérifiez que MongoDB est démarré
   - Vérifiez la connection string
   - Vérifiez que votre IP est whitelistée (Atlas)

2. **Email ne s'envoie pas** :
   - Vérifiez les credentials Gmail
   - Activez "Less secure app access" ou utilisez App Password
   - Vérifiez les logs backend

3. **CORS Error** :
   - Vérifiez que `CLIENT_URL` correspond à l'URL du frontend
   - Vérifiez la configuration CORS dans `server/src/app.ts`

4. **Module not found** :
   - Exécutez `npm install` dans les deux dossiers
   - Supprimez `node_modules` et `package-lock.json`, puis réinstallez

5. **Port déjà utilisé** :
   - Changez le PORT dans `.env`
   - Ou tuez le processus utilisant le port : `netstat -ano | findstr :5000`

## 📚 Ressources Utiles

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Socket.io Documentation](https://socket.io/docs/)

## ✅ Checklist de Démarrage

- [ ] Dépendances installées (backend + frontend)
- [ ] Variables d'environnement configurées
- [ ] MongoDB connecté et fonctionnel
- [ ] Backend démarre sans erreurs
- [ ] Frontend démarre sans erreurs
- [ ] Test connexion backend (health endpoint)
- [ ] Test page d'accueil frontend
- [ ] Premier utilisateur créé
- [ ] Email de vérification reçu
- [ ] Connexion fonctionnelle
- [ ] Au moins un produit dans la base de données
- [ ] Menu affiche les produits

## 🎯 Objectifs à Court Terme

1. **Aujourd'hui** : Faire fonctionner l'authentification complète
2. **Cette semaine** : Faire fonctionner le parcours commande complet
3. **Cette semaine** : Ajouter des données de test
4. **Prochaine semaine** : Interface employé fonctionnelle
5. **Prochaine semaine** : Déploiement staging

Bonne chance avec votre développement ! 🚀

