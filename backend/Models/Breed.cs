using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Breed
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public int SpeciesId { get; set; }
    public Species Species { get; set; } = null!;
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
}
