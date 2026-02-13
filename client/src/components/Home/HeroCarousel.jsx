import { useState, useEffect } from "react";

import hero1 from "../../assets/images/hero-car-1.jpg";
import hero2 from "../../assets/images/hero-car-2.jpg";
import hero3 from "../../assets/images/background.jpg";

const slides = [
  { image: hero1, title: "FIND YOUR", highlight: "TRUCK" },
  { image: hero2, title: "CHOOSE YOUR", highlight: "POWER" },
  { image: hero3, title: "DRIVE THE", highlight: "FUTURE" },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-card-right glass">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`carousel-slide-fade ${i === index ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="overlay">
            <h2 className="hero-big-text">
              {slide.title} <br />
              <span className="highlight">{slide.highlight}</span>
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
}
