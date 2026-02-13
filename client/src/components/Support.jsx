import { useNavigate } from 'react-router-dom';

export default function Support() {
  const navigate = useNavigate();

  return (
    <div 
      className="soporte-float-wrapper"
      onClick={() => navigate('/SupportChat')}
    >
      <div className="soporte-float glass-vip">
        <div className="soporte-content">
          <div className="soporte-icon-container">
            <svg viewBox="0 0 24 24" className="icon-svg">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.8 8.5 8.5 0 0 1 7.6 10.8L22 20.5l-2.1-2.1z" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="online-indicator"></span>
          </div>
          <span className="soporte-text"> Nuestro Soporte </span>
        </div>
      </div>
    </div>
  );
}