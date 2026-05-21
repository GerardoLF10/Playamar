import { useState } from "react";
import { useNavigate } from "react-router";
import { Waves, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../contextos/AuthContext";
import { toast } from "sonner";

export function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const { iniciarSesion } = useAuth();
  const navegar = useNavigate();

  async function manejarEnvio(e: React.FormEvent) {
    e.preventDefault();
    if (!correo || !password) {
      toast.error("Por favor ingresa tu correo y contraseña");
      return;
    }
    setEnviando(true);
    try {
      await iniciarSesion(correo, password);
      toast.success("Inicio de sesión exitoso");
      navegar("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al iniciar sesión");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-sky-100 overflow-hidden">
          <div className="bg-gradient-to-r from-sky-400 to-blue-500 p-8 text-center">
            <div className="bg-white p-3 rounded-xl shadow-md inline-flex mb-4">
              <Waves className="size-10 text-sky-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">Playamar Boutique</h1>
            <p className="text-sky-50 text-sm mt-1">Sistema de gestión</p>
          </div>

          <form onSubmit={manejarEnvio} className="p-8 space-y-6">
            <div className="space-y-2">
              <label htmlFor="correo" className="text-sm font-medium text-slate-700">
                Correo Electrónico
              </label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={mostrarPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-11 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {mostrarPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {enviando ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-400 mt-6">
          &copy; {new Date().getFullYear()} Playamar Boutique. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
