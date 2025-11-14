import { IStatisticsStrategy, StatisticsResult } from "./IStatistiqueStrategy";
import MusicEvent from "../models/MusicEvent";

export class MostPlayedArtistStrategy implements IStatisticsStrategy {
    
     getType(): string {
         return 'artista_più_suonato'; 
     } 
     
      calculate(events: MusicEvent[]): Promise<StatisticsResult> {
          throw new Error("Method not implemented.");
     }
}

export default MostPlayedArtistStrategy;