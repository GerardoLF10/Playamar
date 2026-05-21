// ============================================================
// MODELO: Proveedor
// Empresa que suministra productos a la boutique
// ============================================================

import mongoose from 'mongoose';

const proveedorSchema = new mongoose.Schema({
  nombre:     { type: String, required: true },                       // Nombre de la empresa
  contacto:   { type: String, required: true },                       // Nombre de la persona de contacto
  telefono:   { type: String, required: true },                       // Teléfono de contacto
  correo:     { type: String, required: true },                       // Correo electrónico
}, { timestamps: true });

export default mongoose.model('Proveedor', proveedorSchema);
