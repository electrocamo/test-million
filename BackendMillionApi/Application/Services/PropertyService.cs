using RealEstateApi.Application.DTOs;
using RealEstateApi.Application.Interfaces;
using RealEstateApi.Domain.Entities;

namespace RealEstateApi.Application.Services;

/// <summary>
/// Service implementation for Property business logic
/// </summary>
public class PropertyService : IPropertyService
{
    private readonly IPropertyRepository _repository;
    private readonly ILogger<PropertyService> _logger;

    public PropertyService(IPropertyRepository repository, ILogger<PropertyService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<IEnumerable<PropertyDto>> GetAllPropertiesAsync()
    {
        try
        {
            var properties = await _repository.GetAllAsync();
            return properties.Select(MapToDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all properties");
            throw;
        }
    }

    public async Task<PropertyDto?> GetPropertyByIdAsync(string id)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentException("Property ID cannot be null or empty", nameof(id));
            }

            var property = await _repository.GetByIdAsync(id);
            return property != null ? MapToDto(property) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving property with ID: {PropertyId}", id);
            throw;
        }
    }

    public async Task<IEnumerable<PropertyDto>> GetFilteredPropertiesAsync(PropertyFilterDto filter)
    {
        try
        {
            if (filter == null)
            {
                throw new ArgumentNullException(nameof(filter));
            }

            // Validate price range
            if (filter.MinPrice.HasValue && filter.MaxPrice.HasValue 
                && filter.MinPrice.Value > filter.MaxPrice.Value)
            {
                throw new ArgumentException("Minimum price cannot be greater than maximum price");
            }

            var properties = await _repository.GetFilteredAsync(filter);
            return properties.Select(MapToDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving filtered properties");
            throw;
        }
    }

    public async Task<PropertyDto> CreatePropertyAsync(CreatePropertyDto createDto)
    {
        try
        {
            if (createDto == null)
            {
                throw new ArgumentNullException(nameof(createDto));
            }

            var property = new Property
            {
                IdOwner = createDto.IdOwner,
                Name = createDto.Name.Trim(),
                Address = createDto.Address.Trim(),
                Price = createDto.Price,
                Image = createDto.Image.Trim()
            };

            var createdProperty = await _repository.CreateAsync(property);
            _logger.LogInformation("Property created with ID: {PropertyId}", createdProperty.Id);
            
            return MapToDto(createdProperty);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating property");
            throw;
        }
    }

    public async Task<bool> UpdatePropertyAsync(string id, UpdatePropertyDto updateDto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentException("Property ID cannot be null or empty", nameof(id));
            }

            if (updateDto == null)
            {
                throw new ArgumentNullException(nameof(updateDto));
            }

            var existingProperty = await _repository.GetByIdAsync(id);
            if (existingProperty == null)
            {
                return false;
            }

            // Update only provided fields
            if (!string.IsNullOrWhiteSpace(updateDto.Name))
            {
                existingProperty.Name = updateDto.Name.Trim();
            }

            if (!string.IsNullOrWhiteSpace(updateDto.Address))
            {
                existingProperty.Address = updateDto.Address.Trim();
            }

            if (updateDto.Price.HasValue)
            {
                existingProperty.Price = updateDto.Price.Value;
            }

            if (!string.IsNullOrWhiteSpace(updateDto.Image))
            {
                existingProperty.Image = updateDto.Image.Trim();
            }

            var updated = await _repository.UpdateAsync(id, existingProperty);
            
            if (updated)
            {
                _logger.LogInformation("Property updated with ID: {PropertyId}", id);
            }
            
            return updated;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating property with ID: {PropertyId}", id);
            throw;
        }
    }

    public async Task<bool> DeletePropertyAsync(string id)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentException("Property ID cannot be null or empty", nameof(id));
            }

            var deleted = await _repository.DeleteAsync(id);
            
            if (deleted)
            {
                _logger.LogInformation("Property deleted with ID: {PropertyId}", id);
            }
            else
            {
                _logger.LogWarning("Property not found for deletion with ID: {PropertyId}", id);
            }
            
            return deleted;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting property with ID: {PropertyId}", id);
            throw;
        }
    }

    private static PropertyDto MapToDto(Property property)
    {
        return new PropertyDto
        {
            Id = property.Id,
            IdOwner = property.IdOwner,
            Name = property.Name,
            Address = property.Address,
            Price = property.Price,
            Image = property.Image
        };
    }
}


