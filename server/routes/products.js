const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products - Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;

    let filter = {};

    // Filtro por categoría
    if (category) {
      filter.category = category;
    }

    // Filtro por rango de precio
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Búsqueda por nombre o descripción
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter)
      .populate('totalReviews', 'rating')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
});

// GET /api/products/:id - Obtener un producto específico con sus reseñas
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('totalReviews');

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ message: "Error al obtener el producto" });
  }
});

module.exports = router;