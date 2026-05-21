import { useState, useEffect } from "react";
import { Plus, Truck, Package, Trash2, FileText } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { productosAPI, comprasAPI, proveedoresAPI } from "../servicios/api";
import type { Producto, CompraProveedor, Proveedor } from "../datos/datosSimulados";
import { toast } from "sonner";

interface ArticuloCompra {
  producto: Producto;
  cantidad: number;
  costo: number;
}

export function Compras() {
  const [compras, setCompras] = useState<CompraProveedor[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [cargando, setCargando] = useState(true);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");
  const [numeroFactura, setNumeroFactura] = useState("");
  const [articulosCompra, setArticulosCompra] = useState<ArticuloCompra[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [costo, setCosto] = useState("");

  // Cargar datos desde la base de datos al iniciar
  useEffect(() => {
    async function cargarDatos() {
      try {
        const [comprasDatos, productosDatos, proveedoresDatos] = await Promise.all([
          comprasAPI.obtenerTodos(),
          productosAPI.obtenerTodos(),
          proveedoresAPI.obtenerTodos(),
        ]);
        setCompras(comprasDatos);
        setProductos(productosDatos);
        setProveedores(proveedoresDatos);
      } catch (error) {
        toast.error("Error al cargar datos de compras");
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  const abrirDialogo = () => {
    setProveedorSeleccionado("");
    setNumeroFactura("");
    setArticulosCompra([]);
    setProductoSeleccionado("");
    setCantidad("");
    setCosto("");
    setDialogoAbierto(true);
  };

  const cerrarDialogo = () => {
    setDialogoAbierto(false);
  };

  const agregarArticulo = () => {
    if (!productoSeleccionado || !cantidad || !costo) {
      toast.error("Por favor completa todos los campos del producto");
      return;
    }

    const producto = productos.find((p) => p._id === productoSeleccionado);
    if (!producto) return;

    const nuevoArticulo: ArticuloCompra = {
      producto,
      cantidad: parseInt(cantidad),
      costo: parseFloat(costo),
    };

    setArticulosCompra([...articulosCompra, nuevoArticulo]);
    setProductoSeleccionado("");
    setCantidad("");
    setCosto("");
    toast.success(`${producto.nombre} agregado a la compra`);
  };

  const quitarArticulo = (indice: number) => {
    setArticulosCompra(articulosCompra.filter((_, i) => i !== indice));
  };

  const guardarCompra = async () => {
    if (!proveedorSeleccionado || !numeroFactura) {
      toast.error("Por favor selecciona un proveedor e ingresa el número de factura");
      return;
    }

    if (articulosCompra.length === 0) {
      toast.error("Agrega al menos un producto a la compra");
      return;
    }

    const proveedor = proveedores.find((p) => p._id === proveedorSeleccionado);
    if (!proveedor) return;

    const total = articulosCompra.reduce((suma, item) => suma + item.costo * item.cantidad, 0);

    try {
      const nuevaCompra = await comprasAPI.crear({
        proveedorId: proveedor._id,
        proveedorNombre: proveedor.nombre,
        articulos: articulosCompra.map((item) => ({
          producto: item.producto._id,
          cantidad: item.cantidad,
          costo: item.costo,
        })),
        total,
        fecha: new Date().toISOString().split("T")[0],
        numeroFactura,
      });

      setCompras([nuevaCompra, ...compras]);
      toast.success(`Compra registrada exitosamente. Total: $${total.toFixed(2)} MXN`);
      cerrarDialogo();
    } catch (error) {
      toast.error("Error al registrar la compra");
    }
  };

  const totalCompraActual = articulosCompra.reduce(
    (suma, item) => suma + item.costo * item.cantidad,
    0
  );

  if (cargando) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-slate-500">Cargando compras...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Compras a Proveedores</h2>
          <p className="text-slate-500">Registra la entrada de mercancía al inventario</p>
        </div>
        <Button
          onClick={abrirDialogo}
          className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
        >
          <Plus className="size-4 mr-2" />
          Nueva Compra
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-sky-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-100 rounded-lg">
              <Truck className="size-6 text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Compras Realizadas</p>
              <p className="text-2xl font-bold text-slate-800">{compras.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 border-sky-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="size-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Proveedores Activos</p>
              <p className="text-2xl font-bold text-slate-800">{proveedores.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 border-sky-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="size-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Inversión Total</p>
              <p className="text-2xl font-bold text-slate-800">
                ${compras.reduce((suma, p) => suma + p.total, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-sky-100">
        <div className="p-6 border-b border-sky-100">
          <h3 className="text-xl font-bold text-slate-800">Historial de Compras</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sky-50 border-b border-sky-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">ID / Factura</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Proveedor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Productos</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {compras.map((compra) => (
                <tr key={compra._id} className="hover:bg-sky-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-800">{compra._id.slice(-6)}</p>
                      <p className="text-xs text-slate-500">Fact: {compra.numeroFactura}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sky-100 rounded-lg">
                        <Truck className="size-5 text-sky-600" />
                      </div>
                      <span className="font-medium text-slate-800">{compra.proveedorNombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(compra.fecha).toLocaleDateString("es-MX", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {compra.articulos.map((item, idx) => (
                        <Badge key={idx} variant="outline" className="border-sky-200 text-xs">
                          {item.producto.nombre} ({item.cantidad})
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-sky-600">${compra.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Nueva Compra</DialogTitle>
            <DialogDescription>Completa los datos de la compra a proveedor</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="proveedor">Proveedor</Label>
                <Select value={proveedorSeleccionado} onValueChange={setProveedorSeleccionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {proveedores.map((proveedor) => (
                      <SelectItem key={proveedor._id} value={proveedor._id}>
                        {proveedor.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="factura">Número de Factura</Label>
                <Input
                  id="factura"
                  value={numeroFactura}
                  onChange={(e) => setNumeroFactura(e.target.value)}
                  placeholder="Ej: INV-003"
                />
              </div>
            </div>

            <Card className="p-4 bg-sky-50 border-sky-200">
              <h4 className="font-semibold text-slate-800 mb-3">Agregar Producto</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="producto">Producto</Label>
                  <Select value={productoSeleccionado} onValueChange={setProductoSeleccionado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {productos.map((producto) => (
                        <SelectItem key={producto._id} value={producto._id}>
                          {producto.nombre} (SKU: {producto.sku})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cantidad">Cantidad</Label>
                  <Input
                    id="cantidad"
                    type="number"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costo">Costo Unitario</Label>
                  <Input
                    id="costo"
                    type="number"
                    value={costo}
                    onChange={(e) => setCosto(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <Button
                onClick={agregarArticulo}
                className="w-full mt-3 bg-sky-600 hover:bg-sky-700"
                size="sm"
              >
                <Plus className="size-4 mr-2" />
                Agregar Producto
              </Button>
            </Card>

            {articulosCompra.length > 0 && (
              <Card className="border-sky-100">
                <div className="p-4 bg-sky-50 border-b border-sky-100">
                  <h4 className="font-semibold text-slate-800">
                    Productos en Compra ({articulosCompra.length})
                  </h4>
                </div>
                <div className="divide-y divide-slate-100">
                  {articulosCompra.map((item, indice) => (
                    <div
                      key={indice}
                      className="p-4 flex items-center justify-between hover:bg-sky-50/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{item.producto.nombre}</p>
                        <p className="text-sm text-slate-500">
                          {item.cantidad} unidades × ${item.costo.toFixed(2)} = $
                          {(item.cantidad * item.costo).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => quitarArticulo(indice)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-gradient-to-r from-sky-400 to-blue-500">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Total de Compra:</span>
                    <span className="text-2xl font-bold text-white">
                      ${totalCompraActual.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cerrarDialogo}>Cancelar</Button>
            <Button
              onClick={guardarCompra}
              className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
            >
              <Package className="size-4 mr-2" />
              Registrar Compra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
