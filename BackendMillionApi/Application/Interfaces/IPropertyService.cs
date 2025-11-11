using RealEstateApi.Application.DTOs;

namespace RealEstateApi.Application.Interfaces;

/// <summary>
/// Service interface for Property business logic
/// </summary>
public interface IPropertyService
{
    Task<IEnumerable<PropertyDto>> GetAllPropertiesAsync();
    Task<PropertyDto?> GetPropertyByIdAsync(string id);
    Task<IEnumerable<PropertyDto>> GetFilteredPropertiesAsync(PropertyFilterDto filter);
    Task<PropertyDto> CreatePropertyAsync(CreatePropertyDto createDto);
    Task<bool> UpdatePropertyAsync(string id, UpdatePropertyDto updateDto);
    Task<bool> DeletePropertyAsync(string id);
}


