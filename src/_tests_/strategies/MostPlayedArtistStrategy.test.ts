import { MostPlayedArtistStrategy } from '../../strategies/MostPlayedArtistStrategy';
import { MusicEvent } from '../../models/MusicEvent';

describe('MostPlayedArtistStrategy', () => {
     let strategy: MostPlayedArtistStrategy;

     beforeEach(() => {
          strategy = new MostPlayedArtistStrategy();
     });

     it('dovrebbe restituire il tipo corretto', () => {
          expect(strategy.getType()).toBe('artista_più_suonato');
     });

     it('dovrebbe calcolare l\'artista più ascoltato', async () => {
          const events: MusicEvent[] = [
               { id: 1, userId: 'u1', trackId: 't001', artist: 'Ultimo', duration: 832, timestamp: new Date() } as MusicEvent,
               { id: 2, userId: 'u2', trackId: 't002', artist: 'Ultimo', duration: 181, timestamp: new Date() } as MusicEvent,
               { id: 3, userId: 'u3', trackId: 't003', artist: 'Ultimo', duration: 500, timestamp: new Date() } as MusicEvent,
               { id: 4, userId: 'u4', trackId: 't004', artist: 'Laura Pausini', duration: 210, timestamp: new Date() } as MusicEvent,
               { id: 5, userId: 'u5', trackId: 't005', artist: 'Eros Ramazzotti', duration: 167, timestamp: new Date() } as MusicEvent,
          ];

          const result = await strategy.calculate(events);

          expect(result.type).toBe('artista_più_suonato');
          expect(result.value).toBe('Ultimo');
          expect(result.metadata?.maxCount).toBe(3);
          expect(result.metadata?.totalEvents).toBe(5);
          expect(result.metadata?.percentage).toBe('60.00');
     });

     it('dovrebbe gestire array vuoto', async () => {
          const result = await strategy.calculate([]);

          expect(result.type).toBe('artista_più_suonato');
          expect(result.value).toBeNull();
          expect(result.metadata?.message).toBe('Nessun evento disponibile');
     });

     it('dovrebbe includere statistiche opzionali se disponibili', async () => {
          const events: MusicEvent[] = [
               { id: 1, userId: 'u1', trackId: 't001', artist: 'Ultimo', duration: 832, timestamp: new Date(), genre: 'Dance', device: 'mobile', country: 'IT' } as MusicEvent,
               { id: 2, userId: 'u2', trackId: 't002', artist: 'Sfera Ebbasta', duration: 181, timestamp: new Date(), genre: 'Pop', device: 'desktop', country: 'IT' } as MusicEvent,
          ];

          const result = await strategy.calculate(events);

          expect(result.metadata?.genre).toBeDefined();
          expect(result.metadata?.device).toBeDefined();
          expect(result.metadata?.country).toBeDefined();
     });
});

