using RealEstateApi.Domain.Entities;
using RealEstateApi.Application.DTOs;

namespace RealEstateApi.Application.Interfaces;

/// <summary>
/// Repository interface for Property operations
/// </summary>
public interface IPropertyRepository
{
    Task<IEnumerable<Property>> GetAllAsync();
    Task<Property?> GetByIdAsync(string id);
    Task<IEnumerable<Property>> GetFilteredAsync(PropertyFilterDto filter);
    Task<Property> CreateAsync(Property property);
    Task<bool> UpdateAsync(string id, Property property);
    Task<bool> DeleteAsync(string id);
    Task<long> CountAsync();
}


