# ⚡ Solución Rápida - Error SSH_HOST Vacío

## 🎯 Tu Error

```
ssh-keyscan -H  >> ~/.ssh/known_hosts
usage: ssh-keyscan [-46cDHv] [-f file] [-O option]
Error: Process completed with exit code 1
```

**Causa**: El secreto `SSH_HOST` está vacío o no configurado.

---

## ✅ Solución en 3 Pasos

### Paso 1: Ir a Configuración de Secretos

1. Abre tu repositorio en GitHub
2. Click en **Settings** (⚙️ arriba a la derecha)
3. En el menú lateral izquierdo:
   - Scroll down hasta **Secrets and variables**
   - Click en **Actions**

### Paso 2: Verificar/Agregar SSH_HOST

**¿El secreto `SSH_HOST` existe?**

#### ❌ SI NO EXISTE:
1. Click en **New repository secret** (botón verde)
2. **Name**: escribe exactamente `SSH_HOST`
3. **Secret**: escribe la IP o dominio de tu servidor
   ```
   Ejemplo: 192.168.1.100
   O: miservidor.ejemplo.com
   ```
4. Click en **Add secret**

#### ✅ SI EXISTE:
1. Click en el nombre `SSH_HOST`
2. Click en **Update secret**
3. Verifica que el campo **Value** NO esté vacío
4. Ingresa la IP o dominio correcto
5. Click en **Update secret**

### Paso 3: Volver a Ejecutar el Workflow

1. Ve a la pestaña **Actions** (arriba)
2. Click en el workflow que falló
3. Click en **Re-run jobs** (botón arriba a la derecha)
4. Click en **Re-run failed jobs**

---

## 📋 Lista Completa de Secretos Requeridos

Verifica que TODOS estos secretos existan y tengan valores:

| Secreto | Ejemplo | ¿Configurado? |
|---------|---------|---------------|
| `SSH_HOST` | `192.168.1.100` | ☐ |
| `SSH_USER` | `deployer` | ☐ |
| `SSH_KEY` | `-----BEGIN OPENSSH...` | ☐ |
| `APP_PATH_BACKEND` | `/home/deployer/apps/TestMillion` | ☐ |
| `APP_PATH_FRONTEND` | `/home/deployer/apps/TestMillion` | ☐ |
| `PM2_APP_NAME_FRONTEND` | `real-estate-frontend` | ☐ |

---

## 🔍 Cómo Verificar que Está Correcto

El workflow actualizado ahora **valida los secretos primero**. 

Si ves este mensaje, todo está bien:
```
✅ Todos los secretos están configurados correctamente
```

Si ves errores como estos:
```
❌ ERROR: SSH_HOST no está configurado
❌ ERROR: SSH_USER no está configurado
```

Entonces necesitas configurar esos secretos.

---

## 💡 Obtener tu SSH_HOST

### ¿No sabes cuál es tu SSH_HOST?

**Opción 1: Si tienes acceso al servidor**
```bash
# Conectarte normalmente
ssh usuario@TU_SERVIDOR_AQUI
# El "TU_SERVIDOR_AQUI" es tu SSH_HOST

# O ver la IP del servidor
hostname -I
```

**Opción 2: Ver el archivo SSH config**
```bash
cat ~/.ssh/config
# Busca el Host que usas
```

**Opción 3: Ver tu historial de SSH**
```bash
history | grep "ssh "
# Busca las conexiones recientes
```

---

## 🆘 Si Sigue Fallando

### 1. Verifica que los secretos NO tengan espacios extra

❌ MAL:
```
 192.168.1.100   <- espacios al inicio/fin
```

✅ BIEN:
```
192.168.1.100
```

### 2. Verifica que uses el nombre EXACTO

Los nombres son **case-sensitive**:
- ✅ `SSH_HOST`
- ❌ `ssh_host`
- ❌ `SSH_host`
- ❌ `Ssh_Host`

### 3. Espera unos segundos

Después de agregar/actualizar un secreto, GitHub puede tardar unos segundos en propagarlo.

---

## 📖 Documentación Completa

Para configuración completa del servidor y más detalles:
- 📖 [Guía Completa](.github/DEPLOYMENT.md)
- 🐛 [Troubleshooting Detallado](.github/TROUBLESHOOTING.md)
- ✅ [Checklist de Configuración](.github/DEPLOYMENT_CHECKLIST.md)

---

## ✨ Resumen Visual

```
GitHub Repo
    └─ Settings
        └─ Secrets and variables
            └─ Actions
                └─ Repository secrets
                    ├─ SSH_HOST ✅ (debe tener un valor)
                    ├─ SSH_USER ✅
                    ├─ SSH_KEY ✅
                    ├─ APP_PATH_BACKEND ✅
                    ├─ APP_PATH_FRONTEND ✅
                    └─ PM2_APP_NAME_FRONTEND ✅
```

---

**Tiempo estimado**: 2-5 minutos  
**Dificultad**: ⭐ Muy fácil

¡Una vez configurado, los despliegues serán automáticos! 🚀

