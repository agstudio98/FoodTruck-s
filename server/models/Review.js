const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null }, // opcional: vinculado a una orden
  rating: { type: Number, min: 1, max: 5, required: true }, // 1-5 estrellas
  title: { type: String, default: '' }, // ej: "Excelente producto"
  comment: { type: String, required: true }, // Comentario
  helpfulCount: { type: Number, default: 0 }, // Votos "útil"
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);
