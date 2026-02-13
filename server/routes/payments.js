const express = require('express');
const router = express.Router();
const PaymentMethod = require('../models/PaymentMethod');
const User = require('../models/User');

// Get payment methods for a user
router.get('/:userId', async (req, res) => {
  try {
    const methods = await PaymentMethod.find({ user: req.params.userId }).sort({ isDefault: -1, createdAt: -1 });
    res.json(methods);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching payment methods');
  }
});

// Create new payment method (mock tokenization)
router.post('/', async (req, res) => {
  try {
    const { userId, cardNumber, brand, expMonth, expYear, nameOnCard, isDefault, provider, providerAccountId } = req.body;
    if (!userId) return res.status(400).json({ msg: 'userId required' });

    // For card provider we expect cardNumber. For external providers we may have providerAccountId.
    let last4 = '';
    if (provider === 'card' || !provider) {
      if (!cardNumber) return res.status(400).json({ msg: 'cardNumber required for card provider' });
      const digits = (cardNumber || '').replace(/\s+/g, '');
      last4 = digits.slice(-4);
    }

    const token = 'pm_' + Date.now() + Math.floor(Math.random()*9999);

    if (isDefault) {
      await PaymentMethod.updateMany({ user: userId }, { isDefault: false });
    }

    const pm = new PaymentMethod({ user: userId, brand, provider: provider || 'card', last4, expMonth, expYear, nameOnCard, isDefault: !!isDefault, token, providerAccountId: providerAccountId || '' });
    await pm.save();
    res.json(pm);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating payment method');
  }
});

// Update a payment method
router.patch('/:id', async (req, res) => {
  try {
    const { isDefault, nameOnCard, expMonth, expYear } = req.body;
    const pm = await PaymentMethod.findById(req.params.id);
    if (!pm) return res.status(404).json({ msg: 'Not found' });

    if (isDefault) {
      await PaymentMethod.updateMany({ user: pm.user }, { isDefault: false });
    }

    pm.isDefault = isDefault ?? pm.isDefault;
    if (nameOnCard) pm.nameOnCard = nameOnCard;
    if (expMonth) pm.expMonth = expMonth;
    if (expYear) pm.expYear = expYear;
    await pm.save();
    res.json(pm);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating payment method');
  }
});

// Delete a payment method
router.delete('/:id', async (req, res) => {
  try {
    const pm = await PaymentMethod.findByIdAndDelete(req.params.id);
    if (!pm) return res.status(404).json({ msg: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting payment method');
  }
});

module.exports = router;
