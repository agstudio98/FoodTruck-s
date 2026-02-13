const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');

// --- REGISTRO (Crear Membresía Manual) ---
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "Este usuario ya existe" });

    user = new User({ email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    res.json({ msg: "Usuario creado con éxito", user: userResponse });
  } catch (err) {
    res.status(500).send("Error al registrar usuario");
  }
});

// --- LOGIN (Iniciar Sesión Manual) ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Usuario o contraseña incorrectos" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const userResponse = user.toObject();
    delete userResponse.password;
    res.json({ token, user: userResponse });
  } catch (err) {
    res.status(500).send("Error en el servidor");
  }
});

// --- RUTAS DE GOOGLE OAUTH ---

// 1. Iniciar autenticación
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2. Callback de Google
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
  (req, res) => {
    // Al tener éxito, passport guarda al usuario en req.user
    // Generar JWT
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const userResponse = req.user.toObject();
    delete userResponse.password;
    
    // Pasar token y user como query params
    const userStr = encodeURIComponent(JSON.stringify(userResponse));
    res.redirect(`http://localhost:5173/marketplace?token=${token}&user=${userStr}`);
  }
);

// --- ACTUALIZAR PERFIL DE USUARIO ---
router.patch('/update', async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ msg: 'id required' });

    // Sólo permitir campos seguros para actualizar desde este endpoint
    const allowed = ['name', 'phone', 'profilePic', 'address', 'twoFactorEnabled', 'twoFactorSecret', 'modoAccount', 'mercadoAccount'];
    const updateData = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) updateData[key] = req.body[key];
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ msg: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al actualizar el perfil' });
  }
});

// --- CAMBIAR CONTRASEÑA ---
router.post('/change-password', async (req, res) => {
  try {
    const { id, currentPassword, newPassword } = req.body;
    if (!id || !newPassword) return res.status(400).json({ msg: 'Invalid' });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (user.password) {
      const isMatch = await bcrypt.compare(currentPassword || '', user.password);
      if (!isMatch) return res.status(401).json({ msg: 'Current password incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error changing password');
  }
});

// --- TOKENS (API tokens / security tokens) ---
router.post('/token', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ msg: 'userId required' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const token = 'tk_' + Date.now() + Math.floor(Math.random()*9000 + 1000);
    user.tokens.push({ token });
    await user.save();
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating token');
  }
});

router.delete('/token/:userId/:token', async (req, res) => {
  try {
    const { userId, token } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    user.tokens = user.tokens.filter(t => t.token !== token);
    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting token');
  }
});

// --- OBTENER USUARIO (sin password) ---
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching user');
  }
});

module.exports = router;
