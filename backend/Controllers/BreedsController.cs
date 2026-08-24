using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using backend.Models;

namespace backend.Controllers;

public class CreateBreedDto
{
    public required string Name { get; set; }
    public int SpeciesId { get; set; }
}

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BreedsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BreedsController(ApplicationDbContext context)
    {
        _context = context;
    }

    private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetBreeds([FromQuery] int? speciesId)
    {
        var userId = GetUserId();
        var query = _context.Breeds.Where(b => b.UserId == userId);
        
        if (speciesId.HasValue)
        {
            query = query.Where(b => b.SpeciesId == speciesId.Value);
        }

        var breeds = await query
            .Select(b => new {
                b.Id,
                b.Name,
                b.SpeciesId,
                SpeciesName = b.Species.Name
            })
            .ToListAsync();
            
        return Ok(breeds);
    }

    [HttpPost]
    public async Task<ActionResult<Breed>> CreateBreed([FromBody] CreateBreedDto input)
    {
        var userId = GetUserId();
        
        // Verify species belongs to user
        var speciesExists = await _context.Species.AnyAsync(s => s.Id == input.SpeciesId && s.UserId == userId);
        if (!speciesExists) return BadRequest("النوع غير موجود.");

        var breed = new Breed
        {
            Name = input.Name,
            SpeciesId = input.SpeciesId,
            UserId = userId
        };

        _context.Breeds.Add(breed);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBreeds), new { id = breed.Id }, new { breed.Id, breed.Name, breed.SpeciesId });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBreed(int id, [FromBody] CreateBreedDto input)
    {
        var userId = GetUserId();
        var breed = await _context.Breeds.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
        
        if (breed == null) return NotFound();

        breed.Name = input.Name;
        // Not allowing moving to another species for simplicity, or we can allow it
        
        await _context.SaveChangesAsync();
        
        return Ok(new { breed.Id, breed.Name, breed.SpeciesId });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBreed(int id)
    {
        var userId = GetUserId();
        var breed = await _context.Breeds.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

        if (breed == null) return NotFound();

        // Check if used in birds
        var isUsed = await _context.Birds.AnyAsync(b => b.BreedId == id);
        if (isUsed) return BadRequest("لا يمكن حذف هذه الفصيلة لوجود طيور مرتبطة بها.");

        _context.Breeds.Remove(breed);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
