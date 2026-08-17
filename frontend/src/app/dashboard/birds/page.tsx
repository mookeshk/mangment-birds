"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Bird {
  id: number;
  species: string;
  gender: string;
  source: string;
  purchasePrice: number;
  purchaseDate: string;
  status: string;
  cageId: number | null;
}

export default function BirdsPage() {
  const router = useRouter();
  const [birds, setBirds] = useState<Bird[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBirds();
  }, []);

  const fetchBirds = async () => {
    try {
      const res = await fetch('http://localhost:5089/api/Birds', {
        credentials: 'include'
      });

      if (res.status === 401) {
        // Unauthorized, redirect to login
        router.push('/');
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setBirds(data);
      } else {
        setError('حدث خطأ أثناء جلب بيانات الطيور.');
      }
    } catch (err) {
      setError('تعذر الاتصال بالخادم.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="h1" style={{ marginBottom: 0 }}>إدارة الطيور</h1>
        <Link href="/dashboard/birds/new" className="btn btn-primary">
          + إضافة طائر جديد
        </Link>
      </div>

      {error && <div style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</div>}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <input 
            type="text" 
            placeholder="ابحث برقم الطائر أو النوع..." 
            className="form-control" 
            style={{ maxWidth: '300px' }} 
          />
          
          <select className="form-control" style={{ maxWidth: '200px' }}>
            <option>جميع الأنواع</option>
            <option>حمام</option>
            <option>كوكتيل</option>
            <option>أسترالي</option>
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '24px' }}>جاري التحميل...</div>
          ) : birds.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>لا توجد طيور مضافة حتى الآن.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>رقم الطائر (المعرف)</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>النوع</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>الجنس</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>تاريخ الشراء/الفقس</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>الحالة</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {birds.map((bird) => (
                  <tr key={bird.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '16px' }}><strong>#{bird.id}</strong></td>
                    <td style={{ padding: '16px' }}>{bird.species}</td>
                    <td style={{ padding: '16px' }}>{bird.gender}</td>
                    <td style={{ padding: '16px' }}>{new Date(bird.purchaseDate).toLocaleDateString('ar-EG')}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        color: bird.status === 'Active' ? 'var(--success)' : 'var(--warning)', 
                        fontWeight: 'bold' 
                      }}>
                        {bird.status === 'Active' ? 'نشط' : bird.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.875rem' }}>التفاصيل</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
