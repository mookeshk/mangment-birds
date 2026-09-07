import os

file_path = r"backend\Controllers\BreedingSessionsController.cs"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

debug = '''        if (input.CageId.HasValue && !input.MaleBirdId.HasValue && !input.FemaleBirdId.HasValue)
        {
            // Colony breeding
            var cage = await _context.Cages.FirstOrDefaultAsync(c => c.Id == input.CageId && c.UserId == userId);
            if (cage == null) return BadRequest("قفص غير صالح.");
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
            }
        }'''

if 'Colony breeding' in content:
    print('Found')
