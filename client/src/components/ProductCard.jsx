import React from 'react';

const ProductCard = ({ product, onAddCart, onShowDetails }) => {
  const renderStars = (rating) => {
    return (
      <div className="stars-small">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`star ${i < Math.round(rating) ? 'filled' : ''}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const promo = product.promo ? parseInt(product.promo) : 0;
  const discountedPrice = promo > 0 ? product.price * (1 - promo / 100) : product.price;

  return (
    <div className="premium-card glass">
      <div className="img-wrapper">
        <img src={product.img} alt={product.name} className="product-img" />
        {promo > 0 && <div className="discount-badge">{promo}% OFF</div>}
      </div>

      <div className="info-area">
        <h3 className="card-title">{product.name}</h3>
        
        {product.averageRating > 0 && (
          <div className="rating-section">
            {renderStars(product.averageRating)}
            <span className="rating-count">
              {product.averageRating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}

        <p className="card-shop">{product.shop}</p>

        <div className="price-section">
          {promo > 0 ? (
            <>
              <span className="original-price">${product.price.toFixed(0)}</span>
              <span className="price-tag">${discountedPrice.toFixed(0)}</span>
            </>
          ) : (
            <span className="price-tag">${product.price.toFixed(0)}</span>
          )}
        </div>

        <div className="card-actions">
          <button className="btn-details" onClick={() => onShowDetails(product)}>
            Ver Details
          </button>
          <button className="btn-add-cart" onClick={() => onAddCart(product)}>
            🛒 Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;