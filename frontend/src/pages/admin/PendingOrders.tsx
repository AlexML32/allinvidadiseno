import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { ClipboardList, ChevronDown, ChevronUp, MapPin } from 'lucide-react';

interface OrderItem { id: string; product_name: string; unit_price: number; quantity: number; subtotal: number; }
interface Order { id: string; client_name: string; delivery_address: string; total: number; created_at: string; items: OrderItem[]; }

export default function PendingOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get('/orders/pending').then(res => setOrders(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-naturista-primary"></div></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <ClipboardList className="w-8 h-8 text-amber-500" />
        <h1 className="text-3xl font-extrabold text-naturista-text">Pedidos Pendientes</h1>
        <span className="ml-2 bg-amber-100 text-amber-700 font-bold px-3 py-1 rounded-full text-sm">{orders.length}</span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-naturista-primary-light p-12 text-center">
          <ClipboardList className="w-14 h-14 text-naturista-primary-light mx-auto mb-4" />
          <p className="text-naturista-text-muted text-lg">No hay pedidos pendientes por el momento.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-amber-50 transition" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div>
                  <p className="font-bold text-naturista-text">{order.client_name}</p>
                  <div className="flex items-center gap-1.5 text-naturista-text-muted text-sm mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />{order.delivery_address}
                  </div>
                  <p className="text-xs text-naturista-text-muted mt-1">{new Date(order.created_at).toLocaleString('es-PE')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-naturista-primary text-lg">S/ {Number(order.total).toFixed(2)}</span>
                  {expanded === order.id ? <ChevronUp className="w-5 h-5 text-naturista-text-muted" /> : <ChevronDown className="w-5 h-5 text-naturista-text-muted" />}
                </div>
              </div>
              {expanded === order.id && (
                <div className="border-t border-amber-100 bg-amber-50 px-5 pb-5 pt-4">
                  <div className="space-y-2">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm bg-white rounded-lg px-4 py-2.5 border border-gray-100">
                        <span>{item.product_name} <span className="text-naturista-text-muted">×{item.quantity}</span></span>
                        <span className="font-semibold">S/ {Number(item.subtotal).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
