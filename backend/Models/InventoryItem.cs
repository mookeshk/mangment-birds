using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class InventoryItem
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;

    public string Name { get; set; } = string.Empty;

    public int? CategoryId { get; set; }
    public InventoryCategory? Category { get; set; }

    public decimal Quantity { get; set; }
    public string Unit { get; set; } = string.Empty; // كجم, جرام, لتر, عبوة
    public decimal Price { get; set; } // سعر الوحدة

    public decimal WarningLimit { get; set; }
    public decimal CriticalLimit { get; set; }
    
    public DateTime LastUpdated { get; set; }

    public int? ExpenseRecordId { get; set; }
    public ExpenseRecord? ExpenseRecord { get; set; }

    [NotMapped]
    public string Status 
    {
        get
        {
            if (Quantity <= CriticalLimit) return "حرج جداً";
            if (Quantity <= WarningLimit) return "يرجى الطلب";
            return "مستقر";
        }
    }
}
