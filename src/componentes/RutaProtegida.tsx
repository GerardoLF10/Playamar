import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contextos/AuthContext";

export function RutaProtegida() {
  const { estaAutenticado, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-50">
        <div className="flex items-center gap-3 text-sky-600">
          <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          <span className="font-medium">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
