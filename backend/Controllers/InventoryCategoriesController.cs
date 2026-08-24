using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class InventoryCategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public InventoryCategoriesController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<InventoryCategory>>> GetInventoryCategories()
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null) return Unauthorized();

        return await _context.InventoryCategories
            .Where(c => c.UserId == userId)
            .OrderBy(c => c.Name)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<InventoryCategory>> CreateInventoryCategory(CreateInventoryCategoryDto input)
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null) return Unauthorized();

        var category = new InventoryCategory
        {
            Name = input.Name,
            UserId = userId
        };

        _context.InventoryCategories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetInventoryCategories), new { id = category.Id }, category);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteInventoryCategory(int id)
    {
        var userId = _userManager.GetUserId(User);
        if (userId == null) return Unauthorized();

        var category = await _context.InventoryCategories.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (category == null) return NotFound();

        // Prevent deletion if in use
        var inUse = await _context.InventoryItems.AnyAsync(i => i.CategoryId == id);
        if (inUse) return BadRequest("لا يمكن حذف هذا النوع لوجود أصناف مرتبطة به.");

        _context.InventoryCategories.Remove(category);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public class CreateInventoryCategoryDto
{
    public string Name { get; set; } = string.Empty;
}
