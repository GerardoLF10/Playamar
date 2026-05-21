// ============================================================
// RUTAS API: Usuarios
// CRUD completo para gestionar usuarios del sistema
// ============================================================

import { Router } from 'express';
import Usuario from '../modelos/Usuario.js';

const enrutador = Router();

// OBTENER todos los usuarios
enrutador.get('/', async (peticion, respuesta) => {
  try {
    const usuarios = await Usuario.find().sort({ createdAt: -1 });
    respuesta.json(usuarios);
  } catch (error) {
    respuesta.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
});

// CREAR un nuevo usuario
enrutador.post('/', async (peticion, respuesta) => {
  try {
    const { password, ...datos } = peticion.body;
    const usuario = new Usuario({ ...datos, password: password || 'playamar123' });
    const guardado = await usuario.save();
    const objeto = guardado.toObject();
    delete objeto.password;
    respuesta.status(201).json(objeto);
  } catch (error) {
    respuesta.status(400).json({ mensaje: 'Error al crear usuario', error: error.message });
  }
});

// ACTUALIZAR un usuario
enrutador.put('/:id', async (peticion, respuesta) => {
  try {
    const { password, ...datos } = peticion.body;
    if (password) {
      const usuario = await Usuario.findById(peticion.params.id).select('+password');
      if (!usuario) return respuesta.status(404).json({ mensaje: 'Usuario no encontrado' });
      usuario.password = password;
      Object.assign(usuario, datos);
      const actualizado = await usuario.save();
      const objeto = actualizado.toObject();
      delete objeto.password;
      return respuesta.json(objeto);
    }
    const actualizado = await Usuario.findByIdAndUpdate(peticion.params.id, datos, { new: true });
    if (!actualizado) return respuesta.status(404).json({ mensaje: 'Usuario no encontrado' });
    respuesta.json(actualizado);
  } catch (error) {
    respuesta.status(400).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
});

// ELIMINAR un usuario
enrutador.delete('/:id', async (peticion, respuesta) => {
  try {
    const eliminado = await Usuario.findByIdAndDelete(peticion.params.id);
    if (!eliminado) return respuesta.status(404).json({ mensaje: 'Usuario no encontrado' });
    respuesta.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    respuesta.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
  }
});

export default enrutador;
