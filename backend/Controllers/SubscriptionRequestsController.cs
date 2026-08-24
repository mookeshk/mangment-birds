using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace backend.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/admin/requests")]
public class SubscriptionRequestsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public SubscriptionRequestsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetRequests()
    {
        var requests = await _context.SubscriptionRequests
            .Include(r => r.User)
            .Include(r => r.Package)
            .OrderByDescending(r => r.RequestDate)
            .Select(r => new {
                r.Id,
                r.UserId,
                UserEmail = r.User.Email,
                FarmName = r.User.FarmName,
                r.PackageId,
                PackageName = r.Package.Name,
                r.ReceiptUrl,
                r.Status,
                r.RequestDate
            })
            .ToListAsync();
        return Ok(requests);
    }

    [HttpPost("{id}/approve")]
    public async Task<IActionResult> ApproveRequest(int id)
    {
        var req = await _context.SubscriptionRequests
            .Include(r => r.Package)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == id);
            
        if (req == null) return NotFound();
        if (req.Status != "Pending") return BadRequest("Request is not pending.");

        req.Status = "Approved";
        
        // Update user subscription
        var user = req.User;
        user.ActivePackageId = req.PackageId;
        
        // Add duration to current end date or from today if expired
        var startDate = (user.SubscriptionEndDate.HasValue && user.SubscriptionEndDate.Value > DateTime.UtcNow) 
            ? user.SubscriptionEndDate.Value 
            : DateTime.UtcNow;
            
        user.SubscriptionEndDate = startDate.AddMonths(req.Package.DurationMonths);

        await _context.SaveChangesAsync();
        return Ok(new { message = "Approved successfully." });
    }

    [HttpPost("{id}/reject")]
    public async Task<IActionResult> RejectRequest(int id)
    {
        var req = await _context.SubscriptionRequests.FindAsync(id);
        if (req == null) return NotFound();
        if (req.Status != "Pending") return BadRequest("Request is not pending.");

        req.Status = "Rejected";
        await _context.SaveChangesAsync();
        return Ok(new { message = "Rejected successfully." });
    }
}
