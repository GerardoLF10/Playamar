// ============================================================
// SERVIDOR PRINCIPAL
// API REST para Playamar Boutique
// ============================================================

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { conectarBD } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { verificarToken } from './middleware/auth.js';

// Importar las rutas de cada recurso
import rutasAuth from './rutas/auth.js';
import rutasProductos from './rutas/productos.js';
import rutasVentas from './rutas/ventas.js';
import rutasUsuarios from './rutas/usuarios.js';
import rutasClientes from './rutas/clientes.js';
import rutasTransacciones from './rutas/transacciones.js';
import rutasProveedores from './rutas/proveedores.js';
import rutasCompras from './rutas/compras.js';
import rutasCalificaciones from './rutas/calificaciones.js';

const aplicacion = express();
const PUERTO = 5000;

// Middleware para permitir peticiones del frontend
aplicacion.use(cors());
// Middleware para procesar JSON en las peticiones
aplicacion.use(express.json());

// Ruta de prueba pública
aplicacion.get('/api/estado', (peticion, respuesta) => {
  respuesta.json({ estado: 'OK', mensaje: 'Servidor de Playamar Boutique funcionando' });
});

// Registrar las rutas API
aplicacion.use('/api/auth', rutasAuth);
// Proteger todas las rutas siguientes con autenticación
aplicacion.use('/api', verificarToken);
aplicacion.use('/api/productos', rutasProductos);
aplicacion.use('/api/ventas', rutasVentas);
aplicacion.use('/api/usuarios', rutasUsuarios);
aplicacion.use('/api/clientes', rutasClientes);
aplicacion.use('/api/transacciones', rutasTransacciones);
aplicacion.use('/api/proveedores', rutasProveedores);
aplicacion.use('/api/compras', rutasCompras);
aplicacion.use('/api/calificaciones', rutasCalificaciones);

// Servir archivos estáticos del frontend compilado por Vite
aplicacion.use(express.static(path.join(__dirname, '../dist')));

// Cualquier ruta que no sea API, responder con index.html
aplicacion.use((peticion, respuesta) => {
  respuesta.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Iniciar el servidor
async function iniciar() {
  await conectarBD();
  aplicacion.listen(PUERTO, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PUERTO}`);
  });
}

iniciar();
