using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;

    public AdminController(UserManager<ApplicationUser> userManager, ApplicationDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var totalUsers = await _userManager.Users.CountAsync();
        var activeFarms = await _userManager.Users.Where(u => !string.IsNullOrEmpty(u.FarmName)).CountAsync();
        var totalBirds = await _context.Birds.CountAsync();

        return Ok(new
        {
            TotalUsers = totalUsers,
            ActiveFarms = activeFarms,
            TotalBirds = totalBirds
        });
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userManager.Users.Select(u => new
        {
            u.Id,
            u.Email,
            u.FarmName,
            PhoneNumber = u.ContactNumbers ?? u.PhoneNumber,
            IsLockedOut = u.LockoutEnd != null && u.LockoutEnd > DateTimeOffset.UtcNow,
            LockoutEnd = u.LockoutEnd
        }).ToListAsync();

        return Ok(users);
    }

    [HttpPost("users/{id}/toggle-lock")]
    public async Task<IActionResult> ToggleLockUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound();

        if (await _userManager.IsLockedOutAsync(user))
        {
            await _userManager.SetLockoutEndDateAsync(user, null);
        }
        else
        {
            await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);
        }

        return Ok();
    }
}
