// ============================================================
// MODELO: Cliente
// Cliente registrado en el programa de fidelización
// ============================================================

import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
  nombre:          { type: String, required: true },                   // Nombre completo
  correo:          { type: String, required: true },                   // Correo electrónico
  telefono:        { type: String, required: true },                   // Número de teléfono
  puntos:          { type: Number, default: 0 },                       // Puntos de lealtad acumulados
  comprasTotales:  { type: Number, default: 0 },                       // Cantidad de compras realizadas
  fechaRegistro:   { type: Date, default: Date.now },                  // Fecha en que se registró
}, { timestamps: true });

export default mongoose.model('Cliente', clienteSchema);
