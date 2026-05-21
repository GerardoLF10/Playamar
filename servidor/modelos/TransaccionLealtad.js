// ============================================================
// MODELO: TransaccionLealtad
// Registra cada movimiento de puntos (ganar o canjear)
// ============================================================

import mongoose from 'mongoose';

const transaccionLealtadSchema = new mongoose.Schema({
  clienteId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  tipo:         { type: String, enum: ['ganar', 'canjear'], required: true },
  puntos:       { type: Number, required: true },                     // Cantidad de puntos de la transacción
  descripcion:  { type: String, default: '' },                        // Motivo o descripción
  fecha:        { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('TransaccionLealtad', transaccionLealtadSchema);
