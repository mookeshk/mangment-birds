import os

file_path = r"backend\Controllers\BreedingSessionsController.cs"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# I will add EndSession just before DeleteSession
search = "public async Task<IActionResult> DeleteSession(int id)"

new_endpoint = '''[HttpPut("{id}/end")]
    public async Task<IActionResult> EndSession(int id)
    {
        var session = await _context.BreedingSessions
            .Include(b => b.MaleBird)
            .Include(b => b.FemaleBird)
            .FirstOrDefaultAsync(b => b.Id == id && b.UserId == GetUserId());
            
        if (session == null) return NotFound();
        
        session.IsActive = false;
        session.EndDate = DateTime.UtcNow;
        
        if (session.MaleBird != null) {
            session.MaleBird.Status = BirdStatus.Available;
            session.MaleBird.PairingDate = null;
        }
        
        if (session.FemaleBird != null) {
            session.FemaleBird.Status = BirdStatus.Available;
            session.FemaleBird.PairingDate = null;
        }

        if (session.CageId.HasValue && session.MaleBirdId == null && session.FemaleBirdId == null) {
            var colonyBirds = await _context.Birds.Where(b => b.CageId == session.CageId && b.Status == BirdStatus.Paired && b.UserId == GetUserId()).ToListAsync();
            foreach (var b in colonyBirds) {
                b.Status = BirdStatus.Available;
                b.PairingDate = null;
                b.CageId = null;
            }
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSession(int id)'''

if search in content:
    content = content.replace("[HttpDelete(\"{id}\")]\n    public async Task<IActionResult> DeleteSession(int id)", new_endpoint)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added EndSession")
else:
    print("Could not find search string")
