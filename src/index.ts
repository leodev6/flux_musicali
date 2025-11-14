import { StatisticsObserver } from './observers/StastisticsObserver';
import { StatisticService } from './services/StatisticService';
import { EventController } from './controllers/EventController';
import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import { MusicEventRepository } from './repositories/MusicEventRepository';
import { EventProcessingService } from './services/EventProcessingService';
import { EventSubject } from './observers/EventSubject';
import { createRoutes } from './routes';
import StatatisticRepository from './repositories/StatistiqueRepository';
import { StatatisticsController } from './controllers';

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT  || 3000;

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//Inizializzazione la connexìzione al database
async function inizializeDatabase(): Promise<void> {
     try {
          await sequelize.authenticate();
          console.log('Connessione al database riuscita!');
     } catch (error) {
          console.error('Errore dell\'inizializzazione del database', error);
          process.exit(1);
     }
}


//Inizializzazione dei servizi e le dipendenze
function initializaServices(){
     //Ripository
     const musicEventRepository = new MusicEventRepository();
     const statisticRepository = new StatatisticRepository();

     //Subject
     const eventSubject = new EventSubject();
     const statisticService = new StatisticService(musicEventRepository);

     //Service
     const eventProcessingService = new EventProcessingService(musicEventRepository, eventSubject);

     //Observers
     const statisticsObserver = new StatisticsObserver(statisticService, statisticRepository);
     eventSubject.attach(statisticsObserver);

     //Controller 
     const eventController = new EventController(eventProcessingService);
     const statisticsController = new StatatisticsController(statisticService, musicEventRepository);

     //Routes
     const routes = createRoutes(eventController, statisticsController);
     app.use('/api', routes);

     console.log('Inizializzazione del servizion corretto.')


}


async function startServer(): Promise<void> {
     try {
          await inizializeDatabase();
          initializaServices();

          app.listen(PORT, () => {
               console.log(`Server is running on port ${PORT}`);
               console.log(`API endpoint available at http:localhost:${PORT}/api`);
               console.log(`Health check:  http:localhost:${PORT}/api/health`);
          })
     } catch (error) {
          console.log('Failled to start server', error);
          process.exit(1)
     }
}


startServer();
