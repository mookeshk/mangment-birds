using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace backend.Models;
public class SubscriptionRequest
{
    public int Id { get; set; }
    [Required] public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    public int PackageId { get; set; }
    public SubscriptionPackage Package { get; set; } = null!;
    [Required] public string ReceiptUrl { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
    public DateTime RequestDate { get; set; } = DateTime.UtcNow;
}
