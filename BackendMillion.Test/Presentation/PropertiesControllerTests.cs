using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using RealEstateApi.Application.DTOs;
using RealEstateApi.Application.Interfaces;
using RealEstateApi.Presentation.Controllers;

namespace BackendMillion.Test.Presentation;

[TestFixture]
public class PropertiesControllerTests
{
    private Mock<IPropertyService> _mockService = null!;
    private Mock<ILogger<PropertiesController>> _mockLogger = null!;
    private PropertiesController _controller = null!;

    [SetUp]
    public void Setup()
    {
        _mockService = new Mock<IPropertyService>();
        _mockLogger = new Mock<ILogger<PropertiesController>>();
        _controller = new PropertiesController(_mockService.Object, _mockLogger.Object);
    }

    [Test]
    public async Task GetAllProperties_ShouldReturnOkWithProperties()
    {
        // Arrange
        var properties = new List<PropertyDto>
        {
            new PropertyDto
            {
                Id = "1",
                IdOwner = "owner1",
                Name = "Property 1",
                Address = "Address 1",
                Price = 100000,
                Image = "https://example.com/image1.jpg"
            }
        };

        _mockService.Setup(s => s.GetAllPropertiesAsync()).ReturnsAsync(properties);

        // Act
        var result = await _controller.GetAllProperties();

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = result.Result as OkObjectResult;
        Assert.That(okResult?.Value, Is.EqualTo(properties));
    }

    [Test]
    public async Task GetPropertyById_WithValidId_ShouldReturnOkWithProperty()
    {
        // Arrange
        var property = new PropertyDto
        {
            Id = "1",
            IdOwner = "owner1",
            Name = "Test Property",
            Address = "Test Address",
            Price = 150000,
            Image = "https://example.com/image.jpg"
        };

        _mockService.Setup(s => s.GetPropertyByIdAsync("1")).ReturnsAsync(property);

        // Act
        var result = await _controller.GetPropertyById("1");

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = result.Result as OkObjectResult;
        Assert.That(okResult?.Value, Is.EqualTo(property));
    }

    [Test]
    public async Task GetPropertyById_WithInvalidId_ShouldReturnNotFound()
    {
        // Arrange
        _mockService.Setup(s => s.GetPropertyByIdAsync("999")).ReturnsAsync((PropertyDto?)null);

        // Act
        var result = await _controller.GetPropertyById("999");

        // Assert
        Assert.That(result.Result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task SearchProperties_WithValidFilters_ShouldReturnOkWithFilteredProperties()
    {
        // Arrange
        var properties = new List<PropertyDto>
        {
            new PropertyDto
            {
                Id = "1",
                IdOwner = "owner1",
                Name = "Test Property",
                Address = "Test Address",
                Price = 150000,
                Image = "https://example.com/image.jpg"
            }
        };

        _mockService.Setup(s => s.GetFilteredPropertiesAsync(It.IsAny<PropertyFilterDto>()))
            .ReturnsAsync(properties);

        // Act
        var result = await _controller.SearchProperties("Test", "Address", 100000, 200000);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var okResult = result.Result as OkObjectResult;
        Assert.That(okResult?.Value, Is.EqualTo(properties));
    }

    [Test]
    public async Task SearchProperties_WithInvalidPriceRange_ShouldReturnBadRequest()
    {
        // Arrange
        _mockService.Setup(s => s.GetFilteredPropertiesAsync(It.IsAny<PropertyFilterDto>()))
            .ThrowsAsync(new ArgumentException("Invalid price range"));

        // Act
        var result = await _controller.SearchProperties(null, null, 200000, 100000);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<BadRequestObjectResult>());
    }

    [Test]
    public async Task CreateProperty_WithValidData_ShouldReturnCreatedAtAction()
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

        var createdProperty = new PropertyDto
        {
            Id = "1",
            IdOwner = createDto.IdOwner,
            Name = createDto.Name,
            Address = createDto.Address,
            Price = createDto.Price,
            Image = createDto.Image
        };

        _mockService.Setup(s => s.CreatePropertyAsync(createDto)).ReturnsAsync(createdProperty);

        // Act
        var result = await _controller.CreateProperty(createDto);

        // Assert
        Assert.That(result.Result, Is.InstanceOf<CreatedAtActionResult>());
        var createdResult = result.Result as CreatedAtActionResult;
        Assert.That(createdResult?.Value, Is.EqualTo(createdProperty));
    }

    [Test]
    public async Task UpdateProperty_WithValidData_ShouldReturnNoContent()
    {
        // Arrange
        var updateDto = new UpdatePropertyDto
        {
            Name = "Updated Name",
            Price = 175000
        };

        _mockService.Setup(s => s.UpdatePropertyAsync("1", updateDto)).ReturnsAsync(true);

        // Act
        var result = await _controller.UpdateProperty("1", updateDto);

        // Assert
        Assert.That(result, Is.InstanceOf<NoContentResult>());
    }

    [Test]
    public async Task UpdateProperty_WithNonExistentId_ShouldReturnNotFound()
    {
        // Arrange
        var updateDto = new UpdatePropertyDto
        {
            Name = "Updated Name"
        };

        _mockService.Setup(s => s.UpdatePropertyAsync("999", updateDto)).ReturnsAsync(false);

        // Act
        var result = await _controller.UpdateProperty("999", updateDto);

        // Assert
        Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task DeleteProperty_WithValidId_ShouldReturnNoContent()
    {
        // Arrange
        _mockService.Setup(s => s.DeletePropertyAsync("1")).ReturnsAsync(true);

        // Act
        var result = await _controller.DeleteProperty("1");

        // Assert
        Assert.That(result, Is.InstanceOf<NoContentResult>());
    }

    [Test]
    public async Task DeleteProperty_WithNonExistentId_ShouldReturnNotFound()
    {
        // Arrange
        _mockService.Setup(s => s.DeletePropertyAsync("999")).ReturnsAsync(false);

        // Act
        var result = await _controller.DeleteProperty("999");

        // Assert
        Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
    }
}


