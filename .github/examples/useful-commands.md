# 🛠️ Comandos Útiles para Despliegue

Esta guía contiene comandos útiles para gestionar el servidor y las aplicaciones desplegadas.

## 📋 Tabla de Contenidos

- [SSH y Conexión](#ssh-y-conexión)
- [Git y Repositorio](#git-y-repositorio)
- [Backend (.NET)](#backend-net)
- [Frontend (Next.js + PM2)](#frontend-nextjs--pm2)
- [MongoDB](#mongodb)
- [Nginx](#nginx)
- [Monitoreo y Logs](#monitoreo-y-logs)
- [Troubleshooting](#troubleshooting)

## 🔐 SSH y Conexión

### Conectarse al servidor
```bash
ssh user@servidor.com
```

### Conectarse con clave específica
```bash
ssh -i ~/.ssh/mi_clave user@servidor.com
```

### Copiar archivo al servidor
```bash
scp archivo.txt user@servidor.com:/ruta/destino/
```

### Copiar directorio al servidor
```bash
scp -r directorio/ user@servidor.com:/ruta/destino/
```

### Verificar conexión SSH
```bash
ssh -v user@servidor.com
```

## 📦 Git y Repositorio

### Clonar repositorio en el servidor
```bash
cd ~/apps
git clone https://github.com/usuario/TestMillion.git
```

### Actualizar código
```bash
cd ~/apps/TestMillion
git pull origin main
```

### Ver estado del repositorio
```bash
git status
git log --oneline -10
```

### Resetear cambios locales
```bash
git reset --hard origin/main
```

### Ver diferencias
```bash
git diff
```

### Cambiar de rama
```bash
git checkout develop
git checkout -b nueva-rama
```

## 🔧 Backend (.NET)

### Restaurar dependencias
```bash
cd ~/apps/TestMillion/BackendMillionApi
dotnet restore
```

### Compilar proyecto
```bash
dotnet build
```

### Compilar para producción
```bash
dotnet publish -c Release -o ./publish
```

### Ejecutar en modo desarrollo
```bash
dotnet run
```

### Ejecutar en producción
```bash
cd publish
dotnet BackendMillionApi.dll
```

### Ejecutar tests
```bash
cd ~/apps/TestMillion/BackendMillion.Test
dotnet test --verbosity normal
```

### Ver versión de .NET
```bash
dotnet --version
dotnet --list-sdks
dotnet --list-runtimes
```

### Limpiar build
```bash
dotnet clean
rm -rf bin/ obj/
```

### Verificar endpoint del backend
```bash
curl http://localhost:5206/api/properties
```

## 🎨 Frontend (Next.js + PM2)

### Instalar dependencias
```bash
cd ~/apps/TestMillion/frontend
npm install
# o para producción
npm ci
```

### Compilar proyecto
```bash
npm run build
```

### Ejecutar en modo desarrollo
```bash
npm run dev
```

### Ejecutar en producción (sin PM2)
```bash
npm start
```

### PM2 - Iniciar aplicación
```bash
cd ~/apps/TestMillion/frontend
pm2 start npm --name "real-estate-frontend" -- start
```

### PM2 - Reiniciar aplicación
```bash
pm2 restart real-estate-frontend
```

### PM2 - Detener aplicación
```bash
pm2 stop real-estate-frontend
```

### PM2 - Eliminar aplicación
```bash
pm2 delete real-estate-frontend
```

### PM2 - Ver estado de aplicaciones
```bash
pm2 list
pm2 status
```

### PM2 - Ver logs
```bash
pm2 logs real-estate-frontend
pm2 logs real-estate-frontend --lines 100
pm2 logs --err  # Solo errores
```

### PM2 - Monitoreo en tiempo real
```bash
pm2 monit
```

### PM2 - Información detallada
```bash
pm2 info real-estate-frontend
pm2 show real-estate-frontend
```

### PM2 - Guardar configuración
```bash
pm2 save
```

### PM2 - Configurar inicio automático
```bash
pm2 startup
# Ejecutar el comando que PM2 te indica
pm2 save
```

### PM2 - Reiniciar todas las aplicaciones
```bash
pm2 restart all
```

### PM2 - Detener todas las aplicaciones
```bash
pm2 stop all
```

### PM2 - Limpiar logs
```bash
pm2 flush
```

### Verificar endpoint del frontend
```bash
curl http://localhost:3000
```

## 🍃 MongoDB

### Iniciar MongoDB
```bash
sudo systemctl start mongod
```

### Detener MongoDB
```bash
sudo systemctl stop mongod
```

### Reiniciar MongoDB
```bash
sudo systemctl restart mongod
```

### Ver estado de MongoDB
```bash
sudo systemctl status mongod
```

### Habilitar MongoDB al inicio
```bash
sudo systemctl enable mongod
```

### Conectarse a MongoDB
```bash
mongosh
```

### Ver bases de datos
```bash
mongosh --eval "show dbs"
```

### Ver colecciones
```bash
mongosh RealEstateDb --eval "show collections"
```

### Contar documentos
```bash
mongosh RealEstateDb --eval "db.Properties.countDocuments()"
```

### Ver propiedades
```bash
mongosh RealEstateDb --eval "db.Properties.find().limit(5).pretty()"
```

### Backup de base de datos
```bash
mongodump --db RealEstateDb --out ~/backups/mongo_$(date +%Y%m%d)
```

### Restaurar backup
```bash
mongorestore --db RealEstateDb ~/backups/mongo_20241111/RealEstateDb/
```

### Ver logs de MongoDB
```bash
sudo tail -f /var/log/mongodb/mongod.log
```

## 🌐 Nginx

### Iniciar Nginx
```bash
sudo systemctl start nginx
```

### Detener Nginx
```bash
sudo systemctl stop nginx
```

### Reiniciar Nginx
```bash
sudo systemctl restart nginx
```

### Recargar configuración (sin downtime)
```bash
sudo systemctl reload nginx
```

### Ver estado
```bash
sudo systemctl status nginx
```

### Verificar configuración
```bash
sudo nginx -t
```

### Ver configuración activa
```bash
cat /etc/nginx/sites-enabled/default
```

### Ver logs de acceso
```bash
sudo tail -f /var/log/nginx/access.log
```

### Ver logs de error
```bash
sudo tail -f /var/log/nginx/error.log
```

## 📊 Monitoreo y Logs

### Ver logs del backend (systemd)
```bash
sudo journalctl -u backend-million -f
sudo journalctl -u backend-million --since "1 hour ago"
sudo journalctl -u backend-million --since today
```

### Ver logs del frontend (PM2)
```bash
pm2 logs real-estate-frontend --lines 200
```

### Ver uso de recursos
```bash
# CPU y memoria
htop
# o
top

# Uso de disco
df -h

# Procesos de Node
ps aux | grep node

# Procesos de .NET
ps aux | grep dotnet
```

### Ver puertos en uso
```bash
sudo netstat -tulpn | grep LISTEN
sudo lsof -i -P -n | grep LISTEN
```

### Ver específicamente puertos 3000 y 5206
```bash
sudo lsof -i :3000
sudo lsof -i :5206
```

### Monitoreo de red
```bash
# Tráfico de red
sudo iftop

# Conexiones activas
netstat -an | grep ESTABLISHED
```

## 🐛 Troubleshooting

### Reiniciar todo el stack
```bash
# Backend
sudo systemctl restart backend-million

# Frontend
pm2 restart real-estate-frontend

# MongoDB
sudo systemctl restart mongod

# Nginx
sudo systemctl reload nginx
```

### Limpiar y reconstruir todo

#### Backend
```bash
cd ~/apps/TestMillion/BackendMillionApi
dotnet clean
rm -rf bin/ obj/ publish/
dotnet restore
dotnet publish -c Release -o ./publish
sudo systemctl restart backend-million
```

#### Frontend
```bash
cd ~/apps/TestMillion/frontend
rm -rf .next/ node_modules/
npm install
npm run build
pm2 restart real-estate-frontend
```

### Matar proceso en puerto específico
```bash
# Encontrar PID
sudo lsof -i :3000

# Matar proceso
sudo kill -9 <PID>
```

### Ver espacio en disco
```bash
df -h
du -sh ~/apps/TestMillion
du -sh ~/apps/TestMillion/* | sort -h
```

### Limpiar logs antiguos
```bash
# PM2
pm2 flush

# Journalctl (systemd)
sudo journalctl --vacuum-time=7d
sudo journalctl --vacuum-size=500M
```

### Verificar conectividad
```bash
# Ping
ping google.com

# DNS
nslookup google.com

# Curl con headers
curl -I http://localhost:3000
curl -I http://localhost:5206/api/properties
```

### Verificar variables de entorno
```bash
# Backend
cat ~/apps/TestMillion/BackendMillionApi/appsettings.json

# Frontend
cat ~/apps/TestMillion/frontend/.env.local
```

### Rollback rápido
```bash
cd ~/apps/TestMillion

# Ver commits recientes
git log --oneline -10

# Volver a commit anterior
git reset --hard <commit-hash>

# Reconstruir
cd BackendMillionApi
dotnet publish -c Release -o ./publish
sudo systemctl restart backend-million

cd ../frontend
npm run build
pm2 restart real-estate-frontend
```

## 🔄 Secuencia Completa de Despliegue Manual

```bash
# 1. Conectar al servidor
ssh deployer@servidor.com

# 2. Actualizar código
cd ~/apps/TestMillion
git pull origin main

# 3. Backend
cd BackendMillionApi
dotnet restore
dotnet publish -c Release -o ./publish
sudo systemctl restart backend-million

# 4. Frontend
cd ../frontend
npm ci
npm run build
pm2 restart real-estate-frontend

# 5. Verificar
pm2 status
sudo systemctl status backend-million
curl http://localhost:3000
curl http://localhost:5206/api/properties

# 6. Ver logs
pm2 logs real-estate-frontend --lines 50
sudo journalctl -u backend-million -n 50
```

## 📝 Scripts Útiles

### Script para reiniciar todo
```bash
#!/bin/bash
echo "Reiniciando servicios..."
sudo systemctl restart backend-million
pm2 restart real-estate-frontend
sudo systemctl reload nginx
echo "Servicios reiniciados!"
pm2 status
```

### Script para ver estado de todo
```bash
#!/bin/bash
echo "=== Backend Status ==="
sudo systemctl status backend-million --no-pager

echo -e "\n=== Frontend Status ==="
pm2 list

echo -e "\n=== MongoDB Status ==="
sudo systemctl status mongod --no-pager

echo -e "\n=== Nginx Status ==="
sudo systemctl status nginx --no-pager

echo -e "\n=== Disk Usage ==="
df -h | grep -E '^/dev|Filesystem'
```

---

**Tip**: Guarda estos comandos en un archivo en el servidor para acceso rápido:
```bash
nano ~/deploy-commands.sh
chmod +x ~/deploy-commands.sh
```

**Última actualización**: Noviembre 2025

