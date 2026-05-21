// ============================================================
// RUTAS API: Transacciones de Lealtad
// Registro de puntos ganados y canjeados
// ============================================================

import { Router } from 'express';
import TransaccionLealtad from '../modelos/TransaccionLealtad.js';

const enrutador = Router();

// OBTENER todas las transacciones
enrutador.get('/', async (peticion, respuesta) => {
  try {
    const transacciones = await TransaccionLealtad.find().sort({ fecha: -1 });
    respuesta.json(transacciones);
  } catch (error) {
    respuesta.status(500).json({ mensaje: 'Error al obtener transacciones', error: error.message });
  }
});

// CREAR una nueva transacción
enrutador.post('/', async (peticion, respuesta) => {
  try {
    const transaccion = new TransaccionLealtad(peticion.body);
    const guardada = await transaccion.save();
    respuesta.status(201).json(guardada);
  } catch (error) {
    respuesta.status(400).json({ mensaje: 'Error al crear transacción', error: error.message });
  }
});

export default enrutador;
