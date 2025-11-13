import MusicEvent from '../models/MusicEvent';

export interface IObserver {
     update(event: MusicEvent): Promise<void>;
     getName(): string;
}