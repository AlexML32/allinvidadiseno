import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import apiClient from '../api/client';
import { ShoppingBag, ArrowLeft, Package, Leaf } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiClient.get(`/products/${id}`);
        setProduct(res.data);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleAdd = () => {
    if (!product) return;
    addToCart({ id: product.id, name: product.name, price: product.price, stock: product.stock, category: product.category, imageUrl: product.image_url }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="flex justify-center items-center py-32">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-naturista-primary"></div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-naturista-primary hover:text-naturista-primary-hover font-medium mb-8 transition">
        <ArrowLeft className="w-5 h-5" /> Volver al catálogo
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-naturista-primary-light overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Imagen */}
        <div className="bg-gray-50 flex items-center justify-center p-10 min-h-72">
          <img
            src={product.image_url || ''}
            alt={product.name}
            onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><rect width=%22200%22 height=%22200%22 fill=%22%23e2e8f0%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2280%22>🍃</text></svg>'; }}
            className="max-h-72 max-w-full object-contain"
          />
        </div>

        {/* Info */}
        <div className="p-8 flex flex-col justify-between">
          <div>
            <span className="inline-block bg-naturista-primary-light text-naturista-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              <Leaf className="inline w-3 h-3 mr-1" />{product.category || 'Natural'}
            </span>
            <h1 className="text-3xl font-extrabold text-naturista-text leading-tight">{product.name}</h1>
            <p className="text-naturista-text-muted mt-4 leading-relaxed">{product.description || 'Sin descripción adicional.'}</p>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-4xl font-bold text-naturista-primary">S/ {Number(product.price).toFixed(2)}</span>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-naturista-error'}`}>
                <Package className="w-4 h-4" />
                {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-4 mb-5">
              <span className="text-sm font-semibold text-naturista-text-muted">Cantidad:</span>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-naturista-primary hover:bg-naturista-primary-light font-bold text-lg transition">−</button>
                <span className="px-6 py-2 font-bold text-naturista-text border-x border-gray-300">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-4 py-2 text-naturista-primary hover:bg-naturista-primary-light font-bold text-lg transition">+</button>
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg ${added ? 'bg-naturista-success' : 'bg-naturista-primary hover:bg-naturista-primary-hover'} disabled:opacity-50`}
            >
              <ShoppingBag className="w-5 h-5" />
              {added ? '¡Agregado al carrito! ✓' : 'Agregar al Carrito'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
