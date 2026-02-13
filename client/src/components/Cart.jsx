import React from 'react';

export default function Cart({ isOpen, onClose, items = [], onRemoveItem }) {
  // Calculamos el total basado en los items reales recibidos por props
  const total = items.reduce((acc, item) => acc + item.price, 0);

  if (!isOpen) return null;

  return (
    <div className="cart-component-overlay">
      <div className="cart-backdrop" onClick={onClose}></div>
      
      <aside className="cart-ios-drawer">
        <div className="cart-header-ios">
          <div className="header-info">
            <h2>Pedido <span className="text-accent">Actual</span></h2>
            <p>{items.length} {items.length === 1 ? 'producto seleccionado' : 'productos seleccionados'}</p>
          </div>
          <button className="close-ios-btn" onClick={onClose}>✕</button>
        </div>

        <div className="cart-scroll-area">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div key={item.cartId || index} className="cart-item-ios">
                <img src={item.img} alt={item.name} />
                <div className="item-meta">
                  <h4>{item.name}</h4>
                  <p className="shop-name">{item.shop}</p>
                  <span className="price">${item.price.toLocaleString()}</span>
                </div>
                <button 
                  className="remove-item-btn" 
                  title="Eliminar"
                  onClick={() => onRemoveItem(item.cartId)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <div className="empty-cart-msg">
              <p>Tu carrito está vacío</p>
            </div>
          )}
        </div>

        <div className="cart-footer-ios">
          <div className="total-split">
            <span>Total a pagar</span>
            <span className="amount">${total.toLocaleString()}</span>
          </div>
          <button 
            className="btn-apple-pay" 
            disabled={items.length === 0}
            onClick={() => alert("Redirigiendo al pago...")}
          >
            Continuar al pago
          </button>
        </div>
      </aside>
    </div>
  );
}