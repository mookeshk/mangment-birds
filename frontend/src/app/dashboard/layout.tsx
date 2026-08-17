export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: 'var(--card-bg)', borderLeft: '1px solid var(--border-color)', padding: '24px' }}>
        <h2 className="h3" style={{ color: 'var(--primary-color)', marginBottom: '32px' }}>نظام المزرعة</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <a href="/dashboard" style={{ fontWeight: 'bold' }}>لوحة التحكم</a>
          <a href="/dashboard/birds">إدارة الطيور</a>
          <a href="/dashboard/breeding">التزاوج والتفريخ</a>
          <a href="/dashboard/inventory">المخزون والعلف</a>
          <a href="/dashboard/finance">الماليات</a>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px' }}>
        {children}
      </main>
    </div>
  );
}
