const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    // Quitamos 'required: true' para permitir el login social
    required: false 
  },
  googleId: { 
    type: String, 
    default: null 
  },
  name: { 
    type: String 
  },
  phone: { type: String, default: '' },
  profilePic: { type: String, default: '' },
  address: { type: String, default: '' },
  tokens: [
    {
      token: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String, default: '' },
  modoAccount: { type: String, default: '' },
  mercadoAccount: { type: String, default: '' },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', UserSchema);