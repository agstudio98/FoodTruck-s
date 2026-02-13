import React, { useState, useRef, useEffect } from 'react';

const SupportBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! 👋 Soy el asistente de FoodTracks. ¿Cómo puedo ayudarte hoy?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const FAQ = {
    'hola': {
      response: '¡Hola! Bienvenido a FoodTracks. Puedo ayudarte con:\n• 📍 Estado de tu orden\n• 💳 Métodos de pago\n• ⭐ Dejar reseñas\n• 🚚 Rastreamiento\n\n¿Cuál es tu pregunta?'
    },
    'estado': {
      response: 'Para ver el estado de tu orden, ve a "Mis Órdenes" en tu dashboard o usa el número de orden que recibiste. 📦'
    },
    'rastreamiento': {
      response: 'Puedes rastrear tu orden en tiempo real desde la página de detalles. Verás:\n✅ Estado actual\n🚗 Ubicación del repartidor\n📍 Hora estimada de entrega\n📞 Teléfono del repartidor'
    },
    'pago': {
      response: 'Aceptamos:\n💳 Tarjetas de crédito/débito\n💰 Efectivo en entrega\n🏪 MercadoPago\n💸 MODO\n\nPuedes guardar tus métodos en tu perfil. 💪'
    },
    'entrega': {
      response: 'Entregamos en:\n🌍 Buenos Aires zona centro\n⏱️ Tiempo estimado 30-60 minutos\n📞 Puedes llamar al repartidor cuando quieras\n💬 Dejar notas especiales al ordenar'
    },
    'reseña': {
      response: 'Para dejar una reseña:\n1️⃣ Ve al detalle del producto\n2️⃣ Haz click en "Dejar una reseña"\n3️⃣ Califica de 1-5 estrellas\n4️⃣ Escribe tu comentario\n5️⃣ ¡Envía!\n\n⭐ Ayudas a otros usuarios!'
    },
    'problema': {
      response: 'Siento que tengas un problema 😞\n\nPuedo ayudarte con:\n• Orden no llega\n• Producto incorrecto\n• Problema de pago\n• Otra cosa\n\nCuéntame qué pasó específicamente.'
    },
    'horario': {
      response: '⏰ Nuestro horario:\n• Lunes a Viernes: 11:00 - 23:00\n• Sábado: 12:00 - 23:00\n• Domingo: 12:00 - 22:00\n\n¡Estamos abiertos para ti!'
    },
    'contacto': {
      response: '📞 Contacto:\n• WhatsApp: +54 9 123 456 7890\n• Email: soporte@foodtracks.com\n• Chat: Disponible 24/7\n\n¡Responderemos rápido!'
    },
    'ofertas': {
      response: '🎉 Ofertas actuales:\n• Primera orden: 15% OFF\n• Compra >$5000: Envío gratis\n• Reseña dejada: +20 puntos\n• Refiere un amigo: Descuento doble\n\n¡No te las pierdas!'
    },
    'seguir': {
      response: 'Perfecto, sigue estos pasos:\n1. Ve al marketplace\n2. Agrega productos a tu carrito\n3. Confirma en checkout\n4. ¡Tu orden está en camino! 🚀'
    }
  };

  const getResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Búsqueda de palabras clave
    for (const [key, value] of Object.entries(FAQ)) {
      if (lowerMessage.includes(key)) {
        return value.response;
      }
    }

    // Respuesta por defecto
    return 'No entendí bien tu pregunta 🤔\n\nPuedo ayudarte con:\n• Estado de orden\n• Métodos de pago\n• Rastramiento\n• Horarios\n• Reseñas\n\n¿Preguntame algo de esto?';
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simular delay de respuesta
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getResponse(input),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setLoading(false);
    }, 800);
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        className="chatbot-floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Soporte"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="chatbot-window glass-premium">
          <div className="chatbot-header">
            <h3>FoodTracks Support</h3>
            <p className="status">Activo ahora ✅</p>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message ${msg.sender}`}
              >
                <div className="message-content">
                  {msg.text.split('\n').map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            ))}
            {loading && (
              <div className="chat-message bot">
                <div className="message-content typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              className="chatbot-input"
              disabled={loading}
            />
            <button type="submit" className="chatbot-send-btn" disabled={loading}>
              {loading ? '...' : '→'}
            </button>
          </form>

          <div className="chatbot-suggestions">
            <button
              className="suggestion-btn"
              onClick={() => {
                setInput('Cómo rastrear mi orden');
                handleSendMessage({ preventDefault: () => {} });
              }}
            >
              Rastramiento
            </button>
            <button
              className="suggestion-btn"
              onClick={() => {
                setInput('Métodos de pago');
                handleSendMessage({ preventDefault: () => {} });
              }}
            >
              Pagos
            </button>
            <button
              className="suggestion-btn"
              onClick={() => {
                setInput('Horarios');
                handleSendMessage({ preventDefault: () => {} });
              }}
            >
              Horario
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SupportBot;
