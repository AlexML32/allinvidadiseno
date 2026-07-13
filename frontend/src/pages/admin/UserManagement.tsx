import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { Users, Plus, Edit2, Trash2, X, Save, Shield, Truck, User } from 'lucide-react';

interface UserItem { id: string; full_name: string; email: string; phone: string; address: string; role: string; is_active: boolean; }

const roleIcons: Record<string, React.ReactNode> = {
  ADMIN: <Shield className="w-3.5 h-3.5" />,
  DELIVERY: <Truck className="w-3.5 h-3.5" />,
  CLIENT: <User className="w-3.5 h-3.5" />,
};
const roleBadge: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-700',
  DELIVERY: 'bg-blue-100 text-blue-700',
  CLIENT: 'bg-naturista-primary-light text-naturista-primary',
};

const emptyForm = { full_name: '', email: '', password: '', phone: '', address: '', role: 'CLIENT', is_active: true };

export default function UserManagement() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [selected, setSelected] = useState<UserItem | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (roleFilter) params.role = roleFilter;
      const res = await apiClient.get('/users', { params });
      setUsers(res.data);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [roleFilter]);

  const openCreate = () => { setForm(emptyForm); setError(''); setModal('create'); };
  const openEdit = (u: UserItem) => { setSelected(u); setForm({ ...u, password: '' }); setError(''); setModal('edit'); };
  const closeModal = () => { setModal(null); setSelected(null); setError(''); };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      if (modal === 'create') {
        await apiClient.post('/users', form);
      } else if (modal === 'edit' && selected) {
        await apiClient.put(`/users/${selected.id}`, form);
      }
      closeModal(); fetchUsers();
    } catch (e: any) { setError(e.response?.data?.message || 'Error al guardar usuario'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Deseas desactivar este usuario?')) return;
    try { await apiClient.delete(`/users/${id}`); fetchUsers(); } catch { }
  };

  const F = ({ label, name, type = 'text', options }: { label: string; name: string; type?: string; options?: string[] }) => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-naturista-text-muted mb-1">{label}</label>
      {options ? (
        <select value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-naturista-primary outline-none transition bg-white">
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-naturista-primary outline-none transition" />
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-extrabold text-naturista-text">Gestión de Usuarios</h1>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-naturista-primary hover:bg-naturista-primary-hover text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition">
          <Plus className="w-5 h-5" /> Nuevo Usuario
        </button>
      </div>

      {/* Filtros de rol */}
      <div className="flex gap-2 mb-6">
        {['', 'ADMIN', 'CLIENT', 'DELIVERY'].map(r => (
          <button key={r} onClick={() => setRoleFilter(r)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${roleFilter === r ? 'bg-naturista-primary text-white' : 'bg-white border border-gray-300 text-naturista-text-muted hover:border-naturista-primary'}`}>
            {r || 'Todos'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-naturista-primary"></div></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-naturista-primary-light overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-naturista-primary-light text-naturista-primary">
              <tr>
                <th className="px-5 py-3 text-left font-bold uppercase tracking-wider text-xs">Nombre</th>
                <th className="px-5 py-3 text-left font-bold uppercase tracking-wider text-xs">Email</th>
                <th className="px-5 py-3 text-center font-bold uppercase tracking-wider text-xs">Rol</th>
                <th className="px-5 py-3 text-center font-bold uppercase tracking-wider text-xs">Estado</th>
                <th className="px-5 py-3 text-center font-bold uppercase tracking-wider text-xs">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className={`hover:bg-naturista-bg transition ${!u.is_active ? 'opacity-50' : ''}`}>
                  <td className="px-5 py-4 font-medium text-naturista-text">{u.full_name}</td>
                  <td className="px-5 py-4 text-naturista-text-muted">{u.email}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${roleBadge[u.role]}`}>
                      {roleIcons[u.role]}{u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {u.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(u.id)} className="p-1.5 rounded-lg text-naturista-error hover:bg-red-50 transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="font-bold text-xl text-naturista-text">{modal === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}</h2>
              <button onClick={closeModal}><X className="w-5 h-5 text-naturista-text-muted" /></button>
            </div>
            <div className="p-6 space-y-4">
              <F label="Nombre Completo" name="full_name" />
              <F label="Email" name="email" type="email" />
              <F label={modal === 'create' ? 'Contraseña' : 'Nueva Contraseña (opcional)'} name="password" type="password" />
              <F label="Teléfono" name="phone" />
              <F label="Dirección" name="address" />
              <F label="Rol" name="role" options={['CLIENT', 'DELIVERY', 'ADMIN']} />
              {modal === 'edit' && (
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-naturista-primary" />
                  <label htmlFor="is_active" className="text-sm text-naturista-text font-medium">Usuario activo</label>
                </div>
              )}
              {error && <p className="text-naturista-error text-xs">{error}</p>}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={closeModal} className="flex-1 py-2.5 border border-gray-300 rounded-xl font-semibold text-naturista-text-muted hover:bg-gray-50 transition">Cancelar</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 bg-naturista-primary hover:bg-naturista-primary-hover text-white font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50">
                <Save className="w-4 h-4" /> {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
