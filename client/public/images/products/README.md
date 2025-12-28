# Images des Produits

Ce dossier contient les images des produits de la buvette.

## Structure des noms de fichiers

Les images doivent être nommées selon le nom français du produit, normalisé :
- En minuscules
- Sans accents
- Espaces et caractères spéciaux remplacés par des tirets
- Extension `.jpg`

### Exemples :
- `tacos-23-dh-sans-frites.jpg`
- `frites.jpg`
- `tacos-viande-hachee-frites.jpg`
- `pizza-margherita.jpg`
- `cafe-noire.jpg`
- `jus-orange.jpg`
- `msemen.jpg`

## Liste complète des images nécessaires

Pour générer la liste complète des noms d'images attendus, exécutez :

```bash
cd server
npm run seed:products
```

Le script affichera les noms d'images normalisés pour chaque produit.

## Taille recommandée

- Format : JPG
- Taille : 300x300 pixels minimum (carré)
- Poids : < 200 KB par image
- Résolution : 72 DPI (web)

## Ajouter des images

1. Placez vos images dans ce dossier (`client/public/images/products/`)
2. Nommez-les selon la convention ci-dessus
3. Assurez-vous que les noms correspondent exactement aux noms générés par le script
4. Les images seront automatiquement chargées dans l'application

