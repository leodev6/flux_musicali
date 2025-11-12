import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Valida variabili d'ambiente richieste
const variabiliRichieste = ['DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const variabiliMancanti = variabiliRichieste.filter((nomeVariabile) => !process.env[nomeVariabile]);

if (variabiliMancanti.length > 0 && !process.env.DB_HOST) {
     console.warn(
          `Avviso: Variabili d'ambiente mancanti: ${variabiliMancanti.join(', ')}`
     );
}

const sequelize = new Sequelize(
     process.env.DB_NAME || 'music_analyzer',
     process.env.DB_USER || 'misic_db',
     process.env.DB_PASSWORD || 'postgres',
     {
          host: process.env.DB_PORT || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432'),
          dialect: 'postgres',
          logging: process.env.NODE_ENV === 'development' ? console.log : false,
          pool: {
               max: 5,
               min: 0,
               acquire: 30000,
               idle: 10000,
          },
          retry: {
               max: 3,
          },
     }
);

export default sequelize;