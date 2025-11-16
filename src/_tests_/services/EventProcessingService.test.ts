import { EventProcessingService, MusicEventInput } from '../../services/EventProcessingService';
import MusicEventRepository from '../../repositories/MusicEventRepository';
import { EventSubject } from '../../observers/EventSubject';
import { MusicEvent } from '../../models/MusicEvent';

// Mock dei repository e observer
jest.mock('../../repositories/MusicEventRepository');
jest.mock('../../observers/EventSubject');

describe('EventProcessingService', () => {
     let eventProcessingService: EventProcessingService;
     let mockMusicEventRepository: jest.Mocked<MusicEventRepository>;
     let mockEventSubject: jest.Mocked<EventSubject>;

     beforeEach(() => {
          mockMusicEventRepository = {
               create: jest.fn(),
               findAll: jest.fn(),
               findById: jest.fn(),
               findByArtist: jest.fn(),
          } as any;

          mockEventSubject = {
               notify: jest.fn(),
               attach: jest.fn(),
               detach: jest.fn(),
               getObserversCount: jest.fn(),
          } as any;

          eventProcessingService = new EventProcessingService(
               mockMusicEventRepository,
               mockEventSubject
          );
     });

     describe('processEvent', () => {
          const validEventData: MusicEventInput = {
               userId: 'user123',
               trackId: 'track456',
               artist: 'Ultimo',
               duration: 180,
               timestamp: '2024-01-01T12:00:00Z',
               genre: 'Rock',
               country: 'IT',
               device: 'mobile',
          };

          it('dovrebbe processare un evento valido con successo', async () => {
               const mockEvent = {
                    id: 1,
                    ...validEventData,
                    timestamp: new Date(validEventData.timestamp),
               } as MusicEvent;

               mockMusicEventRepository.create.mockResolvedValue(mockEvent);
               mockEventSubject.notify.mockResolvedValue();

               const result = await eventProcessingService.processEvent(validEventData);

               expect(mockMusicEventRepository.create).toHaveBeenCalled();
               expect(mockEventSubject.notify).toHaveBeenCalledWith(mockEvent);
               expect(result).toEqual(mockEvent);
          });

          it('dovrebbe lanciare errore se userId mancante', async () => {
               const invalidData = { ...validEventData, userId: '' };

               await expect(eventProcessingService.processEvent(invalidData)).rejects.toThrow(
                    'Campi obbligatori mancanti: userId, trackId, artist'
               );
          });

          it('dovrebbe lanciare errore se trackId mancante', async () => {
               const invalidData = { ...validEventData, trackId: '' };

               await expect(eventProcessingService.processEvent(invalidData)).rejects.toThrow(
                    'Campi obbligatori mancanti: userId, trackId, artist'
               );
          });

          it('dovrebbe lanciare errore se artist mancante', async () => {
               const invalidData = { ...validEventData, artist: '' };

               await expect(eventProcessingService.processEvent(invalidData)).rejects.toThrow(
                    'Campi obbligatori mancanti: userId, trackId, artist'
               );
          });


          it('dovrebbe lanciare errore se duration non è un numero positivo', async () => {
               const invalidData = { ...validEventData, duration: -10 };

               await expect(eventProcessingService.processEvent(invalidData)).rejects.toThrow(
                    'La durata deve essere un numero positivo superiore a zero'
               );
          });

          it('dovrebbe lanciare errore se timestamp non valido', async () => {
               const invalidData = { ...validEventData, timestamp: 'invalid-date' };

               await expect(eventProcessingService.processEvent(invalidData)).rejects.toThrow(
                    'Formato timestamp non valido'
               );
          });
     });
});