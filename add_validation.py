import os

file_path = r"frontend\src\app\dashboard\breeding\PairingModal.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

search = '''        e.preventDefault();
        setIsSubmitting(true);
        try {'''

replace = '''        e.preventDefault();
        
        if (mode === "colony" && colonyBirdIds.length === 0) {
            alert("يجب اختيار طائر واحد على الأقل للتفريخ الجماعي.");
            return;
        }
        
        setIsSubmitting(true);
        try {'''

if search in content:
    content = content.replace(search, replace)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added validation")
else:
    print("Could not find search string")
