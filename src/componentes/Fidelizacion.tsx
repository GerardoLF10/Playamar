import { useState, useEffect } from "react";
import { Plus, Star, Gift, Mail, MessageSquare, Search, Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { clientesAPI, transaccionesAPI } from "../servicios/api";
import type { Cliente, TransaccionLealtad } from "../datos/datosSimulados";
import { toast } from "sonner";

export function Fidelizacion() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [transacciones, setTransacciones] = useState<TransaccionLealtad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [dialogoPromocionAbierto, setDialogoPromocionAbierto] = useState(false);
  const [dialogoCanjeAbierto, setDialogoCanjeAbierto] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: "",
    correo: "",
    telefono: "",
  });
  const [datosPromocion, setDatosPromocion] = useState({
    asunto: "",
    mensaje: "",
    canal: "correo" as "correo" | "sms",
  });
  const [puntosCanje, setPuntosCanje] = useState("");

  // Cargar datos desde la base de datos al iniciar
  useEffect(() => {
    async function cargarDatos() {
      try {
        const [clientesDatos, transaccionesDatos] = await Promise.all([
          clientesAPI.obtenerTodos(),
          transaccionesAPI.obtenerTodos(),
        ]);
        setClientes(clientesDatos);
        setTransacciones(transaccionesDatos);
      } catch (error) {
        toast.error("Error al cargar datos de fidelización");
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      cliente.correo.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      cliente.telefono.includes(terminoBusqueda)
  );

  const abrirDialogoRegistro = () => {
    setDatosFormulario({ nombre: "", correo: "", telefono: "" });
    setDialogoAbierto(true);
  };

  const cerrarDialogoRegistro = () => {
    setDialogoAbierto(false);
    setDatosFormulario({ nombre: "", correo: "", telefono: "" });
  };

  const guardarCliente = async () => {
    if (!datosFormulario.nombre || !datosFormulario.correo || !datosFormulario.telefono) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    try {
      const nuevoCliente = await clientesAPI.crear({
        nombre: datosFormulario.nombre,
        correo: datosFormulario.correo,
        telefono: datosFormulario.telefono,
        puntos: 0,
        comprasTotales: 0,
        fechaRegistro: new Date().toISOString().split("T")[0],
      });
      setClientes([...clientes, nuevoCliente]);
      toast.success(`Cliente ${datosFormulario.nombre} registrado exitosamente`);
      cerrarDialogoRegistro();
    } catch (error) {
      toast.error("Error al registrar el cliente");
    }
  };

  const abrirDialogoCanje = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setPuntosCanje("");
    setDialogoCanjeAbierto(true);
  };

  const canjearPuntos = async () => {
    if (!clienteSeleccionado) return;

    const puntos = parseInt(puntosCanje);
    if (isNaN(puntos) || puntos <= 0) {
      toast.error("Ingresa una cantidad válida de puntos");
      return;
    }

    if (puntos > clienteSeleccionado.puntos) {
      toast.error("Puntos insuficientes");
      return;
    }

    try {
      // Actualizar los puntos del cliente en la base de datos
      const clienteActualizado = await clientesAPI.actualizar(clienteSeleccionado._id, {
        puntos: clienteSeleccionado.puntos - puntos,
      });

      // Registrar la transacción de canje
      const nuevaTransaccion = await transaccionesAPI.crear({
        clienteId: clienteSeleccionado._id,
        tipo: "canjear",
        puntos: puntos,
        descripcion: `Canje de ${puntos} puntos`,
        fecha: new Date().toISOString().split("T")[0],
      });

      // Actualizar el estado local
      setClientes(clientes.map((c) =>
        c._id === clienteSeleccionado._id ? clienteActualizado : c
      ));
      setTransacciones([nuevaTransaccion, ...transacciones]);

      const descuento = (puntos / 10).toFixed(2);
      toast.success(`${puntos} puntos canjeados. Descuento: $${descuento} MXN`);
      setDialogoCanjeAbierto(false);
      setClienteSeleccionado(null);
    } catch (error) {
      toast.error("Error al canjear puntos");
    }
  };

  const abrirDialogoPromocion = () => {
    setDatosPromocion({ asunto: "", mensaje: "", canal: "correo" });
    setDialogoPromocionAbierto(true);
  };

  const enviarPromocion = () => {
    if (!datosPromocion.asunto || !datosPromocion.mensaje) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    toast.success(
      `Promoción enviada por ${datosPromocion.canal === "correo" ? "correo" : "SMS"} a ${clientes.length} clientes`
    );
    setDialogoPromocionAbierto(false);
  };

  const obtenerNivelCliente = (puntos: number) => {
    if (puntos >= 1000) return { nivel: "Platino", color: "bg-purple-100 text-purple-700 border-purple-200" };
    if (puntos >= 500) return { nivel: "Oro", color: "bg-amber-100 text-amber-700 border-amber-200" };
    return { nivel: "Plata", color: "bg-slate-100 text-slate-700 border-slate-200" };
  };

  if (cargando) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-slate-500">Cargando programa de fidelización...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Programa de Fidelización</h2>
          <p className="text-slate-500">Gestiona clientes frecuentes y puntos de lealtad</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={abrirDialogoPromocion}
            variant="outline"
            className="border-sky-200 hover:bg-sky-50 hover:text-sky-600"
          >
            <Mail className="size-4 mr-2" />
            Enviar Promoción
          </Button>
          <Button
            onClick={abrirDialogoRegistro}
            className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
          >
            <Plus className="size-4 mr-2" />
            Registrar Cliente
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-sky-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-100 rounded-lg">
              <Trophy className="size-6 text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Clientes Registrados</p>
              <p className="text-2xl font-bold text-slate-800">{clientes.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 border-sky-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Star className="size-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Puntos Activos</p>
              <p className="text-2xl font-bold text-slate-800">
                {clientes.reduce((suma, c) => suma + c.puntos, 0)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6 border-sky-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Gift className="size-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Canjes Realizados</p>
              <p className="text-2xl font-bold text-slate-800">
                {transacciones.filter((t) => t.tipo === "canjear").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6 border-sky-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Trophy className="size-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Clientes Platino</p>
              <p className="text-2xl font-bold text-slate-800">
                {clientes.filter((c) => c.puntos >= 1000).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
        <Input
          placeholder="Buscar cliente por nombre, correo o teléfono..."
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
          className="pl-10 border-sky-200 focus:border-sky-400"
        />
      </div>

      <Card className="border-sky-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sky-50 border-b border-sky-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Cliente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Contacto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Nivel</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Puntos Acumulados</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Compras Totales</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clientesFiltrados.map((cliente) => {
                const nivel = obtenerNivelCliente(cliente.puntos);
                return (
                  <tr key={cliente._id} className="hover:bg-sky-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold">
                          {cliente.nombre.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{cliente.nombre}</p>
                          <p className="text-xs text-slate-500">
                            Desde {new Date(cliente.fechaRegistro).toLocaleDateString("es-MX")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-slate-800">{cliente.correo}</p>
                        <p className="text-xs text-slate-500">{cliente.telefono}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={nivel.color}>{nivel.nivel}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Star className="size-4 text-amber-500 fill-amber-500" />
                        <span className="text-lg font-bold text-sky-600">{cliente.puntos}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{cliente.comprasTotales}</td>
                    <td className="px-6 py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => abrirDialogoCanje(cliente)}
                        className="border-green-200 text-green-700 hover:bg-green-50"
                        disabled={cliente.puntos === 0}
                      >
                        <Gift className="size-4 mr-1" />
                        Canjear Puntos
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Cliente Frecuente</DialogTitle>
            <DialogDescription>Completa los datos del nuevo cliente</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input
                id="nombre"
                value={datosFormulario.nombre}
                onChange={(e) => setDatosFormulario({ ...datosFormulario, nombre: e.target.value })}
                placeholder="Ej: Juan Pérez"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="correo">Correo Electrónico</Label>
              <Input
                id="correo"
                type="email"
                value={datosFormulario.correo}
                onChange={(e) => setDatosFormulario({ ...datosFormulario, correo: e.target.value })}
                placeholder="Ej: juan@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={datosFormulario.telefono}
                onChange={(e) => setDatosFormulario({ ...datosFormulario, telefono: e.target.value })}
                placeholder="Ej: 1234567890"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cerrarDialogoRegistro}>Cancelar</Button>
            <Button
              onClick={guardarCliente}
              className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
            >
              Registrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogoCanjeAbierto} onOpenChange={setDialogoCanjeAbierto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Canjear Puntos</DialogTitle>
            <DialogDescription>
              {clienteSeleccionado && (
                <>
                  Cliente: {clienteSeleccionado.nombre} - Puntos disponibles:{" "}
                  <span className="font-bold text-amber-600">{clienteSeleccionado.puntos}</span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="puntos">Puntos a Canjear</Label>
              <Input
                id="puntos"
                type="number"
                value={puntosCanje}
                onChange={(e) => setPuntosCanje(e.target.value)}
                placeholder="Ej: 100"
              />
              <p className="text-xs text-slate-500">
                Descuento equivalente: ${((parseInt(puntosCanje) || 0) / 10).toFixed(2)} MXN
                (10 puntos = $1 MXN)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogoCanjeAbierto(false); setClienteSeleccionado(null); }}>
              Cancelar
            </Button>
            <Button
              onClick={canjearPuntos}
              className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600"
            >
              <Gift className="size-4 mr-2" />
              Aplicar Descuento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogoPromocionAbierto} onOpenChange={setDialogoPromocionAbierto}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Enviar Promoción</DialogTitle>
            <DialogDescription>Envía ofertas personalizadas a tus clientes registrados</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Canal de Envío</Label>
              <div className="flex gap-2">
                <Button
                  variant={datosPromocion.canal === "correo" ? "default" : "outline"}
                  onClick={() => setDatosPromocion({ ...datosPromocion, canal: "correo" })}
                  className={datosPromocion.canal === "correo" ? "flex-1 bg-gradient-to-r from-sky-400 to-blue-500" : "flex-1"}
                >
                  <Mail className="size-4 mr-2" />
                  Correo
                </Button>
                <Button
                  variant={datosPromocion.canal === "sms" ? "default" : "outline"}
                  onClick={() => setDatosPromocion({ ...datosPromocion, canal: "sms" })}
                  className={datosPromocion.canal === "sms" ? "flex-1 bg-gradient-to-r from-sky-400 to-blue-500" : "flex-1"}
                >
                  <MessageSquare className="size-4 mr-2" />
                  SMS
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="asunto">Asunto / Título</Label>
              <Input
                id="asunto"
                value={datosPromocion.asunto}
                onChange={(e) => setDatosPromocion({ ...datosPromocion, asunto: e.target.value })}
                placeholder="Ej: ¡Oferta especial para ti!"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mensaje">Mensaje</Label>
              <Textarea
                id="mensaje"
                value={datosPromocion.mensaje}
                onChange={(e) => setDatosPromocion({ ...datosPromocion, mensaje: e.target.value })}
                placeholder="Escribe tu mensaje promocional aquí..."
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoPromocionAbierto(false)}>Cancelar</Button>
            <Button
              onClick={enviarPromocion}
              className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
            >
              <Mail className="size-4 mr-2" />
              Enviar Promoción
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
