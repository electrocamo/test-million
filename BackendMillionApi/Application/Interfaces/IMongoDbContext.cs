using MongoDB.Driver;

namespace RealEstateApi.Application.Interfaces;

/// <summary>
/// Interface for MongoDB context
/// </summary>
public interface IMongoDbContext
{
    IMongoCollection<T> GetCollection<T>(string collectionName);
}


