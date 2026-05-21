// ============================================================
// MODELO: Usuario
// Representa a una persona que usa el sistema
// ============================================================

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
  nombre:   { type: String, required: true },
  correo:   { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  rol:      { type: String, enum: ['admin', 'cajero', 'gerente'], required: true },
  estado:   { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
}, { timestamps: true });

usuarioSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salto = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salto);
});

usuarioSchema.methods.compararPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('Usuario', usuarioSchema);
