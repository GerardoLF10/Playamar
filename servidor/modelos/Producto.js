// ============================================================
// MODELO: Producto
// Representa un artículo a la venta en la boutique
// ============================================================

import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  nombre:        { type: String, required: true },                     // Nombre del producto
  categoria:     { type: String, required: true },                     // Categoría (Trajes de Baño, Caballeros, etc.)
  precio:        { type: Number, required: true },                     // Precio de venta
  stock:         { type: Number, required: true, default: 0 },         // Cantidad disponible en inventario
  sku:           { type: String, required: true, unique: true },       // Código de identificación único
  imagen:        { type: String, default: '' },                        // URL de la imagen (opcional)
}, { timestamps: true }); // timestamps agrega createdAt y updatedAt automáticamente

export default mongoose.model('Producto', productoSchema);
