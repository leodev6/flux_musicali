import sequelize from "../config/database";

async function inizializeDatabase(): Promise<void> {
     try {
          console.log('Connezione al database...');
          console.log(` HOST: ${process.env.DB_HOST || 'localhost'}`);
          console.log(` Port: ${process.env.DB_PORT || '5432'}`);
          console.log(` Database: ${process.env.DB_NAME || 'music_analyzer'}`);
          console.log(` User: ${process.env.DB_USER || 'music_db'}`);
          
          await sequelize.authenticate();
          console.log('Connessione al database riuscita!');
     } catch (error: any) {
          console.error('Errore dell\'inizializzazione del database', error);
     }
}
inizializeDatabase();