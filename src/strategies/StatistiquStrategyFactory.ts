import { IStatisticsStrategy } from './IStatistiqueStrategy';
import MostPlayedArtistStrategy from './MostPlayedArtistStrategy';
import AverageDurationStrategy from './AverageDurationStrategy';
import DailyTrendStrategy from './DailyTrendStrategy';

export class StatisticsStrategyFactory {
     private static strategies: Map<string, IStatisticsStrategy> = new Map([
          ['artista_più_suonato', new MostPlayedArtistStrategy()],
          ['durata_media', new AverageDurationStrategy()],
          ['tendenza_giornaliera', new DailyTrendStrategy()],
     ]);

     static getStrategy(type: string): IStatisticsStrategy | null {
          return this.strategies.get(type) || null;
     }

     static getAllStrategies(): IStatisticsStrategy[]{
          return Array.from(this.strategies.values());
     }

     static registerStrategy(type: string, strategy: IStatisticsStrategy): void {
          this.strategies.set(type, strategy);
     }
}

export default StatisticsStrategyFactory;