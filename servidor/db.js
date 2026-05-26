// ============================================================
// CONEXIÓN A MONGODB
// ============================================================

import mongoose from 'mongoose';

// Cadena de conexión a MongoDB local
const URI_MONGODB = process.env.MONGODB_URI || 'mongodb+srv://gerarditolagunesflores_db_user:123@callejabd.u4evc8f.mongodb.net/playamar_boutique';

/**
 * Conecta a la base de datos MongoDB
 * @returns {Promise<void>}
 */
export async function conectarBD() {
  try {
    await mongoose.connect(URI_MONGODB);
    console.log('✅ Conectado a MongoDB correctamente');
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }
}
