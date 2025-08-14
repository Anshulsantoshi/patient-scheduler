import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { setAuth } from '../auth';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/users/login', form);
      if (data?.success) {
        setAuth({ token: data.token, user: data.user });
        data.user.role === 'admin' ? navigate('/admin') : navigate('/patient');
      } else setError(data?.message || 'Login failed');
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth:420,margin:'48px auto'}}>
      <h2>Login</h2>
      {error && <div style={{color:'crimson',marginBottom:8}}>{error}</div>}
      <form onSubmit={onSubmit} style={{display:'grid',gap:10}}>
        <input name="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={onChange} required />
        <button disabled={loading} type="submit">{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <p style={{marginTop:8}}>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}