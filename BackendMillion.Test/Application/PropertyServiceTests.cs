using Microsoft.Extensions.Logging;
using Moq;
using RealEstateApi.Application.DTOs;
using RealEstateApi.Application.Interfaces;
using RealEstateApi.Application.Services;
using RealEstateApi.Domain.Entities;

namespace BackendMillion.Test.Application;

[TestFixture]
public class PropertyServiceTests
{
    private Mock<IPropertyRepository> _mockRepository = null!;
    private Mock<ILogger<PropertyService>> _mockLogger = null!;
    private PropertyService _service = null!;

    [SetUp]
    public void Setup()
    {
        _mockRepository = new Mock<IPropertyRepository>();
        _mockLogger = new Mock<ILogger<PropertyService>>();
        _service = new PropertyService(_mockRepository.Object, _mockLogger.Object);
    }

    [Test]
    public async Task GetAllPropertiesAsync_ShouldReturnAllProperties()
    {
        // Arrange
        var properties = new List<Property>
        {
            new Property
            {
                Id = "1",
                IdOwner = "owner1",
                Name = "Property 1",
                Address = "Address 1",
                Price = 100000,
                Image = "https://example.com/image1.jpg"
            },
            new Property
            {
                Id = "2",
                IdOwner = "owner2",
                Name = "Property 2",
                Address = "Address 2",
                Price = 200000,
                Image = "https://example.com/image2.jpg"
            }
        };

        _mockRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(properties);

        // Act
        var result = await _service.GetAllPropertiesAsync();

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Count(), Is.EqualTo(2));
        _mockRepository.Verify(r => r.GetAllAsync(), Times.Once);
    }

    [Test]
    public async Task GetPropertyByIdAsync_WithValidId_ShouldReturnProperty()
    {
        // Arrange
        var property = new Property
        {
            Id = "1",
            IdOwner = "owner1",
            Name = "Test Property",
            Address = "Test Address",
            Price = 150000,
            Image = "https://example.com/image.jpg"
        };

        _mockRepository.Setup(r => r.GetByIdAsync("1")).ReturnsAsync(property);

        // Act
        var result = await _service.GetPropertyByIdAsync("1");

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Id, Is.EqualTo("1"));
        Assert.That(result.Name, Is.EqualTo("Test Property"));
        _mockRepository.Verify(r => r.GetByIdAsync("1"), Times.Once);
    }

    [Test]
    public async Task GetPropertyByIdAsync_WithInvalidId_ShouldReturnNull()
    {
        // Arrange
        _mockRepository.Setup(r => r.GetByIdAsync("999")).ReturnsAsync((Property?)null);

        // Act
        var result = await _service.GetPropertyByIdAsync("999");

        // Assert
        Assert.That(result, Is.Null);
        _mockRepository.Verify(r => r.GetByIdAsync("999"), Times.Once);
    }

    [Test]
    public void GetPropertyByIdAsync_WithNullId_ShouldThrowArgumentException()
    {
        // Act & Assert
        Assert.ThrowsAsync<ArgumentException>(() => _service.GetPropertyByIdAsync(null!));
    }

    [Test]
    public async Task GetFilteredPropertiesAsync_WithValidFilter_ShouldReturnFilteredProperties()
    {
        // Arrange
        var filter = new PropertyFilterDto
        {
            Name = "Test",
            MinPrice = 100000,
            MaxPrice = 200000
        };

        var properties = new List<Property>
        {
            new Property
            {
                Id = "1",
                IdOwner = "owner1",
                Name = "Test Property",
                Address = "Test Address",
                Price = 150000,
                Image = "https://example.com/image.jpg"
            }
        };

        _mockRepository.Setup(r => r.GetFilteredAsync(filter)).ReturnsAsync(properties);

        // Act
        var result = await _service.GetFilteredPropertiesAsync(filter);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Count(), Is.EqualTo(1));
        _mockRepository.Verify(r => r.GetFilteredAsync(filter), Times.Once);
    }

    [Test]
    public void GetFilteredPropertiesAsync_WithInvalidPriceRange_ShouldThrowArgumentException()
    {
        // Arrange
        var filter = new PropertyFilterDto
        {
            MinPrice = 200000,
            MaxPrice = 100000
        };

        // Act & Assert
        Assert.ThrowsAsync<ArgumentException>(() => _service.GetFilteredPropertiesAsync(filter));
    }

    [Test]
    public async Task CreatePropertyAsync_WithValidData_ShouldCreateProperty()
    {
        // Arrange
        var createDto = new CreatePropertyDto
        {
            IdOwner = "owner1",
            Name = "New Property",
            Address = "New Address",
            Price = 180000,
            Image = "https://example.com/image.jpg"
        };

        var createdProperty = new Property
        {
            Id = "1",
            IdOwner = createDto.IdOwner,
            Name = createDto.Name,
            Address = createDto.Address,
            Price = createDto.Price,
            Image = createDto.Image
        };

        _mockRepository.Setup(r => r.CreateAsync(It.IsAny<Property>())).ReturnsAsync(createdProperty);

        // Act
        var result = await _service.CreatePropertyAsync(createDto);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Name, Is.EqualTo("New Property"));
        Assert.That(result.Price, Is.EqualTo(180000));
        _mockRepository.Verify(r => r.CreateAsync(It.IsAny<Property>()), Times.Once);
    }

    [Test]
    public void CreatePropertyAsync_WithNullData_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        Assert.ThrowsAsync<ArgumentNullException>(() => _service.CreatePropertyAsync(null!));
    }

    [Test]
    public async Task UpdatePropertyAsync_WithValidData_ShouldUpdateProperty()
    {
        // Arrange
        var existingProperty = new Property
        {
            Id = "1",
            IdOwner = "owner1",
            Name = "Old Name",
            Address = "Old Address",
            Price = 150000,
            Image = "https://example.com/old.jpg"
        };

        var updateDto = new UpdatePropertyDto
        {
            Name = "Updated Name",
            Price = 175000
        };

        _mockRepository.Setup(r => r.GetByIdAsync("1")).ReturnsAsync(existingProperty);
        _mockRepository.Setup(r => r.UpdateAsync("1", It.IsAny<Property>())).ReturnsAsync(true);

        // Act
        var result = await _service.UpdatePropertyAsync("1", updateDto);

        // Assert
        Assert.That(result, Is.True);
        _mockRepository.Verify(r => r.GetByIdAsync("1"), Times.Once);
        _mockRepository.Verify(r => r.UpdateAsync("1", It.IsAny<Property>()), Times.Once);
    }

    [Test]
    public async Task UpdatePropertyAsync_WithNonExistentId_ShouldReturnFalse()
    {
        // Arrange
        var updateDto = new UpdatePropertyDto
        {
            Name = "Updated Name"
        };

        _mockRepository.Setup(r => r.GetByIdAsync("999")).ReturnsAsync((Property?)null);

        // Act
        var result = await _service.UpdatePropertyAsync("999", updateDto);

        // Assert
        Assert.That(result, Is.False);
        _mockRepository.Verify(r => r.GetByIdAsync("999"), Times.Once);
        _mockRepository.Verify(r => r.UpdateAsync(It.IsAny<string>(), It.IsAny<Property>()), Times.Never);
    }

    [Test]
    public async Task DeletePropertyAsync_WithValidId_ShouldDeleteProperty()
    {
        // Arrange
        _mockRepository.Setup(r => r.DeleteAsync("1")).ReturnsAsync(true);

        // Act
        var result = await _service.DeletePropertyAsync("1");

        // Assert
        Assert.That(result, Is.True);
        _mockRepository.Verify(r => r.DeleteAsync("1"), Times.Once);
    }

    [Test]
    public async Task DeletePropertyAsync_WithNonExistentId_ShouldReturnFalse()
    {
        // Arrange
        _mockRepository.Setup(r => r.DeleteAsync("999")).ReturnsAsync(false);

        // Act
        var result = await _service.DeletePropertyAsync("999");

        // Assert
        Assert.That(result, Is.False);
        _mockRepository.Verify(r => r.DeleteAsync("999"), Times.Once);
    }

    [Test]
    public void DeletePropertyAsync_WithNullId_ShouldThrowArgumentException()
    {
        // Act & Assert
        Assert.ThrowsAsync<ArgumentException>(() => _service.DeletePropertyAsync(null!));
    }
}


