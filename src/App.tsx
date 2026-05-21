import { RouterProvider } from "react-router";
import { enrutador } from "./rutas";
import { Toaster } from "./componentes/ui/sonner";
import { AuthProvider } from "./contextos/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={enrutador} />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
