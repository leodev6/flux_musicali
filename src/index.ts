/**
 * File principale dell'applicazione Flux Musicali
 * 
 * Questo file gestisce l'inizializzazione e l'avvio del server Express,
 * configurando tutti i middleware, i servizi, i repository, gli observer
 * e le route necessarie per il funzionamento dell'applicazione.
 * 
 * @module index
 * @author Lionel Djouaka
 */
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
import { StatatisticsController } from './controllers';
import StatatisticRepository from './repositories/StatisticsRepository';

// Caricamento delle variabili d'ambiente dal file .env
dotenv.config();
// Inizializzazione dell'applicazione Express
const app: Express = express();
const PORT = process.env.PORT || 3000;

/**
 * Configurazione dei middleware Express
 * 
 * - cors: Abilita le richieste cross-origin per consentire l'accesso da domini diversi
 * - express.json: Permette il parsing del body delle richieste in formato JSON
 * - express.urlencoded: Permette il parsing del body delle richieste in formato URL-encoded
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/**
 * Inizializza la connessione al database PostgreSQL
 * 
 * Questa funzione autentica la connessione al database e sincronizza
 * i modelli Sequelize con le tabelle del database. In caso di errore,
 * l'applicazione viene terminata.
 * 
 * @async
 * @function inizializeDatabase
 * @returns {Promise<void>} Promise che si risolve quando il database è inizializzato
 * @throws {Error} Se la connessione al database fallisce
 */
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


/**
 * Inizializza tutti i servizi e le dipendenze dell'applicazione
 * 
 * Questa funzione crea e configura:
 * - I repository per l'accesso ai dati (MusicEventRepository, StatatisticRepository)
 * - I servizi di business logic (EventProcessingService, StatisticService)
 * - Gli observer per il pattern Observer (StatisticsObserver)
 * - I controller per gestire le richieste HTTP (EventController, StatatisticsController)
 * - Le route API e le associa all'applicazione Express
 * 
 * @function initializaServices
 */
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

/**
 * Middleware per la gestione degli errori globali
 * 
 * Questo middleware cattura tutti gli errori non gestiti e restituisce
 * una risposta JSON standardizzata. In modalità development, include
 * anche il messaggio di errore dettagliato.
 * 
 * @param {Error} err - L'errore catturato
 * @param {express.Request} req - Oggetto richiesta Express
 * @param {express.Response} res - Oggetto risposta Express
 * @param {express.NextFunction} next - Funzione per passare al middleware successivo
 */
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
     console.error('Error: ', err);
     res.status(500).json({
          success: false,
          error: 'Errore interno al server',
          message: process.env.NODE_ENV === 'development' ? err.message : undefined,
     });
});

/**
 * Avvia il server Express
 * 
 * Questa funzione inizializza il database, configura tutti i servizi
 * e avvia il server HTTP sulla porta specificata. In caso di errore,
 * l'applicazione viene terminata.
 * 
 * @async
 * @function startServer
 * @returns {Promise<void>} Promise che si risolve quando il server è avviato
 * @throws {Error} Se l'avvio del server fallisce
 */
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
