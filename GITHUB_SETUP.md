# 📤 Instrucciones para Subir a GitHub

## Paso 1: Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `foodtracks`
3. Descripción: "🍔 FoodTracks - Sistema de entrega de comida con rastreamiento en tiempo real"
4. Selecciona: **Public** (para que otros puedan verlo)
5. **NO** selecciones: "Initialize this repository with:" (ya tenemos commits locales)
6. Click en "Create repository"

## Paso 2: Agregar Remote Origin

Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub:

```bash
cd /home/agustin/Proyectos/foodtracks
git remote add origin https://github.com/TU_USUARIO/foodtracks.git
git branch -M main
git push -u origin main
```

**Ejemplo:**
```bash
git remote add origin https://github.com/agustin-dev/foodtracks.git
git branch -M main
git push -u origin main
```

## Paso 3: Autenticación GitHub

Si pide contraseña, necesitas generar un **Personal Access Token**:

1. Ve a https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Selecciona scopes:
   - ☑️ repo
   - ☑️ workflow
4. Copy el token (aparece una sola vez)
5. Cuando pida contraseña en git, pega el token

**O usar SSH (alternativa):**

```bash
# Generar clave SSH si no tienes
ssh-keygen -t ed25519 -C "tu-email@ejemplo.com"

# Agregar a ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copiar clave pública a GitHub
cat ~/.ssh/id_ed25519.pub  # Copia el output
# Ve a https://github.com/settings/keys
# Click "New SSH key" y pega
# Luego usa: git remote set-url origin git@github.com:TU_USUARIO/foodtracks.git
```

## Paso 4: Verificar Conexión

```bash
git remote -v
# Output debe ser:
# origin  https://github.com/TU_USUARIO/foodtracks.git (fetch)
# origin  https://github.com/TU_USUARIO/foodtracks.git (push)
```

## Comandos Git Útiles

```bash
# Ver estado
git status

# Ver commits
git log --oneline

# Hacer más commits después
git add .
git commit -m "✨ Nueva característica"
git push origin main

# Crear rama para desarrollo
git checkout -b desarrollo
git push -u origin desarrollo

# Ver todas las ramas
git branch -a
```

## Archivos que NO se suben (en .gitignore)

✅ Protegido automáticamente:
- ❌ `node_modules/` (se regeneran con npm install)
- ❌ `.env` (credenciales sensibles)
- ❌ `.DS_Store` (archivos del sistema)
- ❌ `.vscode/` (configuración personal)
- ❌ Logs y archivos temporales

## Estructura Final en GitHub

```
foodtracks/
├── README.md (instrucciones)
├── .gitignore (archivos ignorados)
├── .env.example (template de .env)
├── package.json (dependencias raíz)
│
├── server/ (Backend)
│   ├── server.js
│   ├── package.json
│   ├── models/ (Mongoose schemas)
│   ├── routes/ (API endpoints)
│   ├── middleware/ (Auth, validaciones)
│   └── config/ (Configuraciones)
│
└── client/ (Frontend)
    ├── vite.config.js
    ├── package.json
    ├── index.html
    └── src/
        ├── App.jsx
        ├── pages/ (componentes de página)
        ├── components/ (componentes reutilizables)
        ├── context/ (AuthContext, CartContext)
        └── styles/ (CSS)
```

## Clonar el Repo en Otra PC

Para que otros (o tú en otra máquina) clonel el proyecto:

```bash
git clone https://github.com/TU_USUARIO/foodtracks.git
cd foodtracks

# Instalar dependencias
cd server && npm install
cd ../client && npm install

# Configurar .env
cp server/.env.example server/.env
# Editar server/.env con tus credenciales

# Ejecutar
# Terminal 1:
cd server && npm start

# Terminal 2:
cd client && npm run dev
```

## GitHub Actions (CI/CD - Opcional)

Crea `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    
    - name: Install server deps
      run: cd server && npm install
    
    - name: Install client deps
      run: cd client && npm install
    
    - name: Lint client
      run: cd client && npm run lint
```

## Proteger la Rama Main

En repositorio settings (opcional):

1. Ve a Settings → Branches
2. Selecciona `main`
3. Habilita "Require a pull request before merging"
4. Requiere 1 aprobación mínimo

Así evitas pushes directos y mantiene código más limpio.

---

**¡Listo! Tu FoodTracks estará en GitHub! 🚀**

Ver en: `https://github.com/TU_USUARIO/foodtracks`
