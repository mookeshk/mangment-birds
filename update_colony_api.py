import os
file_path = r"backend\Controllers\BreedingSessionsController.cs"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

dto_old = '''    public class CreateBreedingSessionDto
    {
        public int? MaleBirdId { get; set; }
        public int? FemaleBirdId { get; set; }
        public int? CageId { get; set; }
        public DateTime MatingDate { get; set; }
    }'''
dto_new = '''    public class CreateBreedingSessionDto
    {
        public int? MaleBirdId { get; set; }
        public int? FemaleBirdId { get; set; }
        public int? CageId { get; set; }
        public DateTime MatingDate { get; set; }
        public List<int>? ColonyBirdIds { get; set; }
    }'''
content = content.replace(dto_old, dto_new)

colony_old = '''            var cage = await _context.Cages.FirstOrDefaultAsync(c => c.Id == input.CageId && c.UserId == userId);
            if (cage == null) return BadRequest("القفص غير صالح.");
            session.CageId = input.CageId;'''
colony_new = '''            var cage = await _context.Cages.FirstOrDefaultAsync(c => c.Id == input.CageId && c.UserId == userId);
            if (cage == null) return BadRequest("القفص غير صالح.");
            session.CageId = input.CageId;
            
            if (input.ColonyBirdIds != null && input.ColonyBirdIds.Count > 0)
            {
                var colonyBirds = await _context.Birds.Where(b => input.ColonyBirdIds.Contains(b.Id) && b.UserId == userId).ToListAsync();
                foreach (var b in colonyBirds)
                {
                    b.CageId = cage.Id;
                    b.Status = BirdStatus.Paired;
                    b.PairingDate = input.MatingDate;
                }
            }'''
content = content.replace(colony_old, colony_new)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
