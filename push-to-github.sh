#!/bin/bash

# Script para automatizar el push a GitHub
# Uso: ./push-to-github.sh <tu_usuario_github>

if [ -z "$1" ]; then
    echo "❌ Error: Necesitas proporcionar tu usuario de GitHub"
    echo "Uso: ./push-to-github.sh TU_USUARIO"
    echo ""
    echo "Ejemplo:"
    echo "  ./push-to-github.sh agustin-dev"
    exit 1
fi

GITHUB_USER=$1
REPO_NAME="foodtracks"
REPO_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"

echo "🚀 Iniciando push a GitHub..."
echo "📍 Usuario: $GITHUB_USER"
echo "📍 Repo: $REPO_NAME"
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -d ".git" ]; then
    echo "❌ Error: No estamos en un repositorio git"
    echo "Ejecuta desde la raíz del proyecto"
    exit 1
fi

# Agregar remote
echo "✓ Agregando remote origin..."
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

# Verificar conexión
echo "✓ Verificando conexión..."
if ! git ls-remote "$REPO_URL" &>/dev/null; then
    echo "⚠️  No se puede conectar al repositorio"
    echo "Asegúrate que:"
    echo "  1. El repositorio existe en GitHub"
    echo "  2. Has configurado autenticación (token o SSH)"
    echo ""
    exit 1
fi

# Verificar branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 Renombrando rama a main..."
    git branch -M main
fi

# Push
echo "📤 Haciendo push a GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Push completado exitosamente!"
    echo ""
    echo "🔍 Ver repositorio en:"
    echo "   https://github.com/$GITHUB_USER/$REPO_NAME"
    echo ""
    echo "📋 Próximos pasos:"
    echo "   1. Visita el repositorio en GitHub"
    echo "   2. Verifica que todos los archivos estén ahí"
    echo "   3. Agrega descripción y topics (opcional)"
    echo ""
else
    echo ""
    echo "❌ Error en el push"
    echo "Verifica tu autenticación en GitHub"
    exit 1
fi
