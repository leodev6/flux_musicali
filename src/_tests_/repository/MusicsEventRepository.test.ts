import { MusicEventRepository } from '../../repositories/MusicEventRepository';
import MusicEvent from '../../models/MusicEvent';
import { json, Op, where } from 'sequelize';

// Mock del modello Sequelize
jest.mock('../../models/MusicEvent');

describe('MusicEventRepository', () => {

     let repository: MusicEventRepository;
     let mockMusicEvent: jest.Mocked<typeof MusicEvent>;

     beforeEach(() => {
          repository = new MusicEventRepository();
          mockMusicEvent = MusicEvent as jest.Mocked<typeof MusicEvent>;
     });

     describe('create', () => {
          it('dovrebbe creare un nuovo evento', async () => {
               const eventData = {
                    userId: 'user123',
                    trackId: 'track456',
                    artist: 'Artist Name',
                    duration: 180,
                    timestamp: new Date(),
               };

               const mockCreatedEvent = { id: 1, ...eventData } as MusicEvent;
               mockMusicEvent.create = jest.fn().mockResolvedValue(mockCreatedEvent);

               const result = await repository.create(eventData);

               expect(mockMusicEvent.create).toHaveBeenCalledWith(eventData);
               expect(result).toEqual(mockCreatedEvent);
          });
     });

     describe('findById', () => {
          it('dovrebbe trovare un evento per ID', async () => {
               const mockEvent = { id: 1, userId: 'user123' } as MusicEvent;
               mockMusicEvent.findByPk = jest.fn().mockResolvedValue(mockEvent);

               const result = await repository.findById(1);

               expect(mockMusicEvent.findByPk).toHaveBeenCalledWith(1);
               expect(result).toEqual(mockEvent);
          });

          it('dovrebbe restituire null se l\'evento non esiste', async () => {
               mockMusicEvent.findByPk = jest.fn().mockResolvedValue(null);

               const result = await repository.findById(999);

               expect(result).toBeNull();
          });
     });

     describe('findAll', () => {
          it('dovrebbe trovare tutti gli eventi', async () => {
               const mockEvents = [
                    { id: 1, userId: 'user1' } as MusicEvent,
                    { id: 2, userId: 'user2' } as MusicEvent,
               ];
               mockMusicEvent.findAll = jest.fn().mockResolvedValue(mockEvents);

               const result = await repository.findAll();

               expect(mockMusicEvent.findAll).toHaveBeenCalled();
               expect(result).toEqual(mockEvents);
          });
     });

     describe('findByArtist', () => {
          it('dovrebbe trovare eventi per artista', async () => {
               const mockEvent = [{ id: 1, artist: 'Ultimo' } as MusicEvent];
               mockMusicEvent.findAll = jest.fn().mockResolvedValue(mockEvent);

               const result = await repository.findByArtist('Ultimo');

               expect(mockMusicEvent.findAll).toHaveBeenCalledWith({ where: { artist: 'Ultimo'}});
          });
     });

     
});