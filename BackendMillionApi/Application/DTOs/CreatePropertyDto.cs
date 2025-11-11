using System.ComponentModel.DataAnnotations;

namespace RealEstateApi.Application.DTOs;

/// <summary>
/// Data Transfer Object for creating a new Property
/// </summary>
public class CreatePropertyDto
{
    [Required(ErrorMessage = "Owner ID is required")]
    public string IdOwner { get; set; } = string.Empty;

    [Required(ErrorMessage = "Name is required")]
    [StringLength(200, MinimumLength = 3, ErrorMessage = "Name must be between 3 and 200 characters")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Address is required")]
    [StringLength(500, MinimumLength = 5, ErrorMessage = "Address must be between 5 and 500 characters")]
    public string Address { get; set; } = string.Empty;

    [Required(ErrorMessage = "Price is required")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Image is required")]
    [Url(ErrorMessage = "Image must be a valid URL")]
    public string Image { get; set; } = string.Empty;
}


