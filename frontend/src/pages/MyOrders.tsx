import React, { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { ChevronDown, ChevronUp, Clock, CheckCircle2, XCircle, Package } from 'lucide-react';

interface OrderItem {
  id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  status: string;
  delivery_address: string;
  total: number;
  created_at: string;
  confirmed_at: string | null;
  items: OrderItem[];
}

const StatusChip = ({ status }: { status: string }) => {
  const config: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    PENDING: { label: 'Pendiente', cls: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Clock className="w-3.5 h-3.5" /> },
    DELIVERED_PAID: { label: 'Entregado y Pagado', cls: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    CANCELLED: { label: 'Cancelado', cls: 'bg-red-100 text-naturista-error border-red-200', icon: <XCircle className="w-3.5 h-3.5" /> },
  };
  const s = config[status] || config['PENDING'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${s.cls}`}>
      {s.icon}{s.label}
    </span>
  );
};

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiClient.get('/orders/me');
        setOrders(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center py-32">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-naturista-primary"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-naturista-text mb-8">Mis Pedidos</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-naturista-primary-light p-12 text-center">
          <Package className="w-14 h-14 text-naturista-primary-light mx-auto mb-4" />
          <p className="text-naturista-text-muted text-lg">Aún no tienes pedidos registrados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-naturista-primary-light shadow-sm overflow-hidden">
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-naturista-bg transition"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <StatusChip status={order.status} />
                  <span className="text-sm text-naturista-text-muted">
                    {new Date(order.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-naturista-primary text-lg">S/ {Number(order.total).toFixed(2)}</span>
                  {expanded === order.id ? <ChevronUp className="w-5 h-5 text-naturista-text-muted" /> : <ChevronDown className="w-5 h-5 text-naturista-text-muted" />}
                </div>
              </div>

              {expanded === order.id && (
                <div className="border-t border-naturista-primary-light px-5 pb-5 pt-4 bg-naturista-bg">
                  <p className="text-xs text-naturista-text-muted mb-1 font-semibold uppercase tracking-wider">Dirección de entrega</p>
                  <p className="text-sm text-naturista-text mb-4">{order.delivery_address}</p>

                  <p className="text-xs text-naturista-text-muted mb-2 font-semibold uppercase tracking-wider">Productos</p>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm bg-white rounded-lg px-4 py-2.5 border border-gray-100">
                        <span className="text-naturista-text">{item.product_name} <span className="text-naturista-text-muted">×{item.quantity}</span></span>
                        <span className="font-semibold text-naturista-text">S/ {Number(item.subtotal).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {order.confirmed_at && (
                    <p className="text-xs text-naturista-text-muted mt-4">
                      Entregado el: {new Date(order.confirmed_at).toLocaleString('es-PE')}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
