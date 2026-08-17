export default function DashboardPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="h1" style={{ marginBottom: 0 }}>نظرة عامة على المزرعة</h1>
        <button className="btn btn-primary">+ إضافة طائر جديد</button>
      </div>

      <div className="grid grid-cols-3">
        <div className="card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
          <div className="text-muted" style={{ marginBottom: '8px' }}>إجمالي الطيور</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>124</div>
        </div>
        
        <div className="card" style={{ borderLeft: '4px solid var(--secondary-color)' }}>
          <div className="text-muted" style={{ marginBottom: '8px' }}>البيض في الحضانة</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>18</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div className="text-muted" style={{ marginBottom: '8px' }}>تنبيهات هامة</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--warning)', marginTop: '8px' }}>2 تطعيمات قادمة</div>
        </div>
      </div>
      
      <h2 className="h2" style={{ marginTop: '48px', marginBottom: '24px' }}>آخر النشاطات</h2>
      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>التاريخ</th>
              <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>النشاط</th>
              <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>التفاصيل</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px 8px' }}>اليوم 10:30 ص</td>
              <td style={{ padding: '16px 8px', fontWeight: 700, color: 'var(--success)' }}>عملية تزاوج جديدة</td>
              <td style={{ padding: '16px 8px' }}>تم عزل الذكر #102 مع الأنثى #105 في القفص A1</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px 8px' }}>أمس 04:15 م</td>
              <td style={{ padding: '16px 8px', fontWeight: 700, color: 'var(--primary-color)' }}>فقس بيضة</td>
              <td style={{ padding: '16px 8px' }}>تم تسجيل طائر جديد (كوكتيل) وإضافته للمزرعة</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
