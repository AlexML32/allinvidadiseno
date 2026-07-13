import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import apiClient from '../api/client';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userAddress = localStorage.getItem('allinvida_address') || '';

  const [deliveryAddress, setDeliveryAddress] = useState(userAddress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleConfirmOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!deliveryAddress.trim()) {
      setError('Por favor ingresa la dirección de entrega.');
      return;
    }
    if (items.length === 0) {
      setError('El carrito está vacío.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const payload = {
        delivery_address: deliveryAddress,
        items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
      };
      await apiClient.post('/orders', payload);
      clearCart();
      setSuccess('¡Pedido confirmado con éxito! Te notificaremos cuando esté en camino.');
      setTimeout(() => navigate('/my-orders'), 2500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al confirmar el pedido. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !success) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-dashed border-naturista-primary-light p-12">
          <ShoppingBag className="w-16 h-16 text-naturista-primary-light mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-naturista-text mb-2">Tu carrito está vacío</h2>
          <p className="text-naturista-text-muted mb-6">¡Explora nuestro catálogo y agrega productos naturales!</p>
          <button onClick={() => navigate('/')} className="bg-naturista-primary hover:bg-naturista-primary-hover text-white font-bold py-2.5 px-6 rounded-xl transition shadow-md">
            Ver catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-naturista-primary hover:text-naturista-primary-hover font-medium mb-6 transition">
        <ArrowLeft className="w-5 h-5" /> Seguir comprando
      </button>
      <h1 className="text-3xl font-extrabold text-naturista-text mb-8">Tu Carrito</h1>

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 font-semibold">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-naturista-primary-light shadow-sm p-5 flex items-center gap-5">
              <div className="bg-gray-50 rounded-xl w-20 h-20 flex items-center justify-center shrink-0 text-3xl">
                🍃
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="font-semibold text-naturista-text truncate">{item.name}</h3>
                <p className="text-naturista-text-muted text-xs mt-0.5">{item.category}</p>
                <p className="text-naturista-primary font-bold mt-1">S/ {item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 rounded-lg hover:bg-naturista-primary-light text-naturista-primary transition">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-naturista-text">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 rounded-lg hover:bg-naturista-primary-light text-naturista-primary transition">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-naturista-text">S/ {(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeItem(item.id)} className="mt-1 text-naturista-error hover:opacity-70 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-naturista-primary-light shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-naturista-text mb-4">Resumen del Pedido</h2>

            <div className="space-y-2 mb-4">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="text-naturista-text-muted truncate max-w-[60%]">{i.name} ×{i.quantity}</span>
                  <span className="font-medium text-naturista-text">S/ {(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 mb-5">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-naturista-primary">S/ {getTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-naturista-text-muted mb-1">Dirección de entrega</label>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Calle, número, referencia..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naturista-primary focus:border-transparent outline-none text-sm transition"
              />
            </div>

            {error && <p className="text-naturista-error text-xs mb-3">{error}</p>}

            <button
              onClick={handleConfirmOrder}
              disabled={loading}
              className="w-full py-3 bg-naturista-primary hover:bg-naturista-primary-hover text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Confirmando...' : 'Confirmar Pedido'}
            </button>
            <p className="text-center text-xs text-naturista-text-muted mt-3">Pago contra entrega 🤝</p>
          </div>
        </div>
      </div>
    </div>
  );
}
