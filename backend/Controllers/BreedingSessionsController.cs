using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using System.Security.Claims;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BreedingSessionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BreedingSessionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetBreedingSessions()
    {
        var userId = GetUserId();
        var sessions = await _context.BreedingSessions
            .Include(b => b.MaleBird)
                .ThenInclude(m => m.Species)
            .Include(b => b.FemaleBird)
            .Include(b => b.Cage)
            .Include(b => b.Eggs)
            .Where(b => b.UserId == userId)
            .Select(b => new {
                b.Id,
                b.MaleBirdId,
                MaleIdentifier = b.MaleBird != null ? b.MaleBird.Identifier : null,
                b.FemaleBirdId,
                FemaleIdentifier = b.FemaleBird != null ? b.FemaleBird.Identifier : null,
                b.CageId,
                CageName = b.Cage != null ? b.Cage.Name : null,
                SpeciesName = b.MaleBird != null ? b.MaleBird.Species.Name : (b.FemaleBird != null ? b.FemaleBird.Species.Name : "جماعي"),
                SpeciesId = b.MaleBird != null ? b.MaleBird.SpeciesId : (b.FemaleBird != null ? b.FemaleBird.SpeciesId : null),
                BreedId = b.MaleBird != null ? b.MaleBird.BreedId : (b.FemaleBird != null ? b.FemaleBird.BreedId : null),
                IncubationPeriodInDays = b.MaleBird != null ? b.MaleBird.Species.IncubationPeriodInDays : 18,
                b.MatingDate,
                b.IsActive,
                EggsCount = b.Eggs.Count,
                ActiveEggsCount = b.Eggs.Count(e => e.Status == EggStatus.Incubating)
            })
            .ToListAsync();
            
        return Ok(sessions);
    }

    public class CreateBreedingSessionDto
    {
        public int? MaleBirdId { get; set; }
        public int? FemaleBirdId { get; set; }
        public int? CageId { get; set; }
        public DateTime MatingDate { get; set; }
        public List<int>? ColonyBirdIds { get; set; }
    }

    [HttpPost]
    public async Task<ActionResult<object>> PostBreedingSession([FromBody] CreateBreedingSessionDto input)
    {
        var userId = GetUserId();
        
        var session = new BreedingSession
        {
            UserId = userId,
            MatingDate = input.MatingDate,
            IsActive = true
        };

        if (input.MaleBirdId.HasValue && input.FemaleBirdId.HasValue)
        {
            // Individual breeding
            var male = await _context.Birds.FirstOrDefaultAsync(b => b.Id == input.MaleBirdId && b.UserId == userId && b.IsMale == true);
            var female = await _context.Birds.FirstOrDefaultAsync(b => b.Id == input.FemaleBirdId && b.UserId == userId && b.IsMale == false);
            
            if (male == null || female == null) return BadRequest("الطيور المحددة غير صالحة.");
            
            session.MaleBirdId = input.MaleBirdId;
            session.FemaleBirdId = input.FemaleBirdId;

            // Update bird statuses
            male.Status = BirdStatus.Paired;
            male.PairingDate = input.MatingDate;
            female.Status = BirdStatus.Paired;
            female.PairingDate = input.MatingDate;

            if (input.CageId.HasValue)
            {
                var cage = await _context.Cages.FirstOrDefaultAsync(c => c.Id == input.CageId && c.UserId == userId);
                if (cage != null) session.CageId = input.CageId;
            }
        }
        else if (input.CageId.HasValue && !input.MaleBirdId.HasValue && !input.FemaleBirdId.HasValue)
        {
            // Colony breeding
            var cage = await _context.Cages.FirstOrDefaultAsync(c => c.Id == input.CageId && c.UserId == userId);
            if (cage == null) return BadRequest("القفص غير صالح.");
            session.CageId = input.CageId;
            
            if (input.ColonyBirdIds == null) return BadRequest("ColonyBirdIds is null");
            if (input.ColonyBirdIds.Count == 0) return BadRequest("ColonyBirdIds is empty");
            if (input.ColonyBirdIds != null && input.ColonyBirdIds.Count > 0)
            {
                var colonyBirds = await _context.Birds.Where(b => input.ColonyBirdIds.Contains(b.Id) && b.UserId == userId).ToListAsync();
                if (colonyBirds.Count == 0) return BadRequest("No birds found matching the IDs");
                foreach (var b in colonyBirds)
                {
                    b.CageId = cage.Id;
                    b.Status = BirdStatus.Paired;
                    b.PairingDate = input.MatingDate;
                }
            }
        }
        else
        {
            return BadRequest("يجب اختيار ذكر وأنثى، أو اختيار قفص للتفريخ الجماعي.");
        }

        _context.BreedingSessions.Add(session);
        await _context.SaveChangesAsync();
        
        return Ok(new { session.Id });
    }

    [HttpPut("{id}/end")]
    public async Task<IActionResult> EndSession(int id)
    {
        var session = await _context.BreedingSessions
            .Include(b => b.MaleBird)
            .Include(b => b.FemaleBird)
            .FirstOrDefaultAsync(b => b.Id == id && b.UserId == GetUserId());
            
        if (session == null) return NotFound();

        session.IsActive = false;
        
        if (session.MaleBird != null) {
            session.MaleBird.Status = BirdStatus.Available;
            session.MaleBird.PairingDate = null;
        }
        
        if (session.FemaleBird != null) {
            session.FemaleBird.Status = BirdStatus.Available;
            session.FemaleBird.PairingDate = null;
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSession(int id)
    {
        var session = await _context.BreedingSessions
            .Include(b => b.MaleBird)
            .Include(b => b.FemaleBird)
            .FirstOrDefaultAsync(b => b.Id == id && b.UserId == GetUserId());
            
        if (session == null) return NotFound();
        
        if (session.MaleBird != null) {
            session.MaleBird.Status = BirdStatus.Available;
            session.MaleBird.PairingDate = null;
        }
        
        if (session.FemaleBird != null) {
            session.FemaleBird.Status = BirdStatus.Available;
            session.FemaleBird.PairingDate = null;
        }

        // Restore colony birds if it's a colony session
        if (session.CageId.HasValue && session.MaleBirdId == null && session.FemaleBirdId == null) {
            var colonyBirds = await _context.Birds.Where(b => b.CageId == session.CageId && b.Status == BirdStatus.Paired && b.UserId == GetUserId()).ToListAsync();
            foreach (var b in colonyBirds) {
                b.Status = BirdStatus.Available;
                b.PairingDate = null;
                b.CageId = null;
            }
        }

        _context.BreedingSessions.Remove(session);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}


