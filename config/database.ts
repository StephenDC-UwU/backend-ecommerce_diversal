module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      // Esta es la única configuración que leerá
      connectionString: env('DATABASE_URL'), 
      ssl: {
        // Esto es obligatorio para Neon
        rejectUnauthorized: false,
      },
    },
    debug: false,
  },
});