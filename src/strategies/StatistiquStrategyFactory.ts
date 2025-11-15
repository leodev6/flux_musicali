import { IStatisticsStrategy } from './IStatistiqueStrategy';
import MostPlayedArtistStrategy from './MostPlayedArtistStrategy';
import AverageDurationStrategy from './AverageDurationStrategy';
import DailyTrendStrategy from './DailyTrendStrategy';
import PeakHoursStrategy from './PeakHoursStrategy';

export class StatisticsStrategyFactory {
     private static strategies: Map<string, IStatisticsStrategy> = new Map<string, IStatisticsStrategy>([
          ['most_played_artist', new MostPlayedArtistStrategy()],
          ['avg_duration', new AverageDurationStrategy()],
          ['daily_trend', new DailyTrendStrategy()],
          ['peak_hours', new PeakHoursStrategy()],
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