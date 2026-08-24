using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using backend.Models;

namespace backend.Controllers;

public class CreateSpeciesDto
{
    public required string Name { get; set; }
    public int? MaturityAgeInDays { get; set; }
    public int? IncubationPeriodInDays { get; set; }
}

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SpeciesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SpeciesController(ApplicationDbContext context)
    {
        _context = context;
    }

    private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetSpecies()
    {
        var userId = GetUserId();
        var species = await _context.Species
            .Where(s => s.UserId == userId)
            .Select(s => new {
                s.Id,
                s.Name,
                s.MaturityAgeInDays,
                s.IncubationPeriodInDays,
                BreedsCount = s.Breeds.Count
            })
            .ToListAsync();
            
        return Ok(species);
    }

    [HttpPost]
    public async Task<ActionResult<Species>> CreateSpecies([FromBody] CreateSpeciesDto input)
    {
        var userId = GetUserId();
        
        var species = new Species
        {
            Name = input.Name,
            MaturityAgeInDays = input.MaturityAgeInDays,
            IncubationPeriodInDays = input.IncubationPeriodInDays,
            UserId = userId
        };

        _context.Species.Add(species);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSpecies), new { id = species.Id }, new { 
            species.Id, 
            species.Name,
            species.MaturityAgeInDays,
            species.IncubationPeriodInDays,
            BreedsCount = 0 
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSpecies(int id, [FromBody] CreateSpeciesDto input)
    {
        var userId = GetUserId();
        var species = await _context.Species.FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);
        
        if (species == null) return NotFound();

        species.Name = input.Name;
        species.MaturityAgeInDays = input.MaturityAgeInDays;
        species.IncubationPeriodInDays = input.IncubationPeriodInDays;
        
        await _context.SaveChangesAsync();
        
        return Ok(new { 
            species.Id, 
            species.Name,
            species.MaturityAgeInDays,
            species.IncubationPeriodInDays
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSpecies(int id)
    {
        var userId = GetUserId();
        var species = await _context.Species
            .Include(s => s.Breeds)
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

        if (species == null) return NotFound();

        // Check if it's used in any birds
        var isUsed = await _context.Birds.AnyAsync(b => b.SpeciesId == id);
        if (isUsed) return BadRequest("لا يمكن حذف هذا النوع لوجود طيور مرتبطة به.");

        // Check if it has breeds
        if (species.Breeds.Any()) return BadRequest("لا يمكن حذف هذا النوع لوجود فصائل مرتبطة به. يرجى حذف الفصائل أولاً.");

        _context.Species.Remove(species);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
