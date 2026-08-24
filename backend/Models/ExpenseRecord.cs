using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class ExpenseRecord
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    
    public DateTime ExpenseDate { get; set; }
    public decimal Amount { get; set; }
    
    public string Title { get; set; } = string.Empty; 
    public string Category { get; set; } = string.Empty; 
    public string Entity { get; set; } = string.Empty; // Supplier
    public string Notes { get; set; } = string.Empty;
}
