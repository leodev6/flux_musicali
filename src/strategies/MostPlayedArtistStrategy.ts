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

        return Promise.resolve({
            type: this.getType(),
            value: mostPlayedArtist,
            metadata: {
                maxCount,
                totalEvents: events.length,
                percentage: ((maxCount / events.length) * 100).toFixed(2),
            },
        });
    }
}

export default MostPlayedArtistStrategy;