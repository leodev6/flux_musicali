/**
 * Test d'integrazione per verificare che più componenti 
 * dell’applicazione funzionino correttamente insieme.
 * 
 * Lo scopo di assicurare che: 
 * -i controller comunichino correttamente con i service
 * -i service utilizzino in modo corretto i repository
 * -i vari pattern (Observer, Strategy, Subject, Repository…) funzionino bene tra loro
 * -le route HTTP rispondano come previsto
 * -i dati fluiscano correttamente attraverso tutti i livelli dell’applicazione
 * 
 * @module api.test
 */
import { StatisticsObserver } from './../../observers/StastisticsObserver';
import { StatatisticRepository } from './../../repositories/StatisticsRepository';
import request from 'supertest';
import express from 'express';
import { createRoutes } from '../../routes';
import { EventController } from '../../controllers/EventController';
import { EventProcessingService } from '../../services/EventProcessingService';
import { MusicEventRepository } from '../../repositories/MusicEventRepository';
import { EventSubject } from '../../observers/EventSubject';
import { StatisticService } from '../../services/StatisticService';
import { StatatisticsController } from '../../controllers';

/**
 * Test di integrazione sull'API.
 * 
 * Obiettivo:
 *  - Verificare che l'applicazione esponga correttamente gli endpoint principali
 *  - Controllare che il wiring tra controller, servizi, repository e observer funzioni
 *    come previsto in un flusso “quasi reale”.
 */
describe('API Integration Tests', () => {
     let app: express.Application;
     /**
     * Inizializza una piccola applicazione Express prima
     * dell'esecuzione dell'intera suite di test.
     */
     beforeAll(() => {
          // Setup test app
          app = express();
          app.use(express.json());

          // Initialize services (con database di test in uno scenario reale)
          const musicEventRepository = new MusicEventRepository();
          const statisticRepository = new StatatisticRepository();
          const statisticsService = new StatisticService(musicEventRepository);
          const eventSubject = new EventSubject();
          const eventProcessingService = new EventProcessingService(
               musicEventRepository,
               eventSubject
          );

          const statisticsObserver = new StatisticsObserver(statisticsService, statisticRepository);
          eventSubject.attach(statisticsObserver);

          const eventController = new EventController(eventProcessingService);
          const statisticsController = new StatatisticsController(
               statisticsService,
               musicEventRepository
          );

          app.use('/api', createRoutes(eventController, statisticsController));
     });

     it('dovrebbe restituire il controllo del buon funzionamento dell\'applicazione', async () => {
          const response = await request(app).get('/api/health');

          expect(response.status).toBe(200);
          expect(response.body.status).toBe('ok');
     });

     it('dovrebbe creare un evento', async () => {
          const eventData = {
               "userId": "u1",
               "trackId": "t001",
               "artist": "Ultimo",
               "duration": 832,
               "timestamp": "2025-01-01T00:00:00Z",
               "genre": "Dance",
               "country": "IT",
               "device": "mobile"
          };

          const response = await request(app).post('/api/events').send(eventData);

          expect(response.status).toBe(201);
          expect(response.body.success).toBe(true);
          expect(response.body.data.userId).toBe(eventData.userId);
     });
});

