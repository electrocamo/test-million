# 🐛 Guía de Solución de Problemas - GitHub Actions

Esta guía te ayuda a resolver errores comunes en el workflow de despliegue.

## 📋 Tabla de Contenidos

- [Error: SSH_HOST vacío](#error-ssh_host-vacío)
- [Error: Permission denied (publickey)](#error-permission-denied-publickey)
- [Error: git pull failed](#error-git-pull-failed)
- [Error: PM2 command not found](#error-pm2-command-not-found)
- [Error: dotnet command not found](#error-dotnet-command-not-found)
- [Verificar Estado del Workflow](#verificar-estado-del-workflow)

---

## ❌ Error: SSH_HOST vacío

### Síntoma
```
ssh-keyscan -H  >> ~/.ssh/known_hosts
usage: ssh-keyscan [-46cDHv] [-f file] [-O option] [-p port] [-T timeout]
                   [-t type] [host | addrlist namelist]
Error: Process completed with exit code 1.
```

### Causa
El secreto `SSH_HOST` no está configurado o está vacío en GitHub.

### Solución

#### 1. Verificar Secretos en GitHub

**Paso a paso**:
1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral: **Secrets and variables** > **Actions**
4. Verifica que existan TODOS estos secretos:

| Nombre del Secreto | ¿Existe? | ¿Tiene Valor? |
|-------------------|----------|---------------|
| `SSH_HOST` | ☐ | ☐ |
| `SSH_USER` | ☐ | ☐ |
| `SSH_KEY` | ☐ | ☐ |
| `APP_PATH_BACKEND` | ☐ | ☐ |
| `APP_PATH_FRONTEND` | ☐ | ☐ |
| `PM2_APP_NAME_FRONTEND` | ☐ | ☐ |

#### 2. Agregar o Corregir SSH_HOST

1. Click en **New repository secret** (o edita el existente)
2. **Name**: `SSH_HOST`
3. **Secret**: Ingresa la IP o dominio de tu servidor
   - Ejemplo: `192.168.1.100`
   - Ejemplo: `miservidor.ejemplo.com`
4. Click en **Add secret**

#### 3. Verificar el Valor

**Prueba rápida** - Agrega este step temporal al workflow:

```yaml
- name: Debug SSH_HOST
  run: |
    if [ -z "${{ secrets.SSH_HOST }}" ]; then
      echo "SSH_HOST está VACÍO"
    else
      echo "SSH_HOST está configurado: ${{ secrets.SSH_HOST }}"
    fi
```

#### 4. Volver a Ejecutar el Workflow

1. Ve a la pestaña **Actions**
2. Selecciona el workflow fallido
3. Click en **Re-run jobs** > **Re-run failed jobs**

---

## ❌ Error: Permission denied (publickey)

### Síntoma
```
Permission denied (publickey).
Error: Process completed with exit code 255.
```

### Causa
La clave SSH no está configurada correctamente o no está autorizada en el servidor.

### Solución

#### 1. Verificar el Secreto SSH_KEY

**El secreto debe contener la clave PRIVADA completa**:
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAA...
(múltiples líneas)
...
-----END OPENSSH PRIVATE KEY-----
```

**⚠️ Errores comunes**:
- ❌ Solo copiaste una línea
- ❌ Falta `-----BEGIN` o `-----END`
- ❌ Copiaste la clave PÚBLICA en lugar de la PRIVADA
- ❌ Hay espacios o saltos de línea extra

#### 2. Generar Nuevas Claves SSH

```bash
# En tu máquina local
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy

# Esto genera:
# ~/.ssh/github_deploy      <- CLAVE PRIVADA (para GitHub Secret)
# ~/.ssh/github_deploy.pub  <- CLAVE PÚBLICA (para el servidor)
```

#### 3. Copiar Clave Pública al Servidor

```bash
# Opción A: Usando ssh-copy-id
ssh-copy-id -i ~/.ssh/github_deploy.pub usuario@servidor.com

# Opción B: Manualmente
cat ~/.ssh/github_deploy.pub | ssh usuario@servidor.com "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

# Opción C: Si ya estás en el servidor
# Copia el contenido de github_deploy.pub y pégalo en:
nano ~/.ssh/authorized_keys
```

#### 4. Verificar Permisos en el Servidor

```bash
# Conectarse al servidor
ssh usuario@servidor.com

# Verificar permisos
ls -la ~/.ssh/

# Deben ser:
# drwx------  ~/.ssh/                (700)
# -rw-------  ~/.ssh/authorized_keys (600)

# Corregir si es necesario
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

#### 5. Probar Conexión Local

```bash
# Desde tu máquina
ssh -i ~/.ssh/github_deploy usuario@servidor.com "echo 'Conexión exitosa'"
```

#### 6. Actualizar Secreto SSH_KEY en GitHub

```bash
# Ver la clave privada completa
cat ~/.ssh/github_deploy

# Copiar TODO el output (incluido BEGIN y END)
# Pegar en GitHub Secrets > SSH_KEY
```

---

## ❌ Error: git pull failed

### Síntoma
```
fatal: not a git repository
Error: Process completed with exit code 1.
```

### Causa
El directorio en `APP_PATH_BACKEND` o `APP_PATH_FRONTEND` no es un repositorio git.

### Solución

#### 1. Verificar el Path

Conectarse al servidor y verificar:

```bash
ssh usuario@servidor.com

# Verificar que el directorio existe
ls -la /home/deployer/apps/TestMillion

# Verificar que es un repositorio git
cd /home/deployer/apps/TestMillion
git status
```

#### 2. Si el Directorio No Existe

```bash
# Crear el directorio padre
mkdir -p /home/deployer/apps

# Clonar el repositorio
cd /home/deployer/apps
git clone https://github.com/tu-usuario/TestMillion.git
```

#### 3. Si Existe pero No es Repositorio Git

```bash
cd /home/deployer/apps/TestMillion
git init
git remote add origin https://github.com/tu-usuario/TestMillion.git
git fetch
git checkout main
```

#### 4. Configurar Git en el Servidor

```bash
git config --global user.name "Deploy Bot"
git config --global user.email "deploy@example.com"
```

---

## ❌ Error: PM2 command not found

### Síntoma
```
pm2: command not found
Error: Process completed with exit code 127.
```

### Causa
PM2 no está instalado en el servidor o no está en el PATH.

### Solución

#### 1. Instalar PM2

```bash
# Conectarse al servidor
ssh usuario@servidor.com

# Instalar PM2 globalmente
sudo npm install -g pm2

# Verificar instalación
pm2 --version
which pm2
```

#### 2. Agregar PM2 al PATH

Si PM2 está instalado pero no se encuentra:

```bash
# Ver dónde está instalado
npm root -g

# Agregar al PATH
echo 'export PATH="$PATH:/usr/local/bin"' >> ~/.bashrc
source ~/.bashrc
```

#### 3. Configurar PM2 Startup

```bash
# Configurar para inicio automático
pm2 startup

# Ejecutar el comando que PM2 te indica
# Ejemplo:
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u deployer --hp /home/deployer

# Guardar configuración
pm2 save
```

---

## ❌ Error: dotnet command not found

### Síntoma
```
dotnet: command not found
Error: Process completed with exit code 127.
```

### Causa
.NET SDK no está instalado en el servidor o no está en el PATH.

### Solución

#### 1. Instalar .NET SDK 9.0

```bash
# Conectarse al servidor
ssh usuario@servidor.com

# Descargar script de instalación
wget https://dot.net/v1/dotnet-install.sh -O /tmp/dotnet-install.sh
chmod +x /tmp/dotnet-install.sh

# Instalar .NET 9.0
/tmp/dotnet-install.sh --channel 9.0
```

#### 2. Agregar al PATH

```bash
# Agregar al .bashrc
echo 'export DOTNET_ROOT=$HOME/.dotnet' >> ~/.bashrc
echo 'export PATH=$PATH:$HOME/.dotnet' >> ~/.bashrc

# Recargar configuración
source ~/.bashrc

# Verificar instalación
dotnet --version
```

#### 3. Si usas otro usuario

El workflow se ejecuta con el usuario `SSH_USER`. Asegúrate de que ese usuario tenga .NET en su PATH:

```bash
# Como el usuario SSH_USER
sudo su - deployer

# Agregar al PATH de ese usuario
echo 'export DOTNET_ROOT=$HOME/.dotnet' >> ~/.bashrc
echo 'export PATH=$PATH:$HOME/.dotnet' >> ~/.bashrc
source ~/.bashrc
```

---

## 🔍 Verificar Estado del Workflow

### Ver Logs Detallados

1. Ve a GitHub > Actions
2. Click en el workflow fallido
3. Click en el job que falló
4. Expande cada step para ver logs completos

### Agregar Debug Logging

Agrega steps de debug temporales:

```yaml
- name: Debug Environment
  run: |
    echo "=== Environment ==="
    whoami
    pwd
    echo "PATH: $PATH"
    
    echo "=== Versions ==="
    git --version || echo "git not found"
    node --version || echo "node not found"
    npm --version || echo "npm not found"
    dotnet --version || echo "dotnet not found"
    pm2 --version || echo "pm2 not found"
    
    echo "=== Secrets Check ==="
    [ -z "${{ secrets.SSH_HOST }}" ] && echo "SSH_HOST: EMPTY" || echo "SSH_HOST: OK"
    [ -z "${{ secrets.SSH_USER }}" ] && echo "SSH_USER: EMPTY" || echo "SSH_USER: OK"
```

### Ejecutar Comandos en el Servidor

```bash
# Conectarse como el usuario del workflow
ssh $SSH_USER@$SSH_HOST

# Simular lo que hace el workflow
cd $APP_PATH_BACKEND
git pull origin main
dotnet restore
dotnet publish -c Release -o ./publish

cd $APP_PATH_FRONTEND/frontend
npm ci
npm run build
pm2 restart real-estate-frontend
```

---

## 📝 Checklist de Verificación Rápida

Antes de hacer push, verifica:

- [ ] ✅ Todos los secretos configurados en GitHub
- [ ] ✅ SSH_KEY es la clave PRIVADA completa
- [ ] ✅ Clave pública está en `~/.ssh/authorized_keys` del servidor
- [ ] ✅ Repositorio git clonado en `APP_PATH`
- [ ] ✅ PM2 instalado globalmente en el servidor
- [ ] ✅ .NET SDK 9.0 instalado en el servidor
- [ ] ✅ Node.js 18+ instalado en el servidor
- [ ] ✅ MongoDB corriendo en el servidor
- [ ] ✅ Firewall permite SSH (puerto 22)

---

## 🆘 Ayuda Adicional

### Ejecutar Script de Verificación

Crea y ejecuta este script en el servidor:

```bash
#!/bin/bash
echo "=== Verificación del Servidor ==="

echo "1. Git:"
git --version && echo "✅ Git OK" || echo "❌ Git NO encontrado"

echo "2. .NET:"
dotnet --version && echo "✅ .NET OK" || echo "❌ .NET NO encontrado"

echo "3. Node.js:"
node --version && echo "✅ Node.js OK" || echo "❌ Node.js NO encontrado"

echo "4. PM2:"
pm2 --version && echo "✅ PM2 OK" || echo "❌ PM2 NO encontrado"

echo "5. MongoDB:"
mongosh --version && echo "✅ MongoDB OK" || echo "❌ MongoDB NO encontrado"

echo "6. Repositorio:"
[ -d "$HOME/apps/TestMillion/.git" ] && echo "✅ Repositorio OK" || echo "❌ Repositorio NO encontrado"

echo "7. SSH Keys:"
[ -f "$HOME/.ssh/authorized_keys" ] && echo "✅ SSH Keys OK" || echo "❌ authorized_keys NO encontrado"
```

### Contacto

Si ninguna solución funciona:

1. Revisa los logs completos en GitHub Actions
2. Verifica la [Guía de Despliegue](.github/DEPLOYMENT.md)
3. Consulta el [Checklist](.github/DEPLOYMENT_CHECKLIST.md)
4. Revisa [Comandos Útiles](.github/examples/useful-commands.md)

---

**Última actualización**: Noviembre 2025

