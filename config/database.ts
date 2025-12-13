const parse = require('pg-connection-string').parse;

module.exports = ({ env }) => {
  // Se asegura de leer la variable DATABASE_URL que pondrás en Strapi Cloud
  const config = parse(env('DATABASE_URL'));

  return {
    connection: {
      client: 'postgres',
      connection: {
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        password: config.password,
        ssl: {
          rejectUnauthorized: false // Necesario para conectar con Neon
        },
      },
      debug: false,
    },
  };
};