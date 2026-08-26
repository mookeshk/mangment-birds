using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FarmSettingsController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;

    public FarmSettingsController(UserManager<ApplicationUser> userManager, ApplicationDbContext context, IWebHostEnvironment env)
    {
        _userManager = userManager;
        _context = context;
        _env = env;
    }

    [HttpGet]
    public async Task<IActionResult> GetFarmSettings()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Unauthorized();

        // Load active package
        if (user.ActivePackageId.HasValue)
        {
            await _context.Entry(user).Reference(u => u.ActivePackage).LoadAsync();
        }
        
        var roles = await _userManager.GetRolesAsync(user);

        var logoUrl = user.FarmLogoUrl;
        if (!string.IsNullOrEmpty(logoUrl) && logoUrl.StartsWith("/"))
        {
            logoUrl = "https://mangment-birds-api.onrender.com" + logoUrl;
        }
        
        return Ok(new
        {
            user.FarmName,
            user.ContactNumbers,
            FarmLogoUrl = logoUrl,
            user.SubscriptionEndDate,
            PackageName = user.ActivePackage?.Name,
            IsAdmin = roles.Contains("Admin")
        });
    }

    [HttpPut]
    public async Task<IActionResult> UpdateFarmSettings([FromForm] FarmSettingsDto dto, IFormFile? logo)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Unauthorized();

        user.FarmName = dto.FarmName ?? user.FarmName;
        user.ContactNumbers = dto.ContactNumbers;
        
        if (logo != null && logo.Length > 0)
        {
            var uploadsPath = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads", "logos");
            if (!Directory.Exists(uploadsPath)) Directory.CreateDirectory(uploadsPath);

            var fileName = $"{user.Id}_{Guid.NewGuid()}{Path.GetExtension(logo.FileName)}";
            var filePath = Path.Combine(uploadsPath, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create)) { await logo.CopyToAsync(stream); }

            user.FarmLogoUrl = $"https://mangment-birds-api.onrender.com/uploads/logos/{fileName}";
        }
        
        await _userManager.UpdateAsync(user);

        return Ok(new { message = "Updated", url = user.FarmLogoUrl });
    }

    [HttpPost("logo")]
    public async Task<IActionResult> UploadLogo(IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("No file uploaded");
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return Unauthorized();

        var uploadsPath = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads", "logos");
        if (!Directory.Exists(uploadsPath)) Directory.CreateDirectory(uploadsPath);

        var fileName = $"{user.Id}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploadsPath, fileName);
        using (var stream = new FileStream(filePath, FileMode.Create)) { await file.CopyToAsync(stream); }

        user.FarmLogoUrl = $"https://mangment-birds-api.onrender.com/uploads/logos/{fileName}";
        await _userManager.UpdateAsync(user);
        return Ok(new { url = user.FarmLogoUrl });
    }
}

public class FarmSettingsDto
{
    public string? FarmName { get; set; }
    public string? ContactNumbers { get; set; }
}
