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

          // Calcola statistiche per genre, device, country (se disponibili)
          const genreStats = this.calculateOptionalFieldStats(events, 'genre');
          const deviceStats = this.calculateOptionalFieldStats(events, 'device');
          const countryStats = this.calculateOptionalFieldStats(events, 'country');

          return {
               type: this.getType(),
               value: Math.round(averageDuration),
               metadata: {
                    totalDuration,
                    eventCount: events.length,
                    unit: 'seconds',
                    ...(genreStats && { genre: genreStats }),
                    ...(deviceStats && { device: deviceStats }),
                    ...(countryStats && { country: countryStats }),
               },
          };
     }
     private calculateOptionalFieldStats(events: MusicEvent[], field: 'genre' | 'device' | 'country'): Record<string, number> | null {
          const stats = new Map<string, number>();
          let hasValues = false;

          events.forEach((event) => {
               const value = event[field];
               if (value) {
                    hasValues = true;
                    const count = stats.get(value) || 0;
                    stats.set(value, count + 1);
               }
          });

          if (!hasValues) {
               return null;
          }

          return Object.fromEntries(stats);
     }
}

export default AverageDurationStrategy;

