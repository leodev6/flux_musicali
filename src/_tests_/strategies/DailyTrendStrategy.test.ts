/**
 * Test suite per DailyTrendStrategy
 * 
 * Testa il calcolo delle tendenze giornaliere degli eventi musicali.
 * 
 * @module DailyTrendStrategy.test
 */

import { DailyTrendStrategy } from '../../strategies/DailyTrendStrategy';
import { MusicEvent } from '../../models/MusicEvent';

describe('DailyTrendStrategy', () => {
     let strategy: DailyTrendStrategy;

     beforeEach(() => {
          strategy = new DailyTrendStrategy();
     });

     it('dovrebbe restituire il tipo corretto', () => {
          expect(strategy.getType()).toBe('tendenza_giornaliera');
     });

     it('dovrebbe calcolare le tendenze giornaliere', async () => {
          const date1 = new Date('2024-01-01T10:00:00Z');
          const date2 = new Date('2024-01-02T10:00:00Z');

          const events: MusicEvent[] = [
               { id: 1, userId: 'user1', trackId: 'track1', artist: 'Artist A', duration: 100, timestamp: date1 } as MusicEvent,
               { id: 2, userId: 'user2', trackId: 'track2', artist: 'Artist B', duration: 200, timestamp: date1 } as MusicEvent,
               { id: 3, userId: 'user3', trackId: 'track3', artist: 'Artist C', duration: 150, timestamp: date2 } as MusicEvent,
          ];

          const result = await strategy.calculate(events);

          expect(result.type).toBe('tendenza_giornaliera');
          expect(Array.isArray(result.value)).toBe(true);
          expect(result.value.length).toBe(2);
          expect(result.metadata?.totalDays).toBe(2);
     });

     it('dovrebbe calcolare correttamente eventCount, totalDuration, uniqueArtists e uniqueUsers', async () => {
          const data = new Date('2025-01-01T00:00:00Z');

          const events: MusicEvent[] = [
               { id: 1, userId: 'u1', trackId: 't001', artist: 'Ultimo', duration: 832, timestamp: data } as MusicEvent,
               { id: 2, userId: 'u2', trackId: 't002', artist: 'Sfera Ebbasta', duration: 181, timestamp: data } as MusicEvent,
               { id: 3, userId: 'u3', trackId: 't003', artist: 'Mahmood', duration: 500, timestamp: data} as MusicEvent,
          ];

          const result = await strategy.calculate(events);

          const dayData = result.value[0];
          expect(dayData.eventCount).toBe(3);
          expect(dayData.totalDuration).toBe(1513);
          expect(dayData.uniqueArtists).toBe(3);
          expect(dayData.uniqueUsers).toBe(3);
     });

     it('dovrebbe ordinare le tendenze per data', async () => {
          const data1 = new Date('2024-01-01T00:00:00Z');
          const data2 = new Date('2024-01-02T03:07:11Z');

          const events: MusicEvent[] = [
               { id: 1, userId: 'u1', trackId: 't001', artist: 'Ultimo', duration: 832, timestamp: data1 } as MusicEvent,
               { id: 2, userId: 'u2', trackId: 't002', artist: 'Sfera Ebbasta', duration: 181, timestamp: data2 } as MusicEvent,
          ];

          const result = await strategy.calculate(events);

          expect(result.value[0].date).toBe('2024-01-01');
          expect(result.value[1].date).toBe('2024-01-02');
     });

     it('dovrebbe gestire array vuoto', async () => {
          const result = await strategy.calculate([]);

          expect(result.type).toBe('tendenza_giornaliera');
          expect(result.value).toEqual([]);
          expect(result.metadata?.message).toBe('Nessun evento disponibile');
     });
});

