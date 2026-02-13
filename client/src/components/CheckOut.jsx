import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

export default function CheckOut({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { cartItems, getTotalPrice, clearCart } = useContext(CartContext);
  
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [deliveryPhone, setDeliveryPhone] = useState(user?.phone || '');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [error, setError] = useState(null);

  // Cargar métodos de pago al abrir
  useEffect(() => {
    if (isOpen && user) {
      fetchPaymentMethods();
    }
  }, [isOpen, user]);

  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/payments/${user._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const methods = await response.json();
      setPaymentMethods(methods);
      
      // Auto-seleccionar el método por defecto
      const defaultMethod = methods.find(m => m.isDefault);
      if (defaultMethod) {
        setSelectedPayment(defaultMethod._id);
      }
    } catch (error) {
      console.error('Error cargando métodos de pago:', error);
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError(null);

    if (!deliveryAddress.trim()) {
      setError('La dirección de entrega es requerida');
      return;
    }

    if (!deliveryPhone.trim()) {
      setError('El teléfono de entrega es requerido');
      return;
    }

    if (!selectedPayment && paymentMethods.length > 0) {
      setError('Selecciona un método de pago');
      return;
    }

    if (cartItems.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const orderData = {
        items: cartItems,
        totalPrice: getTotalPrice(),
        paymentMethod: 'card',
        deliveryAddress,
        deliveryPhone,
        deliveryNotes
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Error al crear la orden');
      }

      const data = await response.json();
      
      // Limpiar carrito
      clearCart();
      
      // Redirigir a página de rastreo
      onClose();
      navigate(`/order-tracking/${data.order._id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const totalPrice = getTotalPrice();
  const deliveryFee = totalPrice > 5000 ? 0 : 500;
  const finalTotal = totalPrice + deliveryFee;

  return (
    <div className="checkout-overlay">
      <div className="checkout-backdrop" onClick={onClose}></div>
      
      <div className="checkout-modal glass-premium fade-up">
        <button className="close-modal" onClick={onClose}>&times;</button>
        
        <header className="checkout-header">
          <h2>Finalizar Compra</h2>
        </header>

        <div className="checkout-content">
          {error && <div className="checkout-error">{error}</div>}

          <form onSubmit={handleSubmitOrder} className="checkout-form">
            {/* Sección de Entrega */}
            <section className="checkout-section">
              <h3 className="section-title">📍 Dirección de Entrega</h3>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Tu dirección completa"
                className="checkout-input"
                required
              />
              <input
                type="tel"
                value={deliveryPhone}
                onChange={(e) => setDeliveryPhone(e.target.value)}
                placeholder="Teléfono de contacto"
                className="checkout-input"
                required
              />
              <textarea
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="Notas especiales para el repartidor (opcional)"
                className="checkout-textarea"
              />
            </section>

            {/* Sección de Pago */}
            {paymentMethods.length > 0 && (
              <section className="checkout-section">
                <h3 className="section-title">💳 Método de Pago</h3>
                <div className="payment-methods">
                  {paymentMethods.map(method => (
                    <label key={method._id} className="payment-option">
                      <input
                        type="radio"
                        name="payment"
                        value={method._id}
                        checked={selectedPayment === method._id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                      />
                      <div className="payment-details">
                        <span className="payment-brand">{method.brand} •••• {method.last4}</span>
                        <span className="payment-exp">{method.expMonth}/{method.expYear}</span>
                        {method.isDefault && <span className="default-badge">Por defecto</span>}
                      </div>
                    </label>
                  ))}
                </div>
              </section>
            )}

            {/* Resumen de Orden */}
            <section className="checkout-section summary-section">
              <h3 className="section-title">📋 Resumen</h3>
              
              <div className="order-items">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">x{item.quantity}</span>
                    </div>
                    <span className="item-price">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="total-line">
                  <span>Subtotal</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="total-line">
                    <span>Envío</span>
                    <span>${deliveryFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="total-line final">
                  <span>Total</span>
                  <span>${finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </section>

            {/* Botón de submit */}
            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              className="btn-checkout-submit"
            >
              {loading ? 'Procesando...' : `Confirmar Orden - $${finalTotal.toLocaleString()}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}