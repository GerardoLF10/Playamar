import { Outlet, Link, useLocation } from "react-router";
import { ShoppingCart, Package, BarChart3, DollarSign, Users, Waves, Heart, Truck, MessageCircle, LogOut } from "lucide-react";
import { cn } from "./ui/utils";
import { useAuth } from "../contextos/AuthContext";

interface ElementoNavegacion {
  ruta: string;
  etiqueta: string;
  icono: React.ComponentType<{ className?: string }>;
  rolesPermitidos: string[];
}

const elementosNavegacion: ElementoNavegacion[] = [
  { ruta: "/", etiqueta: "Punto de Venta", icono: ShoppingCart, rolesPermitidos: ["admin", "gerente", "cajero"] },
  { ruta: "/inventario", etiqueta: "Inventario", icono: Package, rolesPermitidos: ["admin", "gerente"] },
  { ruta: "/reportes", etiqueta: "Reportes", icono: BarChart3, rolesPermitidos: ["admin", "gerente"] },
  { ruta: "/corte-caja", etiqueta: "Corte de Caja", icono: DollarSign, rolesPermitidos: ["admin", "gerente", "cajero"] },
  { ruta: "/usuarios", etiqueta: "Usuarios", icono: Users, rolesPermitidos: ["admin"] },
  { ruta: "/fidelizacion", etiqueta: "Fidelización", icono: Heart, rolesPermitidos: ["admin", "gerente", "cajero"] },
  { ruta: "/compras", etiqueta: "Compras", icono: Truck, rolesPermitidos: ["admin", "gerente"] },
  { ruta: "/calificacion", etiqueta: "Calificación", icono: MessageCircle, rolesPermitidos: ["admin", "gerente", "cajero"] },
];

const MAPA_ROLES: Record<string, string> = {
  admin: "Administrador",
  gerente: "Gerente",
  cajero: "Cajero",
};

export function Diseno() {
  const ubicacion = useLocation();
  const { usuario, cerrarSesion } = useAuth();

  const iniciales = usuario
    ? usuario.nombre.split(" ").map((n) => n[0]).join("")
    : "??";

  return (
    <div className="flex h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <aside className="w-64 bg-white border-r border-sky-100 shadow-lg flex flex-col">
        <div className="p-6 border-b border-sky-100 bg-gradient-to-r from-sky-400 to-blue-500">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg shadow-md">
              <Waves className="size-8 text-sky-500" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white">Playamar</h1>
              <p className="text-xs text-sky-50">Boutique</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {elementosNavegacion
            .filter((elemento) => !usuario || elemento.rolesPermitidos.includes(usuario.rol))
            .map((elemento) => {
            const Icono = elemento.icono;
            const esActivo = ubicacion.pathname === elemento.ruta;
            return (
              <Link
                key={elemento.ruta}
                to={elemento.ruta}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  esActivo
                    ? "bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md"
                    : "text-slate-600 hover:bg-sky-50 hover:text-sky-600"
                )}
              >
                <Icono className="size-5" />
                <span className="font-medium">{elemento.etiqueta}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sky-100 bg-sky-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-white font-bold">
                {iniciales}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">{usuario?.nombre}</p>
                <p className="text-xs text-slate-500">{usuario ? MAPA_ROLES[usuario.rol] : ""}</p>
              </div>
            </div>
            <button
              onClick={cerrarSesion}
              className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              title="Cerrar sesión"
            >
              <LogOut className="size-5" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
