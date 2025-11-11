#!/bin/bash

# ==============================================================================
# Script de Configuración Inicial del Servidor
# ==============================================================================
# 
# Este script configura automáticamente el servidor para recibir despliegues
# desde GitHub Actions.
#
# Uso: 
#   bash setup-server.sh
#
# Requisitos:
#   - Ubuntu/Debian Linux
#   - Acceso sudo
#   - Conexión a internet
# ==============================================================================

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones de utilidad
print_header() {
    echo -e "\n${BLUE}===================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}===================================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Verificar que se está ejecutando en Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    print_error "Este script solo funciona en Linux"
    exit 1
fi

# Verificar acceso sudo
if ! sudo -v; then
    print_error "Se requiere acceso sudo para ejecutar este script"
    exit 1
fi

print_header "🚀 CONFIGURACIÓN INICIAL DEL SERVIDOR"

# ==============================================================================
# 1. Actualizar Sistema
# ==============================================================================
print_header "📦 Actualizando Sistema"
sudo apt update
sudo apt upgrade -y
print_success "Sistema actualizado"

# ==============================================================================
# 2. Instalar Git
# ==============================================================================
print_header "📥 Instalando Git"
if command -v git &> /dev/null; then
    print_warning "Git ya está instalado ($(git --version))"
else
    sudo apt install git -y
    print_success "Git instalado correctamente"
fi

# Configurar Git
echo -e "\n${YELLOW}Configurando Git...${NC}"
read -p "Ingresa tu nombre para Git: " git_name
read -p "Ingresa tu email para Git: " git_email
git config --global user.name "$git_name"
git config --global user.email "$git_email"
print_success "Git configurado"

# ==============================================================================
# 3. Instalar .NET SDK 9.0
# ==============================================================================
print_header "🔧 Instalando .NET SDK 9.0"
if command -v dotnet &> /dev/null; then
    print_warning ".NET ya está instalado ($(dotnet --version))"
else
    # Descargar e instalar .NET
    wget https://dot.net/v1/dotnet-install.sh -O /tmp/dotnet-install.sh
    chmod +x /tmp/dotnet-install.sh
    /tmp/dotnet-install.sh --channel 9.0
    
    # Agregar al PATH
    echo 'export DOTNET_ROOT=$HOME/.dotnet' >> ~/.bashrc
    echo 'export PATH=$PATH:$HOME/.dotnet' >> ~/.bashrc
    export DOTNET_ROOT=$HOME/.dotnet
    export PATH=$PATH:$HOME/.dotnet
    
    print_success ".NET SDK 9.0 instalado correctamente"
fi

# ==============================================================================
# 4. Instalar Node.js 18.x
# ==============================================================================
print_header "🟢 Instalando Node.js 18.x"
if command -v node &> /dev/null; then
    print_warning "Node.js ya está instalado ($(node --version))"
else
    # Agregar repositorio de NodeSource
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
    print_success "Node.js instalado correctamente ($(node --version))"
fi

# ==============================================================================
# 5. Instalar PM2
# ==============================================================================
print_header "⚡ Instalando PM2"
if command -v pm2 &> /dev/null; then
    print_warning "PM2 ya está instalado ($(pm2 --version))"
else
    sudo npm install -g pm2
    
    # Configurar PM2 para inicio automático
    pm2 startup | tail -n 1 | sudo bash
    
    print_success "PM2 instalado correctamente"
fi

# ==============================================================================
# 6. Instalar MongoDB
# ==============================================================================
print_header "🍃 Instalando MongoDB"
if command -v mongod &> /dev/null; then
    print_warning "MongoDB ya está instalado"
else
    # Importar clave pública de MongoDB
    wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
    
    # Agregar repositorio de MongoDB
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    
    # Instalar MongoDB
    sudo apt update
    sudo apt install -y mongodb-org
    
    # Iniciar y habilitar MongoDB
    sudo systemctl start mongod
    sudo systemctl enable mongod
    
    print_success "MongoDB instalado y corriendo"
fi

# ==============================================================================
# 7. Instalar Nginx (Opcional)
# ==============================================================================
print_header "🌐 Nginx (Opcional)"
read -p "¿Deseas instalar Nginx como proxy reverso? (y/n): " install_nginx
if [[ "$install_nginx" == "y" || "$install_nginx" == "Y" ]]; then
    if command -v nginx &> /dev/null; then
        print_warning "Nginx ya está instalado"
    else
        sudo apt install nginx -y
        sudo systemctl enable nginx
        print_success "Nginx instalado correctamente"
    fi
else
    print_warning "Nginx no será instalado"
fi

# ==============================================================================
# 8. Configurar Firewall
# ==============================================================================
print_header "🔥 Configurando Firewall"
read -p "¿Deseas configurar el firewall UFW? (y/n): " config_firewall
if [[ "$config_firewall" == "y" || "$config_firewall" == "Y" ]]; then
    sudo ufw allow OpenSSH
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw allow 5206/tcp
    sudo ufw allow 3000/tcp
    
    # Preguntar antes de habilitar
    read -p "¿Habilitar firewall ahora? Asegúrate de tener SSH permitido (y/n): " enable_ufw
    if [[ "$enable_ufw" == "y" || "$enable_ufw" == "Y" ]]; then
        sudo ufw --force enable
        print_success "Firewall configurado y habilitado"
    else
        print_warning "Firewall configurado pero no habilitado"
    fi
else
    print_warning "Firewall no configurado"
fi

# ==============================================================================
# 9. Crear Usuario Deployer (Opcional)
# ==============================================================================
print_header "👤 Usuario Deployer"
read -p "¿Deseas crear un usuario 'deployer' para los despliegues? (y/n): " create_deployer
if [[ "$create_deployer" == "y" || "$create_deployer" == "Y" ]]; then
    if id "deployer" &>/dev/null; then
        print_warning "El usuario 'deployer' ya existe"
    else
        sudo adduser --disabled-password --gecos "" deployer
        sudo usermod -aG sudo deployer
        
        # Copiar configuración SSH si existe
        if [ -d "$HOME/.ssh" ]; then
            sudo mkdir -p /home/deployer/.ssh
            sudo cp $HOME/.ssh/authorized_keys /home/deployer/.ssh/ 2>/dev/null || true
            sudo chown -R deployer:deployer /home/deployer/.ssh
            sudo chmod 700 /home/deployer/.ssh
            sudo chmod 600 /home/deployer/.ssh/authorized_keys 2>/dev/null || true
        fi
        
        print_success "Usuario 'deployer' creado"
    fi
fi

# ==============================================================================
# 10. Configurar Directorios de Aplicación
# ==============================================================================
print_header "📁 Configurando Directorios"
read -p "¿Deseas clonar el repositorio ahora? (y/n): " clone_repo
if [[ "$clone_repo" == "y" || "$clone_repo" == "Y" ]]; then
    read -p "Ingresa la URL del repositorio (https://github.com/...): " repo_url
    read -p "Ingresa la ruta donde clonar (default: ~/apps/TestMillion): " app_path
    app_path=${app_path:-~/apps/TestMillion}
    
    # Crear directorio padre si no existe
    mkdir -p "$(dirname "$app_path")"
    
    if [ -d "$app_path" ]; then
        print_warning "El directorio ya existe, saltando clonación"
    else
        git clone "$repo_url" "$app_path"
        print_success "Repositorio clonado en $app_path"
    fi
else
    print_warning "Repositorio no clonado. Hazlo manualmente cuando lo necesites."
fi

# ==============================================================================
# 11. Configurar Claves SSH para GitHub
# ==============================================================================
print_header "🔑 Configuración SSH para GitHub Actions"
echo -e "${YELLOW}Para que GitHub Actions pueda conectarse a este servidor:${NC}"
echo ""
echo "1. Genera una clave SSH en tu máquina local:"
echo -e "   ${GREEN}ssh-keygen -t ed25519 -C \"github-actions\" -f ~/.ssh/github_deploy${NC}"
echo ""
echo "2. Copia la clave pública a este servidor:"
echo -e "   ${GREEN}ssh-copy-id -i ~/.ssh/github_deploy.pub $(whoami)@$(hostname -I | awk '{print $1}')${NC}"
echo ""
echo "3. Copia la clave PRIVADA como secreto en GitHub:"
echo -e "   ${GREEN}cat ~/.ssh/github_deploy${NC}"
echo ""
echo "4. Configura los secretos en GitHub:"
echo "   - SSH_HOST: $(hostname -I | awk '{print $1}')"
echo "   - SSH_USER: $(whoami)"
echo "   - SSH_KEY: [contenido de la clave privada]"
echo ""

# ==============================================================================
# 12. Resumen Final
# ==============================================================================
print_header "✅ CONFIGURACIÓN COMPLETADA"
echo -e "${GREEN}Software instalado:${NC}"
echo "  • Git: $(git --version 2>/dev/null || echo 'No instalado')"
echo "  • .NET: $(dotnet --version 2>/dev/null || echo 'No instalado')"
echo "  • Node.js: $(node --version 2>/dev/null || echo 'No instalado')"
echo "  • NPM: $(npm --version 2>/dev/null || echo 'No instalado')"
echo "  • PM2: $(pm2 --version 2>/dev/null || echo 'No instalado')"
echo "  • MongoDB: $(mongod --version 2>/dev/null | head -n1 || echo 'No instalado')"
echo "  • Nginx: $(nginx -v 2>&1 || echo 'No instalado')"
echo ""
echo -e "${YELLOW}Próximos pasos:${NC}"
echo "  1. Configura las claves SSH (ver instrucciones arriba)"
echo "  2. Clona el repositorio si no lo has hecho"
echo "  3. Configura los secretos en GitHub"
echo "  4. Realiza el primer despliegue manual"
echo "  5. Haz push a main para probar el despliegue automático"
echo ""
echo -e "${BLUE}Documentación completa:${NC} .github/DEPLOYMENT.md"
echo ""
print_success "¡Servidor listo para recibir despliegues! 🚀"

