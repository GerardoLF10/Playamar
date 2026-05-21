import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

const API_URL = "/api/auth";

interface UsuarioAuth {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
}

interface AuthContextType {
  usuario: UsuarioAuth | null;
  token: string | null;
  iniciarSesion: (correo: string, password: string) => Promise<void>;
  cerrarSesion: () => void;
  estaAutenticado: boolean;
  cargando: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioAuth | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token");
    const usuarioGuardado = localStorage.getItem("usuario");
    if (tokenGuardado && usuarioGuardado) {
      try {
        setToken(tokenGuardado);
        setUsuario(JSON.parse(usuarioGuardado));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
      }
    }
    setCargando(false);
  }, []);

  async function iniciarSesion(correo: string, password: string) {
    const respuesta = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, password }),
    });

    if (!respuesta.ok) {
      const error = await respuesta.json().catch(() => ({ mensaje: "Error del servidor" }));
      throw new Error(error.mensaje || "Credenciales inválidas");
    }

    const datos = await respuesta.json();
    setToken(datos.token);
    setUsuario(datos.usuario);
    localStorage.setItem("token", datos.token);
    localStorage.setItem("usuario", JSON.stringify(datos.usuario));
  }

  function cerrarSesion() {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        iniciarSesion,
        cerrarSesion,
        estaAutenticado: !!token && !!usuario,
        cargando,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return contexto;
}
