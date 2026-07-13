import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { CheckCircle2, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

interface OrderItem { id: string; product_name: string; unit_price: number; quantity: number; subtotal: number; }
interface Order { id: string; client_name: string; delivery_address: string; total: number; created_at: string; confirmed_at: string; delivery_user_name: string; items: OrderItem[]; }

export default function SalesHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchSales = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (fromDate) params.from_date = new Date(fromDate).toISOString();
      if (toDate) params.to_date = new Date(toDate + 'T23:59:59').toISOString();
      const res = await apiClient.get('/orders/sales', { params });
      setOrders(res.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchSales(); }, []);

  const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle2 className="w-8 h-8 text-green-600" />
        <h1 className="text-3xl font-extrabold text-naturista-text">Ventas Realizadas</h1>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-naturista-primary-light shadow-sm p-5 mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-naturista-text-muted mb-1">Desde</label>
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-naturista-primary transition" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-naturista-text-muted mb-1">Hasta</label>
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-naturista-primary transition" />
        </div>
        <button onClick={fetchSales} className="flex items-center gap-2 bg-naturista-primary hover:bg-naturista-primary-hover text-white font-bold py-2 px-5 rounded-xl transition">
          <Calendar className="w-4 h-4" /> Filtrar
        </button>
        <div className="ml-auto text-right">
          <p className="text-xs text-naturista-text-muted uppercase tracking-wider">Total del período</p>
          <p className="text-2xl font-extrabold text-naturista-primary">S/ {totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-naturista-primary"></div></div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-naturista-text-muted">No hay ventas en el período seleccionado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-green-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-green-50 transition" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div>
                  <p className="font-bold text-naturista-text">{order.client_name}</p>
                  <p className="text-xs text-naturista-text-muted mt-0.5">
                    Confirmado: {order.confirmed_at ? new Date(order.confirmed_at).toLocaleString('es-PE') : '—'}
                    {order.delivery_user_name && ` · por ${order.delivery_user_name}`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-naturista-primary text-lg">S/ {Number(order.total).toFixed(2)}</span>
                  {expanded === order.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
              {expanded === order.id && (
                <div className="border-t border-green-100 bg-green-50 px-5 pb-5 pt-4 space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm bg-white rounded-lg px-4 py-2.5 border border-gray-100">
                      <span>{item.product_name} <span className="text-naturista-text-muted">×{item.quantity}</span> @ S/{Number(item.unit_price).toFixed(2)}</span>
                      <span className="font-semibold">S/ {Number(item.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
