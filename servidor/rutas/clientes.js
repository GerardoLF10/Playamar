// ============================================================
// RUTAS API: Clientes
// CRUD completo para clientes del programa de fidelización
// ============================================================

import { Router } from 'express';
import Cliente from '../modelos/Cliente.js';

const enrutador = Router();

// OBTENER todos los clientes
enrutador.get('/', async (peticion, respuesta) => {
  try {
    const clientes = await Cliente.find().sort({ createdAt: -1 });
    respuesta.json(clientes);
  } catch (error) {
    respuesta.status(500).json({ mensaje: 'Error al obtener clientes', error: error.message });
  }
});

// CREAR un nuevo cliente
enrutador.post('/', async (peticion, respuesta) => {
  try {
    const cliente = new Cliente(peticion.body);
    const guardado = await cliente.save();
    respuesta.status(201).json(guardado);
  } catch (error) {
    respuesta.status(400).json({ mensaje: 'Error al crear cliente', error: error.message });
  }
});

// ACTUALIZAR un cliente (para canjear puntos, etc.)
enrutador.put('/:id', async (peticion, respuesta) => {
  try {
    const actualizado = await Cliente.findByIdAndUpdate(peticion.params.id, peticion.body, { new: true });
    if (!actualizado) return respuesta.status(404).json({ mensaje: 'Cliente no encontrado' });
    respuesta.json(actualizado);
  } catch (error) {
    respuesta.status(400).json({ mensaje: 'Error al actualizar cliente', error: error.message });
  }
});

// ELIMINAR un cliente
enrutador.delete('/:id', async (peticion, respuesta) => {
  try {
    const eliminado = await Cliente.findByIdAndDelete(peticion.params.id);
    if (!eliminado) return respuesta.status(404).json({ mensaje: 'Cliente no encontrado' });
    respuesta.json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (error) {
    respuesta.status(500).json({ mensaje: 'Error al eliminar cliente', error: error.message });
  }
});

export default enrutador;
