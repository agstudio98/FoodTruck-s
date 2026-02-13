import React, { useState } from 'react';

export default function Categories() {
  const [selectedCat, setSelectedCat] = useState(null);

  const cats = [
    { 
      name: "Promociones", 
      accent: "accent-yellow", 
      img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80",
      info: "Aprovecha nuestro 2x1 en toda la línea de accesorios y tecnología. Renueva tu equipo hoy mismo con los mejores precios del mercado." 
    },
    { 
      name: "Beneficios", 
      accent: "accent-green", 
      img: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=800&q=80",
      info: "Por ser cliente Gold, tienes envíos gratis ilimitados y acceso anticipado a nuestras colecciones cápsula de cada temporada." 
    },
    { 
      name: "Ofertas", 
      accent: "accent-red", 
      img: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80",
      info: "Liquidación total: hasta 70% de descuento en productos seleccionados de la categoría Hogar y Decoración. ¡Solo hasta agotar stock!" 
    },
    { 
      name: "Premios", 
      accent: "accent-blue", 
      img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
      info: "Cada compra mayor a $50 participa automáticamente en el sorteo mensual de un set de productos premium valorado en $500." 
    },
  ];

  return (
    <section className="view-section">
      <div className="max-width-container">
        <div className="category-grid-system">
          {cats.map((cat, i) => (
            <div
              key={i}
              className={`category-block glass category-fade ${cat.accent}`}
              onClick={() => setSelectedCat(cat)}
            >
              <h3 className="category-title">{cat.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL CENTRADO */}
      {selectedCat && (
        <div className="modal-overlay" onClick={() => setSelectedCat(null)}>
          <div 
            className={`modal-content-large glass ${selectedCat.accent}`} 
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={() => setSelectedCat(null)}>&times;</button>
            
            <div className="modal-image-container">
              <img src={selectedCat.img} alt={selectedCat.name} className="modal-featured-img" />
            </div>

            <div className="modal-body">
              <h2 className="category-title-large">{selectedCat.name}</h2>
              <div className="accent-line"></div>
              <p className="modal-description">{selectedCat.info}</p>
              <button className="modal-action-btn">Obtener ahora</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}