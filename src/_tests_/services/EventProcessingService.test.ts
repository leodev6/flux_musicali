import { EventProcessingService, MusicEventInput } from '../../services/EventProcessingService';
import MusicEventRepository from '../../repositories/MusicEventRepository';
import { EventSubject } from '../../observers/EventSubject';
import { MusicEvent } from '../../models/MusicEvent';
import { timestamp } from 'rxjs';

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
               userId: 'u1',
               trackId: 't001',
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

     describe('elaboraEventoBatch', () => {
          it('dovrebbe processare multipli eventi con successo', async () => {
               const eventsData: MusicEventInput[] = [
                    {
                         userId: 'u1',
                         trackId: 't001',
                         artist: 'Ultimo',
                         duration: 180,
                         timestamp: '2024-01-01T12:00:00Z',
                    },
                    {
                         userId: 'u2',
                         trackId: 't002',
                         artist: 'Sfera Ebbasta',
                         duration: 200,
                         timestamp: '2024-01-01T12:00:00Z',
                    },
               ];

               const mockEvents = eventsData.map((data, index) => ({
                    id: index + 1,
                    ...data,
                    timestamp: new Date(data.timestamp),
               })) as MusicEvent[];

               mockMusicEventRepository.create
                    .mockResolvedValueOnce(mockEvents[0])
                    .mockResolvedValueOnce(mockEvents[1]);
               mockEventSubject.notify.mockResolvedValue();

               const result = await eventProcessingService.elaboraEventoBatch(eventsData);

               expect(result).toHaveLength(2);
               expect(mockMusicEventRepository.create).toHaveBeenCalledTimes(2);
          });

          it('dovrebbe continuare a processare anche se un evento fallisce', async () => {
               const eventsData: MusicEventInput[] = [
                    {
                         userId: 'u1',
                         trackId: 't001',
                         artist: 'Ultimo',
                         duration: 180,
                         timestamp: '2024-01-01T12:00:00Z',
                    },
                    {
                         userId: 'u2',
                         trackId: 't002',
                         artist: 'Sfera Ebbasta',
                         duration: 200,
                         timestamp: '2024-01-01T12:00:00Z',
                    },
                    {
                         userId: 'u3',
                         trackId: 'Mahmood',
                         artist: 't003',
                         duration: 150,
                         timestamp: '2024-01-01T12:00:00Z',
                    },
               ];

               const mockEvent1 = { id: 1, ...eventsData[0], timestamp: new Date(eventsData[0].timestamp) } as MusicEvent;
               const mockEvent3 = { id: 3, ...eventsData[2], timestamp: new Date(eventsData[2].timestamp) } as MusicEvent;

               mockMusicEventRepository.create
                    .mockResolvedValueOnce(mockEvent1)
                    .mockRejectedValueOnce(new Error('Invalid data'))
                    .mockResolvedValueOnce(mockEvent3);
               mockEventSubject.notify.mockResolvedValue();

               const result = await eventProcessingService.elaboraEventoBatch(eventsData);

               expect(result).toHaveLength(2);
               expect(result[0].id).toBe(1);
               expect(result[1].id).toBe(3);
          });
     });

     describe('getAllEvents', () => {
          it('dovrebbe recuperare tutti gli eventi', async () => {
               const mockEvents = [
                    { id: 1, userId: 'u1', trackId: 't001', artist: 'Mahmood', duration: 180, timestamp: new Date() },
                    { id: 2, userId: 'u2', trackId: 't002', artist: 'Ultimo', duration: 200, timestamp: new Date() },
               ] as MusicEvent[];

               mockMusicEventRepository.findAll.mockResolvedValue(mockEvents);

               const result = await eventProcessingService.getAllEvents();

               expect(mockMusicEventRepository.findAll).toHaveBeenCalled();
               expect(result).toEqual(mockEvents);
          });
     });


     describe('getAllEvents', () => {
          it('dovrebbe recuperare tutti gli eventi', async () => {
               const mockEvents = [
                    { id: 1, userId: 'u1', trackId: 't001', artist: 'Mahmood', duration: 180, timestamp: new Date() },
                    { id: 2, userId: 'u2', trackId: 't002', artist: 'Ultimo', duration: 200, timestamp: new Date() },
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
                    userId: 'u3',
                    trackId: 't003',
                    artist: 'Mahmood',
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
                    { id: 4, userId: 'u4', trackId: 't001', artist: 'Laura Pausini', duration: 210, timestamp: new Date() },
                    { id: 5, userId: 'u5', trackId: 't005', artist: 'Eros Ramazzotti', duration: 167, timestamp: new Date() },
               ] as MusicEvent[];

               mockMusicEventRepository.findByArtist.mockResolvedValue(mockEvents);

               const result = await eventProcessingService.getEventsByArtist('Eros Ramazzotti');

               expect(mockMusicEventRepository.findByArtist).toHaveBeenCalledWith('Eros Ramazzotti');
               expect(result).toEqual(mockEvents);
          });
     });
});