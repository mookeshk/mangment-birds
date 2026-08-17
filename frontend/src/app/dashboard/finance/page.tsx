export default function FinancePage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="h1" style={{ marginBottom: 0 }}>الإدارة المالية والمبيعات</h1>
        <div>
          <button className="btn btn-outline" style={{ marginLeft: '12px' }}>+ إضافة مصروفات</button>
          <button className="btn btn-primary">+ تسجيل عملية بيع</button>
        </div>
      </div>

      <div className="grid grid-cols-3" style={{ marginBottom: '32px' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div className="text-muted" style={{ marginBottom: '8px' }}>إجمالي المبيعات (هذا الشهر)</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>4,500 ج.م</div>
        </div>
        
        <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div className="text-muted" style={{ marginBottom: '8px' }}>إجمالي المصروفات</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)' }}>1,200 ج.م</div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
          <div className="text-muted" style={{ marginBottom: '8px' }}>صافي الأرباح</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>3,300 ج.م</div>
        </div>
      </div>

      <div className="card">
        <h2 className="h2" style={{ marginBottom: '16px' }}>سجل المبيعات الأخير</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>التاريخ</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>رقم الطائر المباع</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>المشتري</th>
              <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>المبلغ</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '16px' }}>15/10/2026</td>
              <td style={{ padding: '16px', fontWeight: 'bold' }}>#99 (كوكتيل)</td>
              <td style={{ padding: '16px' }}>أحمد محمود - 0101234567</td>
              <td style={{ padding: '16px', color: 'var(--success)', fontWeight: 'bold' }}>300 ج.م</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
