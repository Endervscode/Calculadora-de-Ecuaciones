import { Link } from 'react-router-dom';
import { Sigma, LayoutDashboard, Calculator, Heart, Settings, Search, Plus, CheckCircle2, TrendingUp, ExternalLink, Download, Share2 } from 'lucide-react';

export default function Dashboard() {
  const history = [
    { eq: 'dy/dx + y = e^x', desc: 'Condición inicial: y(0)=1', type: 'Lineal de primer orden', date: '24 Oct, 2023' },
    { eq: "y' + P(x)y = Q(x)y^n", desc: 'Sustitución n=2', type: 'Bernoulli', date: '22 Oct, 2023' },
    { eq: 'd²y/dt² + ω²y = 0', desc: 'Oscilador armónico', type: 'Segundo orden', date: '19 Oct, 2023' },
    { eq: 'M(x,y)dx + N(x,y)dy = 0', desc: 'Prueba de exactitud aprobada', type: 'EDO Exacta', date: '15 Oct, 2023' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Sigma size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">EquaSolve</h1>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-blue-700 bg-blue-50 rounded-xl">
            <LayoutDashboard size={20} />
            Panel de Control
          </Link>
          <Link to="/solver" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
            <Calculator size={20} />
            Mis Ecuaciones
          </Link>
          <Link to="#" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
            <Heart size={20} />
            Favoritos
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-100">
          <Link to="#" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
            <Settings size={20} />
            Configuración
          </Link>
          
          <div className="mt-4 flex items-center gap-3 px-4 py-2 border border-slate-100 rounded-xl bg-slate-50">
            <div className="w-8 h-8 rounded-full bg-slate-300 flex-shrink-0 overflow-hidden">
              <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-800 truncate">Dr. Aris Thotle</p>
              <p className="text-[10px] text-slate-500 truncate">Cuenta Pro</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800">Historial y Panel</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search size={16} />
              </span>
              <input 
                type="text" 
                className="pl-10 pr-4 py-1.5 w-64 text-sm bg-slate-50 border border-slate-200 rounded-full focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" 
                placeholder="Buscar ecuaciones..." 
              />
            </div>
            <Link to="/solver" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-sm shadow-blue-200">
              <Plus size={16} />
              Nueva Ecuación
            </Link>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Resueltas</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">124</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Favoritos</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">12</h3>
              </div>
              <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center">
                <Heart size={24} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Tasa de Éxito</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">98.2%</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>

          {/* Recent History Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Ecuaciones Resueltas Recientemente</h3>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">Ver Todo</button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ecuación</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha de Resolución</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.map((item, i) => (
                      <tr key={`${item.eq}-${item.date}`} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-mono text-sm text-blue-700 font-medium">{item.eq}</span>
                            <span className="text-xs text-slate-400 mt-0.5 italic">{item.desc}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {item.date}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/solver?eq=${encodeURIComponent(item.eq)}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Reabrir">
                              <ExternalLink size={16} />
                            </Link>
                            <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Descargar PDF">
                              <Download size={16} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Compartir">
                              <Share2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">Mostrando 4 de 124 resultados</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-xs font-medium text-slate-400 cursor-not-allowed">Anterior</button>
                  <button className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md">Siguiente</button>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Tips/Promos */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-violet-700 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-lg font-bold mb-2">Consejos de Ecuaciones</h4>
                <p className="text-blue-100 text-sm leading-relaxed mb-4 opacity-90">
                  ¿Sabías que? Ahora puedes exportar tus pasos directamente a formato LaTeX para tus trabajos de investigación.
                </p>
                <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-xs font-semibold backdrop-blur-md transition-all">
                  Saber Más
                </button>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">Atajo de Favoritos</h4>
                <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                  Agrega ecuaciones a favoritos para mantenerlas en la parte superior de tu panel para una referencia rápida.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <img src="https://picsum.photos/seed/u1/32/32" alt="u1" className="w-8 h-8 rounded-full border-2 border-white" referrerPolicy="no-referrer" />
                  <img src="https://picsum.photos/seed/u2/32/32" alt="u2" className="w-8 h-8 rounded-full border-2 border-white" referrerPolicy="no-referrer" />
                  <img src="https://picsum.photos/seed/u3/32/32" alt="u3" className="w-8 h-8 rounded-full border-2 border-white" referrerPolicy="no-referrer" />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">+2,400 otros usuarios activos</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
