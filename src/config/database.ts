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