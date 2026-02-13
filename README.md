# 🍔 FoodTracks - Sistema de Entrega de Comida

Una plataforma moderna de e-commerce para entrega de comida con rastreamiento en tiempo real, sistema de reseñas y chatbot de soporte.

## 🚀 Características

✨ **Sistema de Autenticación**
- Login/Registro con email y contraseña
- Google OAuth
- JWT tokens
- 2FA (campos preparados)

⭐ **Reseñas y Calificaciones**
- Sistema completo de reviews
- Rating de 1-5 estrellas
- Comentarios y títulos personalizados
- Votación de utilidad

📦 **Gestión de Órdenes**
- Crear órdenes desde carrito
- Validación de inventario
- Métodos de pago guardados
- Auto-prefill de datos

🗺️ **Rastreamiento en Tiempo Real**
- Estado de entrega progresivo
- Ubicación GPS del repartidor
- Información del repartidor
- Estimado de entrega

🤖 **Chatbot de Soporte**
- Chat flotante 24/7
- Respuestas automáticas
- Sugerencias rápidas
- FAQ integrado

💳 **Métodos de Pago**
- Tarjetas de crédito/débito
- Soporte para múltiples proveedores
- Guardar métodos
- Pago seguro

## 📋 Requisitos

- Node.js 16+
- npm o yarn
- MongoDB 4.0+
- Git

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/foodtracks.git
cd foodtracks
```

### 2. Configurar Backend

```bash
cd server
npm install
```

Crear archivo `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/foodtracks
JWT_SECRET=tu_clave_secreta_super_segura_aqui
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

### 3. Configurar Frontend

```bash
cd ../client
npm install
```

### 4. Iniciar aplicación

**Terminal 1 - Backend:**
```bash
cd server
npm start
# o para desarrollo con node-dev:
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

**Terminal 3 - Seed BD (opcional):**
```bash
cd server
node seed.js
```

## 📍 URLs

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **API Docs:** http://localhost:5000/api

## 🗄️ Base de Datos

### Configurar MongoDB

**Opción 1: MongoDB Local**
```bash
# Instalar MongoDB
# En Ubuntu/Debian
sudo apt-get install mongodb

# Iniciar servicio
sudo systemctl start mongodb
```

**Opción 2: MongoDB Atlas (Cloud)**
1. Ir a https://www.mongodb.com/cloud/atlas
2. Crear cuenta gratuita
3. Crear cluster
4. Obtener connection string
5. Reemplazar en `.env`:
```env
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/foodtracks
```

**Seed datos de prueba:**
```bash
cd server
node seed.js
```

Esto cargará 47 productos reales de:
- Mostaza (10 items)
- Burger King (9 items)
- McDonald's (12 items)
- Carrefour, Jumbo, Coto, Disco (supermarkets)

## 🔐 Autenticación

### Credenciales de Prueba

```
Email: usuario@ejemplo.com
Password: password123
```

### Google OAuth

1. Ir a https://console.developers.google.com
2. Crear proyecto
3. Enable "Google+ API"
4. Crear credenciales OAuth 2.0
5. Agregar http://localhost:5173 en origins autorizados
6. Copiar Client ID y Secret en `.env`

## 📚 Estructura del Proyecto

```
foodtracks/
├── server/
│   ├── models/           # Esquemas Mongoose
│   ├── routes/           # Endpoints API
│   ├── middleware/       # Auth, validaciones
│   ├── config/           # Configuraciones
│   └── server.js         # Entrada principal
│
├── client/
│   ├── src/
│   │   ├── pages/        # Páginas principales
│   │   ├── components/   # Componentes reutilizables
│   │   ├── context/      # Context API
│   │   ├── styles/       # CSS
│   │   └── App.jsx       # Raíz
│   └── vite.config.js    # Configuración Vite
│
├── .env                  # Variables entorno (NO commit)
├── .gitignore           # Archivos ignorados git
└── README.md            # Este archivo
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `PATCH /api/auth/update` - Actualizar perfil
- `POST /api/auth/change-password` - Cambiar password

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Detalles producto

### Órdenes
- `POST /api/orders` - Crear orden
- `GET /api/orders/user/:userId` - Mis órdenes
- `GET /api/orders/:orderId` - Detalles orden
- `GET /api/orders/:orderId/tracking` - Rastreamiento

### Reseñas
- `POST /api/reviews` - Crear reseña
- `GET /api/reviews/product/:productId` - Reseñas producto
- `PATCH /api/reviews/:reviewId` - Editar reseña
- `DELETE /api/reviews/:reviewId` - Eliminar reseña

### Métodos de Pago
- `GET /api/payments/:userId` - Mis métodos
- `POST /api/payments` - Agregar método
- `DELETE /api/payments/:methodId` - Eliminar método

## 🧪 Testing

### Flujo Completo de Usuario

1. **Registro/Login**
   ```
   http://localhost:5173/login
   ```

2. **Ver Marketplace**
   ```
   http://localhost:5173/marketplace
   ```

3. **Comprar Producto**
   - Agregar al carrito
   - Click checkout
   - Seleccionar método pago
   - Confirmar orden

4. **Rastrear Orden**
   - Automático post-compra
   - O: `/order-tracking/{orderId}`

5. **Dejar Reseña**
   - En detalle del producto
   - Click "Deja tu reseña"
   - Calificar 1-5 estrellas

## 🤖 Chatbot

Click en botón 💬 esquina inferior derecha para:
- Hacer preguntas frecuentes
- Rastrear órdenes
- Soporte general
- Horarios y contacto

## 🐛 Troubleshooting

### MongoDB no conecta
```bash
# Verificar si MongoDB está corriendo
ps aux | grep mongodb

# Iniciar MongoDB
sudo systemctl start mongodb
```

### Puerto 5000 en uso
```bash
# Encontrar proceso en puerto
lsof -i :5000

# Matar proceso
kill -9 <PID>
```

### Frontend no se conecta al backend
1. Verificar que backend corre en puerto 5000
2. Revisar console del navegador
3. Verificar CORS está habilitado en `server.js`

### Errores de autenticación
1. Verificar JWT_SECRET en `.env`
2. Limpiar localStorage del navegador
3. Eliminar cookies

## 📦 Dependencias Principales

**Backend**
- Express.js - Framework web
- Mongoose - ODM para MongoDB
- JWT - Autenticación
- Passport.js - OAuth
- bcryptjs - Hash de contraseñas
- dotenv - Variables de entorno

**Frontend**
- React 18 - UI framework
- React Router - Navegación
- Vite - Build tool
- Context API - State management

## 🚀 Deploy

### Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create foodtracks-app

# Set env variables
heroku config:set MONGO_URI=<tu_mongodb_uri>
heroku config:set JWT_SECRET=<tu_secret>

# Deploy
git push heroku main
```

### Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --cwd client
```

## 📝 Licencia

MIT License - ver LICENSE.md

## 👥 Autor

Desarrollado con ❤️ por FoodTracks Team

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📧 Contacto

- Email: soporte@foodtracks.com
- WhatsApp: +54 9 123 456 7890
- Discord: https://discord.gg/foodtracks

---

Versión: 1.0.0 | Actualizado: Febrero 2026
