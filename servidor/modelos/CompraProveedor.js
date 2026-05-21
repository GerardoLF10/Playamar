// ============================================================
// MODELO: CompraProveedor
// Registra la entrada de mercancía comprada a proveedores
// ============================================================

import mongoose from 'mongoose';

const compraProveedorSchema = new mongoose.Schema({
  proveedorId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedor', required: true },
  proveedorNombre: { type: String, required: true },                  // Nombre del proveedor (para referencia rápida)
  articulos: [{                                                        // Productos comprados
    producto:   { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
    cantidad:   { type: Number, required: true },                     // Cantidad comprada
    costo:      { type: Number, required: true },                     // Precio unitario de compra
  }],
  total:            { type: Number, required: true },                 // Monto total de la compra
  fecha:            { type: Date, default: Date.now },                // Fecha de la compra
  numeroFactura:    { type: String, required: true },                 // Número de factura del proveedor
}, { timestamps: true });

export default mongoose.model('CompraProveedor', compraProveedorSchema);
