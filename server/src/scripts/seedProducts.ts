import mongoose from 'mongoose';
import Product from '../models/Product';
import { connectDatabase } from '../config/database';

// Helper function to get image URL based on product name
const getProductImage = (nameFr: string): string => {
  // Normalize product name for image filename
  const imageName = nameFr
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
  
  // Use local image path (images should be in client/public/images/products/)
  // Fallback to a data URI placeholder if image doesn't exist
  return `/images/products/${imageName}.jpg`;
};

// Helper function to create product
const createProduct = (
  nameFr: string,
  nameAr: string,
  nameEn: string,
  price: number,
  category: 'petit-dejeuner' | 'plats-chauds' | 'boissons',
  preparationTime: number = 10,
  isPopular: boolean = false,
  customImageName?: string // Optional custom image filename if different from product name
) => {
  const imageName = customImageName || nameFr;
  return {
    name: {
      fr: nameFr,
      ar: nameAr,
      en: nameEn,
    },
    description: {
      fr: nameFr,
      ar: nameAr,
      en: nameEn,
    },
    price,
    category,
    image: getProductImage(imageName),
    isAvailable: true,
    stock: 100,
    preparationTime,
    isPopular,
    averageRating: 0,
    totalReviews: 0,
  };
};

const seedProducts = async () => {
  try {
    await connectDatabase();

    // Clean up existing products
    await Product.deleteMany({});

    const products = [
      // TACOS - plats-chauds
      createProduct('Tacos 23 DH sans frites', 'تاكو 23 درهم بدون بطاطس', 'Tacos 23 DH without fries', 23, 'plats-chauds', 15, true),
      createProduct('Frites', 'بطاطس', 'Fries', 5, 'plats-chauds', 5),
      createProduct('Tacos Viande Hachée + Frites', 'تاكو لحم مفروم + بطاطس', 'Tacos Minced Meat + Fries', 25, 'plats-chauds', 15, true),
      createProduct('Tacos Nugette + Frites', 'تاكو ناجتس + بطاطس', 'Tacos Nuggets + Fries', 25, 'plats-chauds', 15),
      createProduct('Tacos Poulet + Frites', 'تاكو دجاج + بطاطس', 'Tacos Chicken + Fries', 25, 'plats-chauds', 15, true),
      createProduct('Tacos Mix + Frites', 'تاكو ميكس + بطاطس', 'Tacos Mix + Fries', 25, 'plats-chauds', 15),
      createProduct('Tacos Saucisse + Frites', 'تاكو نقانق + بطاطس', 'Tacos Sausage + Fries', 25, 'plats-chauds', 15),
      createProduct('Tacos Chawarma + Frites', 'تاكو شاورما + بطاطس', 'Tacos Shawarma + Fries', 25, 'plats-chauds', 15, true),

      // CHAWARMA - plats-chauds
      createProduct('Chawarma Normal Sans Frites', 'شاورما عادي بدون بطاطس', 'Shawarma Normal Without Fries', 22, 'plats-chauds', 12, true),
      createProduct('Chawarma Fromage Sans Frites', 'شاورما جبن بدون بطاطس', 'Shawarma Cheese Without Fries', 23, 'plats-chauds', 12, true),
      createProduct('Chawarma Super Sans Frites', 'شاورما سوبر بدون بطاطس', 'Shawarma Super Without Fries', 25, 'plats-chauds', 12),
      createProduct('Chawarma Arabic Sans Frites', 'شاورما عربي بدون بطاطس', 'Shawarma Arabic Without Fries', 27, 'plats-chauds', 12),

      // PIZZA - plats-chauds
      createProduct('Pizza Margherita', 'بيتزا مارغريتا', 'Pizza Margherita', 15, 'plats-chauds', 20),
      createProduct('Pizza Fromage', 'بيتزا جبن', 'Pizza Cheese', 15, 'plats-chauds', 20, true),
      createProduct('Pizza Viande Hachée', 'بيتزا لحم مفروم', 'Pizza Minced Meat', 20, 'plats-chauds', 20, true),
      createProduct('Pizza Mix', 'بيتزا ميكس', 'Pizza Mix', 20, 'plats-chauds', 20),
      createProduct('Pizza Poulet', 'بيتزا دجاج', 'Pizza Chicken', 20, 'plats-chauds', 20, true),
      createProduct('Pizza Chawarma', 'بيتزا شاورما', 'Pizza Shawarma', 25, 'plats-chauds', 20, true),

      // PASTECCIO - plats-chauds
      createProduct('Pasteccio Dinde', 'باستيتشيو ديك رومي', 'Pasteccio Turkey', 20, 'plats-chauds', 15),
      createProduct('Pasteccio Viande Hachée', 'باستيتشيو لحم مفروم', 'Pasteccio Minced Meat', 20, 'plats-chauds', 15, true),
      createProduct('Pasteccio Mix', 'باستيتشيو ميكس', 'Pasteccio Mix', 22, 'plats-chauds', 15),

      // SANDWICH - plats-chauds
      createProduct('Omelette Lanchon', 'عجة لانشون', 'Lanchon Omelette', 8, 'plats-chauds', 10),
      createProduct('Sandwich Thon', 'ساندويتش تونة', 'Tuna Sandwich', 8, 'plats-chauds', 8, true),
      createProduct('Sandwich Omelette', 'ساندويتش عجة', 'Omelette Sandwich', 8, 'plats-chauds', 8, true),
      createProduct('Sandwich Mix', 'ساندويتش ميكس', 'Mix Sandwich', 17, 'plats-chauds', 10),
      createProduct('Sandwich Viande Hachée', 'ساندويتش لحم مفروم', 'Minced Meat Sandwich', 17, 'plats-chauds', 10, true),

      // PANINI - plats-chauds
      createProduct('Panini Thon', 'بانيني تونة', 'Tuna Panini', 10, 'plats-chauds', 10),
      createProduct('Panini Omelette', 'بانيني عجة', 'Omelette Panini', 10, 'plats-chauds', 10),
      createProduct('Panini Poulet', 'بانيني دجاج', 'Chicken Panini', 18, 'plats-chauds', 12, true),
      createProduct('Panini Viande Hachée', 'بانيني لحم مفروم', 'Minced Meat Panini', 18, 'plats-chauds', 12),
      createProduct('Panini Mix', 'بانيني ميكس', 'Mix Panini', 18, 'plats-chauds', 12),

      // LES PATES - plats-chauds
      createProduct('Les Pates Machouel', 'المعكرونة مشول', 'Machouel Pasta', 20, 'plats-chauds', 15),
      createProduct('Les Pates Dinde', 'المعكرونة ديك رومي', 'Turkey Pasta', 22, 'plats-chauds', 15),
      createProduct('Les Pates Viande Hachée', 'المعكرونة لحم مفروم', 'Minced Meat Pasta', 28, 'plats-chauds', 15, true),
      createProduct('Les Pates Carbonara', 'المعكرونة كاربونارا', 'Carbonara Pasta', 22, 'plats-chauds', 15, true),

      // PLAT - plats-chauds
      createProduct('Plat Poulet', 'طبق دجاج', 'Chicken Plate', 25, 'plats-chauds', 20, true),
      createProduct('Plat Viande Hachée', 'طبق لحم مفروم', 'Minced Meat Plate', 25, 'plats-chauds', 20, true),
      createProduct('Plat Mix', 'طبق ميكس', 'Mix Plate', 25, 'plats-chauds', 20),
      createProduct('Plat Chawarma', 'طبق شاورما', 'Shawarma Plate', 25, 'plats-chauds', 20, true),

      // SALADES - plats-chauds
      createProduct('Salade Niçoise', 'سلطة نيسواز', 'Niçoise Salad', 15, 'plats-chauds', 10, true),
      createProduct('Salade Cèpe', 'سلطة سيب', 'Cèpe Salad', 17, 'plats-chauds', 10),

      // CAFE - boissons
      createProduct('Verre de Thé', 'كأس شاي', 'Glass of Tea', 1.5, 'boissons', 3, true),
      createProduct('Lait Chaud', 'حليب ساخن', 'Hot Milk', 3, 'boissons', 5),
      createProduct('Café Noire', 'قهوة سوداء', 'Black Coffee', 4, 'boissons', 5, true),
      createProduct('Café Crème', 'قهوة كريمة', 'Cream Coffee', 4, 'boissons', 5, true),
      createProduct('Café Au Lait', 'قهوة بالحليب', 'Coffee with Milk', 4, 'boissons', 5, true),
      createProduct('Lait Au Chocolat', 'حليب بالشوكولاتة', 'Chocolate Milk', 4, 'boissons', 5),
      createProduct('Cappuccino', 'كابتشينو', 'Cappuccino', 4.5, 'boissons', 5, true),
      createProduct('Thé À La Menthe Petite', 'شاي بالنعناع صغير', 'Small Mint Tea', 4, 'boissons', 3, true),
      createProduct('Thé À La Menthe Moyen', 'شاي بالنعناع متوسط', 'Medium Mint Tea', 10, 'boissons', 3, true),

      // JUS - boissons
      createProduct('Jus Orange', 'عصير برتقال', 'Orange Juice', 8, 'boissons', 5, true),
      createProduct('Jus Banane', 'عصير موز', 'Banana Juice', 8, 'boissons', 5),
      createProduct('Jus Fraise', 'عصير فراولة', 'Strawberry Juice', 10, 'boissons', 5, true),
      createProduct('Jus Panaché', 'عصير باناشيه', 'Mixed Juice', 12, 'boissons', 5),
      createProduct('Jus Avocat', 'عصير أفوكادو', 'Avocado Juice', 13, 'boissons', 5, true),

      // PATISSERIE - petit-dejeuner
      createProduct('Œufs', 'بيض', 'Eggs', 2, 'petit-dejeuner', 5, true),
      createProduct('Msemen', 'مسمن', 'Msemen', 2, 'petit-dejeuner', 5, true),
      createProduct('Harcha', 'حرشة', 'Harcha', 2.5, 'petit-dejeuner', 5, true),
      createProduct('Croissant', 'كرواسان', 'Croissant', 3, 'petit-dejeuner', 5, true),
      createProduct('Harcha Fromage', 'حرشة جبن', 'Cheese Harcha', 3.5, 'petit-dejeuner', 5),
      createProduct('Briwat', 'بريوات', 'Briwat', 4, 'petit-dejeuner', 5),
      createProduct('Harcha Fromage Miel', 'حرشة جبن عسل', 'Cheese Harcha with Honey', 4.5, 'petit-dejeuner', 5),
      createProduct('Paint Fromage Lanshon', 'بينت جبن لانشون', 'Lanchon Cheese Paint', 5, 'petit-dejeuner', 5),
      createProduct('Msemen Fromage Lanshon', 'مسمن جبن لانشون', 'Lanchon Cheese Msemen', 5.5, 'petit-dejeuner', 5),
      createProduct('Petite Pizza', 'بيتزا صغيرة', 'Small Pizza', 5, 'petit-dejeuner', 10),
      createProduct('Bastila', 'بسطيلة', 'Bastila', 12, 'petit-dejeuner', 15, true),
    ];

    await Product.insertMany(products);

    console.log(`✅ ${products.length} produits créés avec succès!`);
    
    const byCategory = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\n📊 Répartition par catégorie:');
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} produits`);
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed des produits:', error);
    process.exit(1);
  }
};

seedProducts();

