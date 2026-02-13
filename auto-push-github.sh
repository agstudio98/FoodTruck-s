#!/bin/bash

# Script para completar el push a GitHub después de:
# 1. Crear repo en GitHub
# 2. Agregar SSH key

echo "🔐 Configurando para push a GitHub..."
echo ""

# Configurar Git
git config --global user.email "agustin@foodtracks.com"
git config --global user.name "Agustín"

# Verificar SSH
echo "🔑 Verificando SSH key..."
if [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "❌ SSH key no encontrada. Ejecuta primero:"
    echo "   ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N \"\""
    exit 1
fi

# Configurar SSH agent
eval "$(ssh-agent -s)" > /dev/null 2>&1
ssh-add ~/.ssh/id_ed25519 2>/dev/null

# Test SSH connection
echo "🌐 Probando conexión SSH con GitHub..."
if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "✅ SSH conectado correctamente"
else
    echo "⚠️  GitHub aún no reconoce tu SSH key"
    echo "Asegúrate de:"
    echo "  1. Agregar la clave en https://github.com/settings/keys"
    echo "  2. Esperar 30 segundos"
    echo ""
    read -p "¿Quieres continuar? (s/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

# Configurar remote
echo "📍 Configurando GitHub remote..."
git remote remove origin 2>/dev/null
git remote add origin git@github.com:agstudio98/foodtracks.git

# Verificar que repo existe
echo "🔍 Verificando que repositorio existe en GitHub..."
if ! git ls-remote git@github.com:agstudio98/foodtracks.git &>/dev/null; then
    echo "❌ El repositorio no existe en GitHub"
    echo "Crea uno en: https://github.com/new"
    echo "  - Repository name: foodtracks"
    echo "  - Elige Public"
    exit 1
fi

echo "✅ Repositorio encontrado en GitHub"
echo ""

# Push
echo "📤 Haciendo push a GitHub..."
echo "---"
git push -u origin main

echo "---"
echo ""
if [ $? -eq 0 ]; then
    echo "✅ ¡Push completado exitosamente!"
    echo ""
    echo "📍 Tu código está en:"
    echo "   https://github.com/agstudio98/foodtracks"
    echo ""
    echo "📊 Archivos subidos: $(git rev-list --count HEAD)"
    echo "📝 Commits: $(git rev-list --count HEAD)"
    echo ""
    echo "🎉 ¡Listo para compartir y colaborar!"
else
    echo "❌ Error en el push"
    echo ""
    echo "Intenta manualmente:"
    echo "  git push -u origin main"
    exit 1
fi
