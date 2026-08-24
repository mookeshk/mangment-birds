using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FinanceController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public FinanceController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<object>> GetDashboardData()
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null) return Unauthorized();

        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1);

        var salesThisMonth = await _context.SaleRecords
            .Where(s => s.UserId == userId && s.SaleDate >= startOfMonth)
            .SumAsync(s => s.SalePrice);

        var totalSales = await _context.SaleRecords
            .Where(s => s.UserId == userId)
            .SumAsync(s => s.SalePrice);

        var totalExpenses = await _context.ExpenseRecords
            .Where(e => e.UserId == userId)
            .SumAsync(e => e.Amount);

        var recentSales = await _context.SaleRecords
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.SaleDate)
            .Take(10)
            .Select(s => new {
                Id = $"s_{s.Id}",
                Date = s.SaleDate,
                Type = "income",
                Title = !string.IsNullOrEmpty(s.Title) ? s.Title : (s.BirdId != null ? $"بيع طائر #{s.BirdId}" : "مبيعات عامة"),
                Entity = s.BuyerName,
                Amount = s.SalePrice,
                ActualDate = s.SaleDate,
                Notes = s.Notes
            })
            .ToListAsync();

        var recentExpenses = await _context.ExpenseRecords
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.ExpenseDate)
            .Take(10)
            .Select(e => new {
                Id = $"e_{e.Id}",
                Date = e.ExpenseDate,
                Type = "expense",
                Title = e.Title,
                Entity = e.Entity,
                Amount = e.Amount,
                ActualDate = e.ExpenseDate,
                Notes = e.Notes
            })
            .ToListAsync();

        var transactions = recentSales.Concat(recentExpenses)
            .OrderByDescending(t => t.ActualDate)
            .Take(20)
            .Select(t => new {
                id = t.Id,
                date = t.Date.ToString("yyyy-MM-dd"),
                type = t.Type,
                title = t.Title,
                entity = t.Entity,
                amount = t.Amount,
                notes = t.Notes
            })
            .ToList();

        return Ok(new {
            SalesThisMonth = salesThisMonth,
            TotalSales = totalSales,
            TotalExpenses = totalExpenses,
            NetProfit = totalSales - totalExpenses,
            Transactions = transactions
        });
    }

    [HttpPost("income")]
    public async Task<ActionResult<SaleRecord>> AddIncome([FromBody] AddIncomeDto input)
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null) return Unauthorized();

        var sale = new SaleRecord
        {
            UserId = userId,
            Title = input.Title,
            Category = input.Category ?? "مبيعات",
            SaleDate = input.Date,
            SalePrice = input.Amount,
            BuyerName = input.Entity ?? "",
            Notes = input.Notes ?? ""
        };

        _context.SaleRecords.Add(sale);
        await _context.SaveChangesAsync();

        return Ok(sale);
    }

    [HttpPut("income/{id}")]
    public async Task<IActionResult> UpdateIncome(int id, [FromBody] AddIncomeDto input)
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null) return Unauthorized();

        var sale = await _context.SaleRecords.FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
        if (sale == null) return NotFound();

        sale.Title = input.Title;
        sale.SaleDate = input.Date;
        sale.SalePrice = input.Amount;
        sale.BuyerName = input.Entity ?? "";
        sale.Notes = input.Notes ?? "";

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("income/{id}")]
    public async Task<IActionResult> DeleteIncome(int id)
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null) return Unauthorized();

        var sale = await _context.SaleRecords.FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
        if (sale == null) return NotFound();

        _context.SaleRecords.Remove(sale);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("expense")]
    public async Task<ActionResult<ExpenseRecord>> AddExpense([FromBody] AddExpenseDto input)
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null) return Unauthorized();

        var expense = new ExpenseRecord
        {
            UserId = userId,
            Title = input.Title,
            Category = input.Category ?? "مصروفات",
            ExpenseDate = input.Date,
            Amount = input.Amount,
            Entity = input.Entity ?? "",
            Notes = input.Notes ?? ""
        };

        _context.ExpenseRecords.Add(expense);
        await _context.SaveChangesAsync();

        return Ok(expense);
    }

    [HttpPut("expense/{id}")]
    public async Task<IActionResult> UpdateExpense(int id, [FromBody] AddExpenseDto input)
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null) return Unauthorized();

        var expense = await _context.ExpenseRecords.FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
        if (expense == null) return NotFound();

        expense.Title = input.Title;
        expense.ExpenseDate = input.Date;
        expense.Amount = input.Amount;
        expense.Entity = input.Entity ?? "";
        expense.Notes = input.Notes ?? "";

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("expense/{id}")]
    public async Task<IActionResult> DeleteExpense(int id)
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null) return Unauthorized();

        var expense = await _context.ExpenseRecords.FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
        if (expense == null) return NotFound();

        var linkedItems = await _context.InventoryItems.Where(i => i.ExpenseRecordId == id).ToListAsync();
        foreach (var item in linkedItems)
        {
            item.ExpenseRecordId = null;
        }

        _context.ExpenseRecords.Remove(expense);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public class AddIncomeDto
{
    public string Title { get; set; } = string.Empty;
    public string? Category { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string? Entity { get; set; }
    public string? Notes { get; set; }
}

public class AddExpenseDto
{
    public string Title { get; set; } = string.Empty;
    public string? Category { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string? Entity { get; set; }
    public string? Notes { get; set; }
}

