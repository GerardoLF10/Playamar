import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, UserCircle, Shield } from "lucide-react";
import { Button } from "./ui/button";
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
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { usuariosAPI } from "../servicios/api";
import type { Usuario } from "../datos/datosSimulados";
import { toast } from "sonner";

export function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: "",
    correo: "",
    password: "",
    rol: "",
    estado: "activo" as "activo" | "inactivo",
  });

  // Cargar usuarios desde la base de datos al iniciar
  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    try {
      const datos = await usuariosAPI.obtenerTodos();
      setUsuarios(datos);
    } catch (error) {
      toast.error("Error al cargar usuarios");
    } finally {
      setCargando(false);
    }
  }

  const abrirDialogo = (usuario?: Usuario) => {
    if (usuario) {
      setUsuarioEditando(usuario);
      setDatosFormulario({
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        estado: usuario.estado,
      });
    } else {
      setUsuarioEditando(null);
      setDatosFormulario({ nombre: "", correo: "", password: "", rol: "", estado: "activo" });
    }
    setDialogoAbierto(true);
  };

  const cerrarDialogo = () => {
    setDialogoAbierto(false);
    setUsuarioEditando(null);
    setDatosFormulario({ nombre: "", correo: "", password: "", rol: "", estado: "activo" });
  };

  const guardarUsuario = async () => {
    if (!datosFormulario.nombre || !datosFormulario.correo || !datosFormulario.rol) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    const datosUsuario: Record<string, string> = {
      nombre: datosFormulario.nombre,
      correo: datosFormulario.correo,
      rol: datosFormulario.rol,
      estado: datosFormulario.estado,
    };

    if (datosFormulario.password) {
      datosUsuario.password = datosFormulario.password;
    }

    try {
      if (usuarioEditando) {
        await usuariosAPI.actualizar(usuarioEditando._id, datosUsuario);
        toast.success("Usuario actualizado");
      } else {
        await usuariosAPI.crear(datosUsuario);
        toast.success("Usuario agregado");
      }
      cerrarDialogo();
      await cargarUsuarios();
    } catch (error) {
      toast.error("Error al guardar el usuario");
    }
  };

  const eliminarUsuario = async (id: string) => {
    try {
      await usuariosAPI.eliminar(id);
      toast.success("Usuario eliminado");
      await cargarUsuarios();
    } catch (error) {
      toast.error("Error al eliminar el usuario");
    }
  };

  const cambiarEstado = async (id: string) => {
    const usuario = usuarios.find((u) => u._id === id);
    if (!usuario) return;

    const nuevoEstado = usuario.estado === "activo" ? "inactivo" : "activo";
    try {
      await usuariosAPI.actualizar(id, { ...usuario, estado: nuevoEstado });
      await cargarUsuarios();
    } catch (error) {
      toast.error("Error al cambiar el estado del usuario");
    }
  };

  const obtenerInsigniaRol = (rol: string) => {
    const configRoles: Record<string, { etiqueta: string; color: string }> = {
      admin: { etiqueta: "Administrador", color: "bg-purple-100 text-purple-700 border-purple-200" },
      gerente: { etiqueta: "Gerente", color: "bg-blue-100 text-blue-700 border-blue-200" },
      cajero: { etiqueta: "Cajero", color: "bg-green-100 text-green-700 border-green-200" },
    };
    const config = configRoles[rol];
    return (
      <Badge variant="outline" className={config.color}>
        {config.etiqueta}
      </Badge>
    );
  };

  if (cargando) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-slate-500">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Administración de Usuarios</h2>
          <p className="text-slate-500">Gestiona accesos y roles del personal</p>
        </div>
        <Button
          onClick={() => abrirDialogo()}
          className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
        >
          <Plus className="size-4 mr-2" />
          Agregar Usuario
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-sky-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Shield className="size-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Administradores</p>
              <p className="text-2xl font-bold text-slate-800">
                {usuarios.filter((u) => u.rol === "admin").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6 border-sky-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserCircle className="size-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Gerentes</p>
              <p className="text-2xl font-bold text-slate-800">
                {usuarios.filter((u) => u.rol === "gerente").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6 border-sky-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCircle className="size-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Cajeros</p>
              <p className="text-2xl font-bold text-slate-800">
                {usuarios.filter((u) => u.rol === "cajero").length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-sky-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sky-50 border-b border-sky-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Usuario</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Correo Electrónico</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Rol</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usuarios.map((usuario) => (
                <tr key={usuario._id} className="hover:bg-sky-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold">
                        {usuario.nombre.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="font-medium text-slate-800">{usuario.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{usuario.correo}</td>
                  <td className="px-6 py-4">{obtenerInsigniaRol(usuario.rol)}</td>
                  <td className="px-6 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cambiarEstado(usuario._id)}
                      className={
                        usuario.estado === "activo"
                          ? "border-green-200 text-green-700 hover:bg-green-50"
                          : "border-red-200 text-red-700 hover:bg-red-50"
                      }
                    >
                      {usuario.estado === "activo" ? "Activo" : "Inactivo"}
                    </Button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => abrirDialogo(usuario)}
                        className="text-sky-600 hover:text-sky-700 hover:bg-sky-50"
                      >
                        <Edit2 className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarUsuario(usuario._id)}
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
            <DialogTitle>{usuarioEditando ? "Editar Usuario" : "Agregar Usuario"}</DialogTitle>
            <DialogDescription>
              {usuarioEditando ? "Modifica la información del usuario" : "Completa los datos del nuevo usuario"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input
                id="nombre"
                value={datosFormulario.nombre}
                onChange={(e) => setDatosFormulario({ ...datosFormulario, nombre: e.target.value })}
                placeholder="Ej: Ana García"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="correo">Correo Electrónico</Label>
              <Input
                id="correo"
                type="email"
                value={datosFormulario.correo}
                onChange={(e) => setDatosFormulario({ ...datosFormulario, correo: e.target.value })}
                placeholder="Ej: ana@playamar.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Contraseña {usuarioEditando ? "(dejar vacío para mantener)" : ""}
              </Label>
              <Input
                id="password"
                type="password"
                value={datosFormulario.password}
                onChange={(e) => setDatosFormulario({ ...datosFormulario, password: e.target.value })}
                placeholder={usuarioEditando ? "Nueva contraseña..." : "Contraseña"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rol">Rol</Label>
              <Select
                value={datosFormulario.rol}
                onValueChange={(valor) => setDatosFormulario({ ...datosFormulario, rol: valor })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="gerente">Gerente</SelectItem>
                  <SelectItem value="cajero">Cajero</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={datosFormulario.estado}
                onValueChange={(valor) =>
                  setDatosFormulario({ ...datosFormulario, estado: valor as "activo" | "inactivo" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={cerrarDialogo}>Cancelar</Button>
            <Button
              onClick={guardarUsuario}
              className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
            >
              {usuarioEditando ? "Guardar Cambios" : "Agregar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
