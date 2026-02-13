export default function Showcase() {
  const trucks = [...Array(8)]; // Generamos 8 espacios
  return (
    <section className="view-section" style={{ flexDirection: 'column' }}>
      <div className="max-width-container">
        <div className="showcase-header">
          <h2>Selección Premium</h2>
          <div className="yellow-line"></div>
        </div>
        <div className="product-matrix">
          {trucks.map((_, i) => (
            <div key={i} className="premium-card glass">
              <div className="img-wrapper"></div>
              <div className="info-area">
                <h3 className="card-title">Urban Grill Co.</h3>
                <p className="card-desc">Carne madurada y carbón vegetal.</p>
                <div className="card-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                  <span className="price-tag">$18</span>
                  <button className="btn-premium">Explorar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}