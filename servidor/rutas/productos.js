// ============================================================
// RUTAS API: Productos
// CRUD completo para gestionar el catálogo de productos
// ============================================================

import { Router } from 'express';
import Producto from '../modelos/Producto.js';

const enrutador = Router();

// OBTENER todos los productos
enrutador.get('/', async (peticion, respuesta) => {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });
    respuesta.json(productos);
  } catch (error) {
    respuesta.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
  }
});

// OBTENER un producto por su ID
enrutador.get('/:id', async (peticion, respuesta) => {
  try {
    const producto = await Producto.findById(peticion.params.id);
    if (!producto) return respuesta.status(404).json({ mensaje: 'Producto no encontrado' });
    respuesta.json(producto);
  } catch (error) {
    respuesta.status(500).json({ mensaje: 'Error al obtener producto', error: error.message });
  }
});

// CREAR un nuevo producto
enrutador.post('/', async (peticion, respuesta) => {
  try {
    const producto = new Producto(peticion.body);
    const guardado = await producto.save();
    respuesta.status(201).json(guardado);
  } catch (error) {
    respuesta.status(400).json({ mensaje: 'Error al crear producto', error: error.message });
  }
});

// ACTUALIZAR un producto existente
enrutador.put('/:id', async (peticion, respuesta) => {
  try {
    const actualizado = await Producto.findByIdAndUpdate(peticion.params.id, peticion.body, { new: true });
    if (!actualizado) return respuesta.status(404).json({ mensaje: 'Producto no encontrado' });
    respuesta.json(actualizado);
  } catch (error) {
    respuesta.status(400).json({ mensaje: 'Error al actualizar producto', error: error.message });
  }
});

// ELIMINAR un producto
enrutador.delete('/:id', async (peticion, respuesta) => {
  try {
    const eliminado = await Producto.findByIdAndDelete(peticion.params.id);
    if (!eliminado) return respuesta.status(404).json({ mensaje: 'Producto no encontrado' });
    respuesta.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    respuesta.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
  }
});

export default enrutador;
