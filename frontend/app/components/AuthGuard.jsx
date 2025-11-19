"use client";
import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthGuard({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Resetear el flag cuando cambia la ruta
    hasRedirected.current = false;
    setIsLoading(true);

    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    // Rutas públicas que no requieren login
    const publicPaths = ['/', '/login', '/register'];
    
    // Si es la ruta de login, verificar si ya está logueado
    if (publicPaths.includes(pathname)) {
      const userId = localStorage.getItem('userId');
      // Si ya está logueado y está en login, redirigir a tareas (solo una vez)
      if (userId && !hasRedirected.current) {
        hasRedirected.current = true;
        router.replace('/tareas');
        return;
      }
      setIsLoading(false);
      return;
    }

    // Para otras rutas, verificar autenticación
    const userId = localStorage.getItem('userId');

    // Si no hay userId y no está en una ruta pública, redirigir al login (solo una vez)
    if (!userId && !publicPaths.includes(pathname) && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace('/');
      setIsLoading(false);
      return;
    }

    // Si todo está bien, permitir renderizar
    setIsLoading(false);
  }, [pathname]); // Solo pathname como dependencia, no router

  // Si es la ruta de login (/ o /login), renderizar inmediatamente después de la verificación
  if (pathname === '/' || pathname === '/login') {
    if (isLoading) {
      return null; // No mostrar nada mientras carga para evitar parpadeo
    }
    return children;
  }

  // Para otras rutas, mostrar loading mientras se verifica
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return children;
}
