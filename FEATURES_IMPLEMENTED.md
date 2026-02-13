# FoodTracks - Sistema de Entrega de Comida

## ✨ Características Implementadas en Esta Sesión

### 1. **Sistema de Reseñas y Calificaciones** ⭐
- **Modelo Review**: Sistema completo de reseñas con:
  - Calificación de 1-5 estrellas
  - Comentarios y títulos personalizados
  - Contador de "útil" para otras personas
  - Vinculación con órdenes

- **Componentes de UI**:
  - `ReviewCard.jsx`: Muestra reseñas de forma elegante
  - `ReviewForm.jsx`: Formulario con validación de caracteres
  - Integración en modal de productos

- **Endpoints API**:
  - `POST /api/reviews` - Crear reseña
  - `GET /api/reviews/product/:productId` - Obtener reseñas del producto
  - `GET /api/reviews/user/:userId` - Obtener reseñas del usuario
  - `PATCH /api/reviews/:reviewId` - Actualizar reseña
  - `DELETE /api/reviews/:reviewId` - Eliminar reseña
  - `POST /api/reviews/:reviewId/helpful` - Marcar como útil

### 2. **Sistema de Gestión de Órdenes** 📦
- **Modelo Order**: Estructura completa de órdenes con:
  - Detalles de ítems, precios y totales
  - Estados de entrega (pending → accepted → pickup → in_transit → delivered)
  - Información de repartidor asignado
  - Ubicación en tiempo real con geolocalización
  - Tiempo estimado de entrega

- **Endpoints API**:
  - `POST /api/orders` - Crear orden (con validación de items)
  - `GET /api/orders/user/:userId` - Obtener órdenes del usuario
  - `GET /api/orders/:orderId` - Detalles completos de orden
  - `GET /api/orders/:orderId/tracking` - Info de rastreo en tiempo real
  - `PATCH /api/orders/:orderId/status` - Actualizar estado
  - `PATCH /api/orders/:orderId/location` - Actualizar ubicación del repartidor

- **Simulación de Entregas**:
  - Asignación automática de repartidor (Rappi o PedidosYa)
  - Actualización de ubicación cada 10 segundos
  - Progresión de estados automática (pickup → in_transit → delivered)
  - Generación de perfiles de repartidor realistas

### 3. **Página de Rastreamiento de Órdenes** 🗺️
- **Componente OrderTracking** (`/order-tracking/:orderId`):
  - Estado visual con 5 pasos (pending, accepted, pickup, in_transit, delivered)
  - Barra de progreso interactiva
  - Tarjeta con información del repartidor:
    - Nombre, teléfono, rating
    - Medio de transporte (moto/auto)
    - Proveedor (Rappi/PedidosYa)
    - Botón para llamar repartidor
  
  - Mapa simulado con:
    - Ubicación actual del repartidor
    - Marcador de origen y destino
    - Coordenadas GPS en tiempo real
    - Animaciones de movimiento

  - Resumen de orden con detalles de:
    - Ítems pedidos
    - Totales y detalles de pago
    - Dirección de entrega
    - Notas especiales

  - Actualización cada 5 segundos

### 4. **Checkout Mejorado** 💳
- **Componente CheckOut Rediseñado**:
  - Integración con contexto de carrito (CartContext)
  - Auto-prefill con datos del usuario (dirección, teléfono)
  - Integración con métodos de pago guardados:
    - Auto-seleccionar método por defecto
    - Listar todas las tarjetas guardadas
    - Mostrar últimos 4 dígitos y fechas
  
  - Funcionalidades:
    - Campo de dirección de entrega editable
    - Campo de teléfono
    - Notas especiales para repartidor
    - Resumen de ítems del carrito
    - Cálculo automático de envío ($500 gratis si es >$5000)
    - Validación de campos requeridos
    - Crear orden y redirigir a rastreamiento

### 5. **Integración de Productos con Ratings** ⭐
- **Actualización de Modelo Product**:
  - Campo `averageRating` (0-5)
  - Campo `reviewCount` (cantidad de reseñas)
  - Array de referencias a reseñas

- **Actualización de Endpoints**:
  - `GET /api/products` - Incluye rating en respuesta
  - GET `/api/products/:id` - Populate de reseñas completas
  - Filtros de búsqueda en productos

- **UI de Productos**:
  - Mostrar estrellas en tarjetas de producto
  - Rating promedio en card
  - Contador de reseñas
  - Descuentos visuales en cards

### 6. **Estilos CSS Mejorados** 🎨
- Estilos para componentes de reviews:
  - `.review-card`, `.review-form-container`
  - `.stars-small`, `.stars-large`
  - Validación con errores destacados
  - Contador de caracteres

- Estilos para checkout:
  - Modal glassmorphism
  - Selección de métodos de pago
  - Resumen de orden interactivo
  - Estados disabled/loading

- Estilos para tracking:
  - Barra de progreso animada
  - Tarjetas de estado con colores
  - Mapa simulado responsivo
  - Grid adaptivo para diferentes tamaños
  - Animaciones fade-in y bounce

## 📂 Estructura de Archivos Nuevos/Modificados

### Backend
```
server/
├── models/
│   ├── Order.js (NUEVO)
│   ├── Review.js (EXISTENTE - verificado)
│   └── Product.js (MODIFICADO - agregar ratings)
├── routes/
│   ├── orders.js (REEMPLAZADO - implementación completa)
│   ├── reviews.js (NUEVO)
│   └── products.js (MODIFICADO - filtros y populate)
└── server.js (MODIFICADO - agregar rutas)
```

### Frontend
```
client/src/
├── pages/
│   ├── MarketPlace.jsx (MODIFICADO - integrar reviews y CheckOut)
│   └── OrderTracking.jsx (NUEVO - rastreamiento)
├── components/
│   ├── ReviewCard.jsx (NUEVO)
│   ├── ReviewForm.jsx (NUEVO)
│   ├── CheckOut.jsx (REEMPLAZADO - versión mejorada)
│   └── ProductCard.jsx (MODIFICADO - mostrar ratings)
├── context/
│   └── CartContext.jsx (EXISTENTE - funciona perfecto)
├── styles/
│   └── style.css (MODIFICADO - +500 líneas de estilos nuevos)
└── App.jsx (MODIFICADO - agregar ruta OrderTracking)
```

## 🚀 Cómo Usar

### 1. Ver Productos y Reseñas
- Ir a `/marketplace`
- Ver tarjetas de productos con ratings
- Hacer click en producto para ver modal con:
  - Todas las reseñas
  - Formulario para agregar reseña (si estás logged)
  - Escala de 5 estrellas

### 2. Comprar y Procesar Orden
- Agregar productos al carrito
- Ir a checkout
- Seleccionar método de pago guardado
- Ingresar dirección de entrega
- Confirmar orden
- Automáticamente redirige a rastreamiento

### 3. Rastrear Orden
- Ver progreso en tiempo real
- Información del repartidor
- Ubicación GPS simulada
- Poder llamar al repartidor
- Resumen de compra

## 🔌 Endpoints Nuevos

### Reviews
```
POST   /api/reviews
GET    /api/reviews/product/:productId
GET    /api/reviews/user/:userId
PATCH  /api/reviews/:reviewId
DELETE /api/reviews/:reviewId
POST   /api/reviews/:reviewId/helpful
```

### Orders
```
POST   /api/orders
GET    /api/orders/user/:userId
GET    /api/orders/:orderId
GET    /api/orders/:orderId/tracking
PATCH  /api/orders/:orderId/status
PATCH  /api/orders/:orderId/location
```

## 📊 Datos Simulados

### Repartidores Asignados
- Proveedor: Rappi o PedidosYa (random)
- Vehículo: Moto o Auto (random)
- Rating: 3.0 a 5.0 estrellas
- Ubicación: Buenos Aires centro (simulado)

### Estados de Orden
1. **Pending** (⏳) - Esperando aceptación
2. **Accepted** (✅) - Repartidor asignado
3. **Pickup** (📦) - Recogiendo el pedido
4. **In Transit** (🚗) - En camino
5. **Delivered** (🎉) - Entregado
6. **Cancelled** (❌) - Cancelado

## ⚠️ Notas Importantes

1. **Ubicación en Tiempo Real**: Simulada con cambios pequeños cada 10s
2. **Métodos de Pago**: Funciona con métodos guardados del dashboard
3. **Validación de Órdenes**: Verifica cantidades y precios contra DB
4. **Auto-Prefill**: Toma dirección y teléfono del perfil del usuario
5. **Reseñas**: Un usuario solo puede reseñar un producto una vez

## 🎯 Próximas Características Sugeridas

1. **Chatbot de Soporte**
   - Integración con ChatGPT
   - FAQ automático
   - Búsqueda de órdenes

2. **Historial de Órdenes**
   - Dashboard de órdenes pasadas
   - Re-ordenar favoritos
   - Estadísticas

3. **Sistema de Pagos Real**
   - Integración Stripe/MercadoPago
   - Webhooks de confirmación
   - Recibos por email

4. **Notificaciones**
   - Push notif en cambios de estado
   - Email de confirmación
   - SMS de entrega

5. **Modo Admin**
   - Dashboard de órdenes
   - Asignación manual de repartidores
   - Estadísticas de ventas

## 💻 Tecnologías Usadas

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación

**Frontend:**
- React 18
- React Router
- Context API
- Vite

**Estilos:**
- CSS puro
- Glassmorphism
- Animaciones CSS3

---

**Desarrollado con ❤️ para FoodTracks**
