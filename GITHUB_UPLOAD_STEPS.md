# 🚀 Pasos para Subir a GitHub (5 minutos)

## ✅ Paso 1: Crear Repositorio en GitHub (1 minuto)

1. Abre: https://github.com/new
2. **Repository name:** `foodtracks`
3. **Description:** FoodTracks - Food Delivery Platform with AI Chatbot
4. **Public** (seleccionar)
5. Click **Create repository**
6. ✅ **LISTO**

---

## ✅ Paso 2: Agregar SSH Key (1 minuto)

Tu SSH key pública está lista:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGfKujnCv828l9XZzS/KngJNfTnUxsrOT5WSrMmNI6/d agstudio98@github.com
```

**Para agregarla:**
1. Abre: https://github.com/settings/keys
2. Click **New SSH key**
3. **Title:** `FoodTracks Dev`
4. **Key type:** Authentication Key
5. Pega la clave SSH arriba (completa)
6. Click **Add SSH key**
7. ✅ **LISTO**

---

## ✅ Paso 3: Hacer Push (1 minuto)

Después de los pasos 1 y 2, ejecuta en terminal:

```bash
cd /home/agustin/Proyectos/foodtracks
git config --global user.email "agustin@foodtracks.com"
git config --global user.name "Agustín"
git remote remove origin 2>/dev/null
git remote add origin git@github.com:agstudio98/foodtracks.git
git push -u origin main
```

✅ **¡Listo! Tu código estará en GitHub**

---

## Verificar

Abre: https://github.com/agstudio98/foodtracks

Deberías ver 71 archivos con el commit inicial.

---

**⏱️ Total: 5 minutos**
