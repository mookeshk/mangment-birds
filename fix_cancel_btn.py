import os
import glob

# Search for the button class and fix it in all TSX files
for filepath in glob.glob('frontend/src/**/*.tsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-700 dark:hover:bg-slate-600 " in content:
        content = content.replace("bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-700 dark:hover:bg-slate-600 ", "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white ")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filepath}")
