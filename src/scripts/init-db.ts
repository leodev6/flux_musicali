/**
 * Script di inizializzazione del database
 * 
 * Questo script viene eseguito per inizializzare e sincronizzare il database
 * con i modelli Sequelize. Utile per setup iniziale o migrazioni.
 * 
 * @module init-db
 * @author Lionel Djouaka
 */

import sequelize from "../config/database";
import '../models/MusicEvent';

/**
 * Inizializza e sincronizza il database
 * 
 * Questa funzione:
 * 1. Si connette al database PostgreSQL
 * 2. Verifica i modelli registrati
 * 3. Sincronizza i modelli con le tabelle del database (alter: true)
 * 4. Chiude la connessione e termina il processo
 * 
 * @async
 * @function inizializeDatabase
 * @returns {Promise<void>} Promise che si risolve quando l'inizializzazione è completata
 */
async function inizializeDatabase(): Promise<void> {
     try {
          console.log('Connezione al database...');
          console.log(` HOST: ${process.env.DB_HOST || 'localhost'}`);
          console.log(` Port: ${process.env.DB_PORT || '5432'}`);
          console.log(` Database: ${process.env.DB_NAME || 'music_analyzer'}`);
          console.log(` User: ${process.env.DB_USER || 'music_db'}`);
          
          // Autentica la connessione al database
          await sequelize.authenticate();
          console.log('Connessione al database riuscita!');

          // Controlla che i modelli sono salvati
          console.log('Modelli registrati:', Object.keys(sequelize.models));

          //Sincronizzazione dei modelli di database in corso...
          await sequelize.sync({alter: true} );
          console.log('modelli di database Sincronizzati.');


          console.log('Connessione al database terminata.');
          await sequelize.close();
          process.exit(0)
     } catch (error: any) {
          console.error('Errore dell\'inizializzazione del database', error);
     }
     process.exit(1);
}
inizializeDatabase();