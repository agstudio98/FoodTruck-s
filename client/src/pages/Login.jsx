import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validatePassword = (pass) => {
    const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
    return regex.test(pass);
  };

  // --- LÓGICA PARA REDES SOCIALES (Solo Google) ---
  const handleSocialLogin = () => {
    // Redirección directa al endpoint de Google en el backend
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!email.trim() || !password.trim()) {
      setMessage({ text: "Llene todos los campos", type: "error" });
      return;
    }

    if (!isLogin && !validatePassword(password)) {
      setMessage({ 
        text: "La contraseña requiere: Mayúscula, Número y Especial (mín. 6 carac.)", 
        type: "error" 
      });
      return;
    }

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          login(data.token, data.user);
          navigate("/marketplace");
        } else {
          setMessage({ text: "¡Cuenta creada! Inicia sesión ahora.", type: "success" });
          setIsLogin(true);
          setPassword("");
        }
      } else {
        if (response.status === 404) setMessage({ text: "Usuario no encontrado", type: "error" });
        else if (response.status === 401) setMessage({ text: "Usuario o contraseña incorrectos", type: "error" });
        else setMessage({ text: data.msg || "Error en la autenticación", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Error de conexión con el servidor", type: "error" });
    }
  };

  return (
    <div className="view-section login-page">
      <form className="login-container glass-premium fade-in" onSubmit={handleSubmit}>
        <div className="login-header">
          <h2 className="premium-title"><span className="glow-text">FoodTruck's</span></h2>
          <p className="subtitle">
            {isLogin ? "Ingresa a tu cuenta exclusiva" : "Crea tu membresía VIP"}
          </p>
        </div>

        {message.text && (
          <div className={`auth-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="form-content">
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button type="submit" className="btn-main-vip">
            {isLogin ? "Iniciar Sesión" : "Crear Membresía"}
          </button>

          <div className="divider"><span>O continuar con</span></div>
          
          <div className="social-group">
            <button 
              type="button" 
              className="btn-social glass full-width" 
              onClick={handleSocialLogin}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" />
              Continuar con Google
            </button>
          </div>
        </div>

        <div className="login-footer">
          <p>
            {isLogin ? "¿No tienes cuenta?" : "¿Ya eres miembro?"}
            <button 
              type="button" 
              className="text-btn" 
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage({ text: "", type: "" });
                setPassword("");
              }}
            >
              {isLogin ? "Regístrate ahora" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </form>

      <style>{`
        .auth-message { padding: 10px; margin-bottom: 15px; border-radius: 8px; text-align: center; font-size: 0.9rem; animation: fadeIn 0.3s ease; z-index: 10; }
        .auth-message.error { background: rgba(255, 0, 0, 0.15); color: #ff4d4d; border: 1px solid rgba(255, 0, 0, 0.3); }
        .auth-message.success { background: rgba(0, 255, 0, 0.1); color: #2ecc71; border: 1px solid rgba(0, 255, 0, 0.3); }
        .divider { display: flex; align-items: center; margin: 20px 0; color: #888; font-size: 0.8rem; }
        .divider::before, .divider::after { content: ""; flex: 1; height: 1px; background: #444; margin: 0 10px; }
        .social-group { display: flex; justify-content: center; }
        .btn-social { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 12px; border-radius: 8px; cursor: pointer; transition: 0.3s; color: white; border: 1px solid #444; background: rgba(255,255,255,0.05); width: 100%; }
        .btn-social:hover { background: rgba(255,255,255,0.1); border-color: #666; transform: translateY(-2px); }
        .btn-social img { width: 20px; }
      `}</style>
    </div>
  );
}