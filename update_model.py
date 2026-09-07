import os

file_path = r"backend\Models\BreedingSession.cs"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

search = "public bool IsActive { get; set; } = true;"
replace = "public bool IsActive { get; set; } = true;\n    public DateTime? EndDate { get; set; }"

if search in content:
    content = content.replace(search, replace)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added EndDate")
else:
    print("Could not find search string")
