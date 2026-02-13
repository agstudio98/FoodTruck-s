# 🚀 Setup Producción Automatizado

## Paso 1: Crear MongoDB Atlas (5 minutos)

1. Abre: https://www.mongodb.com/cloud/atlas
2. **Sign Up** (o Log In si tienes cuenta)
3. **Create a Deployment** → **Free**
4. **Cluster Name:** foodtracks
5. Click **Create**
6. En **Security Quickstart**:
   - Username: `foodtracks_user`
   - Password: (genera una contraseña segura)
   - Click **Create User**
7. Click **Add My Current IP Address**
8. Click **Finish and Close**
9. En la tarjeta del cluster, click **Connect** → **Drivers**
10. Copia la connection string (reemplaza `<password>` con tu contraseña)

Ejemplo:
```
mongodb+srv://foodtracks_user:TU_PASSWORD@foodtracks.xxxxx.mongodb.net/foodtracks
```

**Guarda esta URL** - la necesitarás en el paso 3.

---

## Paso 2: Hospedar Backend en Render.com (5 minutos)

1. Abre: https://render.com
2. **Sign Up** (puedes usar GitHub)
3. Dashboard → **New** → **Web Service**
4. Conecta tu repositorio GitHub (agstudio98/FoodTruck-s)
5. **Settings:**
   - **Name:** foodtracks-api
   - **Runtime:** Node
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && node server.js`
   - **Environment Variables** (Click **Add from file**):
     ```
     PORT=10000
     MONGO_URI=mongodb+srv://foodtracks_user:TU_PASSWORD@foodtracks.xxxxx.mongodb.net/foodtracks
     JWT_SECRET=tu_secret_jwt_super_seguro_123456
     NODE_ENV=production
     FRONTEND_URL=https://agstudio98.github.io/FoodTruck-s
     ```
6. Scroll down → **Create Web Service**
7. **Espera 5-10 minutos** a que compile

Tu backend estará en: `https://foodtracks-api.onrender.com`

---

## Paso 3: Actualizar Frontend para Producción

Necesitamos actualizar la URL del backend en el frontend.

**Crear archivo `.env.production`** en `/client`:

```env
VITE_API_URL=https://foodtracks-api.onrender.com
```

**Actualizar archivos que usan la API:**

1. En `src/context/AuthContext.jsx` - reemplazar:
   ```javascript
   const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';
   ```

2. En componentes que hacen fetch - usar:
   ```javascript
   const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;
   ```

---

## Paso 4: GitHub Actions para Auto-Deploy (Automático)

Crear archivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy Frontend to GitHub Pages

on:
  push:
    branches:
      - main
    paths:
      - 'client/**'

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: cd client && npm install
      
      - name: Build
        run: cd client && npm run build
        env:
          VITE_API_URL: https://foodtracks-api.onrender.com
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./client/dist
          cname: foodtracks-app.github.io
```

---

## Paso 5: Configurar GitHub Pages en Repositorio

1. Abre: https://github.com/agstudio98/FoodTruck-s/settings/pages
2. **Source:** Deploy from a branch
3. **Branch:** gh-pages
4. **Folder:** / (root)
5. **Save**

---

## Resultado Final

| Componente | URL |
|-----------|-----|
| **Frontend** | https://agstudio98.github.io/FoodTruck-s |
| **Backend API** | https://foodtracks-api.onrender.com |
| **Base Datos** | MongoDB Atlas (nube) |

---

## Verificar que Funciona

1. Abre el frontend: https://agstudio98.github.io/FoodTruck-s
2. Deberías ver la página cargada correctamente
3. Prueba Login → debería funcionar
4. Marketplace → debería cargar productos de MongoDB Atlas

---

## Todos los Pasos en Orden:

1. ✅ Crear MongoDB Atlas (10 min)
2. ✅ Hospedar Backend en Render (5-10 min)
3. ✅ Actualizar Frontend URLs
4. ✅ Subir cambios a GitHub
5. ✅ GitHub Pages los despliega automáticamente

¡Listo! 🚀
