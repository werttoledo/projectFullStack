"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // No necesitamos verificar aquí, AuthGuard ya lo hace

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert('Email y password requeridos');
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.status === 200) {
        const { userId, email, isAdmin } = res.data;
        // Guardamos credenciales en localStorage (nota: almacenar contraseña en claro es inseguro)
        localStorage.setItem('userId', String(userId));
        localStorage.setItem('email', email || '');
        localStorage.setItem('isAdmin', isAdmin ? '1' : '0');
        // Si el usuario envió la contraseña en el formulario, también la guardamos (solicitado)
        localStorage.setItem('password', password);
        alert('Login exitoso');
        // Disparar evento para actualizar el estado en layout
        window.dispatchEvent(new Event('localStorageChange'));
        router.replace('/tareas');
      } else {
        alert('Error: ' + (res.data?.error || 'Credenciales inválidas'));
      }
    } catch (error) {
      console.error(error);
      alert('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="container">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm mb-4">
        <input className="border p-2 rounded" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="border p-2 rounded" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-indigo-600 text-white p-2 rounded">Entrar</button>
      </form>
      <div className="max-w-sm p-3 bg-gray-100 border rounded" style={{marginTop: '1rem'}}>
        <p className="text-sm font-semibold mb-2">Credenciales de ejemplo:</p>
        <p className="text-sm"><strong>Email:</strong> test@local</p>
        <p className="text-sm"><strong>Contraseña:</strong> 12345</p>
      </div>
    </div>
  );
}
