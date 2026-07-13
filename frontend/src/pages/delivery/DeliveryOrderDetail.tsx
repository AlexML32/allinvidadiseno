import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { CheckCircle2, ArrowLeft, MapPin, User, Package } from 'lucide-react';

interface OrderItem { id: string; product_name: string; unit_price: number; quantity: number; subtotal: number; }
interface Order { id: string; client_name: string; delivery_address: string; total: number; created_at: string; status: string; items: OrderItem[]; }

export default function DeliveryOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    apiClient.get(`/orders/${id}`).then(r => setOrder(r.data)).catch(() => navigate('/delivery/dashboard')).finally(() => setLoading(false));
  }, [id, navigate]);

  const handleConfirm = async () => {
    if (!id || !window.confirm('¿Confirmar entrega y recepción del pago?')) return;
    setConfirming(true); setError('');
    try {
      await apiClient.patch(`/orders/${id}/confirm-delivery`);
      setConfirmed(true);
      setTimeout(() => navigate('/delivery/dashboard'), 2000);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al confirmar la entrega.');
    }
    setConfirming(false);
  };

  if (loading) return <div className="flex justify-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-naturista-primary"></div></div>;
  if (!order) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-naturista-primary hover:text-naturista-primary-hover font-medium mb-8 transition">
        <ArrowLeft className="w-5 h-5" /> Volver a mis entregas
      </button>

      {confirmed && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> ¡Entrega confirmada exitosamente! Redirigiendo...
        </div>
      )}

      <div className="bg-white rounded-2xl border border-naturista-primary-light shadow-sm overflow-hidden">
        {/* Cabecera */}
        <div className="bg-naturista-primary p-6 text-white">
          <p className="text-naturista-primary-light text-xs uppercase tracking-widest mb-1">Pedido #{order.id.slice(0, 8)}...</p>
          <h1 className="text-2xl font-extrabold">{order.client_name}</h1>
        </div>

        <div className="p-6 space-y-5">
          {/* Dirección */}
          <div className="flex items-start gap-3 bg-naturista-bg rounded-xl p-4">
            <MapPin className="w-5 h-5 text-naturista-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-naturista-text-muted">Dirección de entrega</p>
              <p className="font-semibold text-naturista-text mt-0.5">{order.delivery_address}</p>
            </div>
          </div>

          {/* Productos */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-naturista-primary" />
              <p className="text-xs uppercase tracking-wider font-semibold text-naturista-text-muted">Productos del pedido</p>
            </div>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-naturista-bg rounded-xl px-4 py-3">
                  <div>
                    <p className="font-semibold text-naturista-text text-sm">{item.product_name}</p>
                    <p className="text-naturista-text-muted text-xs">S/ {Number(item.unit_price).toFixed(2)} × {item.quantity}</p>
                  </div>
                  <p className="font-bold text-naturista-text">S/ {Number(item.subtotal).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center border-t border-naturista-primary-light pt-4">
            <span className="font-bold text-naturista-text text-lg">Total a cobrar</span>
            <span className="font-extrabold text-naturista-primary text-3xl">S/ {Number(order.total).toFixed(2)}</span>
          </div>

          {error && <p className="text-naturista-error text-sm">{error}</p>}

          {/* Botón de confirmación */}
          {order.status === 'PENDING' && !confirmed ? (
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="w-full py-4 bg-naturista-primary hover:bg-naturista-primary-hover text-white font-extrabold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <CheckCircle2 className="w-6 h-6" />
              {confirming ? 'Confirmando...' : 'Confirmar Entrega y Pago'}
            </button>
          ) : order.status !== 'PENDING' ? (
            <div className="text-center p-4 bg-green-50 rounded-xl text-green-700 font-bold">
              <CheckCircle2 className="w-6 h-6 mx-auto mb-1" />
              Este pedido ya fue entregado y pagado.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
