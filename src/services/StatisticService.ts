import { MusicEventRepository } from './../repositories/MusicEventRepository';
import MusicEvent from '../models/MusicEvent';
import { StatisticsResult} from '../strategies/IStatistiqueStrategy';
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

          //Se gli eventi non vengono forniti, ottieni tutti gli eventi
          const eventsToProcess = events || (await this.musicEventRepository.findAll());
          return await strategy.calculate(eventsToProcess);
     }

     async getMostPlayedArtist(events?: MusicEvent[]): Promise<StatisticsResult | null>{
          return await this.calculeteStatistics('artista_più_suonato', events);
     }
}