import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import apiClient from '../api/client';
import { Leaf } from 'lucide-react';

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const loginStore = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        // Petición de login
        const response = await apiClient.post('/auth/login', { email, password });
        const { access_token, role, email: userEmail, full_name } = response.data;
        
        loginStore(access_token, role, userEmail, full_name);

        // Redirección según el rol
        if (role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (role === 'DELIVERY') {
          navigate('/delivery/dashboard');
        } else {
          navigate('/');
        }
      } else {
        // Petición de registro público (rol CLIENT)
        await apiClient.post('/auth/register', {
          full_name: fullName,
          email,
          password,
          phone: phone || undefined,
          address: address || undefined
        });

        setSuccessMsg('Registro exitoso. Ya puedes iniciar sesión.');
        setIsLogin(true);
        // Limpiar campos de registro
        setFullName('');
        setPhone('');
        setAddress('');
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg('Ocurrió un error inesperado. Reintente por favor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-naturista-primary-light">
        <div className="bg-naturista-primary p-6 text-center text-white flex flex-col items-center">
          <Leaf className="w-12 h-12 mb-2 animate-bounce" />
          <h2 className="text-2xl font-bold tracking-tight">ALLINVIDA SALUD</h2>
          <p className="text-naturista-primary-light text-sm mt-1 font-light">Tienda Naturista de Compra y Venta</p>
        </div>

        <div className="p-8">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => { setIsLogin(true); setErrorMsg(''); }}
              className={`w-1/2 pb-3 font-semibold text-center transition ${
                isLogin
                  ? 'text-naturista-primary border-b-2 border-naturista-primary'
                  : 'text-naturista-text-muted hover:text-naturista-text'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setIsLogin(false); setErrorMsg(''); }}
              className={`w-1/2 pb-3 font-semibold text-center transition ${
                !isLogin
                  ? 'text-naturista-primary border-b-2 border-naturista-primary'
                  : 'text-naturista-text-muted hover:text-naturista-text'
              }`}
            >
              Registrarse
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-naturista-error text-sm rounded-lg border border-red-200">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 text-naturista-success text-sm rounded-lg border border-green-200">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-naturista-text-muted mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Juan Pérez"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naturista-primary focus:border-transparent outline-none transition text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-naturista-text-muted mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naturista-primary focus:border-transparent outline-none transition text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-naturista-text-muted mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naturista-primary focus:border-transparent outline-none transition text-sm"
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-naturista-text-muted mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+51 987 654 321"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naturista-primary focus:border-transparent outline-none transition text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-naturista-text-muted mb-1">Dirección de Entrega</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Calle Las Hiedras 456"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naturista-primary focus:border-transparent outline-none transition text-sm"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-naturista-primary hover:bg-naturista-primary-hover text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none transition-all duration-300 disabled:opacity-50 mt-6"
            >
              {loading ? 'Cargando...' : isLogin ? 'Ingresar' : 'Crear Cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
