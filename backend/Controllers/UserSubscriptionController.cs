using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/subscriptions")]
public class UserSubscriptionController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IWebHostEnvironment _env;

    public UserSubscriptionController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IWebHostEnvironment env)
    {
        _context = context;
        _userManager = userManager;
        _env = env;
    }

    [HttpGet("packages")]
    public async Task<IActionResult> GetAvailablePackages()
    {
        return Ok(await _context.SubscriptionPackages.ToListAsync());
    }

    [HttpPost("request")]
    public async Task<IActionResult> CreateRequest([FromForm] int packageId, [FromForm] IFormFile receipt)
    {
        if (receipt == null || receipt.Length == 0) return BadRequest("Receipt image is required.");
        
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Unauthorized();

        var package = await _context.SubscriptionPackages.FindAsync(packageId);
        if (package == null) return NotFound("Package not found.");

        // Check if there is already a pending request
        var existingPending = await _context.SubscriptionRequests
            .AnyAsync(r => r.UserId == user.Id && r.Status == "Pending");
        if (existingPending) return BadRequest("You already have a pending request.");

        // Save receipt
        var uploadsPath = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads", "receipts");
        if (!Directory.Exists(uploadsPath)) Directory.CreateDirectory(uploadsPath);

        var fileName = $"{user.Id}_{Guid.NewGuid()}{Path.GetExtension(receipt.FileName)}";
        var filePath = Path.Combine(uploadsPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await receipt.CopyToAsync(stream);
        }

        var request = new SubscriptionRequest
        {
            UserId = user.Id,
            PackageId = packageId,
            ReceiptUrl = $"/uploads/receipts/{fileName}"
        };

        _context.SubscriptionRequests.Add(request);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Request submitted successfully." });
    }
}
