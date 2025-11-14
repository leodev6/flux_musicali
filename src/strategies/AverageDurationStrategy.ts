import { IStatisticsStrategy, StatisticsResult } from "./IStatistiqueStrategy";
import MusicEvent from "../models/MusicEvent";

export class AverageDurationStrategy implements IStatisticsStrategy {
    
     getType(): string {
          return 'durata_media'; 
     } 
     
      calculate(events: MusicEvent[]): Promise<StatisticsResult> {
          throw new Error("Method not implemented.");
     }
}

export default AverageDurationStrategy;

