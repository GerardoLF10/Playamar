import { Navigate } from "react-router";
import { useAuth } from "../contextos/AuthContext";

interface Props {
  rolesPermitidos: string[];
  children: React.ReactNode;
}

export function RutaPorRol({ rolesPermitidos, children }: Props) {
  const { usuario } = useAuth();

  if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
