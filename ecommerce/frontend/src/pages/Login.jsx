import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../App';

const s = {
  wrap: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' },
  box: { background: '#fff', padding: '32px', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '380px' },
  title: { marginBottom: '20px', fontSize: '1.5rem', textAlign: 'center' },
  field: { marginBottom: '14px' },
  label: { display: 'block', marginBottom: '4px', fontSize: '0.9rem', color: '#555' },
  input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' },
  btn: { width: '100%', padding: '10px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer', marginTop: '8px' },
  err: { color: 'red', fontSize: '0.85rem', marginBottom: '10px' },
  link: { textAlign: 'center', marginTop: '14px', fontSize: '0.9rem' }
};

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={s.wrap}>
      <div style={s.box}>
        <h2 style={s.title}>Login</h2>
        {error && <p style={s.err}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <button style={s.btn} type="submit">Login</button>
        </form>
        <p style={s.link}>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  );
}
