import os

file_path = r"backend\Controllers\BreedingSessionsController.cs"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

search = '''            if (input.ColonyBirdIds != null && input.ColonyBirdIds.Count > 0)
            {
                var colonyBirds = await _context.Birds.Where(b => input.ColonyBirdIds.Contains(b.Id) && b.UserId == userId).ToListAsync();'''

replace = '''            if (input.ColonyBirdIds == null) return BadRequest("ColonyBirdIds is null");
            if (input.ColonyBirdIds.Count == 0) return BadRequest("ColonyBirdIds is empty");
            if (input.ColonyBirdIds != null && input.ColonyBirdIds.Count > 0)
            {
                var colonyBirds = await _context.Birds.Where(b => input.ColonyBirdIds.Contains(b.Id) && b.UserId == userId).ToListAsync();
                if (colonyBirds.Count == 0) return BadRequest("No birds found matching the IDs");'''

if search in content:
    content = content.replace(search, replace)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced")
else:
    print("Not found")
