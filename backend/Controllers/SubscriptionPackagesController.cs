using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/admin/packages")]
public class SubscriptionPackagesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SubscriptionPackagesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetPackages()
    {
        return Ok(await _context.SubscriptionPackages.ToListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> CreatePackage(SubscriptionPackage package)
    {
        _context.SubscriptionPackages.Add(package);
        await _context.SaveChangesAsync();
        return Ok(package);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePackage(int id, SubscriptionPackage package)
    {
        if (id != package.Id) return BadRequest();
        _context.Entry(package).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return Ok(package);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePackage(int id)
    {
        var package = await _context.SubscriptionPackages.FindAsync(id);
        if (package == null) return NotFound();
        _context.SubscriptionPackages.Remove(package);
        await _context.SaveChangesAsync();
        return Ok();
    }
}
