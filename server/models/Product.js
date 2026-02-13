const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  shop: String,
  promo: String,
  img: String,
  description: String,
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  totalReviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);