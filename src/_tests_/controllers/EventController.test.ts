/**
 * Test suite per EventController
 * 
 * Testa tutte le funzionalità del controller degli eventi musicali,
 * inclusi la creazione di eventi singoli e batch, e il recupero di eventi.
 * 
 * @module EventController.test
 */
import { Request, Response } from 'express';
import { EventController } from '../../controllers/EventController';
import { EventProcessingService } from '../../services/EventProcessingService';
import { MusicEvent } from '../../models/MusicEvent';

// Mock del servizio
jest.mock('../../services/EventProcessingService');

/**
 * Suite principale che verifica il comportamento del controller degli eventi musicali,
 * assicurandosi che ogni endpoint REST risponda correttamente in scenari positivi e di errore.
 */
describe('EventController', () => {
     let eventController: EventController;
     let mockEventProcessingService: jest.Mocked<EventProcessingService>;
     let mockRequest: Partial<Request>;
     let mockResponse: Partial<Response>;

     beforeEach(() => {
          // Crea un mock del servizio
          mockEventProcessingService = {
               processEvent: jest.fn(),
               elaboraEventoBatch: jest.fn(),
               getAllEvents: jest.fn(),
               getEventById: jest.fn(),
               getEventsByArtist: jest.fn(),
          } as any;

          eventController = new EventController(mockEventProcessingService);

          // Setup mock response
          mockResponse = {
               status: jest.fn().mockReturnThis(),
               json: jest.fn().mockReturnThis(),
          };

          // Setup mock request
          mockRequest = {
               body: {},
               params: {},
               query: {},
          };
     });

     /**
      * Verifica la creazione di singoli eventi tramite l'endpoint POST /api/events.
      * Copre sia i casi di successo sia la propagazione degli errori dal servizio.
      */
     describe('createEvent', () => {
          it('dovrebbe creare un evento con successo', async () => {
               const mockEvent = {
                    id: 1,
                    userId: 'u1',
                    trackId: 't001',
                    artist: 'Ultimo',
                    duration: 832,
                    timestamp: new Date(),
               } as MusicEvent;

               mockEventProcessingService.processEvent.mockResolvedValue(mockEvent);
               mockRequest.body = {
                    userId: 'u1',
                    trackId: 't001',
                    artist: 'Ultimo',
                    duration: 832,
                    timestamp: '2024-01-01T12:00:00Z',
               };

               await eventController.createEvent(mockRequest as Request, mockResponse as Response);

               expect(mockEventProcessingService.processEvent).toHaveBeenCalledWith(mockRequest.body);
               expect(mockResponse.status).toHaveBeenCalledWith(201);
               expect(mockResponse.json).toHaveBeenCalledWith({
                    success: true,
                    data: mockEvent,
               });
          });

          it('dovrebbe gestire gli errori durante la creazione', async () => {
               const errorMessage = 'Errore di validazione';
               mockEventProcessingService.processEvent.mockRejectedValue(new Error(errorMessage));
               mockRequest.body = {
                    userId: 'u1',
                    trackId: 't001',
                    artist: 'Ultimo',
                    duration: 832,
                    timestamp: '2024-01-01T12:00:00Z',
               };

               await eventController.createEvent(mockRequest as Request, mockResponse as Response);

               expect(mockResponse.status).toHaveBeenCalledWith(401);
               expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: errorMessage,
               });
          });
     });

     describe('creaEventiBatch', () => {
          it('dovrebbe creare multipli eventi con successo', async () => {
               const mockEvents = [
                    { id: 1, userId: 'u1', trackId: 't001', artist: 'Ultimo', duration: 832, timestamp: new Date() },
                    { id: 2, userId: 'u2', trackId: 't002', artist: 'Sfera Ebbasta', duration: 181, timestamp: new Date() },
               ] as MusicEvent[];

               mockEventProcessingService.elaboraEventoBatch.mockResolvedValue(mockEvents);
               mockRequest.body = {
                    events: [
                         { userId: 'u1', trackId: 't001', artist: 'Ultimo', duration: 832, timestamp: '2024-01-01T12:00:00Z' },
                         { userId: 'u2', trackId: 't002', artist: 'Sfera Ebbasta', duration: 181, timestamp: '2024-01-01T12:00:00Z' },
                    ],
               };

               await eventController.creaEventiBatch(mockRequest as Request, mockResponse as Response);

               expect(mockEventProcessingService.elaboraEventoBatch).toHaveBeenCalledWith(mockRequest.body.events);
               expect(mockResponse.status).toHaveBeenCalledWith(201);
               expect(mockResponse.json).toHaveBeenCalledWith({
                    success: true,
                    data: mockEvents,
                    count: 2,
               });
          });

          it('dovrebbe restituire errore se events non è un array', async () => {
               mockRequest.body = {
                    events: 'not an array',
               };

               await eventController.creaEventiBatch(mockRequest as Request, mockResponse as Response);

               expect(mockResponse.status).toHaveBeenCalledWith(400);
               expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: 'Gli eventi devono essere un array',
               });
          });
     });

     describe('getAllEvents', () => {
          it('dovrebbe recuperare tutti gli eventi con successo', async () => {
               const mockEvents = [
                    { id: 1, userId: 'u1', trackId: 't001', artist: 'Ultimo', duration: 832, timestamp: new Date() },
                    { id: 2, userId: 'u2', trackId: 't002', artist: 'Sfera Ebbasta', duration: 181, timestamp: new Date() },
               ] as MusicEvent[];

               mockEventProcessingService.getAllEvents.mockResolvedValue(mockEvents);

               await eventController.getAllEvents(mockRequest as Request, mockResponse as Response);

               expect(mockEventProcessingService.getAllEvents).toHaveBeenCalled();
               expect(mockResponse.json).toHaveBeenCalledWith({
                    success: true,
                    data: mockEvents,
                    count: 2,
               });
          });

          it('dovrebbe gestire gli errori durante il recupero', async () => {
               const errorMessage = 'Errore database';
               mockEventProcessingService.getAllEvents.mockRejectedValue(new Error(errorMessage));

               await eventController.getAllEvents(mockRequest as Request, mockResponse as Response);

               expect(mockResponse.status).toHaveBeenCalledWith(500);
               expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: errorMessage,
               });
          });
     });

     describe('getEventById', () => {
          it('dovrebbe recuperare un evento per ID con successo', async () => {
               const mockEvent = {
                    id: 1,
                    userId: 'user123',
                    trackId: 'track456',
                    artist: 'Artist Name',
                    duration: 180,
                    timestamp: new Date(),
               } as MusicEvent;

               mockEventProcessingService.getEventById.mockResolvedValue(mockEvent);
               mockRequest.params = { id: '1' };

               await eventController.getEventById(mockRequest as Request, mockResponse as Response);

               expect(mockEventProcessingService.getEventById).toHaveBeenCalledWith(1);
               expect(mockResponse.json).toHaveBeenCalledWith({
                    success: true,
                    data: mockEvent,
               });
          });

          it('dovrebbe restituire 404 se l\'evento non esiste', async () => {
               mockEventProcessingService.getEventById.mockResolvedValue(null);
               mockRequest.params = { id: '999' };

               await eventController.getEventById(mockRequest as Request, mockResponse as Response);

               expect(mockResponse.status).toHaveBeenCalledWith(404);
               expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: 'Evento non trovato',
               });
          });

          it('dovrebbe restituire errore se l\'ID non è valido', async () => {
               mockRequest.params = { id: 'invalid' };

               await eventController.getEventById(mockRequest as Request, mockResponse as Response);

               expect(mockResponse.status).toHaveBeenCalledWith(400);
               expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: 'ID non valido',
               });
          });
     });

     describe('getEventsByArtist', () => {
          it('dovrebbe recuperare eventi per artista con successo', async () => {
               const mockEvents = [
                    { id: 1, userId: 'user1', trackId: 'track1', artist: 'Artist Name', duration: 180, timestamp: new Date() },
                    { id: 2, userId: 'user2', trackId: 'track2', artist: 'Artist Name', duration: 200, timestamp: new Date() },
               ] as MusicEvent[];

               mockEventProcessingService.getEventsByArtist.mockResolvedValue(mockEvents);
               mockRequest.params = { artist: 'Artist Name' };

               await eventController.getEventsByArtist(mockRequest as Request, mockResponse as Response);

               expect(mockEventProcessingService.getEventsByArtist).toHaveBeenCalledWith('Artist Name');
               expect(mockResponse.json).toHaveBeenCalledWith({
                    success: true,
                    data: mockEvents,
                    count: 2,
               });
          });

          it('dovrebbe usare query parameter se disponibile', async () => {
               const mockEvents = [] as MusicEvent[];
               mockEventProcessingService.getEventsByArtist.mockResolvedValue(mockEvents);
               mockRequest.query = { artist: 'Artist Name' };

               await eventController.getEventsByArtist(mockRequest as Request, mockResponse as Response);

               expect(mockEventProcessingService.getEventsByArtist).toHaveBeenCalledWith('Artist Name');
          });

          it('dovrebbe restituire errore se il nome artista non è fornito', async () => {
               mockRequest.params = {};
               mockRequest.query = {};

               await eventController.getEventsByArtist(mockRequest as Request, mockResponse as Response);

               expect(mockResponse.status).toHaveBeenCalledWith(400);
               expect(mockResponse.json).toHaveBeenCalledWith({
                    success: false,
                    error: 'Nome artista richiesto',
               });
          });
     });
});

