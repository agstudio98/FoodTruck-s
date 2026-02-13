import HeroCarousel from "./HeroCarousel";
export default function Hero() {
  return (
    <section className="view-section">
      <div className="max-width-container">
        <div className="hero-wrapper">

          <div className="hero-card-left glass">
            <span className="step-indicator"> Bienvenido/a. </span>
            <h1 className="hero-title">FoodTrucks.</h1>
            <p className="hero-description">
              Indexamos los mejores pedidos, para vos.
            </p>
          </div>

          <HeroCarousel />


        </div>
      </div>
    </section>
  );
}