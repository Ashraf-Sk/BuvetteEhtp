# 🌮 Script de Seed des Produits - Buvette EHTP

Ce document explique comment ajouter tous les produits du menu à la base de données.

## 📋 Produits inclus

Le script ajoute **66 produits** répartis en 3 catégories :

### 🍽️ Plats Chauds (45 produits)
- **TACOS** : 8 produits (dont Tacos 23 DH, Tacos Viande Hachée, Tacos Poulet, etc.)
- **CHAWARMA** : 4 produits (Normal, Fromage, Super, Arabic)
- **PIZZA** : 6 produits (Margherita, Fromage, Viande Hachée, Mix, Poulet, Chawarma)
- **PASTECCIO** : 3 produits (Dinde, Viande Hachée, Mix)
- **SANDWICH** : 5 produits (Omelette Lanchon, Thon, Omelette, Mix, Viande Hachée)
- **PANINI** : 5 produits (Thon, Omelette, Poulet, Viande Hachée, Mix)
- **LES PATES** : 4 produits (Machouel, Dinde, Viande Hachée, Carbonara)
- **PLAT** : 4 produits (Poulet, Viande Hachée, Mix, Chawarma)
- **SALADES** : 2 produits (Niçoise, Cèpe)
- **Frites** : 1 produit

### ☕ Boissons (14 produits)
- **CAFE** : 9 produits (Thé, Lait Chaud, Café Noire, Café Crème, Café Au Lait, Lait Au Chocolat, Cappuccino, Thé À La Menthe Petite/Moyen)
- **JUS** : 5 produits (Orange, Banane, Fraise, Panaché, Avocat)

### 🥐 Petit-Déjeuner (11 produits)
- **PATISSERIE** : 11 produits (Œufs, Msemen, Harcha, Croissant, Harcha Fromage, Briwat, Harcha Fromage Miel, Paint Fromage Lanshon, Msemen Fromage Lanshon, Petite Pizza, Bastila)

## 🚀 Utilisation

### Exécuter le script

```bash
cd server
npm run seed:products
```

### Résultat attendu

```
✅ 66 produits créés avec succès!

📊 Répartition par catégorie:
   plats-chauds: 45 produits
   boissons: 14 produits
   petit-dejeuner: 11 produits
```

## 📝 Détails des produits

Chaque produit est créé avec :
- **Nom** : En français, arabe et anglais
- **Prix** : Exactement comme dans le menu fourni
- **Catégorie** : Mappée vers les 3 catégories disponibles
- **Stock** : 100 unités (disponibles)
- **Temps de préparation** : Défini selon le type de produit
- **Image** : Placeholder (à remplacer par de vraies images)
- **Popularité** : Certains produits marqués comme populaires

## ⚠️ Notes importantes

1. **Images** : Les produits utilisent actuellement des images placeholder. Vous devrez les remplacer par de vraies images plus tard.

2. **Catégories** : Les produits sont mappés vers les 3 catégories existantes :
   - `plats-chauds` : Tous les plats principaux
   - `boissons` : Cafés et jus
   - `petit-dejeuner` : Pâtisseries et petits déjeuners

3. **Réinitialisation** : Le script supprime tous les produits existants avant d'ajouter les nouveaux.

4. **Traductions** : Tous les produits ont des noms en français, arabe et anglais.

## 🔄 Mettre à jour les produits

Pour ajouter de nouveaux produits ou modifier les existants :

1. Modifiez le fichier `server/src/scripts/seedProducts.ts`
2. Ajoutez les nouveaux produits dans le tableau `products`
3. Ré-exécutez `npm run seed:products`

## 📸 Ajouter des images

Pour remplacer les images placeholder :

1. Ajoutez les images dans `client/public/images/products/`
2. Modifiez le script pour utiliser les bonnes URLs :
   ```typescript
   image: '/images/products/tacos-viande-hachee.jpg',
   ```

