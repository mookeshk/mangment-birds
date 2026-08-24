using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class InventoryController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public InventoryController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetInventoryItems()
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null) return Unauthorized();

        var items = await _context.InventoryItems
            .Include(i => i.Category)
            .Where(i => i.UserId == userId)
            .OrderByDescending(i => i.LastUpdated)
            .ToListAsync();

        return Ok(items.Select(i => new {
            i.Id,
            i.Name,
            i.CategoryId,
            CategoryName = i.Category?.Name ?? "غير محدد",
            i.Quantity,
            i.Unit,
            i.Price,
            i.WarningLimit,
            i.CriticalLimit,
            i.Status,
            i.LastUpdated
        }));
    }

    [HttpPost]
    public async Task<ActionResult<InventoryItem>> CreateInventoryItem(CreateInventoryItemDto input)
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null) return Unauthorized();

        var item = new InventoryItem
        {
            Name = input.Name,
            CategoryId = input.CategoryId,
            Quantity = input.Quantity,
            Unit = input.Unit,
            Price = input.Price,
            WarningLimit = input.WarningLimit,
            CriticalLimit = input.CriticalLimit,
            LastUpdated = DateTime.UtcNow,
            UserId = userId
        };

        if (input.RecordAsExpense)
        {
            var expense = new ExpenseRecord
            {
                UserId = userId,
                Title = $"شراء {input.Name} ({input.Quantity} {input.Unit})",
                Category = "مشتريات مخزون",
                Amount = input.Quantity * input.Price,
                ExpenseDate = DateTime.UtcNow,
                Notes = "تسجيل تلقائي من قسم المخزون"
            };
            _context.ExpenseRecords.Add(expense);
            item.ExpenseRecord = expense;
        }

        _context.InventoryItems.Add(item);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetInventoryItems), new { id = item.Id }, item);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateInventoryItem(int id, CreateInventoryItemDto input)
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null) return Unauthorized();

        var item = await _context.InventoryItems.Include(i => i.ExpenseRecord).FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
        if (item == null) return NotFound();

        if (input.RecordAsExpense)
        {
            if (item.ExpenseRecord != null)
            {
                // Update the linked expense record
                item.ExpenseRecord.Amount = input.Quantity * input.Price;
                item.ExpenseRecord.Title = $"شراء {input.Name} ({input.Quantity} {input.Unit})";
            }
            else
            {
                // Create one if it wasn't linked before but now requested
                var expense = new ExpenseRecord
                {
                    UserId = userId,
                    Title = $"شراء {input.Name} ({input.Quantity} {input.Unit})",
                    Category = "مشتريات مخزون",
                    Amount = input.Quantity * input.Price,
                    ExpenseDate = DateTime.UtcNow,
                    Notes = "تسجيل تلقائي من قسم المخزون"
                };
                _context.ExpenseRecords.Add(expense);
                item.ExpenseRecord = expense;
            }
        }

        item.Name = input.Name;
        item.CategoryId = input.CategoryId;
        item.Quantity = input.Quantity;
        item.Unit = input.Unit;
        item.Price = input.Price;
        item.WarningLimit = input.WarningLimit;
        item.CriticalLimit = input.CriticalLimit;
        item.LastUpdated = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInventoryItem(int id)
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null) return Unauthorized();

        var item = await _context.InventoryItems.Include(i => i.ExpenseRecord).FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
        if (item == null) return NotFound();

        // Optional: Also delete the linked expense record when deleting inventory item
        if (item.ExpenseRecord != null)
        {
            _context.ExpenseRecords.Remove(item.ExpenseRecord);
        }

        _context.InventoryItems.Remove(item);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public class CreateInventoryItemDto
{
    public string Name { get; set; } = string.Empty;
    public int? CategoryId { get; set; }
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal WarningLimit { get; set; }
    public decimal CriticalLimit { get; set; }
    public bool RecordAsExpense { get; set; }
}

