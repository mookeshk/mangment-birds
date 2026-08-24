using System.ComponentModel.DataAnnotations;
namespace backend.Models;
public class SubscriptionPackage
{
    public int Id { get; set; }
    [Required] public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int DurationMonths { get; set; }
    public string? Features { get; set; } // JSON or comma separated
}
