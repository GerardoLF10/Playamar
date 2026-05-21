import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, AlertTriangle, Search, Package } from "lucide-react";
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
import { productosAPI } from "../servicios/api";
import { categorias } from "../datos/datosSimulados";
import type { Producto } from "../datos/datosSimulados";
import { toast } from "sonner";

export function Inventario() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
    sku: "",
  });

  // Cargar productos desde la base de datos al iniciar
  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {
      const datos = await productosAPI.obtenerTodos();
      setProductos(datos);
    } catch (error) {
      toast.error("Error al cargar productos");
    } finally {
      setCargando(false);
    }
  }

  const productosStockBajo = productos.filter((p) => p.stock < 10);

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    producto.sku.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  const abrirDialogo = (producto?: Producto) => {
    if (producto) {
      setProductoEditando(producto);
      setDatosFormulario({
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio: producto.precio.toString(),
        stock: producto.stock.toString(),
        sku: producto.sku,
      });
    } else {
      setProductoEditando(null);
      setDatosFormulario({ nombre: "", categoria: "", precio: "", stock: "", sku: "" });
    }
    setDialogoAbierto(true);
  };

  const cerrarDialogo = () => {
    setDialogoAbierto(false);
    setProductoEditando(null);
    setDatosFormulario({ nombre: "", categoria: "", precio: "", stock: "", sku: "" });
  };

  const guardarProducto = async () => {
    if (!datosFormulario.nombre || !datosFormulario.categoria || !datosFormulario.precio || !datosFormulario.stock || !datosFormulario.sku) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    const datosProducto = {
      nombre: datosFormulario.nombre,
      categoria: datosFormulario.categoria,
      precio: parseFloat(datosFormulario.precio),
      stock: parseInt(datosFormulario.stock),
      sku: datosFormulario.sku,
    };

    try {
      if (productoEditando) {
        // Actualizar producto existente
        await productosAPI.actualizar(productoEditando._id, datosProducto);
        toast.success("Producto actualizado");
      } else {
        // Crear producto nuevo
        await productosAPI.crear(datosProducto);
        toast.success("Producto agregado");
      }
      cerrarDialogo();
      // Recargar la lista de productos
      await cargarProductos();
    } catch (error) {
      toast.error("Error al guardar el producto");
    }
  };

  const eliminarProducto = async (id: string) => {
    try {
      await productosAPI.eliminar(id);
      toast.success("Producto eliminado");
      await cargarProductos();
    } catch (error) {
      toast.error("Error al eliminar el producto");
    }
  };

  if (cargando) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-slate-500">Cargando inventario...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Inventario</h2>
        <p className="text-slate-500">Gestiona tu catálogo de productos</p>
      </div>

      {productosStockBajo.length > 0 && (
        <Card className="p-4 border-amber-200 bg-amber-50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800">Alerta de Stock Bajo</h3>
              <p className="text-sm text-amber-700 mt-1">
                {productosStockBajo.length} producto(s) con menos de 10 unidades en stock:
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {productosStockBajo.map((p) => (
                  <Badge key={p._id} variant="outline" className="border-amber-300 bg-white">
                    {p.nombre} ({p.stock} unidades)
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <Input
            placeholder="Buscar productos..."
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            className="pl-10 border-sky-200 focus:border-sky-400"
          />
        </div>
        <Button
          onClick={() => abrirDialogo()}
          className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
        >
          <Plus className="size-4 mr-2" />
          Agregar Producto
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sky-50 border-b border-sky-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Producto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">SKU</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Categoría</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Precio</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productosFiltrados.map((producto) => (
                <tr key={producto._id} className="hover:bg-sky-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                        <Package className="size-5 text-sky-500" />
                      </div>
                      <span className="font-medium text-slate-800">{producto.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{producto.sku}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="border-sky-200">{producto.categoria}</Badge>
                  </td>
                  <td className="px-6 py-4 font-semibold text-sky-600">${producto.precio}</td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={producto.stock < 10 ? "destructive" : "outline"}
                      className={producto.stock < 10 ? "bg-amber-500" : "border-green-200 text-green-700"}
                    >
                      {producto.stock} unidades
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => abrirDialogo(producto)}
                        className="text-sky-600 hover:text-sky-700 hover:bg-sky-50"
                      >
                        <Edit2 className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarProducto(producto._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{productoEditando ? "Editar Producto" : "Agregar Producto"}</DialogTitle>
            <DialogDescription>
              {productoEditando ? "Modifica la información del producto" : "Completa los datos del nuevo producto"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Producto</Label>
              <Input
                id="nombre"
                value={datosFormulario.nombre}
                onChange={(e) => setDatosFormulario({ ...datosFormulario, nombre: e.target.value })}
                placeholder="Ej: Bikini Tropical"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Select
                value={datosFormulario.categoria}
                onValueChange={(valor) => setDatosFormulario({ ...datosFormulario, categoria: valor })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="precio">Precio (MXN)</Label>
                <Input
                  id="precio"
                  type="number"
                  value={datosFormulario.precio}
                  onChange={(e) => setDatosFormulario({ ...datosFormulario, precio: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={datosFormulario.stock}
                  onChange={(e) => setDatosFormulario({ ...datosFormulario, stock: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={datosFormulario.sku}
                onChange={(e) => setDatosFormulario({ ...datosFormulario, sku: e.target.value })}
                placeholder="Ej: BIK-001"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cerrarDialogo}>Cancelar</Button>
            <Button
              onClick={guardarProducto}
              className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
            >
              {productoEditando ? "Guardar Cambios" : "Agregar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
