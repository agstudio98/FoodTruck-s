import { useState } from "react";

export default function SupportChat() {
  const [mensaje, setMensaje] = useState("");
  const [chatLog, setChatLog] = useState([]); // Empieza vacío

  const handleSend = () => {
    if (!mensaje.trim()) return;
    
    // Añadir mensaje del usuario
    const nuevoChat = [...chatLog, { role: "user", text: mensaje }];
    setChatLog(nuevoChat);
    setMensaje("");

    // Simulación de respuesta IA tras un breve delay
    setTimeout(() => {
      setChatLog(prev => [...prev, { 
        role: "ai", 
        text: "Procesando tu solicitud VIP... ¿En qué más puedo asistirte?" 
      }]);
    }, 1000);
  };

  return (
    <div className="view-section chat-page">
      <div className="max-width-container chat-container glass-premium">
        
        {/* HEADER LIMPIO */}
        <div className="chat-header">
          <div className="header-info">
            <h3 className="premium-title"> Soporte <span className="glow-text"> FoodTruck's </span></h3>
            <div className="status-container">
              <span className="pulse-dot"></span>
              <p className="status-text">Disponible 24/7</p>
            </div>
          </div>
        </div>

        {/* VENTANA DE CHAT */}
        <div className="chat-window">
          {chatLog.length === 0 ? (
            <div className="empty-state">
              <div className="welcome-icon"> :) </div>
              <h2>¿Cómo podemos ayudarte hoy?</h2>
              <p>Inicia una conversación con nuestra Inteligencia Artificial.</p>
            </div>
          ) : (
            chatLog.map((chat, i) => (
              <div key={i} className={`msg-wrapper ${chat.role}`}>
                <div className={`msg ${chat.role === 'ai' ? 'glass-msg' : 'user-msg'}`}>
                  {chat.text}
                </div>
              </div>
            ))
          )}
        </div>

        {/* INPUT ESTILO MINIMALISTA */}
        <div className="chat-input-area">
          <div className="input-wrapper glass">
            <input 
              type="text" 
              placeholder="Escribe tu consulta..." 
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="btn-send-vip" onClick={handleSend} disabled={!mensaje}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 19V5M12 5L5 12M12 5L19 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}