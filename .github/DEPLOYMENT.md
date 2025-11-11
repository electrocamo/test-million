# 📖 Guía de Configuración de Despliegue Automático

Esta guía explica cómo configurar el despliegue automático del proyecto usando GitHub Actions.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Configuración de Secretos](#configuración-de-secretos)
- [Configuración del Servidor](#configuración-del-servidor)
- [Verificación del Despliegue](#verificación-del-despliegue)
- [Solución de Problemas](#solución-de-problemas)

## ✅ Requisitos Previos

### En el Servidor de Producción:

1. **Sistema Operativo**: Ubuntu/Debian (recomendado) o cualquier Linux
2. **Acceso SSH**: Configurado y funcionando
3. **Git**: Instalado y configurado
4. **.NET SDK**: Versión 9.0 o superior
5. **Node.js**: Versión 18.x o superior
6. **NPM**: Incluido con Node.js
7. **PM2**: Gestor de procesos para Node.js
8. **MongoDB**: Instalado y corriendo

### Instalación en el Servidor:

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Git
sudo apt install git -y

# Instalar .NET 9
wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --version 9.0
export PATH="$HOME/.dotnet:$PATH"

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Configurar PM2 para iniciar al arrancar
pm2 startup
pm2 save

# Instalar MongoDB
sudo apt install mongodb -y
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## 🔐 Configuración de Secretos en GitHub

### Paso 1: Acceder a la Configuración de Secretos

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** (Configuración)
3. En el menú lateral, haz clic en **Secrets and variables** > **Actions**
4. Haz clic en **New repository secret**

### Paso 2: Agregar los Siguientes Secretos

#### 1. `SSH_HOST`
**Descripción**: Dirección IP o dominio del servidor

**Ejemplo**: 
```
192.168.1.100
```
o
```
miservidor.ejemplo.com
```

#### 2. `SSH_USER`
**Descripción**: Usuario SSH con permisos para desplegar

**Ejemplo**:
```
deployer
```

**Crear usuario en el servidor**:
```bash
# En el servidor
sudo adduser deployer
sudo usermod -aG sudo deployer  # Si necesita permisos sudo
```

#### 3. `SSH_KEY`
**Descripción**: Clave privada SSH (completa, incluyendo headers)

**Generar clave SSH**:
```bash
# En tu máquina local o servidor de CI/CD
ssh-keygen -t ed25519 -C "github-actions@deploy" -f ~/.ssh/github_deploy
```

**Copiar clave pública al servidor**:
```bash
# Copiar la clave pública al servidor
ssh-copy-id -i ~/.ssh/github_deploy.pub deployer@tu-servidor.com

# O manualmente
cat ~/.ssh/github_deploy.pub | ssh deployer@tu-servidor.com "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

**Copiar clave privada al secreto**:
```bash
# Mostrar la clave privada completa
cat ~/.ssh/github_deploy

# Copiar TODO el contenido (incluido -----BEGIN y -----END)
# Ejemplo del contenido:
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
...
-----END OPENSSH PRIVATE KEY-----
```

#### 4. `APP_PATH_BACKEND`
**Descripción**: Ruta completa del proyecto backend en el servidor

**Ejemplo**:
```
/home/deployer/apps/TestMillion
```

**Configurar en el servidor**:
```bash
# En el servidor
mkdir -p /home/deployer/apps
cd /home/deployer/apps
git clone https://github.com/tu-usuario/TestMillion.git
cd TestMillion
```

#### 5. `APP_PATH_FRONTEND`
**Descripción**: Ruta completa del proyecto frontend en el servidor (raíz del proyecto)

**Ejemplo**:
```
/home/deployer/apps/TestMillion
```

**Nota**: El workflow luego accede a `/home/deployer/apps/TestMillion/frontend`

#### 6. `PM2_APP_NAME_FRONTEND`
**Descripción**: Nombre de la aplicación frontend en PM2

**Ejemplo**:
```
real-estate-frontend
```

## 🖥️ Configuración del Servidor

### 1. Clonar el Repositorio

```bash
# Conectarse al servidor
ssh deployer@tu-servidor.com

# Crear directorio de aplicaciones
mkdir -p ~/apps
cd ~/apps

# Clonar el repositorio
git clone https://github.com/tu-usuario/TestMillion.git
cd TestMillion
```

### 2. Configurar Variables de Entorno

#### Backend (.NET)
```bash
cd BackendMillionApi

# Editar appsettings.json
nano appsettings.json
```

Configurar MongoDB:
```json
{
  "MongoDbSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "RealEstateDb",
    "PropertiesCollectionName": "Properties"
  }
}
```

#### Frontend (Next.js)
```bash
cd frontend

# Crear archivo de variables de entorno
nano .env.local
```

Configurar URL del API:
```env
NEXT_PUBLIC_API_URL=http://tu-servidor.com:5206/api
```

### 3. Primer Despliegue Manual

#### Backend:
```bash
cd ~/apps/TestMillion/BackendMillionApi
dotnet restore
dotnet publish -c Release -o ./publish

# Configurar como servicio systemd (opcional)
sudo nano /etc/systemd/system/backend-million.service
```

Contenido del servicio:
```ini
[Unit]
Description=Backend Million Real Estate API
After=network.target

[Service]
Type=notify
User=deployer
WorkingDirectory=/home/deployer/apps/TestMillion/BackendMillionApi/publish
ExecStart=/home/deployer/.dotnet/dotnet BackendMillionApi.dll
Restart=always
RestartSec=10
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://0.0.0.0:5206

[Install]
WantedBy=multi-user.target
```

Habilitar servicio:
```bash
sudo systemctl daemon-reload
sudo systemctl enable backend-million
sudo systemctl start backend-million
```

#### Frontend:
```bash
cd ~/apps/TestMillion/frontend
npm ci
npm run build

# Iniciar con PM2
pm2 start npm --name "real-estate-frontend" -- start
pm2 save
```

### 4. Configurar Firewall

```bash
# Permitir puertos necesarios
sudo ufw allow 22      # SSH
sudo ufw allow 80      # HTTP
sudo ufw allow 443     # HTTPS
sudo ufw allow 5206    # Backend API
sudo ufw allow 3000    # Frontend (si no usas proxy)
sudo ufw enable
```

### 5. Configurar Nginx (Recomendado)

```bash
sudo apt install nginx -y

# Crear configuración
sudo nano /etc/nginx/sites-available/real-estate
```

Contenido de configuración:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5206;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Habilitar sitio:
```bash
sudo ln -s /etc/nginx/sites-available/real-estate /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## ✅ Verificación del Despliegue

### 1. Probar Conexión SSH desde GitHub Actions

Puedes hacer un push de prueba a la rama `main` y verificar en la pestaña **Actions** de GitHub.

### 2. Verificar Servicios en el Servidor

```bash
# Estado del backend
sudo systemctl status backend-million

# Estado del frontend con PM2
pm2 status

# Logs del backend
sudo journalctl -u backend-million -f

# Logs del frontend
pm2 logs real-estate-frontend

# Verificar puertos
sudo netstat -tulpn | grep -E '3000|5206'
```

### 3. Probar la Aplicación

```bash
# Probar backend
curl http://localhost:5206/api/properties

# Probar frontend
curl http://localhost:3000
```

## 🐛 Solución de Problemas

### Problema: "Permission denied (publickey)"

**Solución**:
```bash
# Verificar que la clave pública está en authorized_keys
cat ~/.ssh/authorized_keys

# Verificar permisos
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# Verificar configuración SSH del servidor
sudo nano /etc/ssh/sshd_config
# Asegurar que estas líneas estén descomentadas:
# PubkeyAuthentication yes
# AuthorizedKeysFile .ssh/authorized_keys

# Reiniciar SSH
sudo systemctl restart sshd
```

### Problema: "git pull failed"

**Solución**:
```bash
# Configurar credenciales de Git
git config --global user.email "deploy@example.com"
git config --global user.name "Deploy Bot"

# Si hay conflictos
cd ~/apps/TestMillion
git reset --hard origin/main
```

### Problema: "PM2 command not found"

**Solución**:
```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Verificar instalación
which pm2
pm2 --version

# Agregar PM2 al PATH del usuario
echo 'export PATH="$PATH:/usr/local/bin"' >> ~/.bashrc
source ~/.bashrc
```

### Problema: "Port already in use"

**Solución**:
```bash
# Encontrar proceso usando el puerto
sudo lsof -i :3000
sudo lsof -i :5206

# Matar proceso
sudo kill -9 <PID>

# O reiniciar servicios
pm2 restart all
sudo systemctl restart backend-million
```

### Problema: "MongoDB connection failed"

**Solución**:
```bash
# Verificar estado de MongoDB
sudo systemctl status mongodb

# Iniciar MongoDB
sudo systemctl start mongodb

# Verificar conexión
mongosh --eval "db.runCommand({ ping: 1 })"

# Verificar configuración en appsettings.json
cat ~/apps/TestMillion/BackendMillionApi/appsettings.json
```

## 📊 Monitoreo

### Ver Logs en Tiempo Real

```bash
# Backend
sudo journalctl -u backend-million -f

# Frontend
pm2 logs real-estate-frontend --lines 100

# Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Dashboard de PM2

```bash
# Instalar PM2 Plus (opcional)
pm2 install pm2-server-monit

# Ver dashboard
pm2 monit
```

## 🔄 Rollback Manual

Si algo sale mal después de un despliegue:

```bash
# Ir al directorio del proyecto
cd ~/apps/TestMillion

# Ver commits recientes
git log --oneline -10

# Volver a un commit anterior
git reset --hard <commit-hash>

# Backend: recompilar
cd BackendMillionApi
dotnet publish -c Release -o ./publish
sudo systemctl restart backend-million

# Frontend: reconstruir y reiniciar
cd ../frontend
npm run build
pm2 restart real-estate-frontend
```

## 📝 Checklist de Configuración

- [ ] Servidor Linux configurado con SSH
- [ ] Usuario deployer creado
- [ ] .NET SDK 9.0 instalado
- [ ] Node.js 18.x instalado
- [ ] PM2 instalado globalmente
- [ ] MongoDB instalado y corriendo
- [ ] Repositorio clonado en el servidor
- [ ] Variables de entorno configuradas
- [ ] Claves SSH generadas
- [ ] Clave pública copiada al servidor
- [ ] Secretos configurados en GitHub
- [ ] Primer despliegue manual exitoso
- [ ] Servicios corriendo (backend + frontend)
- [ ] Firewall configurado
- [ ] Nginx configurado (opcional)
- [ ] Verificación de endpoints exitosa

## 🎉 ¡Listo!

Una vez completados todos los pasos, cada push a la rama `main` desplegará automáticamente tu aplicación.

Puedes monitorear los despliegues en:
- GitHub: `https://github.com/tu-usuario/TestMillion/actions`
- Servidor: Logs de PM2 y systemd

---

**Última actualización**: Noviembre 2025

