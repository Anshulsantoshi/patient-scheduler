import React, { useState } from 'react';
import api from '../api';

export default function BookAppointment() {
  const [form, setForm] = useState({ date:'', time:'', doctorId:'', reason:'' });
  const [msg, setMsg] = useState(''); const [err, setErr] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault(); setMsg(''); setErr('');
    try {
      const { data } = await api.post('/appointments/portal', form);
      if(data?.success){ setMsg('Appointment created successfully'); setForm({date:'',time:'',doctorId:'',reason:''}); }
    } catch(error){ setErr(error?.response?.data?.message || error.message); }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold mb-4">Book Appointment</h3>
      {msg && <div className="text-green-600 mb-4">{msg}</div>}
      {err && <div className="text-red-600 mb-4">{err}</div>}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input type="date" name="date" value={form.date} onChange={onChange} required
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        <input type="time" name="time" value={form.time} onChange={onChange} required
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        <input type="text" name="doctorId" placeholder="Doctor ID (optional)" value={form.doctorId} onChange={onChange}
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        <input type="text" name="reason" placeholder="Reason" value={form.reason} onChange={onChange}
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        <button type="submit" className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition">Create</button>
      </form>
    </div>
  );
}
