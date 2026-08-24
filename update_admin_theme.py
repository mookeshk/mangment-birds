import re
with open('frontend/src/app/admin/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I want to add a moon/sun toggle to the admin layout header.
# Let's find the header.
header_search = """                    <div className="text-sm text-slate-400 flex items-center gap-2">
                        <span>مرحباً، أيها المدير</span>
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                            <Icons.Settings className="w-4 h-4" />
                        </div>
                    </div>"""

header_replace = """                    <div className="text-sm text-slate-400 flex items-center gap-4">
                        <button 
                            onClick={() => {
                                document.documentElement.classList.toggle('dark');
                                localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
                            }}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-500 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hidden dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 block dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                        </button>
                        <div className="flex items-center gap-2">
                            <span>مرحباً، أيها المدير</span>
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                                <Icons.Settings className="w-4 h-4" />
                            </div>
                        </div>
                    </div>"""

content = content.replace(header_search, header_replace)

# Also remove the forced dark mode in useEffect so it respects the user's choice.
force_dark = """    useEffect(() => {
        // Enforce dark mode on body for admin pages if desired
        if (pathname.startsWith('/admin')) {
            document.documentElement.classList.add('dark');
        }
    }, [pathname]);"""

content = content.replace(force_dark, "")

with open('frontend/src/app/admin/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
