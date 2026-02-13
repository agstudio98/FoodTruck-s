const mongoose = require('mongoose');

const PaymentMethodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brand: { type: String },
  provider: { type: String, default: 'card' }, // card | modo | mercadopago
  last4: { type: String },
  expMonth: { type: Number },
  expYear: { type: Number },
  nameOnCard: { type: String },
  isDefault: { type: Boolean, default: false },
  token: { type: String }, // mock token/id for identifying method
  providerAccountId: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);
