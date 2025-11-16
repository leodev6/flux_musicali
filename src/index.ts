import { StatisticsObserver } from './observers/StastisticsObserver';
import { StatisticService } from './services/StatisticService';
import { EventController } from './controllers/EventController';
import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import './models/MusicEvent';
import './models/Statistic';
import { MusicEventRepository } from './repositories/MusicEventRepository';
import { EventProcessingService } from './services/EventProcessingService';
import { EventSubject } from './observers/EventSubject';
import { createRoutes } from './routes';
import StatatisticRepository from './repositories/StatistiqueRepository';
import { StatatisticsController } from './controllers';

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Inizializzazione la connexìzione al database
async function inizializeDatabase(): Promise<void> {
     try {
          await sequelize.authenticate();
          console.log('Connessione al database riuscita!');
          console.log('Modelli di database sincronizzati.');
          await sequelize.sync({ alter: true });
     } catch (error) {
          console.error('Errore dell\'inizializzazione del database', error);
          process.exit(1);
     }
}


//Inizializzazione dei servizi e le dipendenze
function initializaServices() {
     //RInizializzazione dei repository per l'accesso ai dati
     const musicEventRepository = new MusicEventRepository();
     const statisticRepository = new StatatisticRepository();

     //Inizializzazione dei servizi e del subject per il pattern Observer
     const eventSubject = new EventSubject();
     const statisticService = new StatisticService(musicEventRepository);
     const eventProcessingService = new EventProcessingService(musicEventRepository, eventSubject);

     //Configurazione degli observer: StatisticsObserver viene registrato per ricevere notifiche
     const statisticsObserver = new StatisticsObserver(statisticService, statisticRepository);
     eventSubject.attach(statisticsObserver);

     // Inizializzazione dei controller per gestire le richieste HTTP
     const eventController = new EventController(eventProcessingService);
     const statisticsController = new StatatisticsController(statisticService, musicEventRepository);

     //Configurazione delle route API e associazione all'applicazione Express
     const routes = createRoutes(eventController, statisticsController);
     app.use('/api', routes);

     console.log('Inizializzazione del servizio corretto.')
}

//Errore nella gestione del middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
     console.error('Error: ', err);
     res.status(500).json({
          success: false,
          error: 'Errore interno al server',
          message: process.env.NODE_ENV === 'development' ? err.message : undefined,
     });
});


async function startServer(): Promise<void> {
     try {
          await inizializeDatabase();
          initializaServices();

          app.listen(PORT, () => {
               console.log(`Il server è in esecuzione sulla porta ${PORT}`);
               console.log(`API endpoint disponibile su: http://localhost:${PORT}/api`);
               console.log(`Health check:  http://localhost:${PORT}/api/health`);
          })
     } catch (error) {
          console.log('Impossibile avviare il server', error);
          process.exit(1)
     }
}


startServer();
