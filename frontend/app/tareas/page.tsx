"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import EditTaskModal from '../components/EditTaskModal';
import ConfirmModal from '../components/ConfirmModal';
import { showToast } from '../components/Toast';

interface Task {
  id: number;
  titulo: string;
  descripcion: string | null;
  estado?: boolean;
  categoria_id?: number | null;
}

interface Category {
  id: number;
  nombre: string;
}

interface TaskFormData {
  titulo: string;
  descripcion: string;
  estado: boolean;
  categoria_id: number | null;
}

export default function TareasPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [filterCategoria, setFilterCategoria] = useState<number | null>(null);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);

  // Función reutilizable para cargar tareas y categorías
  const fetchTasks = async (userId?: string | null, categoriaId?: number | null) => {
    try {
      const uid = userId || localStorage.getItem('userId');
      if (!uid) return;
      const catPromise = axios.get(`/api/categorias?usuario_id=${uid}`);
      const tasksUrl = categoriaId ? `/api/tareas?usuario_id=${uid}&categoria_id=${categoriaId}` : `/api/tareas?usuario_id=${uid}`;
      const tasksPromise = axios.get(tasksUrl);
      const [tasksRes, catRes] = await Promise.all([tasksPromise, catPromise]);
      setTasks(tasksRes.data);
      setCategorias(catRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Verificar autenticación inmediatamente
    if (typeof window === 'undefined') {
      setIsChecking(false);
      return;
    }
    
    const userId = localStorage.getItem('userId');
    if (!userId) {
      // Redirigir al login si no hay sesión
      router.replace('/');
      return;
    }
    
    // Si hay userId, cargar datos
    setIsChecking(false);
    fetchTasks(userId, filterCategoria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar

  useEffect(() => {
    // Filtrar por categoria si se selecciona
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    fetchTasks(userId, filterCategoria);
  }, [filterCategoria]);

  const handleDelete = async (id: number) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.replace('/');
        return;
      }
      const res = await axios.delete(`/api/tareas/${id}?usuario_id=${userId}`);
      showToast(res.data.message || 'Tarea eliminada exitosamente', 'success');
      fetchTasks(userId, filterCategoria);
    } catch (err: unknown) {
      console.error(err);
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : err instanceof Error ? err.message : 'Error inesperado';
      showToast('Error: ' + message, 'error');
    }
  };

  const handleEdit = async (taskData: TaskFormData) => {
    try {
      if (!editingTask) return;

      const userId = localStorage.getItem('userId');
      if (!userId) {
        router.replace('/');
        return;
      }
      const payload = {
        titulo: taskData.titulo,
        descripcion: taskData.descripcion,
        estado: taskData.estado,
        categoria_id: taskData.categoria_id,
        usuario_id: Number(userId)
      };
      const res = await axios.put(`/api/tareas/${editingTask.id}`, payload);
      showToast(res.data.message || 'Tarea actualizada exitosamente', 'success');
      setEditingTask(null);
      fetchTasks(userId, filterCategoria);
    } catch (err: unknown) {
      console.error(err);
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : err instanceof Error ? err.message : 'Error inesperado';
      showToast('Error: ' + message, 'error');
    }
  };

  // No renderizar nada hasta verificar autenticación
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--foreground)'}}>Lista de Tareas</h2>
      <div className="form-group" style={{marginBottom: '1.5rem'}}>
        <label className="form-label">Filtrar por categoría:</label>
        <select 
          value={filterCategoria ? String(filterCategoria) : ''} 
          onChange={e => setFilterCategoria(e.target.value ? Number(e.target.value) : null)} 
          className="form-select"
          style={{maxWidth: '300px'}}
        >
          <option value="">Todas las categorías</option>
          {categorias.map(c => <option key={c.id} value={String(c.id)}>{c.nombre}</option>)}
        </select>
      </div>

      <div className="task-list">
        {
          tasks.map((t) => (
            <div key={t.id} className="task-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <div className="task-title">{t.titulo}</div>
                <div className="task-desc">{t.descripcion || 'Sin descripción'}</div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                {t.categoria_id && (
                  <span className="category-badge" style={{marginRight: '1rem'}}>
                    {(categorias.find(c => c.id === t.categoria_id)?.nombre) || 'Categoría'}
                  </span>
                )}
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <button onClick={() => setEditingTask(t)} className="btn-warning">Editar</button>
                  <button onClick={() => setDeleteTaskId(t.id)} className="btn-danger">Eliminar</button>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      <EditTaskModal
        key={editingTask?.id ?? 'new-task'}
        task={editingTask}
        categorias={categorias}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleEdit}
      />

      <ConfirmModal
        isOpen={!!deleteTaskId}
        onClose={() => setDeleteTaskId(null)}
        onConfirm={() => {
          if (deleteTaskId) {
            handleDelete(deleteTaskId);
            setDeleteTaskId(null);
          }
        }}
        title="Eliminar Tarea"
        message="¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer."
      />
    </div>
  );
}

