// ============================================================
// MODELO: CalificacionServicio
// Guarda la opinión de los clientes sobre el servicio
// ============================================================

import mongoose from 'mongoose';

const calificacionServicioSchema = new mongoose.Schema({
  clienteId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', default: null },
  calificacion: { type: Number, required: true, min: 1, max: 5 },     // Puntuación de 1 a 5
  comentario:   { type: String, required: true },                     // Comentario del cliente
  fecha:        { type: Date, default: Date.now },                    // Fecha de la calificación
  atendio:      { type: String, required: true },                     // Nombre de quien atendió
}, { timestamps: true });

export default mongoose.model('CalificacionServicio', calificacionServicioSchema);
