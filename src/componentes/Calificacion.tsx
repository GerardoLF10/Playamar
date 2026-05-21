import { useState, useEffect } from "react";
import { Star, Send, MessageSquare, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { calificacionesAPI } from "../servicios/api";
import type { CalificacionServicio } from "../datos/datosSimulados";
import { useAuth } from "../contextos/AuthContext";
import { toast } from "sonner";
import { cn } from "./ui/utils";

export function Calificacion() {
  const { usuario } = useAuth();
  const [calificaciones, setCalificaciones] = useState<CalificacionServicio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [calificacionSeleccionada, setCalificacionSeleccionada] = useState(0);
  const [calificacionSugerida, setCalificacionSugerida] = useState(0);
  const [comentario, setComentario] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");

  // Cargar datos desde la base de datos al iniciar
  useEffect(() => {
    async function cargarDatos() {
      try {
        const calificacionesDatos = await calificacionesAPI.obtenerTodos();
        setCalificaciones(calificacionesDatos);
      } catch (error) {
        toast.error("Error al cargar datos");
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  const enviarCalificacion = async () => {
    if (calificacionSeleccionada === 0) {
      toast.error("Por favor selecciona una calificación");
      return;
    }

    if (!comentario.trim()) {
      toast.error("Por favor escribe un comentario");
      return;
    }

    try {
      const nuevoRegistro = await calificacionesAPI.crear({
        calificacion: calificacionSeleccionada,
        comentario: comentario.trim(),
        fecha: new Date().toISOString().split("T")[0],
        atendio: usuario?.nombre || "Desconocido",
      });

      setCalificaciones([nuevoRegistro, ...calificaciones]);
      toast.success("¡Gracias por tu feedback! Nos ayuda a mejorar");

      setCalificacionSeleccionada(0);
      setComentario("");
      setNombreCliente("");
    } catch (error) {
      toast.error("Error al enviar la calificación");
    }
  };

  const promedioCalificacion =
    calificaciones.length > 0
      ? (calificaciones.reduce((suma, r) => suma + r.calificacion, 0) / calificaciones.length).toFixed(1)
      : "0.0";

  const distribucionCalificaciones = [5, 4, 3, 2, 1].map((estrellas) => ({
    estrellas,
    conteo: calificaciones.filter((r) => r.calificacion === estrellas).length,
    porcentaje: calificaciones.length > 0
      ? (calificaciones.filter((r) => r.calificacion === estrellas).length / calificaciones.length) * 100
      : 0,
  }));

  if (cargando) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-slate-500">Cargando calificaciones...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Calificación del Servicio</h2>
        <p className="text-slate-500">Recopila feedback de tus clientes para mejorar la atención</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="p-6 border-sky-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4">¿Cómo fue tu experiencia?</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nombreCliente">Nombre (Opcional)</Label>
                <Input
                  id="nombreCliente"
                  value={nombreCliente}
                  onChange={(e) => setNombreCliente(e.target.value)}
                  placeholder="Tu nombre"
                  className="border-sky-200"
                />
              </div>

              <div className="space-y-2">
                <Label>Calificación</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((estrella) => (
                    <button
                      key={estrella}
                      type="button"
                      onClick={() => setCalificacionSeleccionada(estrella)}
                      onMouseEnter={() => setCalificacionSugerida(estrella)}
                      onMouseLeave={() => setCalificacionSugerida(0)}
                      className="transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sky-400 rounded"
                    >
                      <Star
                        className={cn(
                          "size-12 transition-colors",
                          (calificacionSugerida || calificacionSeleccionada) >= estrella
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        )}
                      />
                    </button>
                  ))}
                </div>
                {calificacionSeleccionada > 0 && (
                  <p className="text-sm text-slate-600">
                    {calificacionSeleccionada === 5 && "¡Excelente!"}
                    {calificacionSeleccionada === 4 && "Muy bien"}
                    {calificacionSeleccionada === 3 && "Bien"}
                    {calificacionSeleccionada === 2 && "Regular"}
                    {calificacionSeleccionada === 1 && "Necesitamos mejorar"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="comentario">Comentarios</Label>
                <Textarea
                  id="comentario"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Cuéntanos sobre tu experiencia en Playamar Boutique..."
                  rows={6}
                  className="border-sky-200 resize-none"
                />
              </div>

              <Button
                onClick={enviarCalificacion}
                className="w-full py-6 text-lg bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
              >
                <Send className="size-5 mr-2" />
                Enviar Feedback
              </Button>
            </div>
          </Card>

          <Card className="border-sky-100">
            <div className="p-6 border-b border-sky-100">
              <h3 className="text-xl font-bold text-slate-800">Comentarios Recientes</h3>
            </div>
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {calificaciones.slice(0, 10).map((calificacion) => (
                <div key={calificacion._id} className="p-6 hover:bg-sky-50/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((estrella) => (
                        <Star
                          key={estrella}
                          className={cn(
                            "size-4",
                            estrella <= calificacion.calificacion
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(calificacion.fecha).toLocaleDateString("es-MX")}
                    </span>
                  </div>
                  <p className="text-slate-700 mb-2">{calificacion.comentario}</p>
                  <p className="text-xs text-slate-500">Atendió: {calificacion.atendio}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-sky-100 bg-gradient-to-br from-sky-50 to-blue-50">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-4">
                <span className="text-4xl font-bold text-white">{promedioCalificacion}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Calificación Promedio</h3>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((estrella) => (
                  <Star
                    key={estrella}
                    className={cn(
                      "size-5",
                      estrella <= Math.round(parseFloat(promedioCalificacion))
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    )}
                  />
                ))}
              </div>
              <p className="text-sm text-slate-600">
                Basado en {calificaciones.length} calificaciones
              </p>
            </div>
          </Card>

          <Card className="p-6 border-sky-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Distribución de Calificaciones</h3>
            <div className="space-y-3">
              {distribucionCalificaciones.map(({ estrellas, conteo, porcentaje }) => (
                <div key={estrellas} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium text-slate-700">{estrellas}</span>
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-600 w-12 text-right">{conteo}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-sky-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="size-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Satisfacción</p>
                <p className="text-2xl font-bold text-slate-800">
                  {calificaciones.length > 0
                    ? (
                        (calificaciones.filter((r) => r.calificacion >= 4).length / calificaciones.length) * 100
                      ).toFixed(0)
                    : 0}
                  %
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Porcentaje de clientes que calificaron 4 o 5 estrellas
            </p>
          </Card>

          <Card className="p-6 border-sky-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-sky-100 rounded-lg">
                <MessageSquare className="size-6 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total de Comentarios</p>
                <p className="text-2xl font-bold text-slate-800">{calificaciones.length}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
