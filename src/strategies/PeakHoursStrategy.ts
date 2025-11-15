import { IStatisticsStrategy, StatisticsResult } from './IStatistiqueStrategy';
import { MusicEvent } from '../models/MusicEvent';

export interface PeakHourData {
     hour: number;
     eventCount: number;
     totalDuration: number;
     averageDuration: number;
     uniqueUsers: number;
     uniqueArtists: number;
}

export class PeakHoursStrategy implements IStatisticsStrategy {
     getType(): string {
          return 'peak_hours';
     }

     async calculate(events: MusicEvent[]): Promise<StatisticsResult> {
          if (events.length === 0) {
               return {
                    type: this.getType(),
                    value: [],
                    metadata: { message: 'Nessun evento disponibile' },
               };
          }

          interface HourDataInternal {
               hour: number;
               eventCount: number;
               totalDuration: number;
               uniqueUsers: Set<string>;
               uniqueArtists: Set<string>;
          }

          const hourData = new Map<number, HourDataInternal>();

          // Inizializza tutte le ore (0-23)
          for (let hour = 0; hour < 24; hour++) {
               hourData.set(hour, {
                    hour,
                    eventCount: 0,
                    totalDuration: 0,
                    uniqueUsers: new Set<string>(),
                    uniqueArtists: new Set<string>(),
               });
          }

          // Processa gli eventi
          events.forEach((event) => {
               const eventDate = new Date(event.timestamp);
               const hour = eventDate.getHours();
               const hourInfo = hourData.get(hour);

               if (hourInfo) {
                    hourInfo.eventCount++;
                    hourInfo.totalDuration += event.duration;
                    hourInfo.uniqueUsers.add(event.userId);
                    hourInfo.uniqueArtists.add(event.artist);
               }
          });

          // Converti in formato di output
          const peakHours: PeakHourData[] = Array.from(hourData.values())
               .map((data) => ({
                    hour: data.hour,
                    eventCount: data.eventCount,
                    totalDuration: data.totalDuration,
                    averageDuration:
                         data.eventCount > 0 ? Math.round(data.totalDuration / data.eventCount) : 0,
                    uniqueUsers: data.uniqueUsers.size,
                    uniqueArtists: data.uniqueArtists.size,
               }))
               .sort((a, b) => b.eventCount - a.eventCount); // Ordina per numero di eventi (decrescente)

          // Identifica le ore di punta (top 3)
          const topPeakHours = peakHours.slice(0, 3);
          // Calcola statistiche per genre, device, country (se disponibili)
          const genreStats = this.calculateOptionalFieldStats(events, 'genre');
          const deviceStats = this.calculateOptionalFieldStats(events, 'device');
          const countryStats = this.calculateOptionalFieldStats(events, 'country');

          return {
               type: this.getType(),
               value: {
                    allHours: peakHours.sort((a, b) => a.hour - b.hour), // Ordina per ora per la visualizzazione completa
                    peakHours: topPeakHours,
               },
               metadata: {
                    totalEvents: events.length,
                    peakHour: topPeakHours[0]?.hour,
                    peakHourEventCount: topPeakHours[0]?.eventCount || 0,
                    analysisDate: new Date().toISOString(),
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

export default PeakHoursStrategy;

