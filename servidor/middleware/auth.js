import jwt from 'jsonwebtoken';

const SECRETO = process.env.JWT_SECRET || 'playamar-boutique-secret-key-2026';

export function verificarToken(peticion, respuesta, siguiente) {
  const cabecera = peticion.headers.authorization;
  if (!cabecera || !cabecera.startsWith('Bearer ')) {
    return respuesta.status(401).json({ mensaje: 'Acceso denegado. Token requerido.' });
  }

  const token = cabecera.split(' ')[1];

  try {
    const decodificado = jwt.verify(token, SECRETO);
    peticion.usuario = decodificado;
    siguiente();
  } catch (error) {
    return respuesta.status(401).json({ mensaje: 'Token inválido o expirado.' });
  }
}

export function generarToken(usuario) {
  return jwt.sign(
    { id: usuario._id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol },
    SECRETO,
    { expiresIn: '24h' }
  );
}
