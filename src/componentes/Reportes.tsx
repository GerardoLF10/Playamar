import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, ShoppingCart, Package } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { productosAPI, ventasAPI } from "../servicios/api";
import type { Producto } from "../datos/datosSimulados";
import type { Venta } from "../datos/datosSimulados";

type Periodo = "diario" | "semanal" | "mensual";

export function Reportes() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<Periodo>("diario");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cargando, setCargando] = useState(true);

  // Cargar datos desde la base de datos al iniciar
  useEffect(() => {
    async function cargarDatos() {
      try {
        const [productosDatos, ventasDatos] = await Promise.all([
          productosAPI.obtenerTodos(),
          ventasAPI.obtenerTodos(),
        ]);
        setProductos(productosDatos);
        setVentas(ventasDatos);
      } catch (error) {
        console.error("Error al cargar datos de reportes:", error);
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  // Calcular estadísticas usando los datos reales de la base de datos
  const ingresosTotales = ventas
    .filter((v) => v.estado === "completada")
    .reduce((suma, venta) => suma + venta.total, 0);

  const ventasTotales = ventas.filter((v) => v.estado === "completada").length;

  const productosTotales = productos.length;

  const stockBajo = productos.filter((p) => p.stock < 10).length;

  const datosVentasProductos = productos
    .map((producto) => {
      const ventasProd = ventas.reduce((total, venta) => {
        // Buscar si el producto aparece en los artículos de la venta
        const articuloVenta = venta.articulos.find(
          (a) => (a.producto._id || a.producto.id) === producto._id
        );
        return total + (articuloVenta ? articuloVenta.cantidad : 0);
      }, 0);
      return { nombre: producto.nombre, valor: ventasProd };
    })
    .filter((item) => item.valor > 0)
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 6);

  const datosIngresosCategoria = productos
    .reduce((acum: { nombre: string; valor: number }[], producto) => {
      const ingreso = ventas.reduce((total, venta) => {
        const articuloVenta = venta.articulos.find(
          (a) => (a.producto._id || a.producto.id) === producto._id
        );
        return total + (articuloVenta ? articuloVenta.cantidad * producto.precio : 0);
      }, 0);

      const categoriaExistente = acum.find((item) => item.nombre === producto.categoria);
      if (categoriaExistente) {
        categoriaExistente.valor += ingreso;
      } else {
        acum.push({ nombre: producto.categoria, valor: ingreso });
      }
      return acum;
    }, [])
    .filter((item) => item.valor > 0);

  const datosSemanales = [
    { dia: "Lun", ingreso: 3200 },
    { dia: "Mar", ingreso: 4100 },
    { dia: "Mié", ingreso: 2800 },
    { dia: "Jue", ingreso: 3900 },
    { dia: "Vie", ingreso: 5200 },
    { dia: "Sáb", ingreso: 6800 },
    { dia: "Dom", ingreso: 4500 },
  ];

  const COLORES = ["#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd", "#e0f2fe", "#f0f9ff"];

  const estadisticas = [
    {
      titulo: "Ingresos Totales",
      valor: `$${ingresosTotales.toFixed(2)}`,
      icono: DollarSign,
      color: "from-green-400 to-emerald-500",
      colorFondo: "bg-green-50",
      colorIcono: "text-green-600",
    },
    {
      titulo: "Ventas Realizadas",
      valor: ventasTotales,
      icono: ShoppingCart,
      color: "from-sky-400 to-blue-500",
      colorFondo: "bg-sky-50",
      colorIcono: "text-sky-600",
    },
    {
      titulo: "Productos Totales",
      valor: productosTotales,
      icono: Package,
      color: "from-purple-400 to-violet-500",
      colorFondo: "bg-purple-50",
      colorIcono: "text-purple-600",
    },
    {
      titulo: "Alertas de Stock",
      valor: stockBajo,
      icono: TrendingUp,
      color: "from-amber-400 to-orange-500",
      colorFondo: "bg-amber-50",
      colorIcono: "text-amber-600",
    },
  ];

  if (cargando) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-slate-500">Cargando reportes...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6" style={{ minHeight: '100vh' }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Dashboard de Reportes</h2>
          <p className="text-slate-500">Análisis de ventas e ingresos</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={periodoSeleccionado === "diario" ? "default" : "outline"}
            onClick={() => setPeriodoSeleccionado("diario")}
            className={periodoSeleccionado === "diario"
              ? "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
              : "border-sky-200 hover:bg-sky-50"}
          >
            Diario
          </Button>
          <Button
            variant={periodoSeleccionado === "semanal" ? "default" : "outline"}
            onClick={() => setPeriodoSeleccionado("semanal")}
            className={periodoSeleccionado === "semanal"
              ? "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
              : "border-sky-200 hover:bg-sky-50"}
          >
            Semanal
          </Button>
          <Button
            variant={periodoSeleccionado === "mensual" ? "default" : "outline"}
            onClick={() => setPeriodoSeleccionado("mensual")}
            className={periodoSeleccionado === "mensual"
              ? "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
              : "border-sky-200 hover:bg-sky-50"}
          >
            Mensual
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {estadisticas.map((est, indice) => {
          const Icono = est.icono;
          return (
            <Card key={indice} className="p-6 border-sky-100 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{est.titulo}</p>
                  <p className="text-3xl font-bold text-slate-800">{est.valor}</p>
                </div>
                <div className={`p-3 rounded-lg ${est.colorFondo}`}>
                  <Icono className={`size-6 ${est.colorIcono}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="p-6 border-sky-100">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Productos Más Vendidos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datosVentasProductos}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nombre, percent }) => `${nombre}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="valor"
              >
                {datosVentasProductos.map((_, indice) => (
                  <Cell key={`celda-${indice}`} fill={COLORES[indice % COLORES.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 border-sky-100">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Ingresos por Categoría</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={datosIngresosCategoria}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nombre, valor }) => `${nombre}: $${valor.toFixed(0)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="valor"
              >
                {datosIngresosCategoria.map((_, indice) => (
                  <Cell key={`celda-${indice}`} fill={COLORES[indice % COLORES.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(valor: number) => `$${valor.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 border-sky-100 xl:col-span-2">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Ingresos Semanales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosSemanales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
              <XAxis dataKey="dia" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                formatter={(valor: number) => [`$${valor.toFixed(2)}`, "Ingresos"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e0f2fe",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="ingreso" fill="url(#colorIngresos)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.6} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="border-sky-100">
        <div className="p-6 border-b border-sky-100">
          <h3 className="text-xl font-bold text-slate-800">Ventas Recientes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sky-50 border-b border-sky-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">ID Venta</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Fecha</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Productos</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Método de Pago</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ventas.slice(0, 5).map((venta) => (
                <tr key={venta._id} className="hover:bg-sky-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{venta._id.slice(-6)}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(venta.fecha).toLocaleString("es-MX", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{venta.articulos.length} artículo(s)</td>
                  <td className="px-6 py-4 text-slate-600">{venta.metodoPago}</td>
                  <td className="px-6 py-4 font-semibold text-sky-600">${venta.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
