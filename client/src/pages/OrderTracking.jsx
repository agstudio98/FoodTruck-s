import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateInterval, setUpdateInterval] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
    
    // Actualizar cada 5 segundos
    const interval = setInterval(fetchOrderDetails, 5000);
    setUpdateInterval(interval);

    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Orden no encontrada');
      }

      const data = await response.json();
      setOrder(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { label: 'Pendiente', icon: '⏳', color: '#6b7280' },
      accepted: { label: 'Aceptado', icon: '✅', color: '#3b82f6' },
      pickup: { label: 'Recogiendo', icon: '📦', color: '#f59e0b' },
      in_transit: { label: 'En camino', icon: '🚗', color: '#ec4899' },
      delivered: { label: 'Entregado', icon: '🎉', color: '#22c55e' },
      cancelled: { label: 'Cancelado', icon: '❌', color: '#ef4444' }
    };
    return statusMap[status] || statusMap.pending;
  };

  const statusOrder = ['pending', 'accepted', 'pickup', 'in_transit', 'delivered'];
  const currentStatusIndex = statusOrder.indexOf(order?.deliveryStatus || 'pending');

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateProgress = () => {
    return ((currentStatusIndex + 1) / statusOrder.length) * 100;
  };

  if (loading) {
    return (
      <div className="order-tracking-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando detalles de tu orden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-tracking-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn-back" onClick={() => navigate('/marketplace')}>
            Volver al Marketplace
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-tracking-page">
        <div className="not-found-container">
          <h2>Orden no encontrada</h2>
          <button className="btn-back" onClick={() => navigate('/marketplace')}>
            Volver al Marketplace
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = getStatusInfo(order.deliveryStatus);

  return (
    <div className="order-tracking-page">
      <div className="max-width-container">
        <header className="tracking-header">
          <h1>Rastreo de Orden #{order._id.slice(-8)}</h1>
          <p className="order-date">Creada: {formatDate(order.createdAt)}</p>
        </header>

        <div className="tracking-grid">
          {/* TARJETA DE ESTADO */}
          <div className="status-card glass-premium">
            <div className="status-header">
              <div className="status-icon" style={{ color: currentStatus.color }}>
                {currentStatus.icon}
              </div>
              <div className="status-info">
                <h2 className="status-label">{currentStatus.label}</h2>
                <p className="status-time">
                  {order.deliveryStatus === 'delivered' 
                    ? 'Tu orden fue entregada'
                    : `Tiempo estimado: ${new Date(order.estimatedDeliveryTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`
                  }
                </p>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="progress-section">
              <div className="progress-bar-container">
                <div 
                  className="progress-fill" 
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>

              <div className="status-steps">
                {statusOrder.map((status, idx) => {
                  const isActive = idx <= currentStatusIndex;
                  const statusInfo = getStatusInfo(status);
                  
                  return (
                    <div 
                      key={status} 
                      className={`status-step ${isActive ? 'active' : ''}`}
                    >
                      <div className="step-dot" style={{ backgroundColor: isActive ? statusInfo.color : '#e5e7eb' }}>
                        {isActive ? statusInfo.icon : '○'}
                      </div>
                      <p className="step-label">{statusInfo.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TARJETA DE REPARTIDOR */}
          {order.deliveryPerson && (
            <div className="delivery-person-card glass-premium">
              <h3>Tu Repartidor</h3>
              <div className="driver-info">
                <div className="driver-badge">
                  {order.deliveryPerson.vehicle === 'Moto' ? '🏍️' : '🚗'}
                </div>
                <div className="driver-details">
                  <h4>{order.deliveryPerson.name}</h4>
                  <p className="driver-provider">
                    {order.deliveryProvider === 'rappi' ? '🍔 Rappi' : '📱 PedidosYa'}
                  </p>
                  <div className="driver-rating">
                    {'⭐'.repeat(Math.round(order.deliveryPerson.rating))}
                    <span className="rating-value">{order.deliveryPerson.rating}</span>
                  </div>
                </div>
              </div>
              <a href={`tel:${order.deliveryPerson.phone}`} className="btn-call-driver">
                📞 Llamar Repartidor
              </a>
            </div>
          )}

          {/* MAPA (Simulado) */}
          {order.currentLocation && (
            <div className="map-card glass-premium">
              <h3>Ubicación en Tiempo Real</h3>
              <div className="map-container">
                <div className="map-placeholder">
                  <div className="origin-marker">📍 Tu ubicación</div>
                  <div className="delivery-marker">🚗 {order.deliveryPerson?.name}</div>
                  <div className="destination-marker">🏠 {order.deliveryAddress}</div>
                  <p className="map-info">
                    Coordenadas: {order.currentLocation.latitude.toFixed(4)}, 
                    {order.currentLocation.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* RESUMEN DE ORDEN */}
          <div className="order-summary-card glass-premium">
            <h3>Resumen de Orden</h3>
            
            <div className="order-items">
              {order.items.map((item, idx) => (
                <div key={idx} className="summary-item">
                  <div className="item-left">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">x{item.quantity}</span>
                  </div>
                  <span className="item-total">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-line">
                <span>Subtotal</span>
                <span>${order.totalPrice.toLocaleString()}</span>
              </div>
              <div className="total-line final">
                <span>Total</span>
                <span>${order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* DETALLES DE ENTREGA */}
          <div className="delivery-details-card glass-premium">
            <h3>Detalles de Entrega</h3>
            
            <div className="detail-row">
              <span className="label">Dirección</span>
              <span className="value">{order.deliveryAddress}</span>
            </div>
            
            <div className="detail-row">
              <span className="label">Teléfono</span>
              <span className="value">{order.deliveryPhone}</span>
            </div>

            {order.deliveryNotes && (
              <div className="detail-row">
                <span className="label">Notas</span>
                <span className="value">{order.deliveryNotes}</span>
              </div>
            )}

            <div className="detail-row">
              <span className="label">Hora estimada</span>
              <span className="value">{formatDate(order.estimatedDeliveryTime)}</span>
            </div>
          </div>
        </div>

        <footer className="tracking-footer">
          <button className="btn-back-to-market" onClick={() => navigate('/marketplace')}>
            ← Volver al Marketplace
          </button>
          {order.deliveryStatus === 'delivered' && (
            <button className="btn-rate-order" onClick={() => navigate('/marketplace')}>
              ⭐ Dejar Reseña
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
