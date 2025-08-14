import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { setAuth } from '../auth';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/users/register', form);
      if (data?.success) {
        // auto-login (backend already returns token+user)
        setAuth({ token: data.token, user: data.user });
        data.user.role === 'admin' ? navigate('/admin') : navigate('/patient');
      } else setError(data?.message || 'Registration failed');
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth:480,margin:'48px auto'}}>
      <h2>Register</h2>
      {error && <div style={{color:'crimson',marginBottom:8}}>{error}</div>}
      <form onSubmit={onSubmit} style={{display:'grid',gap:10}}>
        <input name="name" placeholder="Full name" value={form.name} onChange={onChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={onChange} required />
        <select name="role" value={form.role} onChange={onChange}>
          <option value="patient">Patient</option>
          <option value="admin">Admin</option>
        </select>
        <button disabled={loading} type="submit">{loading ? 'Creating...' : 'Create account'}</button>
      </form>
      <p style={{marginTop:8}}>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
