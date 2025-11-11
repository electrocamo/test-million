using System.ComponentModel.DataAnnotations;

namespace RealEstateApi.Application.DTOs;

/// <summary>
/// Data Transfer Object for updating a Property
/// </summary>
public class UpdatePropertyDto
{
    [StringLength(200, MinimumLength = 3, ErrorMessage = "Name must be between 3 and 200 characters")]
    public string? Name { get; set; }

    [StringLength(500, MinimumLength = 5, ErrorMessage = "Address must be between 5 and 500 characters")]
    public string? Address { get; set; }

    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal? Price { get; set; }

    [Url(ErrorMessage = "Image must be a valid URL")]
    public string? Image { get; set; }
}


