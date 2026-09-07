import os

file_path = r"backend\Controllers\BreedingSessionsController.cs"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

delete_old = '''        if (session.FemaleBird != null) {
            session.FemaleBird.Status = BirdStatus.Available;
            session.FemaleBird.PairingDate = null;
        }

        _context.BreedingSessions.Remove(session);'''

delete_new = '''        if (session.FemaleBird != null) {
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

        _context.BreedingSessions.Remove(session);'''

if delete_old in content:
    content = content.replace(delete_old, delete_new)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed DeleteSession")
else:
    print("Could not find delete_old")
