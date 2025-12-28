# 🖼️ Guide des Images des Produits

Ce guide explique comment ajouter des images pour chaque produit de la buvette.

## 📁 Structure des dossiers

Les images doivent être placées dans :
```
client/public/images/products/
```

## 📝 Convention de nommage

Chaque produit a un nom d'image basé sur son nom français, normalisé :
- En minuscules
- Sans accents
- Espaces et caractères spéciaux remplacés par des tirets
- Extension `.jpg`

### Exemples :
- `Tacos 23 DH sans frites` → `tacos-23-dh-sans-frites.jpg`
- `Frites` → `frites.jpg`
- `Pizza Margherita` → `pizza-margherita.jpg`
- `Café Noire` → `cafe-noire.jpg`
- `Thé À La Menthe Petite` → `the-a-la-menthe-petite.jpg`

## 📋 Générer la liste complète des noms d'images

Pour obtenir la liste complète des 66 noms d'images attendus :

```bash
cd server
npm run images:list
```

Cette commande affichera tous les noms de fichiers attendus.

## ✅ Liste complète (66 images)

1. `tacos-23-dh-sans-frites.jpg`
2. `frites.jpg`
3. `tacos-viande-hachee-frites.jpg`
4. `tacos-nugette-frites.jpg`
5. `tacos-poulet-frites.jpg`
6. `tacos-mix-frites.jpg`
7. `tacos-saucisse-frites.jpg`
8. `tacos-chawarma-frites.jpg`
9. `chawarma-normal-sans-frites.jpg`
10. `chawarma-fromage-sans-frites.jpg`
11. `chawarma-super-sans-frites.jpg`
12. `chawarma-arabic-sans-frites.jpg`
13. `pizza-margherita.jpg`
14. `pizza-fromage.jpg`
15. `pizza-viande-hachee.jpg`
16. `pizza-mix.jpg`
17. `pizza-poulet.jpg`
18. `pizza-chawarma.jpg`
19. `pasteccio-dinde.jpg`
20. `pasteccio-viande-hachee.jpg`
21. `pasteccio-mix.jpg`
22. `omelette-lanchon.jpg`
23. `sandwich-thon.jpg`
24. `sandwich-omelette.jpg`
25. `sandwich-mix.jpg`
26. `sandwich-viande-hachee.jpg`
27. `panini-thon.jpg`
28. `panini-omelette.jpg`
29. `panini-poulet.jpg`
30. `panini-viande-hachee.jpg`
31. `panini-mix.jpg`
32. `les-pates-machouel.jpg`
33. `les-pates-dinde.jpg`
34. `les-pates-viande-hachee.jpg`
35. `les-pates-carbonara.jpg`
36. `plat-poulet.jpg`
37. `plat-viande-hachee.jpg`
38. `plat-mix.jpg`
39. `plat-chawarma.jpg`
40. `salade-nicoise.jpg`
41. `salade-cepe.jpg`
42. `verre-de-the.jpg`
43. `lait-chaud.jpg`
44. `cafe-noire.jpg`
45. `cafe-creme.jpg`
46. `cafe-au-lait.jpg`
47. `lait-au-chocolat.jpg`
48. `cappuccino.jpg`
49. `the-a-la-menthe-petite.jpg`
50. `the-a-la-menthe-moyen.jpg`
51. `jus-orange.jpg`
52. `jus-banane.jpg`
53. `jus-fraise.jpg`
54. `jus-panache.jpg`
55. `jus-avocat.jpg`
56. `ufs.jpg` (Œufs)
57. `msemen.jpg`
58. `harcha.jpg`
59. `croissant.jpg`
60. `harcha-fromage.jpg`
61. `briwat.jpg`
62. `harcha-fromage-miel.jpg`
63. `paint-fromage-lanshon.jpg`
64. `msemen-fromage-lanshon.jpg`
65. `petite-pizza.jpg`
66. `bastila.jpg`

## 📐 Spécifications techniques recommandées

- **Format** : JPG (recommandé) ou PNG
- **Taille** : 300x300 pixels minimum (carré)
- **Ratio** : 1:1 (carré) pour un meilleur affichage
- **Poids** : < 200 KB par image (optimisé pour le web)
- **Résolution** : 72 DPI (standard web)
- **Qualité** : 80-85% (bon compromis qualité/poids)

## 🔄 Comment ajouter les images

1. **Préparez vos images** selon les spécifications ci-dessus

2. **Nommez-les** exactement comme indiqué dans la liste (utilisez `npm run images:list` pour la liste complète)

3. **Placez-les** dans le dossier `client/public/images/products/`

4. **Redémarrez le serveur frontend** si nécessaire :
   ```bash
   cd client
   npm run dev
   ```

5. **Exécutez le seed des produits** pour mettre à jour les URLs dans la base de données :
   ```bash
   cd server
   npm run seed:products
   ```

## ⚠️ Important

- Les noms de fichiers doivent être **exactement** comme indiqué (sensible à la casse)
- Les images sont servies depuis le dossier `public`, donc accessible via `/images/products/nom-image.jpg`
- Si une image est manquante, l'application affichera une icône de fallback
- Les images sont chargées de manière lazy (lazy loading) pour optimiser les performances

## 🎨 Alternative : Utiliser des images placeholder

Si vous n'avez pas encore les images réelles, le système utilisera automatiquement un placeholder. Cependant, pour une meilleure expérience utilisateur, il est recommandé d'ajouter de vraies images.

## 📱 Affichage dans l'application

Les images sont affichées dans :
- ✅ Page Menu (grille de produits)
- ✅ Modal de détail du produit
- ✅ Panier
- ✅ Historique des commandes

Chaque image s'affiche avec un fallback élégant si elle est manquante ou si le chargement échoue.

