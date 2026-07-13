import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas públicas / cliente
import LoginRegister from './pages/LoginRegister';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';

// Páginas administrador
import AdminDashboard from './pages/admin/AdminDashboard';
import InventoryManagement from './pages/admin/InventoryManagement';
import PendingOrders from './pages/admin/PendingOrders';
import SalesHistory from './pages/admin/SalesHistory';
import ClientHistory from './pages/admin/ClientHistory';
import UserManagement from './pages/admin/UserManagement';
import Reports from './pages/admin/Reports';

// Páginas repartidor
import DeliveryPendingOrders from './pages/delivery/DeliveryPendingOrders';
import DeliveryOrderDetail from './pages/delivery/DeliveryOrderDetail';

function HomeRedirect() {
  const role = useAuthStore(s => s.role);
  if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'DELIVERY') return <Navigate to="/delivery/dashboard" replace />;
  return <Catalog />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Cliente */}
          <Route path="/cart" element={<ProtectedRoute roles={['CLIENT']}><Cart /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute roles={['CLIENT']}><MyOrders /></ProtectedRoute>} />

          {/* Administrador */}
          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/inventory" element={<ProtectedRoute roles={['ADMIN']}><InventoryManagement /></ProtectedRoute>} />
          <Route path="/admin/pending-orders" element={<ProtectedRoute roles={['ADMIN']}><PendingOrders /></ProtectedRoute>} />
          <Route path="/admin/sales" element={<ProtectedRoute roles={['ADMIN']}><SalesHistory /></ProtectedRoute>} />
          <Route path="/admin/client-history" element={<ProtectedRoute roles={['ADMIN']}><ClientHistory /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute roles={['ADMIN']}><Reports /></ProtectedRoute>} />

          {/* Repartidor */}
          <Route path="/delivery/dashboard" element={<ProtectedRoute roles={['DELIVERY']}><DeliveryPendingOrders /></ProtectedRoute>} />
          <Route path="/delivery/order/:id" element={<ProtectedRoute roles={['DELIVERY']}><DeliveryOrderDetail /></ProtectedRoute>} />

          {/* Ruta comodín */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
