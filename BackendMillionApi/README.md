# Real Estate API - Backend

API RESTful para gestión de propiedades inmobiliarias construida con .NET 9 y MongoDB.

## 🏗️ Arquitectura

Implementa **Clean Architecture** con las siguientes capas:

### Domain Layer
- **Entities**: Modelos de dominio (Property)
- Sin dependencias externas
- Lógica de negocio pura

### Application Layer
- **DTOs**: Objetos de transferencia de datos
- **Interfaces**: Contratos de servicios y repositorios
- **Services**: Lógica de aplicación

### Infrastructure Layer
- **Data**: Contexto y configuración de MongoDB
- **Repositories**: Implementación de acceso a datos
- Queries optimizadas con índices

### Presentation Layer
- **Controllers**: Endpoints HTTP
- Validación de entrada
- Manejo de errores

## 📦 Dependencias

```xml
<PackageReference Include="MongoDB.Driver" Version="3.5.0" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="9.0.6" />
<PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="9.0.10" />
```

## 🚀 Inicio Rápido

### Configuración

1. Configurar MongoDB en `appsettings.json`:
```json
{
  "MongoDbSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "RealEstateDb",
    "PropertiesCollectionName": "Properties"
  }
}
```

2. Ejecutar:
```bash
dotnet restore
dotnet run
```

### Swagger UI

Acceder a la documentación interactiva en:
```
http://localhost:5000/swagger
```

## 📡 Endpoints

### GET /api/properties
Obtiene todas las propiedades.

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "idOwner": "507f1f77bcf86cd799439012",
    "name": "Modern Apartment",
    "address": "123 Main St",
    "price": 350000,
    "image": "https://example.com/image.jpg"
  }
]
```

### GET /api/properties/{id}
Obtiene una propiedad específica.

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "idOwner": "507f1f77bcf86cd799439012",
  "name": "Modern Apartment",
  "address": "123 Main St",
  "price": 350000,
  "image": "https://example.com/image.jpg"
}
```

### GET /api/properties/search
Busca propiedades con filtros.

**Query Parameters:**
- `name` (string): Búsqueda parcial por nombre
- `address` (string): Búsqueda parcial por dirección
- `minPrice` (decimal): Precio mínimo
- `maxPrice` (decimal): Precio máximo

**Ejemplo:**
```
GET /api/properties/search?name=apartment&minPrice=200000&maxPrice=500000
```

### POST /api/properties
Crea una nueva propiedad.

**Request Body:**
```json
{
  "idOwner": "507f1f77bcf86cd799439012",
  "name": "Modern Apartment",
  "address": "123 Main St",
  "price": 350000,
  "image": "https://example.com/image.jpg"
}
```

**Validaciones:**
- `idOwner`: Requerido
- `name`: Requerido, 3-200 caracteres
- `address`: Requerido, 5-500 caracteres
- `price`: Requerido, > 0
- `image`: Requerido, URL válida

### PUT /api/properties/{id}
Actualiza una propiedad existente.

**Request Body:**
```json
{
  "name": "Updated Name",
  "price": 375000
}
```

### DELETE /api/properties/{id}
Elimina una propiedad.

## 🔍 Optimizaciones

### Índices MongoDB
```javascript
{
  "name": 1,
  "address": 1,
  "price": 1
}
```

### Búsquedas Case-Insensitive
Utiliza expresiones regulares de MongoDB para búsquedas sin distinción de mayúsculas/minúsculas.

### Queries Eficientes
- Proyecciones solo de campos necesarios
- Filtros combinados con AND
- Uso de FilterDefinitionBuilder

## 🧪 Testing

Los tests se encuentran en el proyecto `BackendMillion.Test`:

```bash
dotnet test
```

### Cobertura
- PropertyService: 100%
- PropertiesController: 100%

## 🔐 Seguridad

- Validación de entrada con Data Annotations
- Sanitización de strings (Trim)
- Manejo seguro de errores (sin exposición de stack traces)
- CORS configurado para frontend específico

## 📊 Logging

Utiliza `ILogger` integrado de .NET:
- Información de operaciones exitosas
- Advertencias para datos inválidos
- Errores con contexto

## 🐛 Manejo de Errores

| Código | Descripción |
|--------|-------------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request (validación) |
| 404 | Not Found |
| 500 | Internal Server Error |

## 📈 Mejores Prácticas

✅ Clean Architecture
✅ SOLID Principles
✅ Dependency Injection
✅ Async/Await pattern
✅ Repository Pattern
✅ DTO Pattern
✅ Error Handling
✅ Logging
✅ Input Validation
✅ Documentation (XML Comments)

## 🔧 Configuración Avanzada

### CORS Personalizado
En `Program.cs`:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
```

### Logging Personalizado
En `appsettings.json`:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```


