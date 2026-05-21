// ============================================================
// RUTAS API: Ventas
// Gestión de las transacciones de venta
// ============================================================

import { Router } from 'express';
import Venta from '../modelos/Venta.js';
import Producto from '../modelos/Producto.js';

const enrutador = Router();

// OBTENER todas las ventas
enrutador.get('/', async (peticion, respuesta) => {
  try {
    const ventas = await Venta.find().sort({ fecha: -1 }).populate('articulos.producto');
    respuesta.json(ventas);
  } catch (error) {
    respuesta.status(500).json({ mensaje: 'Error al obtener ventas', error: error.message });
  }
});

// CREAR una nueva venta (y descontar stock)
enrutador.post('/', async (peticion, respuesta) => {
  try {
    const venta = new Venta(peticion.body);
    const guardada = await venta.save();

    // Descontar el stock de cada producto vendido
    for (const articulo of guardada.articulos) {
      await Producto.findByIdAndUpdate(articulo.producto, {
        $inc: { stock: -articulo.cantidad }
      });
    }

    const poblada = await Venta.findById(guardada._id).populate('articulos.producto');
    respuesta.status(201).json(poblada);
  } catch (error) {
    respuesta.status(400).json({ mensaje: 'Error al crear venta', error: error.message });
  }
});

export default enrutador;
