"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import ConfirmModal from '../components/ConfirmModal';
import { showToast } from '../components/Toast';

export default function CategoriasPage() {
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState('#FFF9C4');
  const [categorias, setCategorias] = useState([]);
  const [deleteCategoriaId, setDeleteCategoriaId] = useState(null);

  const fetchCategorias = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    axios.get(`/api/categorias?usuario_id=${userId}`)
      .then(res => setCategorias(res.data))
      .catch(err => console.error('Error cargando categorias', err));
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const usuario_id = Number(localStorage.getItem('userId'));
      if (!usuario_id) {
        showToast('Debes iniciar sesión', 'error');
        return;
      }
      const res = await axios.post('/api/categorias', { nombre, color, usuario_id });
      showToast(res.data.message || 'Categoría creada exitosamente', 'success');
      setNombre('');
      setColor('#FFF9C4');
      fetchCategorias();
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Error desconocido';
      showToast('Error: ' + errorMessage, 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const usuario_id = Number(localStorage.getItem('userId'));
      if (!usuario_id) {
        showToast('Debes iniciar sesión', 'error');
        return;
      }
      const res = await axios.delete(`/api/categorias/${id}?usuario_id=${usuario_id}`);
      showToast(res.data.message || 'Categoría eliminada exitosamente', 'success');
      fetchCategorias();
    } catch (error) {
      console.error(error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Error desconocido';
      showToast('Error: ' + errorMessage, 'error');
    }
  };

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  return (
    <div className="container">
      <h2 className="text-2xl font-bold mb-4" style={{color: 'var(--foreground)'}}>Mis Categorías</h2>
      
      {userId && (
        <form onSubmit={handleSubmit} className="login-form" style={{maxWidth: '500px', marginBottom: '2rem'}}>
          <div className="form-group">
            <label className="form-label">Nombre de la categoría</label>
            <input 
              value={nombre} 
              onChange={e => setNombre(e.target.value)} 
              placeholder="Ej: Trabajo, Personal, etc." 
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Color</label>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <input 
                type="color" 
                value={color} 
                onChange={e => setColor(e.target.value)} 
                className="form-input"
                style={{width: '80px', height: '40px', padding: '2px', cursor: 'pointer'}}
              />
              <span style={{fontSize: '0.9rem', color: 'var(--foreground)'}}>{color}</span>
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{width: '100%'}}>Crear Categoría</button>
        </form>
      )}

      <div className="task-list">
        {categorias.length === 0 ? (
          <div style={{textAlign: 'center', padding: '2rem', color: 'var(--foreground)'}}>
            <p>No hay categorías creadas aún.</p>
          </div>
        ) : (
          categorias.map(c => (
            <div key={c.id} className="task-item" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem', flex: 1}}>
                <div style={{
                  width: 40, 
                  height: 40, 
                  background: c.color || '#FFF9C4', 
                  borderRadius: 8, 
                  border: '2px solid rgba(0,0,0,0.1)', 
                  flexShrink: 0,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }} />
                <div>
                  <div className="task-title">{c.nombre}</div>
                  <div className="task-desc" style={{fontSize: '0.85rem', opacity: 0.7}}>
                    {c.color || 'Sin color'}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setDeleteCategoriaId(c.id)} 
                className="btn-danger"
                style={{marginLeft: '1rem'}}
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteCategoriaId}
        onClose={() => setDeleteCategoriaId(null)}
        onConfirm={() => {
          if (deleteCategoriaId) {
            handleDelete(deleteCategoriaId);
            setDeleteCategoriaId(null);
          }
        }}
        title="Eliminar Categoría"
        message="¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer."
      />
    </div>
  );
}
