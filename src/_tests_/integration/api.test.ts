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


describe('API Integration Tests', () => {
     let app: express.Application;

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

