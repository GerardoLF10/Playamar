// ============================================================
// RUTAS API: Calificaciones del Servicio
// Gestión de feedback de clientes
// ============================================================

import { Router } from 'express';
import CalificacionServicio from '../modelos/CalificacionServicio.js';

const enrutador = Router();

// OBTENER todas las calificaciones
enrutador.get('/', async (peticion, respuesta) => {
  try {
    const calificaciones = await CalificacionServicio.find().sort({ fecha: -1 });
    respuesta.json(calificaciones);
  } catch (error) {
    respuesta.status(500).json({ mensaje: 'Error al obtener calificaciones', error: error.message });
  }
});

// CREAR una nueva calificación
enrutador.post('/', async (peticion, respuesta) => {
  try {
    const calificacion = new CalificacionServicio(peticion.body);
    const guardada = await calificacion.save();
    respuesta.status(201).json(guardada);
  } catch (error) {
    respuesta.status(400).json({ mensaje: 'Error al crear calificación', error: error.message });
  }
});

export default enrutador;
