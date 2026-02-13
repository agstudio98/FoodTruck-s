const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// POST /api/reviews - Crear una nueva reseña
router.post('/', auth, async (req, res) => {
  try {
    const { product, order, rating, title, comment } = req.body;

    // Validar datos
    if (!product || !rating) {
      return res.status(400).json({ msg: 'Producto y calificación requeridos' });
    }

    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return res.status(400).json({ msg: 'La calificación debe ser entre 1 y 5' });
    }

    // Verificar que el producto existe
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    // Verificar si el usuario ya reseñó este producto
    const existingReview = await Review.findOne({
      user: req.user.id,
      product
    });

    if (existingReview) {
      return res.status(400).json({ msg: 'Ya has reseñado este producto' });
    }

    // Crear reseña
    const review = new Review({
      user: req.user.id,
      product,
      order: order || null,
      rating: parseInt(rating),
      title: title || `${rating} de 5 estrellas`,
      comment: comment || '',
      helpfulCount: 0
    });

    await review.save();

    // Actualizar las reseñas agregadas en el producto
    await updateProductRating(product);

    res.json({ msg: 'Reseña creada exitosamente', review });
  } catch (error) {
    console.error('Error al crear reseña:', error);
    res.status(500).json({ msg: 'Error al crear la reseña' });
  }
});

// GET /api/reviews/product/:productId - Obtener todas las reseñas de un producto
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name profilePic')
      .sort({ createdAt: -1 });

    if (reviews.length === 0) {
      return res.json({
        reviews: [],
        averageRating: 0,
        totalReviews: 0
      });
    }

    // Calcular promedio de calificaciones
    const averageRating = (
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    ).toFixed(1);

    res.json({
      reviews,
      averageRating: parseFloat(averageRating),
      totalReviews: reviews.length
    });
  } catch (error) {
    console.error('Error al obtener reseñas del producto:', error);
    res.status(500).json({ msg: 'Error al obtener las reseñas' });
  }
});

// GET /api/reviews/user/:userId - Obtener reseñas del usuario
router.get('/user/:userId', auth, async (req, res) => {
  try {
    // Permitir ver sus propias reseñas o si es admin
    if (req.user.id !== req.params.userId && !req.user.isAdmin) {
      return res.status(403).json({ msg: 'No autorizado' });
    }

    const reviews = await Review.find({ user: req.params.userId })
      .populate('product', 'name img shop')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Error al obtener reseñas del usuario:', error);
    res.status(500).json({ msg: 'Error al obtener las reseñas' });
  }
});

// PATCH /api/reviews/:reviewId - Actualizar una reseña
router.patch('/:reviewId', auth, async (req, res) => {
  try {
    const { rating, title, comment } = req.body;

    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ msg: 'Reseña no encontrada' });
    }

    // Verificar que el usuario es el dueño
    if (req.user.id !== review.user.toString()) {
      return res.status(403).json({ msg: 'No autorizado' });
    }

    // Validar nuevos datos
    if (rating && (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
      return res.status(400).json({ msg: 'La calificación debe ser entre 1 y 5' });
    }

    // Guardar rating anterior para actualizar el promedio del producto
    const oldRating = review.rating;

    // Actualizar campos
    if (rating) review.rating = parseInt(rating);
    if (title) review.title = title;
    if (comment) review.comment = comment;
    review.updatedAt = new Date();

    await review.save();

    // Actualizar promedio si cambió el rating
    if (oldRating !== review.rating) {
      await updateProductRating(review.product);
    }

    res.json({ msg: 'Reseña actualizada exitosamente', review });
  } catch (error) {
    console.error('Error al actualizar reseña:', error);
    res.status(500).json({ msg: 'Error al actualizar la reseña' });
  }
});

// DELETE /api/reviews/:reviewId - Eliminar una reseña
router.delete('/:reviewId', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ msg: 'Reseña no encontrada' });
    }

    // Verificar que el usuario es el dueño o admin
    if (req.user.id !== review.user.toString() && !req.user.isAdmin) {
      return res.status(403).json({ msg: 'No autorizado' });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.reviewId);

    // Actualizar promedio del producto
    await updateProductRating(productId);

    res.json({ msg: 'Reseña eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar reseña:', error);
    res.status(500).json({ msg: 'Error al eliminar la reseña' });
  }
});

// POST /api/reviews/:reviewId/helpful - Marcar reseña como útil
router.post('/:reviewId/helpful', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ msg: 'Reseña no encontrada' });
    }

    res.json({ msg: 'Voto registrado', review });
  } catch (error) {
    console.error('Error al marcar como útil:', error);
    res.status(500).json({ msg: 'Error al registrar el voto' });
  }
});

// Función auxiliar para actualizar rating del producto
async function updateProductRating(productId) {
  try {
    const reviews = await Review.find({ product: productId });

    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(productId, {
        averageRating: 0,
        reviewCount: 0,
        totalReviews: []
      });
      return;
    }

    const averageRating = (
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    ).toFixed(1);

    await Product.findByIdAndUpdate(productId, {
      averageRating: parseFloat(averageRating),
      reviewCount: reviews.length,
      totalReviews: reviews.map(r => r._id)
    });
  } catch (error) {
    console.error('Error actualizando rating del producto:', error);
  }
}

module.exports = router;
