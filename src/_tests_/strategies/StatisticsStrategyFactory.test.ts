import { StatisticsStrategyFactory } from '../../strategies/StatistiquStrategyFactory';
import { IStatisticsStrategy } from '../../strategies/IStatistiqueStrategy';

describe('StatisticsStrategyFactory', () => {
     it('dovrebbe restituire la strategia corretta per artista_più_suonato', () => {
          const strategy = StatisticsStrategyFactory.getStrategy('artista_più_suonato');
          expect(strategy).not.toBeNull();
          expect(strategy?.getType()).toBe('artista_più_suonato');
     });

     it('dovrebbe restituire la strategia corretta per durata_media', () => {
          const strategy = StatisticsStrategyFactory.getStrategy('durata_media');
          expect(strategy).not.toBeNull();
          expect(strategy?.getType()).toBe('durata_media');
     });

     it('dovrebbe restituire la strategia corretta per tendenza_giornaliera', () => {
          const strategy = StatisticsStrategyFactory.getStrategy('tendenza_giornaliera');
          expect(strategy).not.toBeNull();
          expect(strategy?.getType()).toBe('tendenza_giornaliera');
     });

     it('dovrebbe restituire la strategia corretta per ore_di_punta', () => {
          const strategy = StatisticsStrategyFactory.getStrategy('ore_di_punta');
          expect(strategy).not.toBeNull();
          expect(strategy?.getType()).toBe('ore_di_punta');
     });

     it('dovrebbe restituire null per un tipo non valido', () => {
          const strategy = StatisticsStrategyFactory.getStrategy('tipo_non_valido');
          expect(strategy).toBeNull();
     });

     it('dovrebbe restituire tutte le strategie disponibili', () => {
          const strategies = StatisticsStrategyFactory.getAllStrategies();
          expect(strategies.length).toBeGreaterThan(0);
          expect(strategies.every(s => s.getType() !== undefined)).toBe(true);
     });

     it('dovrebbe permettere di registrare una nuova strategia', () => {
          const mockStrategy: IStatisticsStrategy = {
               getType: () => 'nuova_strategia',
               calculate: jest.fn(),
          };

          StatisticsStrategyFactory.registerStrategy('nuova_strategia', mockStrategy);
          const retrieved = StatisticsStrategyFactory.getStrategy('nuova_strategia');

          expect(retrieved).toBe(mockStrategy);
          expect(retrieved?.getType()).toBe('nuova_strategia');
     });
});