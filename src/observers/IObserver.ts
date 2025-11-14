import MusicEvent from '../models/MusicEvent';

export interface IObserver {
     getName(): string;
     update(event: MusicEvent): Promise<void>;
}