import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Sigma, Download, Copy, Plus, Minus, Box } from 'lucide-react';
import { solveEquation } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import * as math from 'mathjs';
import { type SolutionResult } from '../types';

export default function Solver() {
  const location = useLocation();
  const [equation, setEquation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SolutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(40); // Estado para el nivel de zoom del gráfico

  const handleSolve = useCallback(async (eqToSolve: string) => {
    const trimmedEq = eqToSolve.trim();
    if (!trimmedEq) return;

    // Heurística para detectar si es una función simple para graficar o una EDO para resolver
    const isSimpleFunction = (trimmedEq.includes('=') && !trimmedEq.includes('y\'') && !trimmedEq.includes('dy/dx'));

    setLoading(true);
    setError(null);
    setResult(null);

    if (isSimpleFunction) {
      // Es una función simple, solo la graficamos sin llamar a la API
      setTimeout(() => { // Simula una pequeña carga para feedback visual
        const mockResult: SolutionResult = {
          finalSolution: trimmedEq, // La función misma es la "solución"
          explanation: 'Mostrando el gráfico de la función proporcionada.',
          steps: [{
            title: 'Graficar Función Directa',
            description: 'Se ha introducido una función directa. El gráfico muestra su representación visual.',
            math: trimmedEq
          }]
        };
        setResult(mockResult);
        setLoading(false);
      }, 300);
    } else {
      // Es una ecuación diferencial, usamos la API de Gemini
      try {
        const res = await solveEquation(trimmedEq);
        setResult(res);
      } catch (err) {
        console.error("Error solving equation:", err);
        setError('No se pudo resolver la ecuación. Por favor, revisa la sintaxis e inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const eq = params.get('eq');
    if (eq) {
      setEquation(eq);
      handleSolve(eq);
    }
  }, [location, handleSolve]);

  const convertSolutionToFunction = useCallback((sol: string): math.EvalFunction | null => {
    try {
      // Limpieza básica de la expresión LaTeX para que math.js la entienda
      let jsExpression = sol
        .replace(/(y|f)\(x\)\s*=\s*/i, '') // Quitar 'y(x) =' o 'F(x) ='
        .replace(/sen/g, 'sin') // Convertir 'sen' (español) a 'sin'
        .replace(/\\frac\{(.+?)\}\{(.+?)\}/g, '($1)/($2)') // Convertir fracciones
        .replace(/\\cdot/g, '*') // Convertir punto de multiplicación
        .replace(/e\^\{(.+?)\}/g, 'exp($1)') // Convertir e^
        .replace(/\\/g, ''); // Quitar otros caracteres de LaTeX

      // Compilar la expresión. Asumimos C=1 para la constante de integración.
      return math.compile(jsExpression);
    } catch (e) {
      console.error("Error parsing solution for plotting:", e);
      return null;
    }
  }, []);

  const drawPlot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width = canvas.parentElement?.clientWidth || 800;
    const h = canvas.height = canvas.parentElement?.clientHeight || 400;
    
    ctx.clearRect(0, 0, w, h);
    
    // Draw Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, h/2);
    ctx.lineTo(w, h/2);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(w/2, 0);
    ctx.lineTo(w/2, h);
    ctx.stroke();

    if (!result?.finalSolution) return;

    const solutionFn = convertSolutionToFunction(result.finalSolution);
    if (!solutionFn) {
      console.warn("Could not draw plot for the solution.");
      return;
    }

    // Draw Function
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    
    const scale = zoom; // Usar el estado de zoom
    const xMin = -w / (2 * scale);
    const xMax = w / (2 * scale);
    const step = (xMax - xMin) / w;
    let started = false;

    for (let x = xMin; x <= xMax; x += step) {
      try {
        const y = solutionFn.evaluate({ x: x, C: 1 });
        if (typeof y !== 'number' || !isFinite(y)) continue;

        const px = w / 2 + x * scale;
        const py = h / 2 - y * scale;

        started ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        started = true;
      } catch (e) {
        // Ignore points where the function is not defined
      }
    }
    ctx.stroke();
  }, [result, convertSolutionToFunction, zoom]);

  useEffect(() => {
    const handleResize = () => {
      drawPlot();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawPlot]);

  const insertSymbol = (symbol: string) => {
    setEquation(prev => prev + symbol);
  };

  // Funciones para manejar el zoom
  const handleZoomIn = () => {
    setZoom(prev => prev * 1.5);
  };

  const handleZoomOut = () => {
    // Evitar que el zoom sea demasiado pequeño o negativo
    setZoom(prev => Math.max(1, prev / 1.5));
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 border-b border-slate-700 bg-slate-800 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">
            <Sigma size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">EquaSolve</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden flex-col md:flex-row">
        {/* Left Side: Input */}
        <section className="w-full md:w-1/2 flex flex-col border-r border-slate-700 bg-slate-900">
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-700 flex flex-wrap gap-2 bg-slate-800/50">
            <div className="flex bg-slate-800 rounded p-1">
              <button onClick={() => insertSymbol('d/dx ')} className="px-3 py-2 hover:bg-slate-700 rounded text-xs font-mono" title="Derivada">d/dx</button>
              <button onClick={() => insertSymbol('∫ ')} className="px-3 py-2 hover:bg-slate-700 rounded text-xs" title="Integral">∫</button>
              <button onClick={() => insertSymbol('lim ')} className="px-3 py-2 hover:bg-slate-700 rounded text-xs" title="Límite">lim</button>
              <button onClick={() => insertSymbol('∑ ')} className="px-3 py-2 hover:bg-slate-700 rounded text-xs" title="Sumatoria">∑</button>
            </div>
            <div className="flex bg-slate-800 rounded p-1">
              <button onClick={() => insertSymbol('α')} className="px-3 py-2 hover:bg-slate-700 rounded text-sm" title="Alpha">α</button>
              <button onClick={() => insertSymbol('β')} className="px-3 py-2 hover:bg-slate-700 rounded text-sm" title="Beta">β</button>
              <button onClick={() => insertSymbol('π')} className="px-3 py-2 hover:bg-slate-700 rounded text-sm" title="Pi">π</button>
              <button onClick={() => insertSymbol('θ')} className="px-3 py-2 hover:bg-slate-700 rounded text-sm" title="Theta">θ</button>
            </div>
            <div className="flex bg-slate-800 rounded p-1">
              <button onClick={() => insertSymbol('√()')} className="px-3 py-2 hover:bg-slate-700 rounded text-sm" title="Raíz Cuadrada">√</button>
              <button onClick={() => insertSymbol('^')} className="px-3 py-2 hover:bg-slate-700 rounded text-sm" title="Potencia">xⁿ</button>
              <button onClick={() => insertSymbol('∞')} className="px-3 py-2 hover:bg-slate-700 rounded text-sm" title="Infinito">∞</button>
            </div>
          </div>

          {/* Input Area */}
          <div className="flex-1 p-8 flex flex-col justify-center max-w-2xl mx-auto w-full">
            <div className="flex justify-between items-center mb-4">
              <label htmlFor="math-input" className="text-slate-400 text-sm">Ingresa tu ecuación o función:</label>
              <select 
                id="examples"
                onChange={(e) => {
                  if (e.target.value) setEquation(e.target.value);
                }}
                defaultValue=""
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-slate-300 focus:border-blue-500 focus:ring-0 cursor-pointer"
                aria-label="Seleccionar ecuación de ejemplo"
              >
                <option value="" disabled>Cargar un ejemplo...</option>
                <option value="y' + 2y = 0">Lineal Simple</option>
                <option value="dy/dx - y = e^x">Factor Integrante</option>
                <option value="y' + y*cos(x) = sin(x)*cos(x)">Trigonométrica</option>
              </select>
            </div>
            <div className="relative">
              <textarea 
                id="math-input"
                value={equation}
                onChange={(e) => setEquation(e.target.value)}
                className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl p-6 text-2xl font-mono focus:border-blue-500 focus:ring-0 resize-none h-48 transition-all outline-none text-white" 
                placeholder="f(x) = sin(x) / x"
              ></textarea>
              <div className="absolute bottom-4 right-4 text-xs text-slate-500 uppercase tracking-widest">Latex Habilitado</div>
            </div>
            <div className="mt-8 flex gap-4">
              <button 
                onClick={() => handleSolve(equation)}
                disabled={loading}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Resolviendo...' : 'Resolver Paso a Paso'}
              </button>
              <button 
                onClick={() => setEquation('')}
                className="px-6 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-all border border-slate-700"
              >
                Limpiar
              </button>
            </div>
          </div>
        </section>

        {/* Right Side: Results */}
        <section className="w-full md:w-1/2 flex flex-col overflow-y-auto bg-slate-900">
          {/* Visualization Area */}
          <div className="w-full aspect-video bg-black/40 border-b border-slate-700 relative overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full"></canvas>
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button onClick={handleZoomIn} className="p-2 bg-slate-800/80 backdrop-blur border border-slate-600 rounded hover:bg-slate-700 transition-colors" title="Acercar"><Plus size={16}/></button>
              <button onClick={handleZoomOut} className="p-2 bg-slate-800/80 backdrop-blur border border-slate-600 rounded hover:bg-slate-700 transition-colors" title="Alejar"><Minus size={16}/></button>
              <button className="p-2 bg-slate-800/80 backdrop-blur border border-slate-600 rounded hover:bg-slate-700 transition-colors cursor-not-allowed opacity-50" title="Alternar 3D (Próximamente)"><Box size={16}/></button>
            </div>
            {result && (
              <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur px-3 py-1 rounded-full text-xs text-slate-300 border border-slate-700">
                Gráfico de la solución
              </div>
            )}
          </div>

          {/* Solution Steps */}
          <div className="p-8 space-y-8">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : result ? (
              <>
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Solución Final</h3>
                  <div className="bg-blue-900/20 border border-blue-500/20 p-6 rounded-xl">
                    <div className="text-3xl font-serif italic mb-2">
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {`$$${result.finalSolution}$$`}
                      </ReactMarkdown>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">{result.explanation}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Desglose Paso a Paso</h3>
                  {result.steps.map((step, index) => (
                    <div key={`step-${index}-${step.title}`} className="border-l-2 border-blue-500 pl-4 mb-6">
                      <span className="text-xs font-bold text-blue-400 uppercase">Paso {index + 1}: {step.title}</span>
                      <p className="mt-2 text-slate-300">{step.description}</p>
                      <div className="bg-slate-800/50 p-4 mt-2 rounded font-mono text-sm overflow-x-auto">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {`$$${step.math}$$`}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <button className="text-xs font-medium px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 flex items-center gap-2">
                    <Download size={16} />
                    Exportar PDF
                  </button>
                  <button className="text-xs font-medium px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 flex items-center gap-2">
                    <Copy size={16} />
                    Copiar LaTeX
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-500 mt-12 px-6">
                {error ? (
                  <p className="text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-500/30">{error}</p>
                ) : (
                  <p>Ingresa una ecuación diferencial y presiona "Resolver Paso a Paso" para ver la solución.</p>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
