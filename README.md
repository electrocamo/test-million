# Real Estate API - Full Stack Project

Sistema completo de gestión de propiedades inmobiliarias con API REST en .NET 9 y frontend en Next.js.

## 🏗️ Arquitectura

El proyecto sigue los principios de **Clean Architecture** con separación clara de responsabilidades:

### Backend (.NET 9)
```
BackendMillionApi/
├── Domain/              # Entidades del negocio
│   └── Entities/
├── Application/         # Lógica de aplicación
│   ├── DTOs/           # Objetos de transferencia
│   ├── Interfaces/     # Contratos
│   └── Services/       # Servicios de negocio
├── Infrastructure/      # Implementaciones externas
│   ├── Data/           # Contexto MongoDB
│   └── Repositories/   # Repositorios
└── Presentation/        # Capa de presentación
    └── Controllers/    # Controladores API
```

### Frontend (Next.js 14)
```
frontend/
├── app/                # Next.js App Router
├── components/         # Componentes reutilizables
├── lib/               # Utilidades y API client
└── styles/            # Estilos CSS
```

## 🚀 Características

### Backend API
- ✅ CRUD completo de propiedades
- ✅ Filtros avanzados (nombre, dirección, rango de precio)
- ✅ Manejo de errores robusto
- ✅ Validación de datos
- ✅ Índices optimizados en MongoDB
- ✅ Documentación con Swagger
- ✅ CORS configurado
- ✅ Logging integrado

### Frontend
- ✅ Listado de propiedades con paginación visual
- ✅ Búsqueda y filtros en tiempo real
- ✅ Vista de detalles de propiedad
- ✅ Diseño responsive
- ✅ UI moderna y atractiva
- ✅ Manejo de errores
- ✅ Loading states

### Testing
- ✅ **Backend**: 23 tests unitarios con NUnit + Moq
- ✅ **Frontend**: 64 tests con Jest + React Testing Library
- ✅ **Total**: 87 tests con 100% pasando
- ✅ Cobertura alta en componentes y servicios
- ✅ Tests de integración y unitarios

## 📋 Requisitos Previos

- .NET 9 SDK
- MongoDB 5.0+
- Node.js 18+
- npm o yarn

## 🔧 Instalación y Configuración

### 1. MongoDB

Instalar y ejecutar MongoDB:
```bash
# Windows (con Chocolatey)
choco install mongodb

# Mac (con Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Iniciar MongoDB
mongod
```

O usar Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Backend

```bash
# Navegar al proyecto
cd BackendMillionApi

# Restaurar dependencias
dotnet restore

# Ejecutar la aplicación
dotnet run
```

La API estará disponible en: `http://localhost:5000`
Swagger UI: `http://localhost:5000/swagger`

### 3. Frontend

```bash
# Navegar al proyecto
cd frontend

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.local.example .env.local

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

## 📊 Estructura de Base de Datos

### Colección: Properties

```json
{
  "_id": "ObjectId",
  "idOwner": "ObjectId",
  "name": "String",
  "address": "String",
  "price": "Decimal",
  "image": "String (URL)",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

### Índices

```javascript
// Índice compuesto para optimizar búsquedas
{
  "name": 1,
  "address": 1,
  "price": 1
}
```

## 🧪 Testing

### Ejecutar Tests del Backend

```bash
cd BackendMillion.Test
dotnet test --verbosity normal
```

**Cobertura Backend** (23 tests):
- ✅ PropertyService: 13 tests (100% cobertura)
- ✅ PropertiesController: 10 tests (100% cobertura)
- ✅ Casos de éxito y error
- ✅ Validaciones de entrada
- ✅ Manejo de excepciones

### Ejecutar Tests del Frontend

```bash
cd frontend
npm test                 # Ejecutar todos los tests
npm run test:watch       # Modo watch
npm run test:coverage    # Con reporte de cobertura
```

**Cobertura Frontend** (64 tests):
- ✅ Utilidades: 13 tests (100% cobertura)
- ✅ API Client: 15 tests (96% cobertura)
- ✅ Componentes: 22 tests (100% cobertura)
- ✅ Páginas: 18 tests (78% cobertura)
- ✅ **Total: 78.48% de cobertura**

**Documentación de Testing**:
- 📖 [Guía de Testing Frontend](frontend/TESTING.md)

## 📡 API Endpoints

### Properties

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/properties` | Obtener todas las propiedades |
| GET | `/api/properties/{id}` | Obtener propiedad por ID |
| GET | `/api/properties/search` | Buscar con filtros |
| POST | `/api/properties` | Crear propiedad |
| PUT | `/api/properties/{id}` | Actualizar propiedad |
| DELETE | `/api/properties/{id}` | Eliminar propiedad |

### Ejemplo de búsqueda con filtros

```bash
GET /api/properties/search?name=apartment&minPrice=100000&maxPrice=500000&address=downtown
```

## 🎨 Características del Frontend

### Páginas

1. **Home** (`/`)
   - Página de bienvenida
   - Características del sistema
   - Navegación a propiedades

2. **Propiedades** (`/properties`)
   - Listado completo
   - Filtros de búsqueda
   - Cards responsivas

3. **Detalles** (`/properties/{id}`)
   - Información completa
   - Imagen destacada
   - Datos del propietario

### Componentes

- **PropertyCard**: Tarjeta de propiedad con imagen y datos
- **PropertyFilter**: Panel de filtros con debouncing
- **PropertyList**: Grid responsivo de propiedades

## 🔐 Variables de Entorno

### Backend (appsettings.json)

```json
{
  "MongoDbSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "RealEstateDb",
    "PropertiesCollectionName": "Properties"
  }
}
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **.NET 9**: Framework principal
- **C# 12**: Lenguaje de programación
- **MongoDB.Driver**: Cliente MongoDB
- **Swashbuckle**: Documentación OpenAPI
- **NUnit**: Framework de testing
- **Moq**: Library de mocking

### Frontend
- **Next.js 14**: Framework React
- **TypeScript**: Tipado estático
- **CSS Modules**: Estilos con scope
- **Axios**: Cliente HTTP

## 📈 Mejores Prácticas Implementadas

### Clean Code
- ✅ Nombres descriptivos
- ✅ Funciones pequeñas y enfocadas
- ✅ Comentarios XML en métodos públicos
- ✅ Separación de responsabilidades
- ✅ DRY (Don't Repeat Yourself)

### Clean Architecture
- ✅ Independencia de frameworks
- ✅ Testeable
- ✅ Independiente de UI
- ✅ Independiente de base de datos
- ✅ Inversión de dependencias

### Performance
- ✅ Índices en MongoDB
- ✅ Queries optimizadas
- ✅ Debouncing en búsquedas
- ✅ Lazy loading de imágenes
- ✅ Async/await en todas las operaciones

### Seguridad
- ✅ Validación de entrada
- ✅ Sanitización de datos
- ✅ Manejo seguro de errores
- ✅ CORS configurado

## 🚀 Despliegue

### ⚡ Despliegue Automático con GitHub Actions

Este proyecto incluye un workflow completo de CI/CD que despliega automáticamente a producción en cada push a `main`.

**Características del CI/CD**:
- ✅ Despliegue automático de Backend (.NET)
- ✅ Despliegue automático de Frontend (Next.js)
- ✅ Conexión SSH al servidor
- ✅ Actualización automática de código
- ✅ Instalación de dependencias
- ✅ Compilación optimizada
- ✅ Reinicio de servicios con PM2
- ✅ Notificaciones de estado

**Documentación**:
- 📖 [Guía Completa de Despliegue](.github/DEPLOYMENT.md)
- ✅ [Checklist de Configuración](.github/DEPLOYMENT_CHECKLIST.md)
- 🚀 [Script de Setup del Servidor](.github/scripts/setup-server.sh)
- 📝 [Comandos Útiles](.github/examples/useful-commands.md)

**Inicio Rápido para CI/CD**:

1. Configurar secretos en GitHub (Settings > Secrets):
   - `SSH_HOST`: IP o dominio del servidor
   - `SSH_USER`: Usuario SSH
   - `SSH_KEY`: Clave privada SSH
   - `APP_PATH_BACKEND`: Ruta del backend en servidor
   - `APP_PATH_FRONTEND`: Ruta del frontend en servidor
   - `PM2_APP_NAME_FRONTEND`: Nombre de app en PM2

2. Preparar el servidor (ejecutar en el servidor):
   ```bash
   bash <(curl -s https://raw.githubusercontent.com/tu-usuario/TestMillion/main/.github/scripts/setup-server.sh)
   ```

3. Hacer push a `main`:
   ```bash
   git push origin main
   ```

4. Ver el despliegue en GitHub Actions tab

### Backend

#### Docker
```bash
cd BackendMillionApi
docker build -t real-estate-api .
docker run -p 5000:80 real-estate-api
```

#### Azure App Service
```bash
dotnet publish -c Release
# Subir a Azure Portal o usar CLI
```

### Frontend

#### Vercel (Recomendado)
```bash
cd frontend
vercel
```

#### Build estático
```bash
npm run build
npm start
```

## 📝 Datos de Prueba

Para poblar la base de datos con datos de prueba, puedes usar este script MongoDB:

```javascript
db.Properties.insertMany([
  {
    idOwner: ObjectId(),
    name: "Modern Downtown Apartment",
    address: "123 Main St, Downtown",
    price: 350000,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    idOwner: ObjectId(),
    name: "Luxury Beach House",
    address: "456 Ocean Drive, Beachfront",
    price: 1200000,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    idOwner: ObjectId(),
    name: "Cozy Suburban Home",
    address: "789 Elm Street, Suburbs",
    price: 275000,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);
```

## 🐛 Solución de Problemas

### MongoDB no conecta
```bash
# Verificar que MongoDB esté corriendo
mongosh
# Si falla, iniciar MongoDB
mongod --dbpath=/data/db
```

### Puerto en uso
```bash
# Backend
dotnet run --urls "http://localhost:5001"

# Frontend
PORT=3001 npm run dev
```

### CORS errors
Verificar que el frontend esté usando el puerto correcto en la configuración de CORS del backend.

## 📧 Contacto y Soporte

Para preguntas o soporte, consulta la documentación de Swagger o revisa los tests unitarios para ejemplos de uso.

## 📄 Licencia

Este proyecto es parte de una prueba técnica y está disponible para fines educativos.


