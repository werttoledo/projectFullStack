"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { showToast } from "../components/Toast";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      showToast("Email y contraseña son requeridos", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post("/api/auth/register", {
        nombre: nombre || undefined,
        email,
        password,
      });

      if (response.data.success) {
        showToast("Usuario creado correctamente. Inicia sesión.", "success");
        router.replace("/");
      } else {
        showToast(response.data.error || "No se pudo crear el usuario", "error");
      }
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || "Error al crear el usuario";
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Crear Cuenta</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-input"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Registrarme"}
          </button>
        </form>
        <div className="credentials-box">
          <p className="credentials-info">
            ¿Ya tienes una cuenta? <Link href="/">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

