/**
 * Script pour générer la liste des noms d'images attendus
 * Exécutez: npx ts-node src/scripts/generateImageList.ts
 */

const normalizeImageName = (nameFr: string): string => {
  return nameFr
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
};

const products = [
  // TACOS - plats-chauds
  'Tacos 23 DH sans frites',
  'Frites',
  'Tacos Viande Hachée + Frites',
  'Tacos Nugette + Frites',
  'Tacos Poulet + Frites',
  'Tacos Mix + Frites',
  'Tacos Saucisse + Frites',
  'Tacos Chawarma + Frites',

  // CHAWARMA - plats-chauds
  'Chawarma Normal Sans Frites',
  'Chawarma Fromage Sans Frites',
  'Chawarma Super Sans Frites',
  'Chawarma Arabic Sans Frites',

  // PIZZA - plats-chauds
  'Pizza Margherita',
  'Pizza Fromage',
  'Pizza Viande Hachée',
  'Pizza Mix',
  'Pizza Poulet',
  'Pizza Chawarma',

  // PASTECCIO - plats-chauds
  'Pasteccio Dinde',
  'Pasteccio Viande Hachée',
  'Pasteccio Mix',

  // SANDWICH - plats-chauds
  'Omelette Lanchon',
  'Sandwich Thon',
  'Sandwich Omelette',
  'Sandwich Mix',
  'Sandwich Viande Hachée',

  // PANINI - plats-chauds
  'Panini Thon',
  'Panini Omelette',
  'Panini Poulet',
  'Panini Viande Hachée',
  'Panini Mix',

  // LES PATES - plats-chauds
  'Les Pates Machouel',
  'Les Pates Dinde',
  'Les Pates Viande Hachée',
  'Les Pates Carbonara',

  // PLAT - plats-chauds
  'Plat Poulet',
  'Plat Viande Hachée',
  'Plat Mix',
  'Plat Chawarma',

  // SALADES - plats-chauds
  'Salade Niçoise',
  'Salade Cèpe',

  // CAFE - boissons
  'Verre de Thé',
  'Lait Chaud',
  'Café Noire',
  'Café Crème',
  'Café Au Lait',
  'Lait Au Chocolat',
  'Cappuccino',
  'Thé À La Menthe Petite',
  'Thé À La Menthe Moyen',

  // JUS - boissons
  'Jus Orange',
  'Jus Banane',
  'Jus Fraise',
  'Jus Panaché',
  'Jus Avocat',

  // PATISSERIE - petit-dejeuner
  'Œufs',
  'Msemen',
  'Harcha',
  'Croissant',
  'Harcha Fromage',
  'Briwat',
  'Harcha Fromage Miel',
  'Paint Fromage Lanshon',
  'Msemen Fromage Lanshon',
  'Petite Pizza',
  'Bastila',
];

console.log('📋 Liste des noms d\'images attendus:\n');
console.log('Placez ces images dans: client/public/images/products/\n');

products.forEach((productName, index) => {
  const imageName = normalizeImageName(productName);
  console.log(`${index + 1}. ${imageName}.jpg`);
});

console.log(`\n✅ Total: ${products.length} images nécessaires`);
console.log('\n💡 Conseil: Nommez vos fichiers exactement comme indiqué ci-dessus.');

