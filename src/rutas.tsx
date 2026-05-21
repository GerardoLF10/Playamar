import { createBrowserRouter } from "react-router";
import { Diseno } from "./componentes/Diseno";
import { Login } from "./componentes/Login";
import { RutaProtegida } from "./componentes/RutaProtegida";
import { RutaPorRol } from "./componentes/RutaPorRol";
import { PuntoVenta } from "./componentes/PuntoVenta";
import { Inventario } from "./componentes/Inventario";
import { Reportes } from "./componentes/Reportes";
import { CorteCaja } from "./componentes/CorteCaja";
import { Usuarios } from "./componentes/Usuarios";
import { Fidelizacion } from "./componentes/Fidelizacion";
import { Compras } from "./componentes/Compras";
import { Calificacion } from "./componentes/Calificacion";

export const enrutador = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: RutaProtegida,
    children: [
      {
        Component: Diseno,
        children: [
          { index: true, Component: PuntoVenta },
          { path: "inventario", element: <RutaPorRol rolesPermitidos={["admin", "gerente"]}><Inventario /></RutaPorRol> },
          { path: "reportes", element: <RutaPorRol rolesPermitidos={["admin", "gerente"]}><Reportes /></RutaPorRol> },
          { path: "corte-caja", Component: CorteCaja },
          { path: "usuarios", element: <RutaPorRol rolesPermitidos={["admin"]}><Usuarios /></RutaPorRol> },
          { path: "fidelizacion", Component: Fidelizacion },
          { path: "compras", element: <RutaPorRol rolesPermitidos={["admin", "gerente"]}><Compras /></RutaPorRol> },
          { path: "calificacion", Component: Calificacion },
        ],
      },
    ],
  },
]);
