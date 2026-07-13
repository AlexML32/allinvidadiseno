import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { Plus, Edit2, Trash2, TrendingUp, TrendingDown, X, Save } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
  is_active: boolean;
}

type ModalType = 'create' | 'edit' | 'stock' | null;

const emptyForm = { name: '', description: '', price: '', stock: '', category: '', image_url: '' };

export default function InventoryManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [stockAction, setStockAction] = useState({ amount: '', type: 'increase', reason: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/products?only_active=false');
      setProducts(res.data);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => { setForm(emptyForm); setError(''); setModal('create'); };
  const openEdit = (p: Product) => { setSelected(p); setForm({ name: p.name, description: p.description || '', price: String(p.price), stock: String(p.stock), category: p.category || '', image_url: p.image_url || '' }); setError(''); setModal('edit'); };
  const openStock = (p: Product) => { setSelected(p); setStockAction({ amount: '', type: 'increase', reason: '' }); setError(''); setModal('stock'); };
  const closeModal = () => { setModal(null); setSelected(null); setError(''); };

  const handleCreate = async () => {
    setSaving(true); setError('');
    try {
      await apiClient.post('/products', { ...form, price: Number(form.price), stock: Number(form.stock) });
      closeModal(); fetchProducts();
    } catch (e: any) { setError(e.response?.data?.message || 'Error al crear producto'); }
    setSaving(false);
  };

  const handleEdit = async () => {
    if (!selected) return;
    setSaving(true); setError('');
    try {
      await apiClient.put(`/products/${selected.id}`, { name: form.name, description: form.description, price: Number(form.price), category: form.category, image_url: form.image_url });
      closeModal(); fetchProducts();
    } catch (e: any) { setError(e.response?.data?.message || 'Error al editar producto'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Deseas eliminar este producto?')) return;
    try { await apiClient.delete(`/products/${id}`); fetchProducts(); } catch { }
  };

  const handleAdjustStock = async () => {
    if (!selected) return;
    setSaving(true); setError('');
    try {
      await apiClient.patch(`/products/${selected.id}/stock`, { amount: Number(stockAction.amount), type: stockAction.type, reason: stockAction.reason });
      closeModal(); fetchProducts();
    } catch (e: any) { setError(e.response?.data?.message || 'Error al ajustar stock'); }
    setSaving(false);
  };

  const InputField = ({ label, value, onChange, type = 'text', placeholder = '' }: any) => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-naturista-text-muted mb-1">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-naturista-primary focus:border-transparent outline-none transition" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-naturista-text">Inventario de Productos</h1>
        <button onClick={openCreate} className="flex items-center gap-2 bg-naturista-primary hover:bg-naturista-primary-hover text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition">
          <Plus className="w-5 h-5" /> Nuevo Producto
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-naturista-primary"></div></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-naturista-primary-light overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-naturista-primary-light text-naturista-primary">
              <tr>
                <th className="px-5 py-3 text-left font-bold uppercase tracking-wider text-xs">Producto</th>
                <th className="px-5 py-3 text-left font-bold uppercase tracking-wider text-xs">Categoría</th>
                <th className="px-5 py-3 text-right font-bold uppercase tracking-wider text-xs">Precio</th>
                <th className="px-5 py-3 text-right font-bold uppercase tracking-wider text-xs">Stock</th>
                <th className="px-5 py-3 text-center font-bold uppercase tracking-wider text-xs">Estado</th>
                <th className="px-5 py-3 text-center font-bold uppercase tracking-wider text-xs">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className={`hover:bg-naturista-bg transition ${!p.is_active ? 'opacity-50' : ''}`}>
                  <td className="px-5 py-4 font-medium text-naturista-text">{p.name}</td>
                  <td className="px-5 py-4 text-naturista-text-muted">{p.category || '—'}</td>
                  <td className="px-5 py-4 text-right font-semibold">S/ {Number(p.price).toFixed(2)}</td>
                  <td className="px-5 py-4 text-right">
                    <span className={`font-bold ${p.stock <= 5 ? 'text-naturista-error' : 'text-naturista-text'}`}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-naturista-error'}`}>
                      {p.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openStock(p)} title="Ajustar stock" className="p-1.5 rounded-lg text-naturista-primary hover:bg-naturista-primary-light transition">
                        <TrendingUp className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEdit(p)} title="Editar" className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} title="Eliminar" className="p-1.5 rounded-lg text-naturista-error hover:bg-red-50 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modales */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="font-bold text-xl text-naturista-text">{modal === 'create' ? 'Nuevo Producto' : 'Editar Producto'}</h2>
              <button onClick={closeModal}><X className="w-5 h-5 text-naturista-text-muted" /></button>
            </div>
            <div className="p-6 space-y-4">
              <InputField label="Nombre" value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} />
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-naturista-text-muted mb-1">Descripción</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-naturista-primary outline-none transition resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Precio (S/)" type="number" value={form.price} onChange={(e: any) => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
                {modal === 'create' && <InputField label="Stock inicial" type="number" value={form.stock} onChange={(e: any) => setForm({ ...form, stock: e.target.value })} placeholder="0" />}
              </div>
              <InputField label="Categoría" value={form.category} onChange={(e: any) => setForm({ ...form, category: e.target.value })} />
              {error && <p className="text-naturista-error text-xs">{error}</p>}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={closeModal} className="flex-1 py-2.5 border border-gray-300 rounded-xl font-semibold text-naturista-text-muted hover:bg-gray-50 transition">Cancelar</button>
              <button onClick={modal === 'create' ? handleCreate : handleEdit} disabled={saving}
                className="flex-1 py-2.5 bg-naturista-primary hover:bg-naturista-primary-hover text-white font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50">
                <Save className="w-4 h-4" /> {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === 'stock' && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="font-bold text-xl text-naturista-text">Ajustar Stock</h2>
              <button onClick={closeModal}><X className="w-5 h-5 text-naturista-text-muted" /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-naturista-text-muted">Producto: <span className="font-semibold text-naturista-text">{selected.name}</span></p>
              <p className="text-sm text-naturista-text-muted">Stock actual: <span className="font-bold text-naturista-primary">{selected.stock}</span></p>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-naturista-text-muted mb-1">Tipo de movimiento</label>
                <div className="flex gap-3">
                  <button onClick={() => setStockAction({ ...stockAction, type: 'increase' })}
                    className={`flex-1 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-1.5 transition ${stockAction.type === 'increase' ? 'bg-naturista-primary text-white' : 'border border-gray-300 text-naturista-text-muted'}`}>
                    <TrendingUp className="w-4 h-4" /> Aumentar
                  </button>
                  <button onClick={() => setStockAction({ ...stockAction, type: 'decrease' })}
                    className={`flex-1 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-1.5 transition ${stockAction.type === 'decrease' ? 'bg-naturista-error text-white' : 'border border-gray-300 text-naturista-text-muted'}`}>
                    <TrendingDown className="w-4 h-4" /> Reducir
                  </button>
                </div>
              </div>
              <InputField label="Cantidad" type="number" value={stockAction.amount} onChange={(e: any) => setStockAction({ ...stockAction, amount: e.target.value })} placeholder="0" />
              <InputField label="Motivo" value={stockAction.reason} onChange={(e: any) => setStockAction({ ...stockAction, reason: e.target.value })} placeholder="Ej: Reposición de stock" />
              {error && <p className="text-naturista-error text-xs">{error}</p>}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={closeModal} className="flex-1 py-2.5 border border-gray-300 rounded-xl font-semibold text-naturista-text-muted hover:bg-gray-50 transition">Cancelar</button>
              <button onClick={handleAdjustStock} disabled={saving}
                className="flex-1 py-2.5 bg-naturista-primary hover:bg-naturista-primary-hover text-white font-bold rounded-xl transition disabled:opacity-50">
                {saving ? 'Guardando...' : 'Aplicar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
