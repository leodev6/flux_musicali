import { IStatisticsStrategy, StatisticsResult } from "./IStatistiqueStrategy";
import MusicEvent from "../models/MusicEvent";

export class AverageDurationStrategy implements IStatisticsStrategy {
    
     getType(): string {
          return 'durata_media'; 
     } 
     
     async calculate(events: MusicEvent[]): Promise<StatisticsResult> {
          if (events.length === 0) {
               return {
                    type: this.getType(),
                    value: 0,
                    metadata: { message: 'Nessun evento disponibile'},
               };
          }

          const totalDuration = events.reduce((sum, event) => sum + event.duration , 0);
          const averageDuration = totalDuration / events.length;

          return {
               type: this.getType(),
               value: Math.round(averageDuration),
               metadata: {
                    totalDuration,
                    eventCount: events.length,
                    unit: 'seconds',
               },
          };
     }
}

export default AverageDurationStrategy;

