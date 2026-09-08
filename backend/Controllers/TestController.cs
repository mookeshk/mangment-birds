using Microsoft.AspNetCore.Mvc;
using backend.Models;
using System;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public TestController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("test-insert")]
        public async Task<IActionResult> TestInsert()
        {
            try
            {
                var session = new BreedingSession
                {
                    UserId = "790e3a2d-3b7e-44b2-a98d-9a16bdc43595",
                    MaleBirdId = 1,
                    FemaleBirdId = 2,
                    CageId = 1,
                    MatingDate = DateTime.Parse("2026-09-08"),
                    IsActive = true
                };

                var male = await _context.Birds.FindAsync(1);
                var female = await _context.Birds.FindAsync(2);
                if (male != null) { male.Status = BirdStatus.Paired; male.PairingDate = session.MatingDate; }
                if (female != null) { female.Status = BirdStatus.Paired; female.PairingDate = session.MatingDate; }

                _context.BreedingSessions.Add(session);
                await _context.SaveChangesAsync();
                
                return Ok(new { success = true, id = session.Id });
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, error = ex.ToString() });
            }
        }
    }
}
