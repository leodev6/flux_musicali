import { IObserver } from './IObserver';
import { MusicEvent } from '../models/MusicEvent';

export class EventSubject {
     private observers: IObserver[] = [];

     attach(observer: IObserver): void {
          const exists = this.observers.some((obs) => obs.getName() === observer.getName());
          if (!exists) {
               this.observers.push(observer);
          }
     }

     detach(observer: IObserver): void {
          this.observers = this.observers.filter((obs) => obs.getName() !== observer.getName());
     }

     async notify(event: MusicEvent): Promise<void> {
          const promises = this.observers.map((observer) => observer.update(event));
          await Promise.allSettled(promises);
     }

     getObserversCount(): number {
          return this.observers.length;
     }
}

export default EventSubject;