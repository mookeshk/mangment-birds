using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Species
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public int? MaturityAgeInDays { get; set; } // سن البلوغ بالأيام
    public int? IncubationPeriodInDays { get; set; } // فترة حضانة البيض بالأيام
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    
    // Navigation property for related breeds
    public ICollection<Breed> Breeds { get; set; } = new List<Breed>();
}
