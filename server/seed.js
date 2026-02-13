const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const foods = [
  // ===== MOSTAZA =====
  // Hamburguesas
  { name: "Sándwich Simple", price: 2490, category: "Hamburguesas", shop: "Mostaza", promo: "Combo", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&h=300", description: "Pan de sándwich con carne 100% vacuna, lechuga, tomate y salsa especial." },
  { name: "Sándwich Doble", price: 3990, category: "Hamburguesas", shop: "Mostaza", promo: null, img: "https://images.unsplash.com/photo-1571407970349-bc2c40e78b27?q=80&w=400&h=300", description: "Doble carne con queso cheddar, lechuga, tomate y cebolla." },
  { name: "Triple Mostaza", price: 5490, category: "Hamburguesas", shop: "Mostaza", promo: "Premium", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&h=300", description: "Triple carne, triple queso, lechuga, tomate, cebolla y huevo." },
  { name: "Mostaza Cheddar", price: 4250, category: "Hamburguesas", shop: "Mostaza", promo: null, img: "https://images.unsplash.com/photo-1513639776144-566c11ce6fe7?q=80&w=400&h=300", description: "Hamburguesa con queso cheddar fundido, bacon y cebolla caramelizada." },
  // Papas y acompañamientos
  { name: "Papas Grandes", price: 1890, category: "Acompañamientos", shop: "Mostaza", promo: null, img: "https://images.unsplash.com/photo-1576003325453-b36036805f91?q=80&w=400&h=300", description: "Papas fritas recién hechas con sal." },
  { name: "Papas Cheddar", price: 2490, category: "Acompañamientos", shop: "Mostaza", promo: null, img: "https://images.unsplash.com/photo-1599599810694-b5ac4dd64b4b?q=80&w=400&h=300", description: "Papas fritas con salsa de queso cheddar y tocino." },
  // Postres y Helados
  { name: "Muffin de Chocolate", price: 1020, category: "Postres", shop: "Mostaza", promo: null, img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&h=300", description: "Muffin casero de chocolate oscuro y pepitas de chocolate." },
  { name: "Pie de Manzana", price: 1250, category: "Postres", shop: "Mostaza", promo: null, img: "https://images.unsplash.com/photo-1574509207169-0a74abf67b0a?q=80&w=400&h=300", description: "Pie de manzana casero con canela." },
  { name: "Helado Vanilla", price: 950, category: "Helados", shop: "Mostaza", promo: null, img: "https://images.unsplash.com/photo-1563805042-7684c019e0d0?q=80&w=400&h=300", description: "Helado vainilla cremoso de marca reconocida." },
  // Bebidas
  { name: "Gaseosa Mostaza", price: 680, category: "Bebidas", shop: "Mostaza", promo: null, img: "https://images.unsplash.com/photo-1554866585-acbb2cda89a2?q=80&w=400&h=300", description: "Bebida gaseosa familia Coca-Cola tamaño regular." },

  // ===== BURGER KING =====
  { name: "Whopper", price: 5290, category: "Hamburguesas", shop: "Burger King", promo: "Hot Deal", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&h=300", description: "La famosa hamburguesa Whopper con pan tostado a la llama." },
  { name: "Whopper Doble", price: 6890, category: "Hamburguesas", shop: "Burger King", promo: null, img: "https://images.unsplash.com/photo-1586190203929-d01d8cb3dd3c?q=80&w=400&h=300", description: "Doble Whopper con dos carnes y todos sus ingredientes." },
  { name: "Hamburguesa Simple BK", price: 3490, category: "Hamburguesas", shop: "Burger King", promo: null, img: "https://images.unsplash.com/photo-1571407970349-bc2c40e78b27?q=80&w=400&h=300", description: "Hamburguesa con queso, tomate, lechuga y salsa especial." },
  { name: "King Sandwich", price: 5590, category: "Hamburguesas", shop: "Burger King", promo: "Combo", img: "https://images.unsplash.com/photo-1513639776144-566c11ce6fe7?q=80&w=400&h=300", description: "Sándwich premium con carne de res, bacon y queso cheddar." },
  // Ensaladas y Wraps
  { name: "Ensalada Crispy", price: 4890, category: "Ensaladas", shop: "Burger King", promo: null, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&h=300", description: "Mix de verdes con pollo crujiente, queso y aderezo ranch." },
  { name: "Wrap Pollo", price: 4590, category: "Sandwiches", shop: "Burger King", promo: null, img: "https://images.unsplash.com/photo-1535920527894-b92e5e4d9b3e?q=80&w=400&h=300", description: "Wrap con pechuga de pollo, verduras frescas y salsa picante." },
  // Papas
  { name: "Papas Salted Crispy", price: 2090, category: "Acompañamientos", shop: "Burger King", promo: null, img: "https://images.unsplash.com/photo-1576003325453-b36036805f91?q=80&w=400&h=300", description: "Papas fritas recién hechas con sal marina." },
  { name: "Papas Loaded", price: 3390, category: "Acompañamientos", shop: "Burger King", promo: null, img: "https://images.unsplash.com/photo-1599599810694-b5ac4dd64b4b?q=80&w=400&h=300", description: "Papas con queso, tocino y cebolla morada." },
  // Postres y Helados
  { name: "Pie de Queso BK", price: 1590, category: "Postres", shop: "Burger King", promo: null, img: "https://images.unsplash.com/photo-1587080944657-9e18b29e8eb0?q=80&w=400&h=300", description: "Clásico pie de queso New York style." },
  { name: "Helado Sundae", price: 1890, category: "Helados", shop: "Burger King", promo: null, img: "https://images.unsplash.com/photo-1563805042-7684c019e0d0?q=80&w=400&h=300", description: "Helado vainilla con salsa de chocolate y frutos rojos." },

  // ===== McDONALD'S =====
  { name: "Big Mac", price: 5090, category: "Hamburguesas", shop: "McDonald's", promo: "Favorito", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&h=300", description: "La legendaria Big Mac con dos carnes y salsa especial." },
  { name: "Quarter Pounder", price: 5590, category: "Hamburguesas", shop: "McDonald's", promo: null, img: "https://images.unsplash.com/photo-1513639776144-566c11ce6fe7?q=80&w=400&h=300", description: "Cuarto de libra de carne de res con queso fundido." },
  { name: "McChicken", price: 4190, category: "Hamburguesas", shop: "McDonald's", promo: "Combo", img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=400&h=300", description: "Sándwich de pechuga de pollo crujiente con lechuga." },
  { name: "Hamburguesa Clásica", price: 2890, category: "Hamburguesas", shop: "McDonald's", promo: null, img: "https://images.unsplash.com/photo-1571407970349-bc2c40e78b27?q=80&w=400&h=300", description: "La clásica hamburguesa McDonald's con queso." },
  // McNuggets y Pollo
  { name: "McNuggets 6 piezas", price: 2690, category: "Pollo", shop: "McDonald's", promo: null, img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=400&h=300", description: "6 nuggets dorados y crujientes de pollo." },
  { name: "McNuggets 10 piezas", price: 3990, category: "Pollo", shop: "McDonald's", promo: null, img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=400&h=300", description: "10 nuggets dorados y crujientes de pollo." },
  // Papas
  { name: "Papas Small", price: 1590, category: "Acompañamientos", shop: "McDonald's", promo: null, img: "https://images.unsplash.com/photo-1576003325453-b36036805f91?q=80&w=400&h=300", description: "Porción pequeña de papas fritas." },
  { name: "Papas Large", price: 2390, category: "Acompañamientos", shop: "McDonald's", promo: null, img: "https://images.unsplash.com/photo-1599599810694-b5ac4dd64b4b?q=80&w=400&h=300", description: "Porción grande de papas fritas." },
  // Postres y Helados
  { name: "Apple Pie McFlurry", price: 2090, category: "Helados", shop: "McDonald's", promo: null, img: "https://images.unsplash.com/photo-1563805042-7684c019e0d0?q=80&w=400&h=300", description: "Helado McFlurry con trocitos de pie de manzana." },
  { name: "Choco Fudge Brownie", price: 1890, category: "Postres", shop: "McDonald's", promo: null, img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&h=300", description: "Brownie de chocolate con salsa fudge caliente." },
  { name: "Cookie Chocolate Chip", price: 950, category: "Postres", shop: "McDonald's", promo: null, img: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=400&h=300", description: "Cookie casera con chips de chocolate." },
  { name: "Helado Vainilla McDonald's", price: 1290, category: "Helados", shop: "McDonald's", promo: null, img: "https://images.unsplash.com/photo-1563805042-7684c019e0d0?q=80&w=400&h=300", description: "Helado vainilla cremoso McDonald's." },

  // ===== CARREFOUR ARGENTINA =====
  // Carnes Premium
  { name: "Carne Picada Premium", price: 8990, category: "Carnes", shop: "Carrefour", promo: null, img: "https://images.unsplash.com/photo-1572365992253-3cb3e56dd362?q=80&w=400&h=300", description: "1kg de carne picada especial para milanesas 100% vacuna." },
  { name: "Lomo Fino", price: 14990, category: "Carnes", shop: "Carrefour", promo: "Premium", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&h=300", description: "Lomo fino para asados y grilla, corte de excelencia." },
  { name: "Bife de Chorizo", price: 11990, category: "Carnes", shop: "Carrefour", promo: null, img: "https://images.unsplash.com/photo-1555939594-58d7cb561549?q=80&w=400&h=300", description: "Bife de chorizo para parrilla, carne argentina de primera." },
  { name: "Pollito Entero", price: 5490, category: "Carnes", shop: "Carrefour", promo: null, img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=400&h=300", description: "Pollo apto para asar, 1.5 kg aproximadamente." },
  { name: "Pechuga de Pollo", price: 4590, category: "Carnes", shop: "Carrefour", promo: null, img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=400&h=300", description: "Pechuga de pollo fresca, ideal para dietas." },

  // ===== JUMBO ARGENTINA =====
  { name: "Costilla Vacuna", price: 9890, category: "Carnes", shop: "Jumbo", promo: null, img: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=400&h=300", description: "Costilla vacuna fresca para asados." },
  { name: "Chuletas de Cerdo", price: 6890, category: "Carnes", shop: "Jumbo", promo: null, img: "https://images.unsplash.com/photo-1555939594-58d7cb561549?q=80&w=400&h=300", description: "Chuletas de cerdo premium para parrilla." },
  { name: "Milanesas de Carne", price: 7990, category: "Carnes", shop: "Jumbo", promo: "Hot Deal", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&h=300", description: "Milanesas ya cortadas listas para cocinar." },
  { name: "Pechuga de Pollo Jumbo", price: 4890, category: "Carnes", shop: "Jumbo", promo: null, img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=400&h=300", description: "Pechuga de pollo fresca Jumbo." },

  // ===== COTO ARGENTINA =====
  { name: "Carne para Guiso", price: 7490, category: "Carnes", shop: "Coto", promo: null, img: "https://images.unsplash.com/photo-1572365992253-3cb3e56dd362?q=80&w=400&h=300", description: "Carne para guiso, corte de primera calidad." },
  { name: "Tira de Asado", price: 8990, category: "Carnes", shop: "Coto", promo: null, img: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=400&h=300", description: "Tira de asado fresca, corte patagónico." },
  { name: "Sándwich de Milanesa", price: 6990, category: "Carnes", shop: "Coto", promo: null, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&h=300", description: "Carne lista para armar sándwich de milanesa." },
  { name: "Pechuga Pollo Coto", price: 4290, category: "Carnes", shop: "Coto", promo: null, img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=400&h=300", description: "Pechuga de pollo fresca Coto." },

  // ===== DISCO ARGENTINA =====
  { name: "Carne Magra", price: 8490, category: "Carnes", shop: "Disco", promo: null, img: "https://images.unsplash.com/photo-1572365992253-3cb3e56dd362?q=80&w=400&h=300", description: "Carne magra sin grasas para dietas especiales." },
  { name: "Bife Angosto", price: 10990, category: "Carnes", shop: "Disco", promo: "Premium", img: "https://images.unsplash.com/photo-1555939594-58d7cb561549?q=80&w=400&h=300", description: "Bife angosto para parrillas especiales." },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Conectado para sembrar datos...");
    await Product.deleteMany({}); // Limpia lo que haya
    await Product.insertMany(foods);
    console.log("✅ ¡Marketplace poblado con " + foods.length + " productos reales actualizados!");
    process.exit();
  })
  .catch(err => console.log(err));