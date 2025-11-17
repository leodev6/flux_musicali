import { AverageDurationStrategy } from '../../strategies/AverageDurationStrategy';
import { MusicEvent } from '../../models/MusicEvent';

describe('AverageDurationStrategy', () => {
     let strategy: AverageDurationStrategy;

     beforeEach(() => {
          strategy = new AverageDurationStrategy();
     });

     it('dovrebbe restituire il tipo corretto', () => {
          expect(strategy.getType()).toBe('durata_media');
     });

     it('dovrebbe calcolare la durata media correttamente', async () => {
          const events: MusicEvent[] = [
               { id: 1, userId: 'u1', trackId: 't001', artist: 'Ultimo', duration: 832, timestamp: new Date() } as MusicEvent,
               { id: 2, userId: 'u2', trackId: 't002', artist: 'Sfera Ebbasta', duration: 181, timestamp: new Date() } as MusicEvent,
               { id: 3, userId: 'u3', trackId: 't003', artist: 'Mahmood', duration: 500, timestamp: new Date() } as MusicEvent,
          ];

          const result = await strategy.calculate(events);

          expect(result.type).toBe('durata_media');
          expect(result.value).toBe(504); // (832 + 181 + 500) / 3 ≈ 504.33
          expect(result.metadata?.totalDuration).toBe(1513);
          expect(result.metadata?.eventCount).toBe(3);
          expect(result.metadata?.unit).toBe('seconds');
     });

     it('dovrebbe gestire array vuoto', async () => {
          const result = await strategy.calculate([]);

          expect(result.type).toBe('durata_media');
          expect(result.value).toBe(0);
          expect(result.metadata?.message).toBe('Nessun evento disponibile');
     });

     it('dovrebbe arrotondare la durata media', async () => {
          const events: MusicEvent[] = [
               { id: 1, userId: 'u1', trackId: 't001', artist: 'Ultimo', duration: 832, timestamp: new Date() } as MusicEvent,
               { id: 2, userId: 'u2', trackId: 't002', artist: 'Sfera Ebbasta', duration: 181, timestamp: new Date() } as MusicEvent,
          ];

          const result = await strategy.calculate(events);

          expect(result.value).toBe(507); // (832 + 181) / 2 = 506.5
     });
});

