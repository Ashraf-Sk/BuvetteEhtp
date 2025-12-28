# 🚀 Guide de Démarrage Rapide

## ⚡ Démarrage en 5 Minutes

### 1. Installer les dépendances

```bash
# Terminal 1 - Backend
cd server
npm install

# Terminal 2 - Frontend  
cd client
npm install
```

### 2. Configurer les variables d'environnement

#### Backend (`server/.env`)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/buvette-ehtp
JWT_SECRET=change-this-secret-in-production
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@buvette-ehtp.ac.ma
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
CLIENT_URL=http://localhost:5173
```

#### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Démarrer MongoDB

**Option A : MongoDB Local**
```bash
# Si MongoDB est installé localement
mongod
```

**Option B : MongoDB Atlas (Gratuit)**
1. Créez un compte sur [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Créez un cluster gratuit
3. Copiez la connection string dans `MONGODB_URI`

### 4. Démarrer les serveurs

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client  
npm run dev
```

### 5. Ouvrir l'application

- Frontend : http://localhost:5173
- Backend API : http://localhost:5000
- Health Check : http://localhost:5000/health

## ✅ Vérification

1. Vérifiez que le backend démarre : `✅ Server running on port 5000`
2. Vérifiez que le frontend démarre : Ouvrez http://localhost:5173
3. Testez l'API : Visitez http://localhost:5000/health

## 🎯 Prochaines Actions

1. **Créer un compte** : Inscrivez-vous avec un email @ehtp.ac.ma
2. **Ajouter des produits** : Utilisez MongoDB Compass ou un script
3. **Tester le flux** : Menu → Panier → Commande

## 📖 Documentation Complète

Voir [SETUP_GUIDE.md](./SETUP_GUIDE.md) pour plus de détails.

