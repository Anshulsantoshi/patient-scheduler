import React, { useState } from 'react';
import api from '../api';

export default function SubmitIntakeForm() {
  const [form, setForm] = useState({
    medicalHistory: '',
    insurance: '',
    symptoms: ''
  });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');
    try {
      const { data } = await api.post('/intake/submit', form);
      if (data.success) {
        setMsg('Form submitted successfully!');
        setForm({ medicalHistory: '', insurance: '', symptoms: '' });
      }
    } catch (error) {
      setErr(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '32px auto' }}>
      <h3>Submit Intake Form</h3>
      {msg && <div style={{ color: 'green' }}>{msg}</div>}
      {err && <div style={{ color: 'crimson' }}>{err}</div>}
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
        <input
          type="text"
          name="medicalHistory"
          placeholder="Medical History"
          value={form.medicalHistory}
          onChange={onChange}
          required
        />
        <input
          type="text"
          name="insurance"
          placeholder="Insurance Details"
          value={form.insurance}
          onChange={onChange}
        />
        <input
          type="text"
          name="symptoms"
          placeholder="Symptoms"
          value={form.symptoms}
          onChange={onChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
