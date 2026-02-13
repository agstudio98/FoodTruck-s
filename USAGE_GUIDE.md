# 🎉 FoodTracks - Guía Completa de Nuevas Características

## 📋 Tabla de Contenidos
1. [Sistema de Reseñas](#reseñas)
2. [Gestión de Órdenes](#órdenes)
3. [Rastreamiento](#rastreamiento)
4. [Checkout Mejorado](#checkout)
5. [Chatbot de Soporte](#chatbot)
6. [Ejemplos de Uso](#ejemplos)

---

## ⭐ Sistema de Reseñas {#reseñas}

### ¿Qué es?
Sistema completo para que los usuarios dejen calificaciones y comentarios en productos.

### Cómo Usar
1. **Ver Reseñas**:
   - Ve a `/marketplace`
   - Haz click en cualquier producto
   - Verás todas las reseñas en el modal
   - Rating promedio con estrellas
   - Contador de reseñas totales

2. **Dejar una Reseña** (si estás logged):
   - En el modal del producto → "Deja tu reseña"
   - Selecciona calificación (1-5 estrellas)
   - Opcionalmente escribe un título
   - Escribe tu comentario (10-500 caracteres)
   - Click en "Enviar Reseña"

3. **Características**:
   - ⭐ Calificación visible en cards de productos
   - 👤 Nombre y foto del usuario que reseña
   - 📅 Fecha relativa de la reseña
   - 👍 Marcar como "útil" para ayudar otros
   - ✏️ Editar tu propia reseña
   - 🗑️ Eliminar tu reseña

### Endpoints API
```bash
# Crear reseña
POST /api/reviews
Headers: Authorization: Bearer {token}
Body: { product, rating, title, comment }

# Ver reseñas de producto
GET /api/reviews/product/{productId}

# Ver mis reseñas
GET /api/reviews/user/{userId}
Headers: Authorization: Bearer {token}
```

---

## 📦 Sistema de Gestión de Órdenes {#órdenes}

### ¿Qué es?
Crea, gestiona y rastrean órdenes de entregas con asignación automática de repartidores.

### Cómo Crear una Orden

1. **Agregar Productos**:
   - Ve a `/marketplace`
   - Haz click en "+" en cada producto para agregar al carrito
   - O haz click en el producto → "Agregar al Carrito"

2. **Ir a Checkout**:
   - Click en icono 🛒 en la Navbar
   - Verás resumen de tu carrito
   - Click en "Comprar Ahora" o "Confirmar Orden"

3. **Completar Compra**:
   - Se abre modal de checkout
   - Dirección de entrega (auto-prefilled de tu perfil)
   - Teléfono de contacto
   - Notas especiales para repartidor
   - Selecciona método de pago guardado
   - Click en "Confirmar Orden"

### Datos de Orden
```javascript
{
  user: ObjectId,           // ID del usuario
  items: [{                 // Productos
    product: ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    shop: String
  }],
  totalPrice: Number,
  paymentMethod: String,    // card, cash, mercadopago, modo
  deliveryAddress: String,  // Donde entregar
  deliveryPhone: String,    // Teléfono contacto
  deliveryNotes: String,    // Instrucciones (opcional)
  
  // Estado y seguimiento
  deliveryStatus: String,   // pending, accepted, pickup, in_transit, delivered
  deliveryProvider: String, // rappi, pedidosya
  deliveryPerson: {         // Datos del repartidor
    id: String,
    name: String,
    phone: String,
    vehicle: String,        // Moto o Auto
    rating: Number          // 3.0-5.0
  },
  currentLocation: {        // GPS en tiempo real
    latitude: Number,
    longitude: Number,
    updatedAt: Date
  },
  estimatedDeliveryTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Estados de Orden
```
Pending (⏳) → Accepted (✅) → Pickup (📦) → In Transit (🚗) → Delivered (🎉)
```

### Endpoints API
```bash
# Crear orden
POST /api/orders
Headers: Authorization: Bearer {token}
Body: { items, totalPrice, paymentMethod, deliveryAddress, deliveryPhone, deliveryNotes }

# Ver mis órdenes
GET /api/orders/user/{userId}
Headers: Authorization: Bearer {token}

# Ver detalles de una orden
GET /api/orders/{orderId}
Headers: Authorization: Bearer {token}

# Ver rastreamiento
GET /api/orders/{orderId}/tracking
(sin autenticación - cualquiera puede rastrear)

# Actualizar estado (admin)
PATCH /api/orders/{orderId}/status
Body: { status: "pending|accepted|pickup|in_transit|delivered|cancelled" }
```

---

## 🗺️ Rastreamiento en Tiempo Real {#rastreamiento}

### ¿Qué es?
Página dedicada para rastrear órdenes en tiempo real con ubicación del repartidor.

### Cómo Acceder
1. **Manual**:
   - URL: `/order-tracking/{orderId}`
   - Ejemplo: `/order-tracking/507f1f77bcf86cd799439011`

2. **Automático**:
   - Después de confirmar una orden
   - Eres redirigido automáticamente

### Información Mostrada

**Status Progress** 📊
- Barra de progreso visual
- 5 pasos: Pending → Accepted → Pickup → In Transit → Delivered
- Icono y color para cada estado

**Tarjeta Repartidor** 🚗
- 👤 Nombre del repartidor
- ⭐ Rating (3.0-5.0 estrellas)
- 📱 Proveedor (Rappi o PedidosYa)
- 🏍️/🚗 Tipo de vehículo
- 📞 Botón para llamar

**Mapa Simulado** 🗺️
- 📍 Tu ubicación (origen)
- 🚗 Ubicación del repartidor (se actualiza)
- 🏠 Dirección de entrega (destino)
- 🔄 Se actualiza cada 5 segundos

**Resumen de Orden** 📋
- Lista de ítems: nombre, cantidad, precio
- Subtotal y Total
- Dirección de entrega
- Teléfono
- Notas especiales

### Simulación de Entregas
- Los repartidores se asignan automáticamente
- Ubicación cambia cada 10 segundos
- Estados progresan: pickup → in_transit → delivered
- Duración total: ~3 minutos

---

## 💳 Checkout Mejorado {#checkout}

### Características Nuevas

**Auto Prefill** 📝
- Dirección desde tu perfil (editable)
- Teléfono desde tu perfil (editable)
- Nunca pierdes información

**Métodos de Pago** 💳
- Muestra todos tus tarjetas guardadas
- Auto-selecciona la por defecto
- Ver últimos 4 dígitos y vencimiento
- Badge "Por defecto" en método actual

**Resumen Dinámico** 📊
- Lista todos los ítems del carrito
- Calcula subtotal
- Agrega envío ($500 si es <$5000, gratis si es >$5000)
- Total final destacado

**Validación Completa** ✅
- Requiere dirección de entrega
- Requiere teléfono
- Requiere método de pago
- Calcula totales vs precios en DB

**Flujo Completo**
1. Confirmar orden crea documento en DB
2. Asigna repartidor automáticamente (2s después)
3. Limpia carrito
4. Redirige a rastreamiento

---

## 🤖 Chatbot de Soporte {#chatbot}

### ¿Qué es?
Asistente virtual 24/7 para preguntas frecuentes.

### Cómo Usar

1. **Abrir Chat**:
   - Click en botón 💬 en esquina inferior derecha
   - Se abre ventana de chat

2. **Hacer Preguntas**:
   - Escribe tu pregunta
   - Click en "→" o presiona Enter
   - Recibe respuesta instantáneamente

3. **Sugerencias Rápidas**:
   - Click en botones de sugerencias
   - Rastreamiento, Pagos, Horario

### Preguntas Soportadas
```
• "hola" → Introducción y opciones
• "rastreamiento" → Cómo rastrear orden
• "pago" / "métodos de pago" → Opciones de pago
• "entrega" / "envío" → Información de entregas
• "reseña" / "comentario" → Cómo dejar reseña
• "problema" / "ayuda" → Para problemas
• "horario" → Horarios de atención
• "contacto" / "whatsapp" → Información de contacto
• "ofertas" / "descuento" → Promociones
```

### Características
- 🤖 Respuestas automáticas basadas en FAQ
- 📱 Interfaz flotante y responsive
- ⌨️ Incluye sugerencias rápidas
- ⏰ Timestamp de cada mensaje
- 💬 Indicador de "escribiendo..."

---

## 🎯 Ejemplos de Uso {#ejemplos}

### Ejemplo 1: Compra Completa
```
1. Login en /login
2. Ve a /marketplace
3. Haz click en producto "Hamburguesa Clásica"
4. Lee reseñas en el modal
5. Click en "+" para agregar al carrito
6. Click en 🛒 Navbar
7. Click "Confirmar Orden"
8. Completa dirección y teléfono
9. Selecciona tarjeta guardada
10. Click "Confirmar Orden"
11. Automáticamente ves /order-tracking/{orderId}
12. Espera 3 minutos hasta que se complete

Total: ~5 minutos
```

### Ejemplo 2: Dejar una Reseña
```
1. Ve a /marketplace
2. Haz click en producto
3. En el modal → "Deja tu reseña"
4. Selecciona 5 estrellas ⭐⭐⭐⭐⭐
5. Escribe: "Excelente hamburguesa, muy recomendado"
6. Click "Enviar Reseña"
7. La reseña aparece instantáneamente
8. Otros usuarios ven tu info y pueden marcar como útil
```

### Ejemplo 3: Usar el Chatbot
```
1. Click en botón 💬 esquina derecha
2. Se abre chat
3. Escribe: "¿Cómo se rastrean los pedidos?"
4. Recibe instrucciones completas
5. Click en sugerencia "Rastreamiento"
6. Recibe más detalles
7. Close el chat con X
```

### Ejemplo 4: Rastrear Orden
```
URL directa: http://localhost:5173/order-tracking/507f1f77bcf86cd799439011

O después de comprar:
1. Completas checkout
2. Eres redirigido automáticamente
3. Ves progreso visual
4. Datos del repartidor
5. Mapa simulado que se actualiza
6. Puedes llamar al repartidor desde aquí
```

---

## 🔧 Notas Técnicas

### Simulación de Repartidores
- Asignados automáticamente 2s después de crear orden
- Random entre Rappi y PedidosYa
- Rating entre 3.0 y 5.0 estrellas
- Ubicación inicial: Buenos Aires centro (simulado)
- Movimiento en mapa cada 10 segundos

### Ubicación GPS
- Latitud: -34.6 ± 0.1 (Buenos Aires)
- Longitud: -58.4 ± 0.1 (Buenos Aires)
- Se actualiza cada 10 segundos
- Puedes enviar ubicación real desde API

### Validaciones
- Productos verificados contra DB antes de crear orden
- Precios calculados vs precios en DB
- Solo usuarios autenticados pueden crear órdenes
- Solo propietario puede ver detalles de su orden

### Auto-Prefill Checkout
- Toma `address` y `phone` del user profile
- Editable en el formulario
- No afecta perfil si cambias en checkout
- Guarda en orden creada

---

## 📞 Soporte Rápido

**¿Duda?** Usa el chatbot 💬
- Click en botón inferior derecho
- Pregunta lo que necesites
- Respuestas instantáneas

**¿Error?** Verifica:
1. ¿Estás logged? (Ir a /login)
2. ¿Tu carrito no está vacío?
3. ¿Tu dirección está completa?
4. ¿Tienes método de pago guardado?

---

**Enjoy FoodTracks! 🍔🚀**
