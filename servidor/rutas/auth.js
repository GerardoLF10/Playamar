import { Router } from 'express';
import Usuario from '../modelos/Usuario.js';
import { generarToken } from '../middleware/auth.js';

const enrutador = Router();

enrutador.post('/login', async (peticion, respuesta) => {
  try {
    const { correo, password } = peticion.body;

    if (!correo || !password) {
      return respuesta.status(400).json({ mensaje: 'Correo y contraseña son requeridos.' });
    }

    const usuario = await Usuario.findOne({ correo }).select('+password');
    if (!usuario) {
      return respuesta.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }

    if (usuario.estado === 'inactivo') {
      return respuesta.status(403).json({ mensaje: 'Usuario inactivo. Contacta al administrador.' });
    }

    const passwordValido = await usuario.compararPassword(password);
    if (!passwordValido) {
      return respuesta.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }

    const token = generarToken(usuario);

    respuesta.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    respuesta.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
});

export default enrutador;
