const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session'); // Necesario para Passport
require('dotenv').config();

const app = express();

// 1. Middlewares básicos
// Allow larger payloads (profile images as data URIs)
app.use(express.json({ limit: '5mb' }));
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));

// 2. Configuración de Sesión (Importante para OAuth)
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}));

// 3. Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// 4. Importar configuración de Passport
require('./config/passport')(passport);

// Serialización de usuario para la sesión
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const User = require('./models/User');
  User.findById(id).then(user => done(null, user));
});

// 5. Conexión a DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a FoodTracks DB"))
  .catch(err => console.log("❌ Error DB:", err));

// 6. Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));