using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using System.Security.Claims;

namespace backend.Controllers;

public class CreateBirdDto
{
    public required string Identifier { get; set; }
    public int? SpeciesId { get; set; }
    public int? BreedId { get; set; }
    public bool? IsMale { get; set; }
    public decimal? SalePrice { get; set; }
    public string? BuyerName { get; set; }
    public BirdStatus Status { get; set; }
    public DateTime? HatchDate { get; set; }
    public string? PhotoUrl { get; set; }
    public DateTime? PairingDate { get; set; }
    public int? FatherId { get; set; }
    public int? MotherId { get; set; }
}

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BirdsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BirdsController(ApplicationDbContext context)
    {
        _context = context;
    }

    private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetBirds()
    {
        var userId = GetUserId();
        var birds = await _context.Birds
            .Include(b => b.Species)
            .Include(b => b.Breed)
            .Where(b => b.UserId == userId)
            .Select(b => new {
                b.Id,
                b.Identifier,
                b.SpeciesId,
                SpeciesName = b.Species != null ? b.Species.Name : null,
                b.BreedId,
                BreedName = b.Breed != null ? b.Breed.Name : null,
                b.CageId,
                b.PurchasePrice,
                b.PurchaseDate,
                b.Source,
                b.HatchDate,
                b.IsMale,
                b.Status,
                b.FatherId,
                b.MotherId,
                b.PhotoUrl,
                b.PairingDate
            })
            .ToListAsync();
            
        return Ok(birds);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetBird(int id)
    {
        var userId = GetUserId();
        var bird = await _context.Birds
            .Include(b => b.Species)
            .Include(b => b.Breed)
            .Where(b => b.Id == id && b.UserId == userId)
            .Select(b => new {
                b.Id,
                b.Identifier,
                b.SpeciesId,
                SpeciesName = b.Species != null ? b.Species.Name : null,
                b.BreedId,
                BreedName = b.Breed != null ? b.Breed.Name : null,
                b.CageId,
                b.PurchasePrice,
                b.PurchaseDate,
                b.Source,
                b.HatchDate,
                b.IsMale,
                b.Status,
                b.FatherId,
                b.MotherId
            })
            .FirstOrDefaultAsync();

        if (bird == null) return NotFound();
        return Ok(bird);
    }

    [HttpPost]
    public async Task<ActionResult<Bird>> PostBird(CreateBirdDto input)
    {
        var userId = GetUserId();

        var bird = new Bird
        {
            Identifier = input.Identifier,
            SpeciesId = input.SpeciesId,
            BreedId = input.BreedId,
            IsMale = input.IsMale,
            Status = input.Status,
            HatchDate = input.HatchDate,
            PhotoUrl = input.PhotoUrl,
            PairingDate = input.PairingDate,
            FatherId = input.FatherId,
            MotherId = input.MotherId,
            UserId = userId
        };

        _context.Birds.Add(bird);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBird), new { id = bird.Id }, bird);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutBird(int id, CreateBirdDto input)
    {
        var userId = GetUserId();
        var bird = await _context.Birds.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);

        if (bird == null)
        {
            return NotFound();
        }

                bird.Identifier = input.Identifier;
        bird.SpeciesId = input.SpeciesId;
        bird.BreedId = input.BreedId;
        bird.IsMale = input.IsMale;
        bird.HatchDate = input.HatchDate;
        bird.PhotoUrl = input.PhotoUrl;
        bird.PairingDate = input.PairingDate;
        bird.FatherId = input.FatherId;
        bird.MotherId = input.MotherId;

        if (input.Status == BirdStatus.Sold && bird.Status != BirdStatus.Sold && input.SalePrice.HasValue)
        {
            var sale = new SaleRecord
            {
                UserId = userId,
                SaleDate = DateTime.UtcNow,
                Title = $"بيع طائر - {bird.Identifier}",
                SalePrice = input.SalePrice.Value,
                BuyerName = input.BuyerName ?? "",
                BirdId = bird.Id
            };
            _context.SaleRecords.Add(sale);
        }
        bird.Status = input.Status;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadPhoto(IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("No file uploaded.");
        
        var userId = GetUserId();
        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "birds");
        if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

        var uniqueFileName = $"{userId}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Ok(new { url = $"/uploads/birds/{uniqueFileName}" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBird(int id)
    {
        var bird = await _context.Birds.FirstOrDefaultAsync(b => b.Id == id && b.UserId == GetUserId());
        if (bird == null) return NotFound();

        _context.Birds.Remove(bird);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

