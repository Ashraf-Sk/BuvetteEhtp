# 📱 Guide d'affichage des produits dans l'application

Ce document explique comment afficher tous les produits dans l'application.

## ✅ Modifications effectuées

### 1. **Service Frontend** (`client/src/services/product.service.ts`)
- Correction de la transformation des données pour correspondre à la réponse API
- Le service extrait maintenant correctement `products` depuis `data.products`

### 2. **Contrôleur Backend** (`server/src/controllers/product.controller.ts`)
- Augmentation de la limite par défaut à 100 produits (au lieu de 20)
- Cela permet d'afficher tous les produits en une seule page

### 3. **Traductions**
- Ajout de la clé `products.search` dans les 3 langues (FR, EN, AR)

## 🚀 Étapes pour afficher les produits

### 1. Ajouter les produits à la base de données

Exécutez le script de seed :

```bash
cd server
npm run seed:products
```

Cela ajoutera **66 produits** à votre base de données.

### 2. Démarrer les serveurs

**Terminal 1 - Backend :**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd client
npm run dev
```

### 3. Accéder à l'application

1. Ouvrez http://localhost:5173
2. Connectez-vous avec un compte utilisateur (utilisez `npm run seed` pour créer des utilisateurs de test)
3. Accédez à la page **Menu** depuis la navigation

## 📋 Fonctionnalités disponibles

### Page Menu (`/menu`)

- ✅ **Affichage de tous les produits** en grille responsive
- ✅ **Recherche** par nom de produit
- ✅ **Filtres par catégorie** :
  - Petit-Déjeuner (11 produits)
  - Plats Chauds (45 produits)
  - Boissons (14 produits)
- ✅ **Filtres par prix** (min/max)
- ✅ **Tri** :
  - Plus récent
  - Prix croissant/décroissant
  - Plus populaire
- ✅ **Cliquer sur un produit** pour voir les détails
- ✅ **Ajouter au panier** directement depuis la carte produit
- ✅ **Ajouter aux favoris** (icône cœur)

### Structure des données

Les produits sont affichés avec :
- **Nom** (FR, AR, EN selon la langue sélectionnée)
- **Description**
- **Prix** en MAD
- **Image** (placeholder pour l'instant)
- **Badge "Populaire"** pour les produits populaires
- **Badge "Rupture de stock"** si indisponible
- **Temps de préparation**

## 🔧 Dépannage

### Les produits ne s'affichent pas

1. **Vérifiez que MongoDB est démarré**
2. **Vérifiez que les produits sont dans la base de données** :
   ```bash
   # Connectez-vous à MongoDB
   mongosh
   use buvette-ehtp
   db.products.count()
   # Devrait retourner 66
   ```
3. **Vérifiez que le serveur backend fonctionne** :
   - Visitez http://localhost:5000/api/products
   - Vous devriez voir une réponse JSON avec les produits
4. **Vérifiez la console du navigateur** pour les erreurs

### Erreur "No products found"

- Assurez-vous d'avoir exécuté `npm run seed:products`
- Vérifiez la connexion à MongoDB
- Vérifiez que le serveur backend est démarré

## 📸 Prochaines étapes (optionnel)

1. **Ajouter de vraies images** :
   - Ajoutez les images dans `client/public/images/products/`
   - Modifiez le script `seedProducts.ts` pour utiliser les bonnes URLs

2. **Personnaliser les temps de préparation** :
   - Modifiez les valeurs dans `seedProducts.ts`

3. **Ajouter plus de produits populaires** :
   - Modifiez `isPopular: true` dans `seedProducts.ts`

## 📊 Statistiques

Après avoir exécuté le seed, vous devriez avoir :
- **66 produits** au total
- **45 plats chauds**
- **14 boissons**
- **11 petit-déjeuner**

Tous les produits sont disponibles par défaut (stock: 100).

