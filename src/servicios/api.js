const BASE_URL = '/api';

function obtenerToken() {
  return localStorage.getItem('token');
}

function obtenerEncabezados(conCuerpo = true) {
  const encabezados = {};
  const token = obtenerToken();
  if (token) {
    encabezados['Authorization'] = `Bearer ${token}`;
  }
  if (conCuerpo) {
    encabezados['Content-Type'] = 'application/json';
  }
  return encabezados;
}

async function procesarRespuesta(respuesta) {
  if (!respuesta.ok) {
    if (respuesta.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
      throw new Error('Sesión expirada. Inicia sesión nuevamente.');
    }
    const error = await respuesta.json().catch(() => ({ mensaje: 'Error del servidor' }));
    throw new Error(error.mensaje || `Error ${respuesta.status}`);
  }
  return respuesta.json();
}

export const authAPI = {
  async login(correo, password) {
    const respuesta = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password }),
    });
    return procesarRespuesta(respuesta);
  },
};

export const productosAPI = {
  async obtenerTodos() {
    const respuesta = await fetch(`${BASE_URL}/productos`, { headers: obtenerEncabezados(false) });
    return procesarRespuesta(respuesta);
  },
  async obtenerPorId(id) {
    const respuesta = await fetch(`${BASE_URL}/productos/${id}`, { headers: obtenerEncabezados(false) });
    return procesarRespuesta(respuesta);
  },
  async crear(producto) {
    const respuesta = await fetch(`${BASE_URL}/productos`, {
      method: 'POST',
      headers: obtenerEncabezados(),
      body: JSON.stringify(producto),
    });
    return procesarRespuesta(respuesta);
  },
  async actualizar(id, producto) {
    const respuesta = await fetch(`${BASE_URL}/productos/${id}`, {
      method: 'PUT',
      headers: obtenerEncabezados(),
      body: JSON.stringify(producto),
    });
    return procesarRespuesta(respuesta);
  },
  async eliminar(id) {
    const respuesta = await fetch(`${BASE_URL}/productos/${id}`, {
      method: 'DELETE',
      headers: obtenerEncabezados(false),
    });
    return procesarRespuesta(respuesta);
  },
};

export const ventasAPI = {
  async obtenerTodos() {
    const respuesta = await fetch(`${BASE_URL}/ventas`, { headers: obtenerEncabezados(false) });
    return procesarRespuesta(respuesta);
  },
  async crear(venta) {
    const respuesta = await fetch(`${BASE_URL}/ventas`, {
      method: 'POST',
      headers: obtenerEncabezados(),
      body: JSON.stringify(venta),
    });
    return procesarRespuesta(respuesta);
  },
};

export const usuariosAPI = {
  async obtenerTodos() {
    const respuesta = await fetch(`${BASE_URL}/usuarios`, { headers: obtenerEncabezados(false) });
    return procesarRespuesta(respuesta);
  },
  async crear(usuario) {
    const respuesta = await fetch(`${BASE_URL}/usuarios`, {
      method: 'POST',
      headers: obtenerEncabezados(),
      body: JSON.stringify(usuario),
    });
    return procesarRespuesta(respuesta);
  },
  async actualizar(id, usuario) {
    const respuesta = await fetch(`${BASE_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: obtenerEncabezados(),
      body: JSON.stringify(usuario),
    });
    return procesarRespuesta(respuesta);
  },
  async eliminar(id) {
    const respuesta = await fetch(`${BASE_URL}/usuarios/${id}`, {
      method: 'DELETE',
      headers: obtenerEncabezados(false),
    });
    return procesarRespuesta(respuesta);
  },
};

export const clientesAPI = {
  async obtenerTodos() {
    const respuesta = await fetch(`${BASE_URL}/clientes`, { headers: obtenerEncabezados(false) });
    return procesarRespuesta(respuesta);
  },
  async crear(cliente) {
    const respuesta = await fetch(`${BASE_URL}/clientes`, {
      method: 'POST',
      headers: obtenerEncabezados(),
      body: JSON.stringify(cliente),
    });
    return procesarRespuesta(respuesta);
  },
  async actualizar(id, cliente) {
    const respuesta = await fetch(`${BASE_URL}/clientes/${id}`, {
      method: 'PUT',
      headers: obtenerEncabezados(),
      body: JSON.stringify(cliente),
    });
    return procesarRespuesta(respuesta);
  },
  async eliminar(id) {
    const respuesta = await fetch(`${BASE_URL}/clientes/${id}`, {
      method: 'DELETE',
      headers: obtenerEncabezados(false),
    });
    return procesarRespuesta(respuesta);
  },
};

export const transaccionesAPI = {
  async obtenerTodos() {
    const respuesta = await fetch(`${BASE_URL}/transacciones`, { headers: obtenerEncabezados(false) });
    return procesarRespuesta(respuesta);
  },
  async crear(transaccion) {
    const respuesta = await fetch(`${BASE_URL}/transacciones`, {
      method: 'POST',
      headers: obtenerEncabezados(),
      body: JSON.stringify(transaccion),
    });
    return procesarRespuesta(respuesta);
  },
};

export const proveedoresAPI = {
  async obtenerTodos() {
    const respuesta = await fetch(`${BASE_URL}/proveedores`, { headers: obtenerEncabezados(false) });
    return procesarRespuesta(respuesta);
  },
  async crear(proveedor) {
    const respuesta = await fetch(`${BASE_URL}/proveedores`, {
      method: 'POST',
      headers: obtenerEncabezados(),
      body: JSON.stringify(proveedor),
    });
    return procesarRespuesta(respuesta);
  },
};

export const comprasAPI = {
  async obtenerTodos() {
    const respuesta = await fetch(`${BASE_URL}/compras`, { headers: obtenerEncabezados(false) });
    return procesarRespuesta(respuesta);
  },
  async crear(compra) {
    const respuesta = await fetch(`${BASE_URL}/compras`, {
      method: 'POST',
      headers: obtenerEncabezados(),
      body: JSON.stringify(compra),
    });
    return procesarRespuesta(respuesta);
  },
};

export const calificacionesAPI = {
  async obtenerTodos() {
    const respuesta = await fetch(`${BASE_URL}/calificaciones`, { headers: obtenerEncabezados(false) });
    return procesarRespuesta(respuesta);
  },
  async crear(calificacion) {
    const respuesta = await fetch(`${BASE_URL}/calificaciones`, {
      method: 'POST',
      headers: obtenerEncabezados(),
      body: JSON.stringify(calificacion),
    });
    return procesarRespuesta(respuesta);
  },
};
