import { useState, useEffect } from "react";
import { Search, Plus, Minus, Trash2, X, ShoppingBag, Banknote, CreditCard, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { productosAPI, ventasAPI } from "../servicios/api";
import type { Producto } from "../datos/datosSimulados";
import { toast } from "sonner";

interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

export function PuntoVenta() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [metodoPago, setMetodoPago] = useState("Efectivo");

  const categorias = ["Todos", "Trajes de Baño", "Caballeros", "Vestidos", "Accesorios", "Calzado", "Infantil"];

  // Cargar productos desde la base de datos al iniciar
  useEffect(() => {
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
    cargarProductos();
  }, []);

  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda = producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                             producto.sku.toLowerCase().includes(terminoBusqueda.toLowerCase());
    const coincideCategoria = categoriaSeleccionada === "Todos" || producto.categoria === categoriaSeleccionada;
    return coincideBusqueda && coincideCategoria;
  });

  const agregarAlCarrito = (producto: Producto) => {
    const itemExistente = carrito.find((elemento) => elemento.producto._id === producto._id);
    if (itemExistente) {
      if (itemExistente.cantidad >= producto.stock) {
        toast.error("Stock insuficiente");
        return;
      }
      setCarrito(carrito.map((elemento) =>
        elemento.producto._id === producto._id
          ? { ...elemento, cantidad: elemento.cantidad + 1 }
          : elemento
      ));
    } else {
      setCarrito([...carrito, { producto, cantidad: 1 }]);
    }
  };

  const actualizarCantidad = (productoId: string, cambio: number) => {
    setCarrito(carrito.map((elemento) => {
      if (elemento.producto._id === productoId) {
        const nuevaCantidad = elemento.cantidad + cambio;
        if (nuevaCantidad <= 0) return elemento;
        if (nuevaCantidad > elemento.producto.stock) {
          toast.error("Stock insuficiente");
          return elemento;
        }
        return { ...elemento, cantidad: nuevaCantidad };
      }
      return elemento;
    }));
  };

  const quitarDelCarrito = (productoId: string) => {
    setCarrito(carrito.filter((elemento) => elemento.producto._id !== productoId));
  };

  const limpiarCarrito = () => {
    setCarrito([]);
    toast.info("Venta cancelada");
  };

  const completarTransaccion = async () => {
    if (carrito.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    try {
      // Preparar los datos para enviar al servidor
      const nuevaVenta = {
        articulos: carrito.map((elemento) => ({
          producto: elemento.producto._id,
          cantidad: elemento.cantidad,
        })),
        total: total,
        metodoPago: metodoPago,
        estado: "completada",
      };

      await ventasAPI.crear(nuevaVenta);

      toast.success(`Venta completada: $${total.toFixed(2)} MXN`);
      setCarrito([]);

      // Recargar productos para actualizar el stock
      const datos = await productosAPI.obtenerTodos();
      setProductos(datos);
    } catch (error) {
      toast.error("Error al completar la venta");
    }
  };

  const subtotal = carrito.reduce((suma, elemento) => suma + elemento.producto.precio * elemento.cantidad, 0);
  const impuesto = subtotal * 0.16;
  const total = subtotal + impuesto;

  if (cargando) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-slate-500">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      <div className="flex-1 flex flex-col p-6 space-y-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Punto de Venta</h2>
          <p className="text-slate-500">Busca y agrega productos al carrito</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <Input
            placeholder="Buscar por nombre o SKU..."
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            className="pl-10 py-6 text-lg border-sky-200 focus:border-sky-400"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categorias.map((categoria) => (
            <Button
              key={categoria}
              variant={categoriaSeleccionada === categoria ? "default" : "outline"}
              onClick={() => setCategoriaSeleccionada(categoria)}
              className={categoriaSeleccionada === categoria
                ? "bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white whitespace-nowrap"
                : "whitespace-nowrap border-sky-200 hover:bg-sky-50 hover:text-sky-600"}
            >
              {categoria}
            </Button>
          ))}
        </div>

        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
            {productosFiltrados.map((producto) => (
              <Card
                key={producto._id}
                className="p-4 hover:shadow-lg transition-all cursor-pointer border-sky-100 hover:border-sky-300"
                onClick={() => agregarAlCarrito(producto)}
              >
                <div className="aspect-square bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg mb-3 flex items-center justify-center">
                  <ShoppingBag className="size-12 text-sky-400" />
                </div>
                <h3 className="font-semibold text-slate-800">{producto.nombre}</h3>
                <p className="text-sm text-slate-500">{producto.categoria}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-lg font-bold text-sky-600">${producto.precio}</p>
                  <p className={`text-sm ${producto.stock < 10 ? 'text-amber-600 font-medium' : 'text-slate-500'}`}>
                    Stock: {producto.stock}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="w-96 bg-white border-l border-sky-100 shadow-xl flex flex-col">
        <div className="p-6 border-b border-sky-100 bg-gradient-to-r from-sky-400 to-blue-500">
          <h3 className="text-xl font-bold text-white">Carrito de Compra</h3>
          <p className="text-sm text-sky-50">{carrito.length} producto(s)</p>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {carrito.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ShoppingBag className="size-16 mx-auto mb-3 opacity-30" />
              <p>El carrito está vacío</p>
            </div>
          ) : (
            carrito.map((elemento) => (
              <Card key={elemento.producto._id} className="p-3 border-sky-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-800">{elemento.producto.nombre}</h4>
                    <p className="text-sm text-slate-500">${elemento.producto.precio} c/u</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => quitarDelCarrito(elemento.producto._id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => actualizarCantidad(elemento.producto._id, -1)}
                      className="h-8 w-8 p-0 border-sky-200"
                    >
                      <Minus className="size-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{elemento.cantidad}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => actualizarCantidad(elemento.producto._id, 1)}
                      className="h-8 w-8 p-0 border-sky-200"
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                  <p className="font-bold text-sky-600">
                    ${(elemento.producto.precio * elemento.cantidad).toFixed(2)}
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="border-t border-sky-100 p-6 space-y-3 bg-sky-50">
          <div className="space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>IVA (16%):</span>
              <span>${impuesto.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-slate-800 pt-2 border-t border-sky-200">
              <span>Total:</span>
              <span className="text-sky-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Método de pago</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { valor: "Efectivo", icono: Banknote, label: "Efectivo" },
                { valor: "Tarjeta", icono: CreditCard, label: "Tarjeta" },
                { valor: "Transferencia", icono: Building2, label: "Transf." },
              ].map((opcion) => {
                const Icono = opcion.icono;
                const seleccionado = metodoPago === opcion.valor;
                return (
                  <button
                    key={opcion.valor}
                    onClick={() => setMetodoPago(opcion.valor)}
                    className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg border text-sm transition-all ${
                      seleccionado
                        ? "bg-gradient-to-r from-sky-400 to-blue-500 text-white border-transparent shadow-md"
                        : "border-sky-200 text-slate-600 hover:bg-sky-50 hover:text-sky-600"
                    }`}
                  >
                    <Icono className="size-5" />
                    <span className="text-xs font-medium">{opcion.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Button
              onClick={completarTransaccion}
              className="w-full py-6 text-lg bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
              disabled={carrito.length === 0}
            >
              Completar Venta
            </Button>
            <Button
              onClick={limpiarCarrito}
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
              disabled={carrito.length === 0}
            >
              <X className="size-4 mr-2" />
              Cancelar Venta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
