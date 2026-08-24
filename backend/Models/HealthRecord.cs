namespace backend.Models;

public enum HealthTargetType
{
    Bird = 0,
    Cage = 1,
    All = 2
}

public class HealthRecord
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public DateTime DateGiven { get; set; }
    public DateTime? NextDueDate { get; set; }
    public string Notes { get; set; } = string.Empty;

    public HealthTargetType TargetType { get; set; }
    
    public int? TargetBirdId { get; set; }
    public Bird? TargetBird { get; set; }

    public int? TargetCageId { get; set; }
    public Cage? TargetCage { get; set; }

    public int? InventoryItemId { get; set; }
    public InventoryItem? InventoryItem { get; set; }
    public decimal? QuantityUsed { get; set; }
}
