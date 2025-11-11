#!/bin/bash
# ==============================================================================
# Script para Instalar .NET 9 Runtime en el Servidor
# ==============================================================================

set -e

echo "=================================================="
echo "📦 Instalando .NET 9 Runtime..."
echo "=================================================="

# Limpiar instalaciones previas si existen
echo "🧹 Limpiando instalaciones previas..."
rm -f /tmp/dotnet-install.sh

# Descargar el instalador
echo "📥 Descargando instalador..."
wget -q https://dot.net/v1/dotnet-install.sh -O /tmp/dotnet-install.sh
chmod +x /tmp/dotnet-install.sh

# Instalar ASP.NET Core Runtime (incluye .NET Runtime)
echo "⚙️  Instalando ASP.NET Core Runtime 9.0..."
/tmp/dotnet-install.sh --channel 9.0 --runtime aspnetcore --install-dir $HOME/.dotnet

# Agregar al PATH si no está
if ! grep -q 'export PATH="$PATH:$HOME/.dotnet"' ~/.bashrc; then
    echo ""
    echo "📝 Agregando .NET al PATH..."
    echo 'export DOTNET_ROOT=$HOME/.dotnet' >> ~/.bashrc
    echo 'export PATH="$PATH:$HOME/.dotnet"' >> ~/.bashrc
fi

# Aplicar cambios al PATH actual
export DOTNET_ROOT=$HOME/.dotnet
export PATH="$PATH:$HOME/.dotnet"

# Limpiar
rm -f /tmp/dotnet-install.sh

echo ""
echo "=================================================="
echo "✅ Instalación Completa!"
echo "=================================================="
echo "Versión instalada:"
$HOME/.dotnet/dotnet --version
echo ""
echo "💡 Si usas una nueva terminal, ejecuta:"
echo "   source ~/.bashrc"
echo ""
echo "🚀 Para verificar:"
echo "   dotnet --version"
echo "=================================================="

