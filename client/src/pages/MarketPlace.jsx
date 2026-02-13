import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import CheckOut from "../components/CheckOut";
import ReviewForm from "../components/ReviewForm";
import ReviewCard from "../components/ReviewCard";

export default function Marketplace() {
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  // --- Estados de Datos y UI ---
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [precio, setPrecio] = useState(50000);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(null);

  // --- Cargar datos desde el Backend ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setFoods(data);
        setLoading(false);
      } catch (error) {
        console.error("Error conectando al servidor:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- Lógica del Carrito (Protegida) ---
  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para agregar productos al carrito 🛡️");
      return navigate("/login");
    }
    addToCart(product);
    alert(`${product.name} agregado al carrito 🛒`);
  };

  // --- Cargar Reviews del Producto ---
  const fetchProductReviews = async (productId) => {
    try {
      setLoadingReviews(true);
      const response = await fetch(`http://localhost:5000/api/reviews/product/${productId}`);
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error cargando reviews:", error);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  // --- Manejar click en producto para mostrar detalles y reviews ---
  const handleShowDetails = (product) => {
    setSelectedProduct(product);
    fetchProductReviews(product._id);
  };

  // --- Enviar Nueva Reseña ---
  const handleSubmitReview = async (reviewData) => {
    try {
      setSubmittingReview(true);
      setReviewSuccess(null);

      const token = localStorage.getItem('token');
      if (!token) {
        alert("Debes iniciar sesión para dejar una reseña");
        return navigate("/login");
      }

      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Error al enviar la reseña');
      }

      const data = await response.json();
      setReviewSuccess('¡Reseña enviada exitosamente!');
      
      // Recargar reviews
      await fetchProductReviews(selectedProduct._id);

      setTimeout(() => setReviewSuccess(null), 3000);
    } catch (error) {
      console.error('Error enviando reseña:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setSubmittingReview(false);
    }
  };

  // --- Control del Checkout (Protegido) ---
  const handleOpenCheckout = () => {
    if (!isAuthenticated) {
      alert("Para realizar una compra, por favor ingresa a tu cuenta 🔑");
      return navigate("/login");
    }
    if (cartItems.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }
    setIsCheckoutOpen(true);
  };

  // --- Lógica de Filtrado ---
  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = food.price <= precio;
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(food.category);
    return matchesSearch && matchesPrice && matchesCategory;
  });

  const categories = ["Hamburguesas", "Ensaladas", "Carnes", "Postres", "Helados", "Pizzas", "Sushi", "Tacos", "Vegano", "Bebidas"];
  const visibleCategories = isExpanded ? categories : categories.slice(0, 5);

  const handleCategoryChange = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="marketplace-page">
      <header className="market-hero">
        <div className="max-width-container">
          <h1 className="market-hero-title">
            FOODTRUCK <span className="glow-text-white">MARKET</span>
          </h1>
          <div className="search-wrapper glass-premium">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Busca tu comida favorita..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn-search-main">Buscar</button>
          </div>
        </div>
      </header>

      <div className="max-width-container market-layout">
        {/* SIDEBAR DE FILTROS */}
        <aside className="filters-sidebar glass">
          <h2 className="filter-main-title">Filtros</h2>
          <div className="filter-group">
            <h4>Categoría</h4>
            <div className="filter-options">
              {visibleCategories.map(cat => (
                <label key={cat} className="check-container fade-in">
                  {cat}
                  <input 
                    type="checkbox" 
                    onChange={() => handleCategoryChange(cat)}
                    checked={selectedCategories.includes(cat)}
                  />
                  <span className="checkmark"></span>
                </label>
              ))}
            </div>
            <button className="btn-expand" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Ver menos" : "Ver más categorías +"}
            </button>
          </div>

          <div className="filter-group">
            <h4>Rango de Precio</h4>
            <input 
              type="range" 
              min="0" 
              max="50000" 
              value={precio} 
              onChange={(e) => setPrecio(e.target.value)} 
              className="price-slider" 
            />
            <div className="price-labels">
              <span>$0</span>
              <span className="current-price">${Number(precio).toLocaleString()}</span>
            </div>
          </div>
        </aside>

        {/* GRILLA DE PRODUCTOS */}
        <main className="products-grid-container">
          {loading ? (
            <div className="loading-msg">Cargando delicias...</div>
          ) : (
            <div className="products-grid">
              {filteredFoods.map(food => (
                <div key={food._id || food.id} className="product-card glass-hover" onClick={() => handleShowDetails(food)}>
                  <div className="product-img-wrapper">
                    <img src={food.img} alt={food.name} />
                    {food.promo && <span className="promo-badge">{food.promo}</span>}
                  </div>
                  <div className="product-info">
                    <p className="shop-name">{food.shop}</p>
                    <h3 className="product-title">{food.name}</h3>
                    {food.averageRating > 0 && (
                      <div className="product-rating">
                        <span className="stars">{'★'.repeat(Math.round(food.averageRating))}</span>
                        <span className="rating-value">{food.averageRating.toFixed(1)}</span>
                      </div>
                    )}
                    <div className="price-row">
                      <span className="price">${food.price.toLocaleString()}</span>
                      <button 
                        className="add-cart-btn" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleAddToCart(food); 
                        }}
                      >+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MODAL DE DETALLE */}
      {selectedProduct && !isCheckoutOpen && (
        <div className="detail-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="detail-modal glass-premium fade-up detail-modal-expanded" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedProduct(null)}>&times;</button>
            
            <div className="detail-grid">
              <div className="detail-image">
                <img src={selectedProduct.img} alt={selectedProduct.name} />
              </div>
              <div className="detail-info">
                <span className="detail-category">{selectedProduct.category}</span>
                <h2 className="detail-name">{selectedProduct.name}</h2>
                <p className="detail-shop-name">por {selectedProduct.shop}</p>
                <p className="detail-desc">{selectedProduct.description}</p>
                
                {selectedProduct.averageRating > 0 && (
                  <div className="detail-rating-section">
                    <div className="stars-large">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`star ${i < Math.round(selectedProduct.averageRating) ? 'filled' : ''}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="rating-info">
                      {selectedProduct.averageRating.toFixed(1)} de 5 ({selectedProduct.reviewCount} reseñas)
                    </span>
                  </div>
                )}

                <h3 className="detail-price-big">${selectedProduct.price.toLocaleString()}</h3>
                
                <div className="detail-actions">
                  <button className="btn-buy-now" onClick={handleOpenCheckout}>
                    Comprar Ahora
                  </button>
                  <button 
                    className="btn-add-cart-detail glass" 
                    onClick={() => handleAddToCart(selectedProduct)}
                  >
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            </div>

            {/* SECCIÓN DE REVIEWS */}
            <div className="reviews-section">
              <div className="reviews-container">
                <h3 className="reviews-title">Reseñas de Clientes</h3>
                
                {isAuthenticated && (
                  <div className="review-form-wrapper">
                    {reviewSuccess && (
                      <div className="success-message">{reviewSuccess}</div>
                    )}
                    <ReviewForm 
                      productId={selectedProduct._id}
                      onSubmit={handleSubmitReview}
                      loading={submittingReview}
                    />
                  </div>
                )}

                {!isAuthenticated && (
                  <div className="auth-message">
                    <p>Inicia sesión para dejar una reseña</p>
                    <button 
                      className="btn-login-review"
                      onClick={() => navigate('/login')}
                    >
                      Ir a Login
                    </button>
                  </div>
                )}

                <div className="reviews-list">
                  {loadingReviews ? (
                    <p className="loading-reviews">Cargando reseñas...</p>
                  ) : reviews.length === 0 ? (
                    <p className="no-reviews">No hay reseñas aún. ¡Sé el primero!</p>
                  ) : (
                    reviews.map(review => (
                      <ReviewCard key={review._id} review={review} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPONENTE CHECKOUT */}
      <CheckOut 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
}