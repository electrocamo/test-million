using Microsoft.Extensions.Options;
using MongoDB.Driver;
using RealEstateApi.Application.DTOs;
using RealEstateApi.Application.Interfaces;
using RealEstateApi.Domain.Entities;
using RealEstateApi.Infrastructure.Data;

namespace RealEstateApi.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for Property with optimized MongoDB queries
/// </summary>
public class PropertyRepository : IPropertyRepository
{
    private readonly IMongoCollection<Property> _properties;

    public PropertyRepository(IMongoDbContext context, IOptions<MongoDbSettings> settings)
    {
        _properties = context.GetCollection<Property>(settings.Value.PropertiesCollectionName);
        
        // Create indexes for better query performance
        CreateIndexes();
    }

    private void CreateIndexes()
    {
        var indexKeysDefinition = Builders<Property>.IndexKeys
            .Ascending(p => p.Name)
            .Ascending(p => p.Address)
            .Ascending(p => p.Price);
        
        var indexOptions = new CreateIndexOptions { Name = "PropertySearchIndex" };
        var indexModel = new CreateIndexModel<Property>(indexKeysDefinition, indexOptions);
        
        // Create index if it doesn't exist (will be idempotent)
        _properties.Indexes.CreateOneAsync(indexModel);
    }

    public async Task<IEnumerable<Property>> GetAllAsync()
    {
        return await _properties.Find(_ => true).ToListAsync();
    }

    public async Task<Property?> GetByIdAsync(string id)
    {
        return await _properties.Find(p => p.Id == id).FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<Property>> GetFilteredAsync(PropertyFilterDto filter)
    {
        var filterBuilder = Builders<Property>.Filter;
        var filters = new List<FilterDefinition<Property>>();

        // Filter by name (case-insensitive partial match)
        if (!string.IsNullOrWhiteSpace(filter.Name))
        {
            filters.Add(filterBuilder.Regex(p => p.Name, 
                new MongoDB.Bson.BsonRegularExpression(filter.Name, "i")));
        }

        // Filter by address (case-insensitive partial match)
        if (!string.IsNullOrWhiteSpace(filter.Address))
        {
            filters.Add(filterBuilder.Regex(p => p.Address, 
                new MongoDB.Bson.BsonRegularExpression(filter.Address, "i")));
        }

        // Filter by price range
        if (filter.MinPrice.HasValue)
        {
            filters.Add(filterBuilder.Gte(p => p.Price, filter.MinPrice.Value));
        }

        if (filter.MaxPrice.HasValue)
        {
            filters.Add(filterBuilder.Lte(p => p.Price, filter.MaxPrice.Value));
        }

        // Combine filters with AND logic
        var combinedFilter = filters.Count > 0 
            ? filterBuilder.And(filters) 
            : filterBuilder.Empty;

        // Execute optimized query with projection if needed
        return await _properties
            .Find(combinedFilter)
            .SortByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<Property> CreateAsync(Property property)
    {
        property.CreatedAt = DateTime.UtcNow;
        property.UpdatedAt = DateTime.UtcNow;
        await _properties.InsertOneAsync(property);
        return property;
    }

    public async Task<bool> UpdateAsync(string id, Property property)
    {
        property.UpdatedAt = DateTime.UtcNow;
        var result = await _properties.ReplaceOneAsync(p => p.Id == id, property);
        return result.IsAcknowledged && result.ModifiedCount > 0;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _properties.DeleteOneAsync(p => p.Id == id);
        return result.IsAcknowledged && result.DeletedCount > 0;
    }

    public async Task<long> CountAsync()
    {
        return await _properties.CountDocumentsAsync(_ => true);
    }
}


