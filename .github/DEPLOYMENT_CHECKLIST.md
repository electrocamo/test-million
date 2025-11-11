# ✅ Checklist de Despliegue

Usa este checklist para asegurarte de que todo está configurado correctamente para el despliegue automático.

## 📋 Fase 1: Preparación del Servidor

### Instalación de Software Básico
- [ ] Ubuntu/Debian Linux instalado y actualizado
- [ ] Acceso SSH configurado y funcionando
- [ ] Usuario con permisos sudo disponible
- [ ] Git instalado (`git --version`)
- [ ] .NET SDK 9.0 instalado (`dotnet --version`)
- [ ] Node.js 18.x instalado (`node --version`)
- [ ] NPM instalado (`npm --version`)
- [ ] PM2 instalado globalmente (`pm2 --version`)
- [ ] MongoDB instalado y corriendo (`sudo systemctl status mongod`)

**Script automático disponible**: `.github/scripts/setup-server.sh`

### Configuración de Seguridad
- [ ] Firewall UFW configurado
- [ ] Puerto 22 (SSH) permitido
- [ ] Puerto 80 (HTTP) permitido
- [ ] Puerto 443 (HTTPS) permitido
- [ ] Puerto 5206 (Backend API) permitido
- [ ] Puerto 3000 (Frontend) permitido o proxy configurado
- [ ] Fail2ban instalado (opcional pero recomendado)

### Usuario Deployer (Recomendado)
- [ ] Usuario `deployer` creado
- [ ] Usuario agregado al grupo sudo
- [ ] Home directory configurado (`/home/deployer`)
- [ ] Shell bash configurado

## 🔐 Fase 2: Configuración SSH

### Generación de Claves
- [ ] Par de claves SSH generado (`ssh-keygen -t ed25519`)
- [ ] Clave privada guardada en lugar seguro
- [ ] Clave pública copiada al servidor (`ssh-copy-id`)

### Verificación de Acceso
- [ ] Conexión SSH sin contraseña funciona
- [ ] Permisos de `~/.ssh` correctos (700)
- [ ] Permisos de `~/.ssh/authorized_keys` correctos (600)
- [ ] Configuración SSH del servidor permite PubkeyAuthentication

### Comandos de Verificación
```bash
# Verificar conexión
ssh -i ~/.ssh/github_deploy deployer@servidor.com "echo 'Conexión exitosa'"

# Verificar permisos
ssh deployer@servidor.com "ls -la ~/.ssh"
```

## 📦 Fase 3: Preparación del Repositorio

### En el Servidor
- [ ] Directorio de apps creado (`mkdir -p ~/apps`)
- [ ] Repositorio clonado (`git clone ...`)
- [ ] Git configurado (user.name y user.email)
- [ ] Rama main verificada (`git branch`)

### Variables de Entorno

#### Backend
- [ ] Archivo `appsettings.json` configurado
- [ ] ConnectionString de MongoDB correcto
- [ ] DatabaseName configurado
- [ ] CollectionName configurado
- [ ] ASPNETCORE_ENVIRONMENT configurado

#### Frontend
- [ ] Archivo `.env.local` creado
- [ ] NEXT_PUBLIC_API_URL configurado
- [ ] Otras variables necesarias configuradas

## 🚀 Fase 4: Primer Despliegue Manual

### Backend (.NET)
- [ ] Dependencias restauradas (`dotnet restore`)
- [ ] Proyecto compilado (`dotnet build`)
- [ ] Proyecto publicado (`dotnet publish -c Release`)
- [ ] Servicio systemd creado (opcional)
- [ ] Backend corriendo y accesible
- [ ] Endpoint `/api/properties` responde correctamente

### Verificación Backend
```bash
curl http://localhost:5206/api/properties
# Debe retornar JSON con propiedades
```

### Frontend (Next.js)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Proyecto compilado (`npm run build`)
- [ ] Carpeta `.next` generada
- [ ] PM2 configurado para la app
- [ ] Frontend corriendo en PM2
- [ ] PM2 configurado para inicio automático
- [ ] Frontend accesible en navegador

### Verificación Frontend
```bash
pm2 list
# Debe mostrar real-estate-frontend online

curl http://localhost:3000
# Debe retornar HTML
```

### MongoDB
- [ ] MongoDB corriendo (`sudo systemctl status mongod`)
- [ ] Base de datos RealEstateDb creada
- [ ] Colección Properties existe
- [ ] Datos de prueba insertados (opcional)
- [ ] Conexión desde backend funciona

### Verificación MongoDB
```bash
mongosh RealEstateDb --eval "db.Properties.countDocuments()"
```

## 🔧 Fase 5: Configuración de GitHub

### Secretos del Repositorio
- [ ] Acceso a Settings > Secrets and variables > Actions
- [ ] Secreto `SSH_HOST` configurado
- [ ] Secreto `SSH_USER` configurado
- [ ] Secreto `SSH_KEY` configurado (clave privada completa)
- [ ] Secreto `APP_PATH_BACKEND` configurado
- [ ] Secreto `APP_PATH_FRONTEND` configurado
- [ ] Secreto `PM2_APP_NAME_FRONTEND` configurado

### Verificación de Secretos
- [ ] Todos los secretos tienen valores (no vacíos)
- [ ] SSH_KEY incluye las líneas BEGIN y END
- [ ] APP_PATH apunta a directorio correcto
- [ ] PM2_APP_NAME coincide con el nombre en PM2

### Archivo Workflow
- [ ] Archivo `.github/workflows/deploy.yml` existe
- [ ] Workflow configurado para rama `main`
- [ ] Jobs de backend y frontend definidos
- [ ] Comandos SSH correctos

## 🧪 Fase 6: Prueba de Despliegue

### Primera Prueba
- [ ] Cambio menor realizado en código
- [ ] Commit creado con mensaje descriptivo
- [ ] Push a rama `main` realizado
- [ ] Workflow de GitHub Actions iniciado automáticamente

### Monitoreo del Despliegue
- [ ] Ir a GitHub Actions tab
- [ ] Ver workflow en ejecución
- [ ] Revisar logs de cada step
- [ ] Verificar que no hay errores

### En el Servidor (Durante Despliegue)
```bash
# Ver logs en tiempo real
pm2 logs real-estate-frontend --lines 0
sudo journalctl -u backend-million -f
```

### Verificación Post-Despliegue
- [ ] Workflow completado con éxito (✅ verde)
- [ ] Backend reiniciado correctamente
- [ ] Frontend reiniciado correctamente
- [ ] API responde correctamente
- [ ] Frontend carga correctamente
- [ ] No hay errores en los logs

## 🌐 Fase 7: Configuración de Proxy (Opcional)

### Nginx
- [ ] Nginx instalado
- [ ] Archivo de configuración creado (`/etc/nginx/sites-available/`)
- [ ] Symlink creado (`/etc/nginx/sites-enabled/`)
- [ ] Configuración verificada (`sudo nginx -t`)
- [ ] Nginx reiniciado
- [ ] Proxy para frontend funcionando (/)
- [ ] Proxy para backend funcionando (/api)

### SSL/HTTPS (Opcional con Let's Encrypt)
- [ ] Certbot instalado
- [ ] Certificado SSL obtenido
- [ ] Nginx configurado para HTTPS
- [ ] Redirección HTTP a HTTPS configurada
- [ ] Renovación automática configurada

## 📊 Fase 8: Monitoreo y Logs

### Herramientas de Monitoreo
- [ ] PM2 monit funciona (`pm2 monit`)
- [ ] Logs accesibles (`pm2 logs`, `journalctl`)
- [ ] Uptime configurado (opcional)
- [ ] Alertas configuradas (opcional)

### Comandos de Verificación
```bash
# Estado general
pm2 status
sudo systemctl status backend-million
sudo systemctl status mongod

# Recursos
htop
df -h

# Logs
pm2 logs --lines 50
sudo journalctl -u backend-million -n 50
```

## 🎯 Fase 9: Optimizaciones

### Performance
- [ ] MongoDB índices creados
- [ ] Frontend optimizado (next.config.js)
- [ ] PM2 cluster mode configurado (opcional)
- [ ] Compresión gzip habilitada en Nginx
- [ ] Cache configurado

### Backups
- [ ] Script de backup de MongoDB creado
- [ ] Cron job para backups configurado
- [ ] Destino de backups verificado
- [ ] Proceso de restauración probado

## 📝 Fase 10: Documentación

### Para el Equipo
- [ ] README actualizado con instrucciones
- [ ] Documentación de API actualizada
- [ ] Variables de entorno documentadas
- [ ] Procedimientos de rollback documentados
- [ ] Contactos de soporte documentados

### Para Nuevos Desarrolladores
- [ ] Guía de setup local completa
- [ ] Guía de despliegue disponible
- [ ] Comandos útiles documentados
- [ ] Troubleshooting guide disponible

## 🔄 Checklist de Despliegue Regular

Para cada despliegue futuro:

### Pre-Despliegue
- [ ] Tests pasando localmente
- [ ] Code review completado
- [ ] Changelog actualizado
- [ ] Variables de entorno verificadas
- [ ] Backup reciente de MongoDB

### Durante Despliegue
- [ ] Monitorear GitHub Actions
- [ ] Verificar logs en servidor
- [ ] Verificar que servicios reinician
- [ ] Smoke tests de endpoints

### Post-Despliegue
- [ ] API respondiendo correctamente
- [ ] Frontend carga sin errores
- [ ] Funcionalidades críticas funcionan
- [ ] No hay errores en logs
- [ ] Performance aceptable
- [ ] Notificar al equipo del despliegue exitoso

## 🆘 Rollback Plan

En caso de problemas:

- [ ] Identificar el commit problemático
- [ ] Proceso de rollback definido
- [ ] Comandos de rollback probados
- [ ] Tiempo de rollback conocido (<5 min ideal)

### Rollback Rápido
```bash
# En el servidor
cd ~/apps/TestMillion
git reset --hard <commit-anterior>

# Redesplegar
cd BackendMillionApi
dotnet publish -c Release -o ./publish
sudo systemctl restart backend-million

cd ../frontend
npm run build
pm2 restart real-estate-frontend
```

## 📞 Contactos de Emergencia

Completa esta sección con tu información:

- **DevOps Lead**: _________________
- **Backend Dev**: _________________
- **Frontend Dev**: _________________
- **DBA**: _________________
- **Proveedor de Hosting**: _________________

## 📅 Mantenimiento Programado

### Semanal
- [ ] Revisar logs de errores
- [ ] Verificar espacio en disco
- [ ] Revisar performance

### Mensual
- [ ] Actualizar dependencias de seguridad
- [ ] Revisar backups
- [ ] Limpiar logs antiguos
- [ ] Revisar métricas de uso

### Trimestral
- [ ] Actualizar Node.js (si hay nueva LTS)
- [ ] Actualizar .NET (si hay nueva versión)
- [ ] Revisar configuración de seguridad
- [ ] Auditoría de accesos

---

## ✅ Estado Final

Una vez completado todo:

```
☑️ Servidor configurado
☑️ SSH funcionando
☑️ Repositorio clonado
☑️ Primer despliegue manual exitoso
☑️ Secretos de GitHub configurados
☑️ Workflow de GitHub Actions funcionando
☑️ Despliegue automático probado
☑️ Monitoreo configurado
☑️ Documentación completa
☑️ Equipo informado
```

**¡Felicidades! Tu pipeline de CI/CD está completo y funcionando.** 🎉

---

**Fecha de configuración inicial**: _________________  
**Configurado por**: _________________  
**Última verificación**: _________________

