"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { showToast } from './components/Toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Email y contraseña son requeridos', 'error');
      return;
    }
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        const { userId, email: userEmail, isAdmin } = res.data;
        // Guardamos credenciales en localStorage
        localStorage.setItem('userId', String(userId));
        localStorage.setItem('email', userEmail || '');
        localStorage.setItem('isAdmin', isAdmin ? '1' : '0');
        localStorage.setItem('password', password);
        // Disparar evento para actualizar el estado en layout
        window.dispatchEvent(new Event('localStorageChange'));
        showToast('¡Login exitoso!', 'success');
        router.replace('/tareas');
      } else {
        showToast('Error: ' + (res.data?.error || 'Credenciales inválidas'), 'error');
      }
    } catch (error: any) {
      console.error(error);
      showToast('Error: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="tu@email.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
            />
          </div>
          <button type="submit" className="login-button">Entrar</button>
        </form>
        <div className="credentials-box">
          <p className="credentials-title">Credenciales de ejemplo:</p>
          <p className="credentials-info"><strong>Email:</strong> test@local</p>
          <p className="credentials-info"><strong>Contraseña:</strong> 12345</p>
        </div>
      </div>
    </div>
  );
}
