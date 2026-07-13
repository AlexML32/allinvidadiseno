import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { Truck, MapPin, Clock, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface Order { id: string; client_name: string; delivery_address: string; total: number; created_at: string; }

export default function DeliveryPendingOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fullName = useAuthStore(s => s.fullName);

  useEffect(() => {
    apiClient.get('/orders/pending')
      .then(r => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-32">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-naturista-primary"></div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <Truck className="w-8 h-8 text-naturista-primary" />
        <h1 className="text-3xl font-extrabold text-naturista-text">Mis Entregas Pendientes</h1>
      </div>
      <p className="text-naturista-text-muted ml-11 mb-8">Hola, <span className="font-semibold text-naturista-text">{fullName}</span>. Estos son los pedidos que debes entregar.</p>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-naturista-primary-light p-14 text-center">
          <Truck className="w-16 h-16 text-naturista-primary-light mx-auto mb-4" />
          <p className="text-naturista-text-muted text-lg font-medium">¡No hay pedidos pendientes!</p>
          <p className="text-naturista-text-muted text-sm mt-1">Vuelve más tarde para ver nuevos pedidos.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <button
              key={order.id}
              onClick={() => navigate(`/delivery/order/${order.id}`)}
              className="w-full bg-white rounded-2xl border border-naturista-primary-light shadow-sm p-5 text-left hover:shadow-md hover:border-naturista-primary hover:-translate-y-0.5 transition-all-custom group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <p className="font-bold text-naturista-text text-lg group-hover:text-naturista-primary transition">{order.client_name}</p>
                  <div className="flex items-center gap-1.5 text-naturista-text-muted text-sm mt-1.5">
                    <MapPin className="w-4 h-4 text-naturista-primary shrink-0" />
                    <span>{order.delivery_address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-naturista-text-muted text-xs mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pedido: {new Date(order.created_at).toLocaleString('es-PE')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-naturista-text-muted uppercase tracking-wider">Total</p>
                    <p className="font-extrabold text-naturista-primary text-xl">S/ {Number(order.total).toFixed(2)}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-naturista-text-muted group-hover:text-naturista-primary transition" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
