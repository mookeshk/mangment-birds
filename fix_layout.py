import re
with open('frontend/src/app/admin/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<main className="flex-1 overflow-auto bg-slate-900">', '<main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900">')
content = content.replace('<header className="bg-slate-800 border-b border-slate-700 p-4 shadow-sm flex items-center justify-between text-white">', '<header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 shadow-sm flex items-center justify-between text-slate-900 dark:text-white">')
content = content.replace('bg-slate-900 flex items-center', 'bg-slate-50 dark:bg-slate-900 flex items-center')

with open('frontend/src/app/admin/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
