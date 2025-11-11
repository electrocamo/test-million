using Microsoft.AspNetCore.Mvc;
using RealEstateApi.Application.DTOs;
using RealEstateApi.Application.Interfaces;

namespace RealEstateApi.Presentation.Controllers;

/// <summary>
/// Controller for managing property operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class PropertiesController : ControllerBase
{
    private readonly IPropertyService _propertyService;
    private readonly ILogger<PropertiesController> _logger;

    public PropertiesController(IPropertyService propertyService, ILogger<PropertiesController> logger)
    {
        _propertyService = propertyService;
        _logger = logger;
    }

    /// <summary>
    /// Get all properties
    /// </summary>
    /// <returns>List of all properties</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<PropertyDto>>> GetAllProperties()
    {
        try
        {
            var properties = await _propertyService.GetAllPropertiesAsync();
            return Ok(properties);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all properties");
            return StatusCode(500, new { message = "An error occurred while retrieving properties" });
        }
    }

    /// <summary>
    /// Get a specific property by ID
    /// </summary>
    /// <param name="id">Property ID</param>
    /// <returns>Property details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<PropertyDto>> GetPropertyById(string id)
    {
        try
        {
            var property = await _propertyService.GetPropertyByIdAsync(id);
            
            if (property == null)
            {
                return NotFound(new { message = $"Property with ID {id} not found" });
            }
            
            return Ok(property);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid property ID: {PropertyId}", id);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving property with ID: {PropertyId}", id);
            return StatusCode(500, new { message = "An error occurred while retrieving the property" });
        }
    }

    /// <summary>
    /// Search properties with filters
    /// </summary>
    /// <param name="name">Property name (partial match)</param>
    /// <param name="address">Property address (partial match)</param>
    /// <param name="minPrice">Minimum price</param>
    /// <param name="maxPrice">Maximum price</param>
    /// <returns>Filtered list of properties</returns>
    [HttpGet("search")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<PropertyDto>>> SearchProperties(
        [FromQuery] string? name,
        [FromQuery] string? address,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice)
    {
        try
        {
            var filter = new PropertyFilterDto
            {
                Name = name,
                Address = address,
                MinPrice = minPrice,
                MaxPrice = maxPrice
            };

            var properties = await _propertyService.GetFilteredPropertiesAsync(filter);
            return Ok(properties);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid filter parameters");
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching properties");
            return StatusCode(500, new { message = "An error occurred while searching properties" });
        }
    }

    /// <summary>
    /// Create a new property
    /// </summary>
    /// <param name="createDto">Property creation data</param>
    /// <returns>Created property</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<PropertyDto>> CreateProperty([FromBody] CreatePropertyDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var property = await _propertyService.CreatePropertyAsync(createDto);
            return CreatedAtAction(nameof(GetPropertyById), new { id = property.Id }, property);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating property");
            return StatusCode(500, new { message = "An error occurred while creating the property" });
        }
    }

    /// <summary>
    /// Update an existing property
    /// </summary>
    /// <param name="id">Property ID</param>
    /// <param name="updateDto">Property update data</param>
    /// <returns>No content if successful</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateProperty(string id, [FromBody] UpdatePropertyDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updated = await _propertyService.UpdatePropertyAsync(id, updateDto);
            
            if (!updated)
            {
                return NotFound(new { message = $"Property with ID {id} not found" });
            }
            
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid update data for property ID: {PropertyId}", id);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating property with ID: {PropertyId}", id);
            return StatusCode(500, new { message = "An error occurred while updating the property" });
        }
    }

    /// <summary>
    /// Delete a property
    /// </summary>
    /// <param name="id">Property ID</param>
    /// <returns>No content if successful</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteProperty(string id)
    {
        try
        {
            var deleted = await _propertyService.DeletePropertyAsync(id);
            
            if (!deleted)
            {
                return NotFound(new { message = $"Property with ID {id} not found" });
            }
            
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid property ID: {PropertyId}", id);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting property with ID: {PropertyId}", id);
            return StatusCode(500, new { message = "An error occurred while deleting the property" });
        }
    }
}


