import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import apiClient from '../api/client';
import { Search, Filter, ShoppingBag, Eye } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
  is_active: boolean;
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [categories, setCategories] = useState<string[]>([]);
  
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/products?only_active=true');
        setProducts(response.data);
        
        // Extraer categorías únicas
        const cats = response.data.reduce((acc: string[], prod: Product) => {
          if (prod.category && !acc.includes(prod.category)) {
            acc.push(prod.category);
          }
          return acc;
        }, []);
        setCategories(['Todos', ...cats]);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (prod.description && prod.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Todos' || prod.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold font-poppins text-naturista-text tracking-tight">Catálogo Saludable</h1>
        <p className="text-naturista-text-muted mt-2 max-w-xl mx-auto font-light">
          Explora nuestra selección de remedios y alimentos naturales, cosechados y elaborados con el mayor respeto hacia la Madre Tierra.
        </p>
      </div>

      {/* Buscador y Filtros */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-naturista-primary-light">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Buscar productos naturistas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-naturista-primary focus:border-transparent text-sm transition"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-naturista-primary shrink-0" />
          <span className="text-xs font-semibold uppercase text-naturista-text-muted shrink-0 mr-2">Categorías:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition ${
                selectedCategory === cat
                  ? 'bg-naturista-primary text-white shadow'
                  : 'bg-naturista-primary-light text-naturista-primary hover:bg-opacity-80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Productos */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-naturista-primary"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
          <p className="text-naturista-text-muted text-lg">No encontramos productos en esta búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl shadow-sm border border-naturista-primary-light overflow-hidden flex flex-col group hover:shadow-md transition-all-custom"
            >
              {/* Imagen */}
              <div className="relative overflow-hidden bg-gray-50 h-48 flex items-center justify-center p-4">
                <img
                  src={prod.image_url || '/placeholder-product.png'}
                  alt={prod.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23e2e8f0%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2240%22>🍃</text></svg>';
                  }}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-all-custom"
                />
                
                {prod.stock <= 0 && (
                  <div className="absolute top-2 right-2 bg-naturista-error text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">
                    Agotado
                  </div>
                )}
                
                {prod.stock > 0 && prod.stock <= 5 && (
                  <div className="absolute top-2 right-2 bg-naturista-warning text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">
                    ¡Poco Stock!
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-naturista-secondary">
                    {prod.category || 'Natural'}
                  </span>
                  <h3 className="text-base font-semibold text-naturista-text group-hover:text-naturista-primary transition mt-1 line-clamp-1">
                    {prod.name}
                  </h3>
                  <p className="text-naturista-text-muted text-xs mt-1.5 line-clamp-2 min-h-[2rem]">
                    {prod.description || 'Sin descripción adicional.'}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-naturista-text">
                      S/ {Number(prod.price).toFixed(2)}
                    </span>
                    <span className="text-xs text-naturista-text-muted">
                      Stock: {prod.stock}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Link
                      to={`/product/${prod.id}`}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 border border-naturista-primary text-naturista-primary hover:bg-naturista-primary-light font-semibold text-xs rounded-xl transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Detalle
                    </Link>
                    <button
                      disabled={prod.stock <= 0}
                      onClick={() => addToCart({
                        id: prod.id,
                        name: prod.name,
                        price: prod.price,
                        stock: prod.stock,
                        category: prod.category,
                        imageUrl: prod.image_url
                      })}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-naturista-primary hover:bg-naturista-primary-hover text-white font-semibold text-xs rounded-xl transition disabled:opacity-50"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Llevar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
