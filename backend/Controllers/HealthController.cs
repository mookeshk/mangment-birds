using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using backend.Models;


[Authorize]
[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public HealthController(ApplicationDbContext context)
    {
        _context = context;
    }

    private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetHealthRecords()
    {
        var records = await _context.HealthRecords
            .Include(h => h.TargetBird)
            .Include(h => h.TargetCage)
            .Include(h => h.InventoryItem)
            .Where(h => h.UserId == GetUserId())
            .OrderByDescending(h => h.DateGiven)
            .ToListAsync();
        return Ok(records);
    }

    public class CreateHealthRecordDto
    {
        public string Title { get; set; } = string.Empty;
        public DateTime DateGiven { get; set; }
        public DateTime? NextDueDate { get; set; }
        public string Notes { get; set; } = string.Empty;
        public HealthTargetType TargetType { get; set; }
        public int? TargetBirdId { get; set; }
        public int? TargetCageId { get; set; }
        public int? InventoryItemId { get; set; }
        public decimal? QuantityUsed { get; set; }
    }

    [HttpPost]
    public async Task<IActionResult> AddRecord([FromBody] CreateHealthRecordDto input)
    {
        var record = new HealthRecord {
            UserId = GetUserId(),
            Title = input.Title,
            DateGiven = input.DateGiven,
            NextDueDate = input.NextDueDate,
            Notes = input.Notes,
            TargetType = input.TargetType,
            TargetBirdId = input.TargetBirdId,
            TargetCageId = input.TargetCageId,
            InventoryItemId = input.InventoryItemId,
            QuantityUsed = input.QuantityUsed
        };
        
        // Deduct from inventory if applicable
        if (record.InventoryItemId.HasValue && record.QuantityUsed.HasValue && record.QuantityUsed.Value > 0)
        {
            var item = await _context.InventoryItems.FirstOrDefaultAsync(i => i.Id == record.InventoryItemId && i.UserId == record.UserId);
            if (item != null)
            {
                item.Quantity -= record.QuantityUsed.Value;
                
                // Add consumption log
                var consumption = new InventoryConsumption
                {
                    UserId = record.UserId,
                    InventoryItemId = item.Id,
                    Quantity = record.QuantityUsed.Value,
                    DateConsumed = record.DateGiven,
                    Notes = $"استهلاك جرعة: {record.Title}"
                };
                _context.InventoryConsumptions.Add(consumption);
            }
        }

        _context.HealthRecords.Add(record);
        await _context.SaveChangesAsync();
        return Ok(record);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRecord(int id)
    {
        var record = await _context.HealthRecords.FirstOrDefaultAsync(h => h.Id == id && h.UserId == GetUserId());
        if (record == null) return NotFound();
        _context.HealthRecords.Remove(record);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
