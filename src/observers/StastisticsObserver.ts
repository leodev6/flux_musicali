import { IObserver } from "./IObserver";
import MusicEvent from "../models/MusicEvent";
import { StatisticService } from "../services/StatisticService";
import StatatisticRepository from "../repositories/StatistiqueRepository";

export class StatisticsObserver implements IObserver {
     private statisticService: StatisticService;
     private statatisticRepository: StatatisticRepository;

     constructor(statisticService: StatisticService, statatisticRepository: StatatisticRepository) {
          this.statisticService = statisticService;
          this.statatisticRepository = statatisticRepository;
     }

     getName(): string {
          return 'StatisticsObserver';
     }

     update(event: MusicEvent): Promise<void> {
          throw new Error("Method not implemented.");
     }
     
}
export default StatisticsObserver;