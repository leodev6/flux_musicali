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

     describe('getAllEvents', () => {
          it('dovrebbe recuperare tutti gli eventi', async () => {
               const mockEvents = [
                    { id: 1, userId: 'user1', trackId: 'track1', artist: 'Artist1', duration: 180, timestamp: new Date() },
                    { id: 2, userId: 'user2', trackId: 'track2', artist: 'Artist2', duration: 200, timestamp: new Date() },
               ] as MusicEvent[];

               mockMusicEventRepository.findAll.mockResolvedValue(mockEvents);

               const result = await eventProcessingService.getAllEvents();

               expect(mockMusicEventRepository.findAll).toHaveBeenCalled();
               expect(result).toEqual(mockEvents);
          });
     });

     describe('getEventById', () => {
          it('dovrebbe recuperare un evento per ID', async () => {
               const mockEvent = {
                    id: 1,
                    userId: 'user123',
                    trackId: 'track456',
                    artist: 'Artist Name',
                    duration: 180,
                    timestamp: new Date(),
               } as MusicEvent;

               mockMusicEventRepository.findById.mockResolvedValue(mockEvent);

               const result = await eventProcessingService.getEventById(1);

               expect(mockMusicEventRepository.findById).toHaveBeenCalledWith(1);
               expect(result).toEqual(mockEvent);
          });

          it('dovrebbe restituire null se l\'evento non esiste', async () => {
               mockMusicEventRepository.findById.mockResolvedValue(null);

               const result = await eventProcessingService.getEventById(999);

               expect(result).toBeNull();
          });
     });

     describe('getEventsByArtist', () => {
          it('dovrebbe recuperare eventi per artista', async () => {
               const mockEvents = [
                    { id: 1, userId: 'user1', trackId: 'track1', artist: 'Laura Pausini', duration: 180, timestamp: new Date() },
                    { id: 2, userId: 'user2', trackId: 'track2', artist: 'Eros Ramazzotti', duration: 200, timestamp: new Date() },
               ] as MusicEvent[];

               mockMusicEventRepository.findByArtist.mockResolvedValue(mockEvents);

               const result = await eventProcessingService.getEventsByArtist('Laura Pausini');

               expect(mockMusicEventRepository.findByArtist).toHaveBeenCalledWith('Eros Ramazzotti');
               expect(result).toEqual(mockEvents);
          });
     });
});