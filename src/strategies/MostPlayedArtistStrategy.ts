import { IStatisticsStrategy, StatisticsResult } from "./IStatistiqueStrategy";
import MusicEvent from "../models/MusicEvent";

export class MostPlayedArtistStrategy implements IStatisticsStrategy {

    getType(): string {
        return 'artista_più_suonato';
    }

    calculate(events: MusicEvent[]): Promise<StatisticsResult> {
        if (events.length === 0) {
            return Promise.resolve({
                type: this.getType(),
                value: null,
                metedata: { message: 'Nessun evento disonibile' },
            });
        }
        const artistCounts = new Map<string, number>();

        events.forEach((event) => {
            const count = artistCounts.get(event.artist) || 0;
            artistCounts.set(event.artist, count + 1);
        });

        let mostPlayedArtist = '';
        let maxCount = 0;

        artistCounts.forEach((count, artist) => {
            if (count > maxCount) {
                maxCount = count;
                mostPlayedArtist = artist;
            }
        });

        

        // Calcola statistiche per genre, device, country (se disponibili)
        const genreStats = this.calculateOptionalFieldStats(events, 'genre');
        const deviceStats = this.calculateOptionalFieldStats(events, 'device');
        const countryStats = this.calculateOptionalFieldStats(events, 'country');

        return Promise.resolve({
            type: this.getType(),
            value: mostPlayedArtist,
            metadata: {
                maxCount,
                totalEvents: events.length,
                percentage: ((maxCount / events.length) * 100).toFixed(2),
                ...(genreStats && { genre: genreStats }),
                ...(deviceStats && { device: deviceStats }),
                ...(countryStats && { country: countryStats }),
            },
        });
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

export default MostPlayedArtistStrategy;