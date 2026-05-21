// ============================================================
// RUTAS API: Proveedores
// CRUD completo para proveedores
// ============================================================

import { Router } from 'express';
import Proveedor from '../modelos/Proveedor.js';

const enrutador = Router();

// OBTENER todos los proveedores
enrutador.get('/', async (peticion, respuesta) => {
  try {
    const proveedores = await Proveedor.find().sort({ nombre: 1 });
    respuesta.json(proveedores);
  } catch (error) {
    respuesta.status(500).json({ mensaje: 'Error al obtener proveedores', error: error.message });
  }
});

// CREAR un nuevo proveedor
enrutador.post('/', async (peticion, respuesta) => {
  try {
    const proveedor = new Proveedor(peticion.body);
    const guardado = await proveedor.save();
    respuesta.status(201).json(guardado);
  } catch (error) {
    respuesta.status(400).json({ mensaje: 'Error al crear proveedor', error: error.message });
  }
});

export default enrutador;
