export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-premium glass-top">
      <div className="max-width-container footer-grid">
        
        {/* BLOQUE 1: MARCA Y LEGAL */}
        <div className="footer-section main-info">
          <h2 className="footer-logo">FOODTRUCK<span className="glow-text">S</span></h2>
          <p className="footer-tagline">Experiencias gastronómicas de alto nivel.</p>
          <div className="legal-links">
            <a href="#terms">Términos y condiciones</a>
            <a href="#privacy">Privacidad</a>
            <a href="#cookies">Cookies</a>
          </div>
        </div>

        {/* BLOQUE 2: CONVENIOS Y REDES */}
        <div className="footer-section">
          <h4>Explorar</h4>
          <ul className="footer-links">
            <li><a href="#convenios">Convenios Corporativos</a></li>
            <li><a href="#franquicias">Franquicias</a></li>
            <li><a href="#eventos">Eventos VIP</a></li>
          </ul>
          <div className="social-icons">
            <a href="#" className="social-link">IG</a>
            <a href="#" className="social-link">FB</a>
            <a href="#" className="social-link">X</a>
          </div>
        </div>

        {/* BLOQUE 3: PAGOS */}
        <div className="footer-section payments">
          <h4>Tarjetas Admitidas</h4>
          <div className="payment-grid">
            <span className="pay-card">Visa</span>
            <span className="pay-card">Mastercard</span>
            <span className="pay-card">Mercado Pago</span>
            <span className="pay-card">Naranja</span>
            <span className="pay-card">Cordobesa</span>
          </div>
        </div>
      </div>

      {/* BARRA FINAL */}
      <div className="footer-bottom">
        <div className="max-width-container">
          <p className="copyright">© {year} <span className="ag-studio">Ag Studio</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}