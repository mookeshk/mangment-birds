"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5089/login?useCookies=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        // Successful login via Identity Cookie
        router.push('/dashboard');
      } else {
        setError('بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى.');
      }
    } catch (err) {
      setError('تعذر الاتصال بالخادم، يرجى التأكد من تشغيل الواجهة الخلفية.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <h1 className="h1" style={{ color: 'var(--primary-color)', fontSize: '3rem', marginBottom: '24px' }}>
        مرحباً بك في نظام إدارة مزرعة الطيور
      </h1>
      <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '600px', marginBottom: '32px' }}>
        نظامك المتكامل والموثوق لإدارة جميع طيورك. تتبع السلالات، الإنتاج، التزاوج، والحالة الصحية بكل سهولة واحترافية.
      </p>
      
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="h2">تسجيل الدخول</h2>
        
        {error && <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', textAlign: 'right' }}>{error}</div>}
        
        <form onSubmit={handleLogin} style={{ marginTop: '24px', textAlign: 'right' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">البريد الإلكتروني</label>
            <input 
              type="email" 
              id="email" 
              className="form-control" 
              placeholder="user@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">كلمة المرور</label>
            <input 
              type="password" 
              id="password" 
              className="form-control" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
            {loading ? 'جاري تسجيل الدخول...' : 'دخول للوحة التحكم'}
          </button>
        </form>
        
        <div style={{ marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          ليس لديك حساب؟ <Link href="/register" style={{ fontWeight: 'bold' }}>اشترك الآن</Link>
        </div>
      </div>
    </div>
  );
}
