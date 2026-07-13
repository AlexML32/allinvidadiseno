import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { Leaf, ShoppingBag, LogIn, LogOut, LayoutDashboard, Truck, User } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, role, fullName, logout } = useAuthStore();
  const cartCount = useCartStore(s => s.getItemsCount());
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = () => {
    if (role === 'ADMIN') return [{ to: '/admin/dashboard', label: 'Panel Admin', icon: <LayoutDashboard className="w-4 h-4" /> }];
    if (role === 'DELIVERY') return [{ to: '/delivery/dashboard', label: 'Mis Entregas', icon: <Truck className="w-4 h-4" /> }];
    return [
      { to: '/', label: 'Catálogo', icon: <Leaf className="w-4 h-4" /> },
      { to: '/my-orders', label: 'Mis Pedidos', icon: <User className="w-4 h-4" /> },
    ];
  };

  return (
    <div className="min-h-screen flex flex-col bg-naturista-bg">
      {/* Navbar */}
      <header className="bg-white border-b border-naturista-primary-light shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-naturista-primary rounded-xl flex items-center justify-center group-hover:bg-naturista-primary-hover transition">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="leading-none">
              <p className="font-extrabold text-naturista-text text-sm tracking-tight">ALLINVIDA</p>
              <p className="text-naturista-secondary text-[10px] font-semibold uppercase tracking-widest">Salud Natural</p>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks().map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  location.pathname === link.to
                    ? 'bg-naturista-primary-light text-naturista-primary'
                    : 'text-naturista-text-muted hover:bg-naturista-bg hover:text-naturista-text'
                }`}
              >
                {link.icon}{link.label}
              </Link>
            ))}
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-3">
            {role === 'CLIENT' && (
              <Link to="/cart" className="relative p-2 rounded-xl hover:bg-naturista-primary-light transition group">
                <ShoppingBag className="w-6 h-6 text-naturista-primary" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-naturista-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-naturista-text leading-none">{fullName}</p>
                  <p className="text-[10px] text-naturista-secondary uppercase tracking-wider font-semibold">{role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-naturista-error hover:bg-red-50 text-sm font-semibold transition"
                >
                  <LogOut className="w-4 h-4" /> Salir
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 bg-naturista-primary hover:bg-naturista-primary-hover text-white rounded-xl text-sm font-bold shadow-md transition"
              >
                <LogIn className="w-4 h-4" /> Ingresar
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-naturista-primary-light mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-naturista-primary" />
            <span className="text-sm font-semibold text-naturista-text">ALLINVIDA SALUD</span>
          </div>
          <p className="text-xs text-naturista-text-muted">Productos 100% naturales · Pago contra entrega 🤝</p>
        </div>
      </footer>
    </div>
  );
}
