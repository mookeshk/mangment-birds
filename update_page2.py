import os

file_path = r"frontend\src\app\dashboard\breeding\page.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

search = '''                            <button 
                                onClick={() => setEggModalSession(selectedPair)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                إضافة بيضة
                            </button>'''

replace = '''                            {selectedPair.isActive && (
                                <button 
                                    onClick={() => setEggModalSession(selectedPair)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    إضافة بيضة
                                </button>
                            )}'''

if search in content:
    content = content.replace(search, replace)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added restriction to add egg")
else:
    print("Could not find search string")
