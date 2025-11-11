# Guía de Inicio Rápido - Real Estate API

Esta guía te ayudará a poner en marcha el proyecto completo en menos de 10 minutos.

## ⚡ Inicio Rápido

### Paso 1: Verificar Requisitos

```bash
# Verificar .NET
dotnet --version  # Debe ser 9.0+

# Verificar Node.js
node --version    # Debe ser 18+

# Verificar MongoDB
mongosh          # Debe conectar exitosamente
```

### Paso 2: Iniciar MongoDB

**Opción A - MongoDB Local:**
```bash
mongod
```

**Opción B - MongoDB con Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Paso 3: Poblar Base de Datos (Opcional)

Ejecuta este script en MongoDB Compass o mongosh:

```javascript
use RealEstateDb

db.Properties.insertMany([
  {
    idOwner: "507f1f77bcf86cd799439011",
    name: "Modern Downtown Apartment",
    address: "123 Main Street, Downtown District",
    price: 350000,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    idOwner: "507f1f77bcf86cd799439012",
    name: "Luxury Beach House",
    address: "456 Ocean Drive, Beachfront Area",
    price: 1200000,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    idOwner: "507f1f77bcf86cd799439013",
    name: "Cozy Suburban Home",
    address: "789 Elm Street, Quiet Suburbs",
    price: 275000,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    idOwner: "507f1f77bcf86cd799439014",
    name: "Penthouse Suite",
    address: "101 Sky Tower, City Center",
    price: 2500000,
    image: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    idOwner: "507f1f77bcf86cd799439015",
    name: "Country Cottage",
    address: "222 Rural Road, Countryside",
    price: 180000,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    idOwner: "507f1f77bcf86cd799439016",
    name: "Urban Loft",
    address: "333 Industrial Ave, Arts District",
    price: 425000,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

// Crear índice para optimizar búsquedas
db.Properties.createIndex({ name: 1, address: 1, price: 1 })
```

### Paso 4: Iniciar Backend

**Terminal 1:**
```bash
cd BackendMillionApi
dotnet restore
dotnet run
```

✅ Backend corriendo en: http://localhost:5000
📚 Swagger UI: http://localhost:5000/swagger

### Paso 5: Iniciar Frontend

**Terminal 2:**
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

✅ Frontend corriendo en: http://localhost:3000

### Paso 6: Probar la Aplicación

1. Abre http://localhost:3000
2. Navega a "Properties"
3. Usa los filtros para buscar propiedades
4. Haz clic en "View Details" para ver una propiedad

## 🧪 Ejecutar Tests

```bash
cd BackendMillion.Test
dotnet test
```

## 📡 Probar API con cURL

### Obtener todas las propiedades:
```bash
curl http://localhost:5000/api/properties
```

### Buscar propiedades:
```bash
curl "http://localhost:5000/api/properties/search?name=apartment&minPrice=200000&maxPrice=500000"
```

### Crear una propiedad:
```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "idOwner": "507f1f77bcf86cd799439099",
    "name": "Test Property",
    "address": "Test Address",
    "price": 300000,
    "image": "https://example.com/image.jpg"
  }'
```

## 🐛 Solución de Problemas Comunes

### Error: MongoDB no conecta

```bash
# Verificar que MongoDB esté corriendo
mongosh

# Si falla, iniciar MongoDB
mongod --dbpath=/data/db
```

### Error: Puerto 5000 en uso

```bash
# Backend en puerto diferente
cd BackendMillionApi
dotnet run --urls "http://localhost:5001"

# Actualizar frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Error: Puerto 3000 en uso

```bash
# Frontend en puerto diferente
cd frontend
PORT=3001 npm run dev
```

### Error: CORS en frontend

Verificar que el backend tenga configurado CORS para el puerto del frontend en `Program.cs`:

```csharp
policy.WithOrigins("http://localhost:3000")
```

### Error: Dependencias faltantes

```bash
# Backend
cd BackendMillionApi
dotnet restore
dotnet build

# Frontend
cd frontend
npm install
```

## 📊 Verificar Instalación

### Backend Health Check:
```bash
curl http://localhost:5000/api/properties
# Debe retornar un array JSON
```

### Frontend Health Check:
Abrir http://localhost:3000 en el navegador
- ✅ Debe cargar la página de inicio
- ✅ Debe mostrar el header con navegación
- ✅ Debe poder navegar a /properties

### MongoDB Health Check:
```bash
mongosh
> use RealEstateDb
> db.Properties.countDocuments()
# Debe retornar el número de propiedades
```

## 🚀 Próximos Pasos

1. **Explorar Swagger**: http://localhost:5000/swagger
   - Prueba todos los endpoints
   - Ve la documentación automática

2. **Revisar el Código**:
   - Backend: Clean Architecture implementada
   - Frontend: Componentes reutilizables
   - Tests: Alta cobertura

3. **Personalizar**:
   - Añadir más campos a Property
   - Implementar autenticación
   - Añadir paginación

## 📖 Documentación Adicional

- **README.md**: Documentación completa del proyecto
- **ARCHITECTURE.md**: Detalles de la arquitectura
- **BackendMillionApi/README.md**: Documentación del API
- **frontend/README.md**: Documentación del frontend

## 🎯 Checklist de Funcionalidades

Backend:
- [x] CRUD completo de propiedades
- [x] Filtros por nombre, dirección y precio
- [x] Validación de datos
- [x] Manejo de errores
- [x] Documentación Swagger
- [x] Tests unitarios

Frontend:
- [x] Página de inicio
- [x] Lista de propiedades
- [x] Filtros de búsqueda
- [x] Vista de detalles
- [x] Diseño responsive
- [x] Manejo de errores

## 💡 Tips

1. **Development**:
   - Usa `dotnet watch run` para hot-reload en backend
   - El frontend ya tiene hot-reload con Next.js

2. **Debugging**:
   - Backend logs en consola
   - Frontend logs en browser console
   - MongoDB logs con `mongod --verbose`

3. **Performance**:
   - MongoDB índices ya configurados
   - Frontend con debouncing en filtros
   - Async/await en todo el backend

## 🎉 ¡Listo!

Si todo funciona correctamente, deberías ver:
- ✅ Backend API respondiendo en http://localhost:5000
- ✅ Swagger UI funcionando
- ✅ Frontend mostrando propiedades
- ✅ Filtros funcionando correctamente
- ✅ Tests pasando exitosamente

¡Felicidades! El proyecto está completamente funcional.


