/**
 * Configurazione del database PostgreSQL utilizzando Sequelize ORM
 * 
 * Questo modulo esporta un'istanza configurata di Sequelize per la connessione
 * al database PostgreSQL. Le configurazioni vengono caricate dalle variabili
 * d'ambiente con valori di default per lo sviluppo locale.
 * 
 * @module database
 * @author Lionel Djouaka
 */
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Caricamento delle variabili d'ambiente
dotenv.config();

/**
 * Valida le variabili d'ambiente richieste per la connessione al database
 * 
 * Verifica la presenza delle variabili essenziali (DB_NAME, DB_USER, DB_PASSWORD)
 * e mostra un avviso se mancanti, a meno che non sia specificato DB_HOST.
 */
const variabiliRichieste = ['DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const variabiliMancanti = variabiliRichieste.filter((varName) => !process.env[varName]);

if (variabiliMancanti.length > 0 && !process.env.DB_HOST) {
     console.warn(
          `Avviso: Variabili d'ambiente mancanti: ${variabiliMancanti.join(', ')}`
     );
}

/**
 * Istanza di Sequelize configurata per PostgreSQL
 * 
 * Configurazione della connessione al database con:
 * - Pool di connessioni per gestire le richieste concorrenti
 * - Retry automatico in caso di errori di connessione
 * - Logging abilitato solo in modalità development
 * 
 * @constant {Sequelize} sequelize
 * @property {string} host - Host del database (default: 'localhost')
 * @property {number} port - Porta del database (default: 5432)
 * @property {string} dialect - Tipo di database ('postgres')
 * @property {Object} pool - Configurazione del pool di connessioni
 * @property {number} pool.max - Numero massimo di connessioni nel pool (5)
 * @property {number} pool.min - Numero minimo di connessioni nel pool (0)
 * @property {number} pool.acquire - Tempo massimo per acquisire una connessione (30000ms)
 * @property {number} pool.idle - Tempo massimo di inattività prima di rilasciare una connessione (10000ms)
 * @property {Object} retry - Configurazione dei tentativi di riconnessione
 * @property {number} retry.max - Numero massimo di tentativi (3)
 */
const sequelize = new Sequelize(
     process.env.DB_NAME || 'music_analyzer',
     process.env.DB_USER || 'music_db',
     process.env.DB_PASSWORD || 'postgres',
     {
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432', 10),
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