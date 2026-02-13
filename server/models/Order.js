const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number,
      shop: String
    }
  ],
  totalPrice: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['card', 'cash', 'mercadopago', 'modo'], 
    default: 'card' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'confirmed', 'failed'], 
    default: 'pending' 
  },
  deliveryAddress: { type: String, required: true },
  deliveryPhone: { type: String, required: true },
  deliveryNotes: { type: String, default: '' },
  
  // Repartidor
  deliveryStatus: { 
    type: String, 
    enum: ['pending', 'accepted', 'pickup', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryProvider: { type: String, enum: ['rappi', 'pedidosya', 'manual'], default: null },
  deliveryPerson: {
    id: String,
    name: String,
    phone: String,
    vehicle: String,
    rating: Number
  },
  
  // Geolocalización
  currentLocation: {
    latitude: Number,
    longitude: Number,
    updatedAt: Date
  },
  estimatedDeliveryTime: Date,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
