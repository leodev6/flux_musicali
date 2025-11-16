import { MusicEventRepository } from './../repositories/MusicEventRepository';
import MusicEvent from '../models/MusicEvent';
import { StatisticsResult } from '../strategies/IStatistiqueStrategy';
import { StatisticsStrategyFactory } from '../strategies/StatistiquStrategyFactory';



export class StatisticService {
     private musicEventRepository: MusicEventRepository;

     constructor(musicEventRepository: MusicEventRepository) {
          this.musicEventRepository = musicEventRepository;
     }

     getMusicEventRepository(): MusicEventRepository {
          return this.musicEventRepository;
     }

     async calculeteStatistics(
          type: string,
          events?: MusicEvent[],
     ): Promise<StatisticsResult | null> {
          const strategy = StatisticsStrategyFactory.getStrategy(type);
          if (!strategy) {
               return null;
          }

          //Se gli eventi non vengono forniti, ottiene tutti gli eventi dal repository
          const eventsToProcess = events || (await this.musicEventRepository.findAll());
          return await strategy.calculate(eventsToProcess);
     }

     async getMostPlayedArtist(events?: MusicEvent[]): Promise<StatisticsResult | null> {
          return await this.calculeteStatistics('artista_più_suonato', events);
     }

     async getAverageDuration(events?: MusicEvent[]): Promise<StatisticsResult | null> {
          return await this.calculeteStatistics('durata_media', events);
     }

     async getDailyTrends(events?: MusicEvent[]): Promise<StatisticsResult | null> {
          return await this.calculeteStatistics('tendenza_giornaliera', events);
     }

     async getPeakHours(events?: MusicEvent[]): Promise<StatisticsResult | null> {
          return await this.calculeteStatistics('ore_di_punta', events);
     }

     async getStatisticsByDate(date: Date): Promise<{
          mostPlayedArtist: StatisticsResult | null;
          averageDuration: StatisticsResult | null;
          dailyTrend: StatisticsResult | null;
          peakHours: StatisticsResult | null;
     }> {
          const dayEvents = await this.musicEventRepository.findByDate(date);

          return {
               mostPlayedArtist: await this.getMostPlayedArtist(dayEvents),
               averageDuration: await this.getAverageDuration(dayEvents),
               dailyTrend: await this.getDailyTrends(dayEvents),
               peakHours: await this.getPeakHours(dayEvents),
          };
     }
}