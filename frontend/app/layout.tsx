"use client";
import {ReactNode, useEffect, useState} from "react";
import "./globals.css";
import AuthGuard from './components/AuthGuard';
import ToastContainer from './components/Toast';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { showToast } from './components/Toast';

export default function RootLayout({children}: {children:ReactNode}) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkAuth = () => {
      const userId = localStorage.getItem('userId');
      setIsAuthenticated(!!userId);
    };
    
    // Verificar una vez al montar
    checkAuth();
    
    // Escuchar cambios en localStorage (solo para otras pestañas)
    window.addEventListener('storage', checkAuth);
    
    // Escuchar cambios de localStorage en la misma pestaña usando un evento personalizado
    const handleStorageChange = () => checkAuth();
    window.addEventListener('localStorageChange', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('localStorageChange', handleStorageChange);
    };
  }, []); // Sin dependencias para evitar re-renders infinitos

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    // Disparar evento personalizado para actualizar el estado
    window.dispatchEvent(new Event('localStorageChange'));
    window.location.href = '/';
  };

  return(
    <html>
      <body className="app-body">
        <nav className="app-navbar">
          <h1 className="navbar-logo">TaskHub</h1>
          <div className="navbar-links">
            {isAuthenticated ? (
              <>
                <Link href="/tareas" className="nav-link">Inicio</Link>
                <Link href="/add" className="nav-link">Nueva Tarea</Link>
                <Link href="/categorias" className="nav-link">Categorías</Link>
                <span className="nav-link nav-link-logout" onClick={handleLogout} style={{cursor: 'pointer'}}>Cerrar Sesión</span>
              </>
            ) : (
              <>
                <span className="nav-link nav-link-disabled" onClick={(e) => {
                  e.preventDefault();
                  showToast('⚠️ Debes iniciar sesión para acceder', 'error');
                }}>Inicio</span>
                <span className="nav-link nav-link-disabled" onClick={(e) => {
                  e.preventDefault();
                  showToast('⚠️ Debes iniciar sesión para acceder', 'error');
                }}>Nueva Tarea</span>
                <span className="nav-link nav-link-disabled" onClick={(e) => {
                  e.preventDefault();
                  showToast('⚠️ Debes iniciar sesión para acceder', 'error');
                }}>Categorías</span>
                <Link href="/" className="nav-link nav-link-active">Login</Link>
              </>
            )}
          </div>
        </nav>
        <main className="p-6">
          <AuthGuard>{children}</AuthGuard>
        </main>
        <ToastContainer />
      </body>
    </html>
  );
}
