export interface Producto {
  _id?: string;
  id?: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  sku: string;
  imagen?: string;
}

export interface Venta {
  _id?: string;
  id?: string;
  fecha: string;
  articulos: { producto: Producto; cantidad: number }[];
  total: number;
  metodoPago: string;
  estado: 'completada' | 'cancelada' | 'devuelta';
}

export interface Usuario {
  _id?: string;
  id?: string;
  nombre: string;
  correo: string;
  rol: 'admin' | 'cajero' | 'gerente';
  estado: 'activo' | 'inactivo';
}

export interface Cliente {
  _id?: string;
  id?: string;
  nombre: string;
  correo: string;
  telefono: string;
  puntos: number;
  comprasTotales: number;
  fechaRegistro: string;
}

export interface TransaccionLealtad {
  _id?: string;
  id?: string;
  clienteId: string;
  tipo: 'ganar' | 'canjear';
  puntos: number;
  descripcion: string;
  fecha: string;
}

export interface CompraProveedor {
  _id?: string;
  id?: string;
  proveedorId: string;
  proveedorNombre: string;
  articulos: { producto: Producto; cantidad: number; costo: number }[];
  total: number;
  fecha: string;
  numeroFactura: string;
}

export interface Proveedor {
  _id?: string;
  id?: string;
  nombre: string;
  contacto: string;
  telefono: string;
  correo: string;
}

export interface CalificacionServicio {
  _id?: string;
  id?: string;
  clienteId?: string;
  calificacion: number;
  comentario: string;
  fecha: string;
  atendio: string;
}

export const productosSimulados: Producto[] = [
  { id: '1', nombre: 'Bikini Tropical', categoria: 'Trajes de Baño', precio: 450, stock: 15, sku: 'BIK-001' },
  { id: '2', nombre: 'Short de Playa', categoria: 'Caballeros', precio: 320, stock: 8, sku: 'SHO-001' },
  { id: '3', nombre: 'Vestido Playero', categoria: 'Vestidos', precio: 580, stock: 12, sku: 'VES-001' },
  { id: '4', nombre: 'Pareo Estampado', categoria: 'Accesorios', precio: 250, stock: 20, sku: 'PAR-001' },
  { id: '5', nombre: 'Gorra Surf', categoria: 'Accesorios', precio: 180, stock: 25, sku: 'GOR-001' },
  { id: '6', nombre: 'Sandalias Playeras', categoria: 'Calzado', precio: 280, stock: 5, sku: 'SAN-001' },
  { id: '7', nombre: 'Lentes de Sol', categoria: 'Accesorios', precio: 350, stock: 18, sku: 'LEN-001' },
  { id: '8', nombre: 'Camisa Lino', categoria: 'Caballeros', precio: 480, stock: 10, sku: 'CAM-001' },
  { id: '9', nombre: 'Bolsa de Playa', categoria: 'Accesorios', precio: 220, stock: 3, sku: 'BOL-001' },
  { id: '10', nombre: 'Traje de Baño Niño', categoria: 'Infantil', precio: 280, stock: 14, sku: 'TRA-001' },
];

export const ventasSimuladas: Venta[] = [
  {
    id: 'S001',
    fecha: '2026-04-15T10:30:00',
    articulos: [
      { producto: productosSimulados[0], cantidad: 2 },
      { producto: productosSimulados[3], cantidad: 1 },
    ],
    total: 1150,
    metodoPago: 'Efectivo',
    estado: 'completada',
  },
  {
    id: 'S002',
    fecha: '2026-04-15T11:15:00',
    articulos: [
      { producto: productosSimulados[1], cantidad: 1 },
      { producto: productosSimulados[4], cantidad: 1 },
    ],
    total: 500,
    metodoPago: 'Tarjeta',
    estado: 'completada',
  },
  {
    id: 'S003',
    fecha: '2026-04-15T12:00:00',
    articulos: [
      { producto: productosSimulados[6], cantidad: 2 },
    ],
    total: 700,
    metodoPago: 'Efectivo',
    estado: 'completada',
  },
  {
    id: 'S004',
    fecha: '2026-04-14T15:30:00',
    articulos: [
      { producto: productosSimulados[2], cantidad: 1 },
      { producto: productosSimulados[3], cantidad: 1 },
    ],
    total: 830,
    metodoPago: 'Transferencia',
    estado: 'completada',
  },
];

export const usuariosSimulados: Usuario[] = [
  { id: '1', nombre: 'Ana García', correo: 'ana@playamar.com', rol: 'admin', estado: 'activo' },
  { id: '2', nombre: 'Carlos Mendez', correo: 'carlos@playamar.com', rol: 'gerente', estado: 'activo' },
  { id: '3', nombre: 'Laura Pérez', correo: 'laura@playamar.com', rol: 'cajero', estado: 'activo' },
  { id: '4', nombre: 'Miguel Torres', correo: 'miguel@playamar.com', rol: 'cajero', estado: 'inactivo' },
];

export const clientesSimulados: Cliente[] = [
  { id: 'C001', nombre: 'Juan Pérez', correo: 'juan.perez@example.com', telefono: '5551234567', puntos: 1200, comprasTotales: 8, fechaRegistro: '2025-01-15' },
  { id: 'C002', nombre: 'María López', correo: 'maria.lopez@example.com', telefono: '5559876543', puntos: 850, comprasTotales: 5, fechaRegistro: '2025-02-20' },
  { id: 'C003', nombre: 'Pedro Martínez', correo: 'pedro.martinez@example.com', telefono: '5555551234', puntos: 450, comprasTotales: 3, fechaRegistro: '2025-11-10' },
];

export const transaccionesSimuladas: TransaccionLealtad[] = [
  { id: 'LT001', clienteId: 'C001', tipo: 'ganar', puntos: 100, descripcion: 'Compra de $1000 MXN', fecha: '2026-04-15' },
  { id: 'LT002', clienteId: 'C002', tipo: 'ganar', puntos: 50, descripcion: 'Compra de $500 MXN', fecha: '2026-04-14' },
  { id: 'LT003', clienteId: 'C003', tipo: 'canjear', puntos: 50, descripcion: 'Canje por descuento', fecha: '2026-04-13' },
  { id: 'LT004', clienteId: 'C001', tipo: 'ganar', puntos: 200, descripcion: 'Compra de $2000 MXN', fecha: '2026-04-12' },
];

export const proveedoresSimulados: Proveedor[] = [
  { id: 'SUP001', nombre: 'Textiles del Mar S.A.', contacto: 'Roberto Sánchez', telefono: '5558887777', correo: 'ventas@textilesdelmar.com' },
  { id: 'SUP002', nombre: 'Moda Costera', contacto: 'Elena Ramírez', telefono: '5557776666', correo: 'contacto@modacostera.com' },
  { id: 'SUP003', nombre: 'Importadora Beach Style', contacto: 'Luis González', telefono: '5556665555', correo: 'compras@beachstyle.com' },
];

export const comprasSimuladas: CompraProveedor[] = [
  {
    id: 'SP001',
    proveedorId: 'SUP001',
    proveedorNombre: 'Textiles del Mar S.A.',
    articulos: [
      { producto: productosSimulados[0], cantidad: 20, costo: 300 },
      { producto: productosSimulados[2], cantidad: 15, costo: 400 },
    ],
    total: 12000,
    fecha: '2026-04-10',
    numeroFactura: 'FAC-2026-0415',
  },
  {
    id: 'SP002',
    proveedorId: 'SUP002',
    proveedorNombre: 'Moda Costera',
    articulos: [
      { producto: productosSimulados[1], cantidad: 25, costo: 200 },
      { producto: productosSimulados[4], cantidad: 30, costo: 120 },
    ],
    total: 8600,
    fecha: '2026-04-08',
    numeroFactura: 'FAC-2026-0408',
  },
];

export const calificacionesSimuladas: CalificacionServicio[] = [
  { id: 'SR001', clienteId: 'C001', calificacion: 5, comentario: '¡Excelente servicio! Me encantó la atención personalizada.', fecha: '2026-04-15', atendio: 'Ana García' },
  { id: 'SR002', clienteId: 'C002', calificacion: 4, comentario: 'Muy buen servicio, solo tardaron un poco en atenderme.', fecha: '2026-04-14', atendio: 'Carlos Mendez' },
  { id: 'SR003', calificacion: 5, comentario: 'Productos de excelente calidad y personal muy amable.', fecha: '2026-04-13', atendio: 'Laura Pérez' },
  { id: 'SR004', clienteId: 'C003', calificacion: 5, comentario: 'Me ayudaron a encontrar exactamente lo que buscaba.', fecha: '2026-04-12', atendio: 'Ana García' },
  { id: 'SR005', calificacion: 4, comentario: 'Buena experiencia de compra, volveré pronto.', fecha: '2026-04-11', atendio: 'Carlos Mendez' },
];

export const categorias = [
  'Trajes de Baño',
  'Caballeros',
  'Vestidos',
  'Accesorios',
  'Calzado',
  'Infantil',
];
