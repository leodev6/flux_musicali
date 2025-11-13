import sequelize from "../config/database";
import '../models/MusicEvent';

async function inizializeDatabase(): Promise<void> {
     try {
          console.log('Connezione al database...');
          console.log(` HOST: ${process.env.DB_HOST || 'localhost'}`);
          console.log(` Port: ${process.env.DB_PORT || '5432'}`);
          console.log(` Database: ${process.env.DB_NAME || 'music_analyzer'}`);
          console.log(` User: ${process.env.DB_USER || 'music_db'}`);
          
          await sequelize.authenticate();
          console.log('Connessione al database riuscita!');

          // Controlla che i modelli sono salvati
          console.log('Modelli registrati:', Object.keys(sequelize.models));

          //Sincronizzazione dei modelli di database in corso...
          await sequelize.sync({alter: true} );
          console.log('modelli di database Sincronizzato.');


          console.log('Connessione al database terminato.');
          await sequelize.close();
          process.exit(0)
     } catch (error: any) {
          console.error('Errore dell\'inizializzazione del database', error);
     }
     process.exit(1);
}
inizializeDatabase();