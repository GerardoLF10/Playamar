// ============================================================
// MODELO: Venta
// Registra una transacción de venta en el punto de venta
// ============================================================

import mongoose from 'mongoose';

const ventaSchema = new mongoose.Schema({
  fecha:        { type: Date, default: Date.now },                     // Fecha y hora de la venta
  articulos: [{                                                         // Lista de productos vendidos
    producto:   { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
    cantidad:   { type: Number, required: true },                      // Cantidad vendida
  }],
  total:        { type: Number, required: true },                      // Monto total de la venta
  metodoPago:   { type: String, required: true },                      // Efectivo, Tarjeta, Transferencia
  estado:       { type: String, enum: ['completada', 'cancelada', 'devuelta'], default: 'completada' },
}, { timestamps: true });

export default mongoose.model('Venta', ventaSchema);
