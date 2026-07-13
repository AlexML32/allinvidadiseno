import React, { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { History, ChevronDown, ChevronUp, Search } from 'lucide-react';

interface User { id: string; full_name: string; email: string; }
interface OrderItem { id: string; product_name: string; quantity: number; subtotal: number; }
interface Order { id: string; status: string; total: number; created_at: string; confirmed_at: string | null; items: OrderItem[]; }

const StatusChip = ({ status }: { status: string }) => {
  const m: Record<string, string> = { PENDING: 'Pendiente', DELIVERED_PAID: 'Entregado y Pagado', CANCELLED: 'Cancelado' };
  const c: Record<string, string> = { PENDING: 'bg-amber-100 text-amber-700', DELIVERED_PAID: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-naturista-error' };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c[status] || c.PENDING}`}>{m[status] || status}</span>;
};

export default function ClientHistory() {
  const [clients, setClients] = useState<User[]>([]);
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiClient.get('/users?role=CLIENT').then(r => setClients(r.data)).finally(() => setLoadingClients(false));
  }, []);

  const selectClient = async (client: User) => {
    setSelectedClient(client);
    setOrders([]);
    setExpanded(null);
    setLoadingOrders(true);
    try {
      const res = await apiClient.get(`/orders/client/${client.id}`);
      setOrders(res.data);
    } catch { }
    setLoadingOrders(false);
  };

  const filtered = clients.filter(c => c.full_name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <History className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-extrabold text-naturista-text">Historial de Clientes</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel de clientes */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-naturista-primary-light shadow-sm overflow-hidden">
            <div className="p-4 border-b border-naturista-primary-light">
              <div className="relative">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-naturista-primary transition" />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-100">
              {loadingClients ? (
                <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-naturista-primary"></div></div>
              ) : filtered.map(c => (
                <button key={c.id} onClick={() => selectClient(c)}
                  className={`w-full text-left px-4 py-3.5 hover:bg-naturista-bg transition ${selectedClient?.id === c.id ? 'bg-naturista-primary-light' : ''}`}>
                  <p className="font-semibold text-naturista-text text-sm">{c.full_name}</p>
                  <p className="text-naturista-text-muted text-xs mt-0.5">{c.email}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel de historial */}
        <div className="md:col-span-2">
          {!selectedClient ? (
            <div className="bg-white rounded-2xl border border-dashed border-naturista-primary-light p-12 text-center">
              <p className="text-naturista-text-muted">Selecciona un cliente para ver su historial de pedidos.</p>
            </div>
          ) : loadingOrders ? (
            <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-naturista-primary"></div></div>
          ) : (
            <div>
              <h2 className="font-bold text-lg text-naturista-text mb-4">
                Pedidos de <span className="text-naturista-primary">{selectedClient.full_name}</span>
                <span className="ml-3 bg-naturista-primary-light text-naturista-primary text-sm font-bold px-2 py-0.5 rounded-full">{orders.length}</span>
              </h2>
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center">
                  <p className="text-naturista-text-muted">Este cliente no tiene pedidos registrados.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl border border-naturista-primary-light shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-naturista-bg transition" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                        <div className="flex items-center gap-3">
                          <StatusChip status={order.status} />
                          <span className="text-xs text-naturista-text-muted">{new Date(order.created_at).toLocaleDateString('es-PE')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-naturista-primary">S/ {Number(order.total).toFixed(2)}</span>
                          {expanded === order.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                      {expanded === order.id && (
                        <div className="border-t border-gray-100 px-4 pb-4 pt-3 bg-naturista-bg space-y-2">
                          {order.items.map(item => (
                            <div key={item.id} className="flex justify-between text-sm bg-white rounded-lg px-3 py-2 border border-gray-100">
                              <span>{item.product_name} ×{item.quantity}</span>
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
          )}
        </div>
      </div>
    </div>
  );
}
