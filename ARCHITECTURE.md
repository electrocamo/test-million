# Arquitectura del Sistema

## Visión General

Este documento describe la arquitectura del sistema Real Estate API, implementando principios de Clean Architecture, SOLID y mejores prácticas de desarrollo.

## Principios Arquitectónicos

### Clean Architecture

La aplicación está organizada en capas concéntricas donde las dependencias apuntan hacia el centro:

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│         (Controllers, UI)           │
├─────────────────────────────────────┤
│        Application Layer            │
│    (Services, DTOs, Interfaces)    │
├─────────────────────────────────────┤
│       Infrastructure Layer          │
│   (Repositories, Data Access)      │
├─────────────────────────────────────┤
│          Domain Layer               │
│    (Entities, Business Logic)      │
└─────────────────────────────────────┘
```

### Beneficios

1. **Independencia de Frameworks**: La lógica de negocio no depende de frameworks externos
2. **Testeable**: Las capas internas son fáciles de testear sin dependencias externas
3. **Independencia de UI**: La UI puede cambiar sin afectar el negocio
4. **Independencia de Base de Datos**: MongoDB puede ser reemplazado sin cambiar el dominio
5. **Mantenible**: Separación clara de responsabilidades

## Capas del Sistema

### 1. Domain Layer (Dominio)

**Ubicación**: `Domain/Entities/`

**Responsabilidades**:
- Definir entidades de negocio
- Contener lógica de dominio pura
- Sin dependencias externas

**Componentes**:
```csharp
// Property.cs
public class Property
{
    public string? Id { get; set; }
    public string IdOwner { get; set; }
    public string Name { get; set; }
    public string Address { get; set; }
    public decimal Price { get; set; }
    public string Image { get; set; }
}
```

### 2. Application Layer (Aplicación)

**Ubicación**: `Application/`

**Responsabilidades**:
- Orquestar flujo de datos
- Implementar casos de uso
- Definir contratos (interfaces)
- Transformar datos (DTOs)

**Componentes**:

#### DTOs (Data Transfer Objects)
```csharp
// PropertyDto.cs - Para lectura
// CreatePropertyDto.cs - Para creación
// UpdatePropertyDto.cs - Para actualización
// PropertyFilterDto.cs - Para filtrado
```

#### Interfaces
```csharp
public interface IPropertyService
{
    Task<IEnumerable<PropertyDto>> GetAllPropertiesAsync();
    Task<PropertyDto?> GetPropertyByIdAsync(string id);
    Task<IEnumerable<PropertyDto>> GetFilteredPropertiesAsync(PropertyFilterDto filter);
    // ...
}

public interface IPropertyRepository
{
    Task<IEnumerable<Property>> GetAllAsync();
    Task<Property?> GetByIdAsync(string id);
    // ...
}
```

#### Services
```csharp
public class PropertyService : IPropertyService
{
    private readonly IPropertyRepository _repository;
    
    // Implementa lógica de negocio
    // Valida datos
    // Transforma entre entidades y DTOs
}
```

### 3. Infrastructure Layer (Infraestructura)

**Ubicación**: `Infrastructure/`

**Responsabilidades**:
- Implementar acceso a datos
- Integrar con tecnologías externas
- Configurar contextos de base de datos

**Componentes**:

#### Data Context
```csharp
public class MongoDbContext : IMongoDbContext
{
    private readonly IMongoDatabase _database;
    
    public IMongoCollection<T> GetCollection<T>(string name)
    {
        return _database.GetCollection<T>(name);
    }
}
```

#### Repositories
```csharp
public class PropertyRepository : IPropertyRepository
{
    // Implementa acceso a MongoDB
    // Optimiza queries con índices
    // Maneja filtros complejos
}
```

### 4. Presentation Layer (Presentación)

**Ubicación**: `Presentation/Controllers/`

**Responsabilidades**:
- Exponer endpoints HTTP
- Validar entrada
- Manejar errores
- Retornar respuestas apropiadas

**Componentes**:
```csharp
[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly IPropertyService _service;
    
    // Endpoints REST
    // Validación con DataAnnotations
    // Códigos de estado HTTP apropiados
}
```

## Patrones de Diseño Implementados

### 1. Repository Pattern

**Propósito**: Abstraer el acceso a datos

**Implementación**:
```csharp
public interface IPropertyRepository
{
    Task<IEnumerable<Property>> GetAllAsync();
}

public class PropertyRepository : IPropertyRepository
{
    // Implementación específica de MongoDB
}
```

**Beneficios**:
- Cambiar la base de datos sin afectar la lógica de negocio
- Facilita el testing con mocks
- Centraliza la lógica de acceso a datos

### 2. Dependency Injection

**Propósito**: Inversión de control y desacoplamiento

**Configuración** (`Program.cs`):
```csharp
builder.Services.AddSingleton<IMongoDbContext, MongoDbContext>();
builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();
builder.Services.AddScoped<IPropertyService, PropertyService>();
```

**Beneficios**:
- Bajo acoplamiento
- Fácil testing
- Código más mantenible

### 3. DTO Pattern

**Propósito**: Transferir datos entre capas

**Implementación**:
```csharp
// Entidad de dominio
public class Property { ... }

// DTO para API
public class PropertyDto { ... }

// Mapeo en servicio
private PropertyDto MapToDto(Property property) { ... }
```

**Beneficios**:
- Control sobre qué datos se exponen
- Versionado de API
- Validación específica por operación

### 4. Service Layer Pattern

**Propósito**: Encapsular lógica de negocio

**Implementación**:
```csharp
public class PropertyService : IPropertyService
{
    // Coordina entre repositorios
    // Valida reglas de negocio
    // Transforma datos
}
```

## Flujo de Datos

### Request Flow (Lectura)

```
┌──────────┐      ┌────────────┐      ┌─────────┐      ┌────────────┐
│  Client  │──1──▶│ Controller │──2──▶│ Service │──3──▶│ Repository │
└──────────┘      └────────────┘      └─────────┘      └────────────┘
                                                              │
     ▲                                                        │
     │                                                        ▼
     │                                                  ┌──────────┐
     └──────────────────5─────────────────────────────│ MongoDB  │
                      (DTO)                            └──────────┘
```

1. Cliente hace request HTTP
2. Controller valida y delega al Service
3. Service coordina con Repository
4. Repository consulta MongoDB
5. Datos fluyen de vuelta como DTO

### Write Flow (Escritura)

```
┌──────────┐      ┌────────────┐      ┌─────────┐      ┌────────────┐
│  Client  │──1──▶│ Controller │──2──▶│ Service │──3──▶│ Repository │
│  (JSON)  │      │ (Validate) │      │(Business│      │  (Persist) │
└──────────┘      └────────────┘      │  Logic) │      └────────────┘
                                      └─────────┘             │
                                                              ▼
                                                        ┌──────────┐
                                                        │ MongoDB  │
                                                        └──────────┘
```

1. Cliente envía JSON
2. Controller valida con DataAnnotations
3. Service aplica lógica de negocio
4. Repository persiste en MongoDB

## Principios SOLID

### Single Responsibility Principle (SRP)
- Cada clase tiene una única razón para cambiar
- `PropertyService`: Lógica de negocio
- `PropertyRepository`: Acceso a datos
- `PropertiesController`: Manejo de HTTP

### Open/Closed Principle (OCP)
- Abierto para extensión, cerrado para modificación
- Nuevas funcionalidades mediante nuevos servicios
- Sin modificar código existente

### Liskov Substitution Principle (LSP)
- Implementaciones pueden ser sustituidas
- `IPropertyRepository` puede tener múltiples implementaciones
- Tests usan mocks sin romper funcionalidad

### Interface Segregation Principle (ISP)
- Interfaces específicas y cohesivas
- `IPropertyRepository`: Solo operaciones de repositorio
- `IPropertyService`: Solo operaciones de servicio

### Dependency Inversion Principle (DIP)
- Dependencias en abstracciones, no en concreciones
- Controllers dependen de `IPropertyService`
- Services dependen de `IPropertyRepository`

## Optimizaciones de Performance

### MongoDB Indexes
```javascript
{
  "name": 1,
  "address": 1,
  "price": 1
}
```

### Query Optimization
- Uso de FilterDefinitionBuilder
- Proyecciones solo de campos necesarios
- Queries case-insensitive con regex

### Async/Await
- Todas las operaciones I/O son asíncronas
- Mejora escalabilidad
- No bloquea threads

## Seguridad

### Validación de Entrada
```csharp
[Required]
[Range(0.01, double.MaxValue)]
public decimal Price { get; set; }
```

### Manejo de Errores
- Try-catch en todos los endpoints
- Logging de errores
- Mensajes genéricos al cliente
- Stack traces solo en desarrollo

### CORS
- Configurado para frontend específico
- Solo métodos necesarios
- Headers controlados

## Testing Strategy

### Unit Tests
```csharp
[Test]
public async Task GetPropertyByIdAsync_WithValidId_ShouldReturnProperty()
{
    // Arrange
    var mockRepository = new Mock<IPropertyRepository>();
    
    // Act & Assert
}
```

### Mocking
- Moq para crear mocks de interfaces
- Tests aislados sin base de datos
- Verificación de llamadas

## Frontend Architecture

### Next.js App Router
```
app/
├── layout.tsx          # Layout raíz
├── page.tsx            # Home page
└── properties/
    ├── page.tsx        # Lista de propiedades
    └── [id]/
        └── page.tsx    # Detalles
```

### Component Structure
```typescript
components/
├── PropertyCard.tsx     # Tarjeta de propiedad
├── PropertyFilter.tsx   # Filtros de búsqueda
└── PropertyList.tsx     # Grid de propiedades
```

### API Client
```typescript
// lib/api.ts
export const propertyApi = {
  getAll: async () => {...},
  search: async (filters) => {...},
  // ...
}
```

## Diagrama de Dependencias

```
┌─────────────────────────────────────────────┐
│            PropertiesController             │
│  (Depende de IPropertyService & ILogger)    │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│             PropertyService                 │
│ (Depende de IPropertyRepository & ILogger)  │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│            PropertyRepository               │
│   (Depende de IMongoDbContext & Settings)   │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│             MongoDbContext                  │
│         (Depende de IOptions)               │
└─────────────────────────────────────────────┘
```

## Conclusión

Esta arquitectura proporciona:

✅ **Mantenibilidad**: Código organizado y fácil de entender
✅ **Escalabilidad**: Fácil añadir nuevas funcionalidades
✅ **Testeable**: Alta cobertura de tests unitarios
✅ **Flexible**: Fácil cambiar implementaciones
✅ **Profesional**: Sigue estándares de la industria

La arquitectura está diseñada para crecer con el proyecto y adaptarse a nuevos requisitos sin necesidad de refactorizaciones mayores.


