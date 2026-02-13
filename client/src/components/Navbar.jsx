import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import Cart from "../components/Cart";
import UserMenu from "../components/UserMenu"; // Asegúrate de crear este componente

export default function Navbar() {
  const [showCart, setShowCart] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, user } = useContext(AuthContext);
  const { cart, removeFromCart, getTotalItems } = useContext(CartContext);

  console.log("¿Autenticado?:", isAuthenticated);
  console.log("Datos del Usuario:", user);
  console.log("Carrito:", cart);

  return (
    <nav className="navbar glass-premium">
      <div className="container">
        <Link to="/">
          <div className="logo">FT</div>
        </Link>

        <div className="menu">
          <Link to="/marketplace" className="nav-link">Marketplace</Link>
          
          {isAuthenticated ? (
            <div className="user-nav-container" style={{ position: 'relative' }}>
              <button 
                className="user-avatar-btn" 
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {user?.profilePic ? (
                  <img src={user.profilePic} alt="Avatar" className="nav-avatar-img" />
                ) : (
                  <div className="avatar-placeholder">{user?.name?.charAt(0) || "U"}</div>
                )}
              </button>
              
              {showUserMenu && <UserMenu close={() => setShowUserMenu(false)} />}
            </div>
          ) : (
            <Link to="/login" className="nav-link btn-login-nav"> Ingresar </Link>
          )}

          <button 
            onClick={() => setShowCart(true)} 
            className="cart-icon-btn"
            aria-label="Abrir carrito"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span className="cart-badge">{getTotalItems()}</span>
          </button>
        </div>
      </div>

      <Cart 
        isOpen={showCart} 
        onClose={() => setShowCart(false)} 
        items={cart}
        onRemoveItem={removeFromCart}
      />
    </nav>
  );
}