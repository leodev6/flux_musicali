import { IStatisticsStrategy, StatisticsResult } from "./IStatistiqueStrategy";
import MusicEvent from "../models/MusicEvent";


export interface DailyTrendData {
    date: string;
    eventCount: number;
    totalDuration: number;
    uniqueArtists: number;
    uniqueUsers: number;
}

export class DailyTrendStrategy implements IStatisticsStrategy {

    getType(): string {
        return 'tendenza_giornaliera';
    }

    async calculate(events: MusicEvent[]): Promise<StatisticsResult> {
        if (events.length === 0) {
            return {
                type: this.getType(),
                value: [],
                metadata: { message: 'Nessun evento disponibile' },
            };
        }

        interface DailyDataInternal {
            date: string;
            eventCount: number;
            totalDuration: number;
            uniqueArtists: Set<string>;
            uniqueUsers: Set<string>;
        }

        const dailyData = new Map<string, DailyDataInternal>();

        events.forEach((event) => {
            const dateKey = new Date(event.timestamp).toISOString().split('T')[0];

            if (!dailyData.has(dateKey)) {
                dailyData.set(dateKey, {
                    date: dateKey,
                    eventCount: 0,
                    totalDuration: 0,
                    uniqueArtists: new Set<string>(),
                    uniqueUsers: new Set<string>(),
                });
            }

            const dayData = dailyData.get(dateKey)!;
            dayData.eventCount++;
            dayData.totalDuration += event.duration;
            dayData.uniqueArtists.add(event.artist);
            dayData.uniqueUsers.add(event.userId);
        });

        const trends: DailyTrendData[] = Array.from(dailyData.values()).map((data) => ({
            date: data.date,
            eventCount: data.eventCount,
            totalDuration: data.totalDuration,
            uniqueArtists: data.uniqueArtists.size,
            uniqueUsers: data.uniqueUsers.size,
        }));

        trends.sort((a, b) => a.date.localeCompare(b.date));
        // Calcola statistiche per genre, device, country (se disponibili)
        const genreStats = this.calculateOptionalFieldStats(events, 'genre');
        const deviceStats = this.calculateOptionalFieldStats(events, 'device');
        const countryStats = this.calculateOptionalFieldStats(events, 'country');

        return {
            type: this.getType(),
            value: trends,
            metadata: {
                totalDays: trends.length,
                dateRange: {
                    start: trends[0]?.date,
                    end: trends[trends.length - 1]?.date,
                    ...(genreStats && { genre: genreStats }),
                    ...(deviceStats && { device: deviceStats }),
                    ...(countryStats && { country: countryStats }),
                },
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

export default DailyTrendStrategy;