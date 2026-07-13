import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Package, ShoppingCart, Users, BarChart3, History, ClipboardList } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const cards = [
  { label: 'Inventario', desc: 'Gestiona productos y stock', icon: Package, path: '/admin/inventory', color: 'text-naturista-primary bg-naturista-primary-light' },
  { label: 'Pedidos Pendientes', desc: 'Entregas por confirmar', icon: ClipboardList, path: '/admin/pending-orders', color: 'text-amber-600 bg-amber-50' },
  { label: 'Ventas Realizadas', desc: 'Pedidos entregados y pagados', icon: ShoppingCart, path: '/admin/sales', color: 'text-green-600 bg-green-50' },
  { label: 'Historial de Clientes', desc: 'Compras por cliente', icon: History, path: '/admin/client-history', color: 'text-blue-600 bg-blue-50' },
  { label: 'Usuarios', desc: 'Clientes, repartidores y admins', icon: Users, path: '/admin/users', color: 'text-purple-600 bg-purple-50' },
  { label: 'Reportes', desc: 'Resumen financiero de ventas', icon: BarChart3, path: '/admin/reports', color: 'text-naturista-warm bg-orange-50' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const fullName = useAuthStore((s) => s.fullName);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-1">
          <LayoutGrid className="w-8 h-8 text-naturista-primary" />
          <h1 className="text-3xl font-extrabold text-naturista-text">Panel de Administrador</h1>
        </div>
        <p className="text-naturista-text-muted ml-11">Bienvenido, <span className="font-semibold text-naturista-text">{fullName || 'Administrador'}</span>. ¿Qué deseas gestionar hoy?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              onClick={() => navigate(card.path)}
              className="bg-white rounded-2xl border border-naturista-primary-light shadow-sm p-6 text-left hover:shadow-md hover:-translate-y-1 transition-all-custom group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-naturista-text text-lg">{card.label}</h3>
              <p className="text-naturista-text-muted text-sm mt-1">{card.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
