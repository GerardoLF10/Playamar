// ============================================================
// RUTAS API: Compras a Proveedores
// Registro de mercancía comprada
// ============================================================

import { Router } from 'express';
import CompraProveedor from '../modelos/CompraProveedor.js';
import Producto from '../modelos/Producto.js';

const enrutador = Router();

// OBTENER todas las compras
enrutador.get('/', async (peticion, respuesta) => {
  try {
    const compras = await CompraProveedor.find().sort({ fecha: -1 }).populate('articulos.producto');
    respuesta.json(compras);
  } catch (error) {
    respuesta.status(500).json({ mensaje: 'Error al obtener compras', error: error.message });
  }
});

// CREAR una nueva compra (y aumentar stock)
enrutador.post('/', async (peticion, respuesta) => {
  try {
    const compra = new CompraProveedor(peticion.body);
    const guardada = await compra.save();

    // Aumentar el stock de cada producto comprado
    for (const articulo of guardada.articulos) {
      await Producto.findByIdAndUpdate(articulo.producto, {
        $inc: { stock: articulo.cantidad }
      });
    }

    const poblada = await CompraProveedor.findById(guardada._id).populate('articulos.producto');
    respuesta.status(201).json(poblada);
  } catch (error) {
    respuesta.status(400).json({ mensaje: 'Error al crear compra', error: error.message });
  }
});

export default enrutador;
