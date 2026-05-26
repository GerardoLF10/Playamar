// ============================================================
// SEMBRAR DATOS INICIALES
// Puebla la base de datos con datos de ejemplo
// Ejecutar: npm run seed
// ============================================================

import mongoose from 'mongoose';

// Importar todos los modelos
import Producto from './modelos/Producto.js';
import Venta from './modelos/Venta.js';
import Usuario from './modelos/Usuario.js';
import Cliente from './modelos/Cliente.js';
import TransaccionLealtad from './modelos/TransaccionLealtad.js';
import Proveedor from './modelos/Proveedor.js';
import CompraProveedor from './modelos/CompraProveedor.js';
import CalificacionServicio from './modelos/CalificacionServicio.js';

async function sembrar() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/playamar_boutique');
    console.log('✅ Conectado a MongoDB');

    // Limpiar datos existentes para evitar duplicados
    await Promise.all([
      Producto.deleteMany({}),
      Venta.deleteMany({}),
      Usuario.deleteMany({}),
      Cliente.deleteMany({}),
      TransaccionLealtad.deleteMany({}),
      Proveedor.deleteMany({}),
      CompraProveedor.deleteMany({}),
      CalificacionServicio.deleteMany({}),
    ]);
    console.log('🗑️  Datos anteriores eliminados');

    // === PRODUCTOS ===
    const productos = await Producto.insertMany([
      { nombre: 'Bikini Tropical', categoria: 'Trajes de Baño', precio: 450, stock: 15, sku: 'BIK-001' },
      { nombre: 'Short de Playa', categoria: 'Caballeros', precio: 320, stock: 8, sku: 'SHO-001' },
      { nombre: 'Vestido Playero', categoria: 'Vestidos', precio: 580, stock: 12, sku: 'VES-001' },
      { nombre: 'Pareo Estampado', categoria: 'Accesorios', precio: 250, stock: 20, sku: 'PAR-001' },
      { nombre: 'Gorra Surf', categoria: 'Accesorios', precio: 180, stock: 25, sku: 'GOR-001' },
      { nombre: 'Sandalias Playeras', categoria: 'Calzado', precio: 280, stock: 5, sku: 'SAN-001' },
      { nombre: 'Lentes de Sol', categoria: 'Accesorios', precio: 350, stock: 18, sku: 'LEN-001' },
      { nombre: 'Camisa Lino', categoria: 'Caballeros', precio: 480, stock: 10, sku: 'CAM-001' },
      { nombre: 'Bolsa de Playa', categoria: 'Accesorios', precio: 220, stock: 3, sku: 'BOL-001' },
      { nombre: 'Traje de Baño Niño', categoria: 'Infantil', precio: 280, stock: 14, sku: 'TRA-001' },
    ]);
    console.log(`📦 ${productos.length} productos creados`);

    // === USUARIOS ===
    const datosUsuarios = [
      { nombre: 'Ana García', correo: 'ana@playamar.com', password: 'playamar123', rol: 'admin', estado: 'activo' },
      { nombre: 'Carlos Mendez', correo: 'carlos@playamar.com', password: 'playamar123', rol: 'gerente', estado: 'activo' },
      { nombre: 'Laura Pérez', correo: 'laura@playamar.com', password: 'playamar123', rol: 'cajero', estado: 'activo' },
      { nombre: 'Miguel Torres', correo: 'miguel@playamar.com', password: 'playamar123', rol: 'cajero', estado: 'inactivo' },
    ];
    const usuarios = [];
    for (const datos of datosUsuarios) {
      const usuario = new Usuario(datos);
      await usuario.save();
      const obj = usuario.toObject();
      delete obj.password;
      usuarios.push(obj);
    }
    console.log(`👤 ${usuarios.length} usuarios creados`);

    // === CLIENTES ===
    const clientes = await Cliente.insertMany([
      { nombre: 'Juan Pérez', correo: 'juan.perez@example.com', telefono: '5551234567', puntos: 1200, comprasTotales: 8, fechaRegistro: new Date('2025-01-15') },
      { nombre: 'María López', correo: 'maria.lopez@example.com', telefono: '5559876543', puntos: 850, comprasTotales: 5, fechaRegistro: new Date('2025-02-20') },
      { nombre: 'Pedro Martínez', correo: 'pedro.martinez@example.com', telefono: '5555551234', puntos: 450, comprasTotales: 3, fechaRegistro: new Date('2025-11-10') },
    ]);
    console.log(`👥 ${clientes.length} clientes creados`);

    // === PROVEEDORES ===
    const proveedores = await Proveedor.insertMany([
      { nombre: 'Textiles del Mar S.A.', contacto: 'Roberto Sánchez', telefono: '5558887777', correo: 'ventas@textilesdelmar.com' },
      { nombre: 'Moda Costera', contacto: 'Elena Ramírez', telefono: '5557776666', correo: 'contacto@modacostera.com' },
      { nombre: 'Importadora Beach Style', contacto: 'Luis González', telefono: '5556665555', correo: 'compras@beachstyle.com' },
    ]);
    console.log(`🏭 ${proveedores.length} proveedores creados`);

    // === VENTAS ===
    await Venta.insertMany([
      {
        fecha: new Date('2026-04-15T10:30:00'),
        articulos: [{ producto: productos[0]._id, cantidad: 2 }, { producto: productos[3]._id, cantidad: 1 }],
        total: 1150, metodoPago: 'Efectivo', estado: 'completada',
      },
      {
        fecha: new Date('2026-04-15T11:15:00'),
        articulos: [{ producto: productos[1]._id, cantidad: 1 }, { producto: productos[4]._id, cantidad: 1 }],
        total: 500, metodoPago: 'Tarjeta', estado: 'completada',
      },
      {
        fecha: new Date('2026-04-15T12:00:00'),
        articulos: [{ producto: productos[6]._id, cantidad: 2 }],
        total: 700, metodoPago: 'Efectivo', estado: 'completada',
      },
      {
        fecha: new Date('2026-04-14T15:30:00'),
        articulos: [{ producto: productos[2]._id, cantidad: 1 }, { producto: productos[3]._id, cantidad: 1 }],
        total: 830, metodoPago: 'Transferencia', estado: 'completada',
      },
    ]);
    console.log('🧾 Ventas creadas');

    // === TRANSACCIONES DE LEALTAD ===
    await TransaccionLealtad.insertMany([
      { clienteId: clientes[0]._id, tipo: 'ganar', puntos: 100, descripcion: 'Compra de $1000 MXN', fecha: new Date('2026-04-15') },
      { clienteId: clientes[1]._id, tipo: 'ganar', puntos: 50, descripcion: 'Compra de $500 MXN', fecha: new Date('2026-04-14') },
      { clienteId: clientes[2]._id, tipo: 'canjear', puntos: 50, descripcion: 'Canje por descuento', fecha: new Date('2026-04-13') },
      { clienteId: clientes[0]._id, tipo: 'ganar', puntos: 200, descripcion: 'Compra de $2000 MXN', fecha: new Date('2026-04-12') },
    ]);
    console.log('⭐ Transacciones de lealtad creadas');

    // === COMPRAS A PROVEEDORES ===
    await CompraProveedor.insertMany([
      {
        proveedorId: proveedores[0]._id, proveedorNombre: 'Textiles del Mar S.A.',
        articulos: [{ producto: productos[0]._id, cantidad: 20, costo: 300 }, { producto: productos[2]._id, cantidad: 15, costo: 400 }],
        total: 12000, fecha: new Date('2026-04-10'), numeroFactura: 'FAC-2026-0415',
      },
      {
        proveedorId: proveedores[1]._id, proveedorNombre: 'Moda Costera',
        articulos: [{ producto: productos[1]._id, cantidad: 25, costo: 200 }, { producto: productos[4]._id, cantidad: 30, costo: 120 }],
        total: 8600, fecha: new Date('2026-04-08'), numeroFactura: 'FAC-2026-0408',
      },
    ]);
    console.log('📋 Compras a proveedores creadas');

    // === CALIFICACIONES ===
    await CalificacionServicio.insertMany([
      { calificacion: 5, comentario: '¡Excelente servicio! Me encantó la atención personalizada.', fecha: new Date('2026-04-15'), atendio: 'Ana García' },
      { calificacion: 4, comentario: 'Muy buen servicio, solo tardaron un poco en atenderme.', fecha: new Date('2026-04-14'), atendio: 'Carlos Mendez' },
      { calificacion: 5, comentario: 'Productos de excelente calidad y personal muy amable.', fecha: new Date('2026-04-13'), atendio: 'Laura Pérez' },
      { calificacion: 5, comentario: 'Me ayudaron a encontrar exactamente lo que buscaba.', fecha: new Date('2026-04-12'), atendio: 'Ana García' },
      { calificacion: 4, comentario: 'Buena experiencia de compra, volveré pronto.', fecha: new Date('2026-04-11'), atendio: 'Carlos Mendez' },
    ]);
    console.log('⭐ Calificaciones de servicio creadas');

    console.log('\n🎉 ¡Base de datos poblada exitosamente!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sembrar datos:', error.message);
    process.exit(1);
  }
}

sembrar();
