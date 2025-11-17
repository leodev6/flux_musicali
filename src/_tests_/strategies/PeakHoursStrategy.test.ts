import { PeakHoursStrategy } from '../../strategies/PeakHoursStrategy';
import { MusicEvent } from '../../models/MusicEvent';

describe('PeakHoursStrategy', () => {
     let strategy: PeakHoursStrategy;

     beforeEach(() => {
          strategy = new PeakHoursStrategy();
     });

     it('dovrebbe restituire il tipo corretto', () => {
          expect(strategy.getType()).toBe('ore_di_punta');
     });

     it('dovrebbe calcolare le ore di punta', async () => {
          const events: MusicEvent[] = [
               { id: 1, userId: 'u1', trackId: 't001', artist: 'Ultimo', duration: 832, timestamp: new Date('2025-01-01T14:00:00Z') } as MusicEvent,
               { id: 2, userId: 'u2', trackId: 't002', artist: 'Sfera Ebbasta', duration: 181, timestamp: new Date('2025-01-01T14:30:00Z') } as MusicEvent,
               { id: 3, userId: 'u3', trackId: 't003', artist: 'Mahmood', duration: 150, timestamp: new Date('2025-01-01T06:14:22Z') } as MusicEvent,
          ];

          const result = await strategy.calculate(events);

          expect(result.type).toBe('ore_di_punta');
          expect(result.value.allHours).toBeDefined();
          expect(result.value.peakHours).toBeDefined();
          expect(result.value.peakHours.length).toBe(3);
          expect(result.metadata?.peakHour).toBe(14); // Ora con più eventi
     });

     it('dovrebbe includere tutte le 24 ore', async () => {
          const events: MusicEvent[] = [
               { id: 1, userId: 'u1', trackId: 't001', artist: 'Ultimo', duration: 832, timestamp: new Date('2025-01-01T00:00:00Z') } as MusicEvent,
          ];

          const result = await strategy.calculate(events);

          expect(result.value.allHours.length).toBe(24);
     });

     it('dovrebbe calcolare correttamente averageDuration per ogni ora', async () => {
          const events: MusicEvent[] = [
               { id: 1, userId: 'u1', trackId: 't001', artist: 'Ultimo', duration: 832, timestamp: new Date('2025-01-01T14:00:00Z') } as MusicEvent,
               { id: 2, userId: 'u2', trackId: 't002', artist: 'Sfera Ebbasta', duration: 181, timestamp: new Date('2025-01-01T14:30:00Z') } as MusicEvent,
          ];

          const result = await strategy.calculate(events);

          const hour14 = result.value.allHours.find((h: any) => h.hour === 14);
          expect(hour14.averageDuration).toBe(507); // (832 + 181) / 2 = 507
     });

     it('dovrebbe ordinare le ore di punta per numero di eventi decrescente', async () => {
          const events: MusicEvent[] = [
               { id: 1, userId: 'u1', trackId: 't001', artist: 'Ultimo', duration: 832, timestamp: new Date('2024-01-01T10:00:00Z') } as MusicEvent,
               { id: 2, userId: 'u2', trackId: 't002', artist: 'Sfera Ebbasta', duration: 181, timestamp: new Date('2025-01-01T03:07:11Z') } as MusicEvent,
               { id: 3, userId: 'u3', trackId: 't003', artist: 'Mahmood', duration: 150, timestamp: new Date('2025-01-01T06:14:22Z') } as MusicEvent,
          ];

          const result = await strategy.calculate(events);

          expect(result.value.peakHours[0].eventCount).toBeGreaterThanOrEqual(result.value.peakHours[1].eventCount);
     });

     it('dovrebbe gestire array vuoto', async () => {
          const result = await strategy.calculate([]);

          expect(result.type).toBe('ore_di_punta');
          expect(result.value).toEqual([]);
          expect(result.metadata?.message).toBe('Nessun evento disponibile');
     });
});

