namespace backend.Models;

public class InventoryConsumption
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;

    public int InventoryItemId { get; set; }
    public InventoryItem InventoryItem { get; set; } = null!;

    public decimal Quantity { get; set; }
    public DateTime DateConsumed { get; set; }
    public string Notes { get; set; } = string.Empty;
}
