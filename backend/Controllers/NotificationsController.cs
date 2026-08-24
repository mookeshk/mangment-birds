using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using backend.Models;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public NotificationsController(ApplicationDbContext context)
    {
        _context = context;
    }

    private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetNotifications()
    {
        var userId = GetUserId();
        var notifications = new List<object>();

        // 1. Inventory Warnings
        var lowInventory = await _context.InventoryItems
            .Where(i => i.UserId == userId && i.Quantity <= i.WarningLimit)
            .ToListAsync();
            
        foreach(var item in lowInventory)
        {
            notifications.Add(new {
                type = "inventory",
                title = "نقص في المخزون",
                message = $"صنف '{item.Name}' وصل إلى الحد الأدنى ({item.Quantity} {item.Unit})",
                date = DateTime.UtcNow,
                isCritical = item.Quantity <= item.CriticalLimit
            });
        }

        // 2. Upcoming Dosages
        var now = DateTime.UtcNow;
        var inThreeDays = now.AddDays(3);
        
        var upcomingDosages = await _context.HealthRecords
            .Where(h => h.UserId == userId && h.NextDueDate.HasValue && h.NextDueDate <= inThreeDays)
            .ToListAsync();

        foreach(var dosage in upcomingDosages)
        {
            var isPast = dosage.NextDueDate < now;
            notifications.Add(new {
                type = "health",
                title = isPast ? "جرعة متأخرة!" : "جرعة قادمة",
                message = $"موعد الجرعة القادمة من '{dosage.Title}' هو {dosage.NextDueDate?.ToString("yyyy-MM-dd")}",
                date = dosage.NextDueDate,
                isCritical = isPast
            });
        }

        // 3. Upcoming Hatchings (Eggs where HatchDate is within 3 days)
        var eggs = await _context.Eggs
            .Where(e => e.UserId == userId && e.Status == EggStatus.Incubating && e.ExpectedHatchDate <= inThreeDays)
            .ToListAsync();

        foreach(var egg in eggs)
        {
            var isPast = egg.ExpectedHatchDate < now;
            notifications.Add(new {
                type = "egg",
                title = isPast ? "تأخر فقس بيضة!" : "فقس بيضة قريب",
                message = $"بيضة متوقع فقسها بتاريخ {egg.ExpectedHatchDate.ToString("yyyy-MM-dd")}",
                date = egg.ExpectedHatchDate,
                isCritical = isPast
            });
        }

        return Ok(notifications.OrderByDescending(n => ((dynamic)n).isCritical).ThenBy(n => ((dynamic)n).date));
    }
}
