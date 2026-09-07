import os

file_path = r"backend\Controllers\BreedingSessionsController.cs"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

search = "                b.MatingDate,\n                b.IsActive,"
replace = "                b.MatingDate,\n                b.IsActive,\n                b.EndDate,"

if search in content:
    content = content.replace(search, replace)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added EndDate to Select")
else:
    print("Could not find search string")
