"use client";
import {useState, useEffect} from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { showToast } from '../components/Toast';

export default function AddTask(){
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [categoriaId, setCategoriaId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Verificar login
        const userId = localStorage.getItem('userId');
        if (!userId) {
            router.push('/');
            return;
        }

        // Cargar categorias
        axios.get('/api/categorias')
            .then(res => setCategorias(res.data))
            .catch(err => console.error('Error cargando categorias', err));
    }, [router]);

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
              router.push('/');
              return;
            }

            const payload = { titulo, descripcion, categoria_id: categoriaId ? Number(categoriaId) : null, usuario_id: Number(userId) };
            const res = await axios.post("/api/tareas", payload);
            if (res.status >= 200 && res.status < 300) {
                setTitulo("");
                setDescripcion("");
                setCategoriaId(null);
                showToast(res.data.message || 'Tarea creada exitosamente', 'success');
                // Redirigir a la lista de tareas
                router.push('/tareas');
            } else {
                showToast('Error: ' + (res.data?.error || 'Unknown'), 'error');
            }
        } catch (error) {
            console.error("Error:", error);
            showToast("Error: " + (error.response?.data?.error || error.message), 'error');
        }
    };

    return (
        <div className="container">
            <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--foreground)'}}>Agregar nueva tarea</h2>
            <form onSubmit={handleSubmit} style={{maxWidth: '600px'}}>
                <div className="form-group">
                  <label className="form-label">Título *</label>
                  <input
                      className="form-input"
                      placeholder="Ingresa el título de la tarea"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Categoría (opcional)</label>
                  <select
                      className="form-select"
                      value={categoriaId || ''}
                      onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : null)}
                  >
                      <option value="">-- Seleccionar categoría --</option>
                      {categorias.map(c => (
                          <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Descripción *</label>
                  <textarea
                      className="form-textarea"
                      placeholder="Describe la tarea..."
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      required
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary">
                    Guardar Tarea
                </button>
            </form>
        </div>
    );
}


