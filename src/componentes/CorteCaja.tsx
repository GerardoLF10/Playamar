import { useState, useEffect } from "react";
import { DollarSign, CreditCard, Smartphone, Clock, CheckCircle, Printer } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { ventasAPI } from "../servicios/api";
import type { Venta } from "../datos/datosSimulados";
import { useAuth } from "../contextos/AuthContext";
import { toast } from "sonner";

export function CorteCaja() {
  const { usuario } = useAuth();
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [conteoEfectivo, setConteoEfectivo] = useState({
    billetes1000: "",
    billetes500: "",
    billetes200: "",
    billetes100: "",
    billetes50: "",
    monedas20: "",
    monedas10: "",
    monedas5: "",
  });

  // Cargar ventas desde la base de datos al iniciar
  useEffect(() => {
    async function cargarVentas() {
      try {
        const datos = await ventasAPI.obtenerTodos();
        setVentas(datos);
      } catch (error) {
        toast.error("Error al cargar ventas");
      } finally {
        setCargando(false);
      }
    }
    cargarVentas();
  }, []);

  // Filtrar las ventas de hoy
  const ventasHoy = ventas.filter((venta) => {
    const fechaVenta = new Date(venta.fecha);
    const hoy = new Date();
    return (
      fechaVenta.toDateString() === hoy.toDateString() &&
      venta.estado === "completada"
    );
  });

  const ventasPorMetodo = {
    efectivo: ventasHoy.filter((v) => v.metodoPago === "Efectivo").reduce((suma, v) => suma + v.total, 0),
    tarjeta: ventasHoy.filter((v) => v.metodoPago === "Tarjeta").reduce((suma, v) => suma + v.total, 0),
    transferencia: ventasHoy.filter((v) => v.metodoPago === "Transferencia").reduce((suma, v) => suma + v.total, 0),
  };

  const totalVentas = ventasHoy.reduce((suma, v) => suma + v.total, 0);

  const efectivoContado =
    (parseInt(conteoEfectivo.billetes1000) || 0) * 1000 +
    (parseInt(conteoEfectivo.billetes500) || 0) * 500 +
    (parseInt(conteoEfectivo.billetes200) || 0) * 200 +
    (parseInt(conteoEfectivo.billetes100) || 0) * 100 +
    (parseInt(conteoEfectivo.billetes50) || 0) * 50 +
    (parseInt(conteoEfectivo.monedas20) || 0) * 20 +
    (parseInt(conteoEfectivo.monedas10) || 0) * 10 +
    (parseInt(conteoEfectivo.monedas5) || 0) * 5;

  const diferencia = efectivoContado - ventasPorMetodo.efectivo;

  const cerrarCaja = () => {
    if (efectivoContado === 0) {
      toast.error("Por favor realiza el conteo de efectivo");
      return;
    }
    toast.success("Corte de caja realizado exitosamente");
  };

  const imprimirReporte = () => {
    toast.info("Imprimiendo reporte de corte de caja...");
  };

  if (cargando) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-slate-500">Cargando datos del día...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Corte de Caja</h2>
        <p className="text-slate-500">Cierre de turno y resumen de operaciones</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="p-6 border-sky-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Resumen de Ventas del Día</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="size-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Efectivo</p>
                    <p className="text-lg font-bold text-slate-800">${ventasPorMetodo.efectivo.toFixed(2)}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500">
                  {ventasHoy.filter((v) => v.metodoPago === "Efectivo").length} ventas
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-sky-50 rounded-lg border border-sky-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-100 rounded-lg">
                    <CreditCard className="size-6 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Tarjeta</p>
                    <p className="text-lg font-bold text-slate-800">${ventasPorMetodo.tarjeta.toFixed(2)}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500">
                  {ventasHoy.filter((v) => v.metodoPago === "Tarjeta").length} ventas
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Smartphone className="size-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Transferencia</p>
                    <p className="text-lg font-bold text-slate-800">${ventasPorMetodo.transferencia.toFixed(2)}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500">
                  {ventasHoy.filter((v) => v.metodoPago === "Transferencia").length} ventas
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg">
                <div>
                  <p className="text-sm text-sky-50">Total de Ventas</p>
                  <p className="text-3xl font-bold text-white">${totalVentas.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-sky-50">Transacciones</p>
                  <p className="text-2xl font-bold text-white">{ventasHoy.length}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-sky-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Conteo de Efectivo</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Billetes de $1000</Label>
                <Input
                  type="number"
                  value={conteoEfectivo.billetes1000}
                  onChange={(e) => setConteoEfectivo({ ...conteoEfectivo, billetes1000: e.target.value })}
                  placeholder="0"
                  className="border-sky-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Billetes de $500</Label>
                <Input
                  type="number"
                  value={conteoEfectivo.billetes500}
                  onChange={(e) => setConteoEfectivo({ ...conteoEfectivo, billetes500: e.target.value })}
                  placeholder="0"
                  className="border-sky-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Billetes de $200</Label>
                <Input
                  type="number"
                  value={conteoEfectivo.billetes200}
                  onChange={(e) => setConteoEfectivo({ ...conteoEfectivo, billetes200: e.target.value })}
                  placeholder="0"
                  className="border-sky-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Billetes de $100</Label>
                <Input
                  type="number"
                  value={conteoEfectivo.billetes100}
                  onChange={(e) => setConteoEfectivo({ ...conteoEfectivo, billetes100: e.target.value })}
                  placeholder="0"
                  className="border-sky-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Billetes de $50</Label>
                <Input
                  type="number"
                  value={conteoEfectivo.billetes50}
                  onChange={(e) => setConteoEfectivo({ ...conteoEfectivo, billetes50: e.target.value })}
                  placeholder="0"
                  className="border-sky-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Monedas de $20</Label>
                <Input
                  type="number"
                  value={conteoEfectivo.monedas20}
                  onChange={(e) => setConteoEfectivo({ ...conteoEfectivo, monedas20: e.target.value })}
                  placeholder="0"
                  className="border-sky-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Monedas de $10</Label>
                <Input
                  type="number"
                  value={conteoEfectivo.monedas10}
                  onChange={(e) => setConteoEfectivo({ ...conteoEfectivo, monedas10: e.target.value })}
                  placeholder="0"
                  className="border-sky-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Monedas de $5</Label>
                <Input
                  type="number"
                  value={conteoEfectivo.monedas5}
                  onChange={(e) => setConteoEfectivo({ ...conteoEfectivo, monedas5: e.target.value })}
                  placeholder="0"
                  className="border-sky-200"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-sky-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Información de Turno</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-lg">
                <Clock className="size-5 text-sky-600" />
                <div>
                  <p className="text-xs text-slate-500">Fecha</p>
                  <p className="text-sm font-medium text-slate-800">
                    {new Date().toLocaleDateString("es-MX", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-lg">
                <CheckCircle className="size-5 text-sky-600" />
                <div>
                  <p className="text-xs text-slate-500">Cajero</p>
                  <p className="text-sm font-medium text-slate-800">{usuario?.nombre || "Cajero"}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-sky-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Resultado del Conteo</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Efectivo Esperado:</span>
                <span className="font-semibold text-slate-800">${ventasPorMetodo.efectivo.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Efectivo Contado:</span>
                <span className="font-semibold text-slate-800">${efectivoContado.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Diferencia:</span>
                <span className={`font-bold text-lg ${
                  diferencia === 0
                    ? "text-green-600"
                    : diferencia > 0
                    ? "text-blue-600"
                    : "text-red-600"
                }`}>
                  {diferencia > 0 ? "+" : ""}${diferencia.toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <Button
              onClick={cerrarCaja}
              className="w-full py-6 text-lg bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
            >
              Cerrar Caja
            </Button>
            <Button
              onClick={imprimirReporte}
              variant="outline"
              className="w-full border-sky-200 hover:bg-sky-50 hover:text-sky-600"
            >
              <Printer className="size-4 mr-2" />
              Imprimir Reporte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
