export default function BreedingPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="h1" style={{ marginBottom: 0 }}>نظام التزاوج والتفريخ</h1>
        <button className="btn btn-primary">+ تسجيل تزاوج جديد</button>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <h3 className="h3" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>أزواج في مرحلة التفريخ</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-sm)', marginBottom: '8px' }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>ذكر #101 + أنثى #105</div>
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>تم التزاوج: 01/10/2026 (حمام زاجل)</div>
            </div>
            <span style={{ color: 'var(--warning)', fontWeight: 'bold', fontSize: '0.9rem' }}>جاري التحضين (3 بيضات)</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-sm)' }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>ذكر #202 + أنثى #210</div>
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>تم التزاوج: 15/09/2026 (كوكتيل)</div>
            </div>
            <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.9rem' }}>فقس (4 فراخ)</span>
          </div>
        </div>

        <div className="card">
          <h3 className="h3" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>متابعة البيض في الحضانة</h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px', color: 'var(--text-muted)' }}>المصدر (الزوج)</th>
                <th style={{ padding: '8px', color: 'var(--text-muted)' }}>تاريخ الوضع</th>
                <th style={{ padding: '8px', color: 'var(--text-muted)' }}>الفقس المتوقع</th>
                <th style={{ padding: '8px', color: 'var(--text-muted)' }}>إجراء</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>#101 + #105</td>
                <td style={{ padding: '12px 8px' }}>12/10/2026</td>
                <td style={{ padding: '12px 8px', color: 'var(--danger)' }}>30/10/2026 (باقي يومين)</td>
                <td style={{ padding: '12px 8px' }}><button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.8rem' }}>تسجيل فقس</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
