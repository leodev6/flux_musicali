/**
 * Factory per le strategie di calcolo delle statistiche
 * 
 * Implementa il pattern Factory per creare e gestire le strategie
 * di calcolo delle statistiche. Mantiene una mappa di tutte le strategie
 * disponibili e fornisce metodi per recuperarle e registrarle.
 * 
 * @module StatistiquStrategyFactory
 * @author Lionel Djouaka
 */

import { IStatisticsStrategy } from './IStatisticStrategy';
import MostPlayedArtistStrategy from './MostPlayedArtistStrategy';
import AverageDurationStrategy from './AverageDurationStrategy';
import DailyTrendStrategy from './DailyTrendStrategy';
import PeakHoursStrategy from './PeakHoursStrategy';

/**
 * Classe factory per le strategie di calcolo delle statistiche
 * 
 * Gestisce la creazione e il recupero delle strategie utilizzando
 * il pattern Factory. Tutte le strategie sono istanziate una sola volta
 * e riutilizzate per migliorare le performance.
 * 
 * @class StatisticsStrategyFactory
 */
export class StatisticsStrategyFactory {
     /**
      * Mappa delle strategie disponibili
      * 
      * Chiave: tipo di statistica (es: 'artista_più_suonato')
      * Valore: istanza della strategia corrispondente
      * 
      * @private
      * @static
      * @type {Map<string, IStatisticsStrategy>}
      */
     private static strategies: Map<string, IStatisticsStrategy> = new Map<string, IStatisticsStrategy>([
          ['artista_più_suonato', new MostPlayedArtistStrategy()],
          ['durata_media', new AverageDurationStrategy()],
          ['tendenza_giornaliera', new DailyTrendStrategy()],
          ['ore_di_punta', new PeakHoursStrategy()],
     ]);

     static getStrategy(type: string): IStatisticsStrategy | null {
          return this.strategies.get(type) || null;
     }

     static getAllStrategies(): IStatisticsStrategy[] {
          return Array.from(this.strategies.values());
     }

     static registerStrategy(type: string, strategy: IStatisticsStrategy): void {
          this.strategies.set(type, strategy);
     }
}

export default StatisticsStrategyFactory;