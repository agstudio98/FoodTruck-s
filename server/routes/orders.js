const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// POST /api/orders - Crear una nueva orden
router.post('/', auth, async (req, res) => {
  try {
    const { items, totalPrice, paymentMethod, deliveryAddress, deliveryPhone, deliveryNotes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ msg: 'El carrito está vacío' });
    }

    if (!deliveryAddress || !deliveryPhone) {
      return res.status(400).json({ msg: 'Dirección y teléfono de entrega requeridos' });
    }

    // Validar items y obtener detalles del producto
    const orderItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ msg: `Producto ${item.product} no encontrado` });
      }

      const itemPrice = product.price * item.quantity;
      calculatedTotal += itemPrice;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        shop: product.shop
      });
    }

    // Validar total
    if (Math.abs(calculatedTotal - totalPrice) > 1) {
      return res.status(400).json({ msg: 'El total no coincide con los ítems' });
    }

    // Calcular tiempo de entrega estimado (30-60 minutos)
    const estimatedDeliveryTime = new Date();
    estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + Math.floor(Math.random() * 30) + 30);

    // Crear orden
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      totalPrice,
      paymentMethod: paymentMethod || 'card',
      deliveryAddress,
      deliveryPhone,
      deliveryNotes,
      estimatedDeliveryTime,
      deliveryStatus: 'pending'
    });

    await order.save();

    // Asignar repartidor simulado (2 segundos después)
    setTimeout(() => {
      assignDeliveryPerson(order._id);
    }, 2000);

    res.json({ msg: 'Orden creada exitosamente', order });
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ msg: 'Error al crear la orden' });
  }
});

// GET /api/orders/user/:userId - Obtener órdenes del usuario
router.get('/user/:userId', auth, async (req, res) => {
  try {
    // Permitir ver sus propias órdenes o si es admin
    if (req.user.id !== req.params.userId && !req.user.isAdmin) {
      return res.status(403).json({ msg: 'No autorizado' });
    }

    const orders = await Order.find({ user: req.params.userId })
      .populate('items.product', 'name img category')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ msg: 'Error al obtener las órdenes' });
  }
});

// GET /api/orders/:orderId - Obtener detalles de una orden
router.get('/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('user', 'name phone email')
      .populate('items.product', 'name img price category shop');

    if (!order) {
      return res.status(404).json({ msg: 'Orden no encontrada' });
    }

    // Verificar permiso
    if (req.user.id !== order.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ msg: 'No autorizado' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error al obtener orden:', error);
    res.status(500).json({ msg: 'Error al obtener la orden' });
  }
});

// GET /api/orders/:orderId/tracking - Obtener información de rastreo
router.get('/:orderId/tracking', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).select(
      'deliveryStatus deliveryPerson currentLocation estimatedDeliveryTime deliveryAddress'
    );

    if (!order) {
      return res.status(404).json({ msg: 'Orden no encontrada' });
    }

    res.json({
      orderId: order._id,
      status: order.deliveryStatus,
      deliveryPerson: order.deliveryPerson,
      currentLocation: order.currentLocation,
      estimatedDeliveryTime: order.estimatedDeliveryTime,
      deliveryAddress: order.deliveryAddress
    });
  } catch (error) {
    console.error('Error al obtener tracking:', error);
    res.status(500).json({ msg: 'Error al obtener información de rastreo' });
  }
});

// PATCH /api/orders/:orderId/status - Actualizar estado de la orden
router.patch('/:orderId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'accepted', 'pickup', 'in_transit', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ msg: 'Estado inválido' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { 
        deliveryStatus: status,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ msg: 'Orden no encontrada' });
    }

    res.json({ msg: 'Estado actualizado', order });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ msg: 'Error al actualizar el estado' });
  }
});

// PATCH /api/orders/:orderId/location - Actualizar ubicación del repartidor
router.patch('/:orderId/location', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ msg: 'Coordenadas requeridas' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      {
        currentLocation: {
          latitude,
          longitude,
          updatedAt: new Date()
        },
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ msg: 'Orden no encontrada' });
    }

    res.json({ msg: 'Ubicación actualizada', order });
  } catch (error) {
    console.error('Error al actualizar ubicación:', error);
    res.status(500).json({ msg: 'Error al actualizar ubicación' });
  }
});

// Función para asignar repartidor simulado
async function assignDeliveryPerson(orderId) {
  try {
    const providers = ['rappi', 'pedidosya'];
    const provider = providers[Math.floor(Math.random() * providers.length)];
    const isMoto = Math.random() > 0.5;

    const deliveryPerson = {
      id: `DP${Date.now()}`,
      name: `Repartidor ${provider} ${Math.floor(Math.random() * 1000)}`,
      phone: `+54 9 123 456${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      vehicle: isMoto ? 'Moto' : 'Auto',
      rating: (Math.random() * 2 + 3).toFixed(1) // 3.0 - 5.0
    };

    // Ubicación inicial aleatoria en Buenos Aires (centro)
    const randomLat = -34.6 + (Math.random() - 0.5) * 0.1;
    const randomLon = -58.4 + (Math.random() - 0.5) * 0.1;

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        deliveryProvider: provider,
        deliveryPerson,
        currentLocation: {
          latitude: randomLat,
          longitude: randomLon,
          updatedAt: new Date()
        },
        deliveryStatus: 'accepted',
        updatedAt: new Date()
      },
      { new: true }
    );

    // Simular actualización de ubicación cada 10 segundos
    simulateLocationUpdates(orderId);
  } catch (error) {
    console.error('Error asignando repartidor:', error);
  }
}

// Función para simular movimiento del repartidor
function simulateLocationUpdates(orderId) {
  let updateCount = 0;
  const maxUpdates = 18; // 3 minutos (18 * 10 segundos)

  const locationInterval = setInterval(async () => {
    try {
      const order = await Order.findById(orderId).select('deliveryStatus currentLocation');

      if (!order || order.deliveryStatus === 'delivered' || order.deliveryStatus === 'cancelled') {
        clearInterval(locationInterval);
        return;
      }

      // Crear movimiento pequeño hacia destino (simular entrega)
      const newLat = order.currentLocation.latitude + (Math.random() - 0.5) * 0.01;
      const newLon = order.currentLocation.longitude + (Math.random() - 0.5) * 0.01;

      const newStatus = updateCount < 5 ? 'pickup' : updateCount < 15 ? 'in_transit' : 'delivered';

      await Order.findByIdAndUpdate(orderId, {
        currentLocation: {
          latitude: newLat,
          longitude: newLon,
          updatedAt: new Date()
        },
        deliveryStatus: newStatus,
        updatedAt: new Date()
      });

      updateCount++;
      if (updateCount >= maxUpdates) {
        clearInterval(locationInterval);
      }
    } catch (error) {
      console.error('Error actualizando ubicación:', error);
      clearInterval(locationInterval);
    }
  }, 10000); // Actualizar cada 10 segundos
}

module.exports = router;