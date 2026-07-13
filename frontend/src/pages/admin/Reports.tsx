import React, { useState } from 'react';
import apiClient from '../../api/client';
import { BarChart3, TrendingUp, ShoppingBag, DollarSign, Package } from 'lucide-react';

interface ProductStat { product_name: string; quantity_sold: number; total_revenue: number; }
interface ReportData { total_sales: number; order_count: number; average_ticket: number; top_selling_products: ProductStat[]; }

export default function Reports() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    setLoading(true); setError('');
    try {
      const params: any = {};
      if (fromDate) params.from_date = new Date(fromDate).toISOString();
      if (toDate) params.to_date = new Date(toDate + 'T23:59:59').toISOString();
      const res = await apiClient.get('/reports/sales-summary', { params });
      setReport(res.data);
    } catch (e: any) { setError(e.response?.data?.message || 'Error al generar reporte'); }
    setLoading(false);
  };

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white rounded-2xl border border-naturista-primary-light shadow-sm p-6 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider font-semibold text-naturista-text-muted">{label}</p>
        <p className="text-2xl font-extrabold text-naturista-text mt-0.5">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 className="w-8 h-8 text-naturista-warm" />
        <h1 className="text-3xl font-extrabold text-naturista-text">Reportes de Ventas</h1>
      </div>

      {/* Controles */}
      <div className="bg-white rounded-2xl border border-naturista-primary-light shadow-sm p-6 mb-8">
        <h2 className="font-bold text-naturista-text mb-4">Seleccionar Período</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-naturista-text-muted mb-1">Desde</label>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-naturista-primary transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-naturista-text-muted mb-1">Hasta</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-naturista-primary transition" />
          </div>
          <button onClick={fetchReport} disabled={loading}
            className="flex items-center gap-2 bg-naturista-primary hover:bg-naturista-primary-hover text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition disabled:opacity-50">
            <TrendingUp className="w-4 h-4" /> {loading ? 'Generando...' : 'Generar Reporte'}
          </button>
          <button onClick={() => { setFromDate(''); setToDate(''); fetchReport(); }}
            className="py-2.5 px-5 border border-gray-300 rounded-xl text-naturista-text-muted hover:bg-gray-50 font-semibold transition text-sm">
            Ver todo el período
          </button>
        </div>
        {error && <p className="text-naturista-error text-sm mt-3">{error}</p>}
      </div>

      {report && (
        <>
          {/* Tarjetas métricas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <StatCard icon={DollarSign} label="Total Vendido" value={`S/ ${Number(report.total_sales).toFixed(2)}`} color="bg-naturista-primary-light text-naturista-primary" />
            <StatCard icon={ShoppingBag} label="Pedidos Completados" value={report.order_count} color="bg-green-50 text-green-600" />
            <StatCard icon={TrendingUp} label="Ticket Promedio" value={`S/ ${Number(report.average_ticket).toFixed(2)}`} color="bg-orange-50 text-naturista-warm" />
          </div>

          {/* Productos más vendidos */}
          <div className="bg-white rounded-2xl border border-naturista-primary-light shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Package className="w-5 h-5 text-naturista-primary" />
              <h2 className="font-bold text-naturista-text text-lg">Productos Más Vendidos</h2>
            </div>
            {report.top_selling_products.length === 0 ? (
              <p className="text-naturista-text-muted text-sm">Sin datos para el período seleccionado.</p>
            ) : (
              <div className="space-y-3">
                {report.top_selling_products.map((p, i) => {
                  const maxQty = report.top_selling_products[0].quantity_sold;
                  const pct = maxQty > 0 ? (p.quantity_sold / maxQty) * 100 : 0;
                  return (
                    <div key={p.product_name} className="flex items-center gap-4">
                      <span className="w-6 h-6 rounded-full bg-naturista-primary text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <div className="flex-grow">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-semibold text-naturista-text">{p.product_name}</span>
                          <span className="text-naturista-text-muted">{p.quantity_sold} unid. · S/ {Number(p.total_revenue).toFixed(2)}</span>
                        </div>
                        <div className="h-2 bg-naturista-primary-light rounded-full overflow-hidden">
                          <div className="h-full bg-naturista-primary rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
