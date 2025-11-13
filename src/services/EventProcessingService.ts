import { Subject, Observable } from 'rxjs';
import { MusicEvent } from '../models/MusicEvent';
import MusicEventRepository from '../repositories/MusicEventRepository';
import EventSubject from '../observers/EventSubject';



export interface MusicEventInput {
     userId: string,
     trackId: string,
     artist: string,
     duration: number,
     timestamp: string,
}

export class EventProcessingService {
     private musicEventRepository: MusicEventRepository;
     private eventSubject: EventSubject;
     private eventStream$: Subject<MusicEvent>;

     constructor(
          musicEventRepository: MusicEventRepository,
          eventSubject: EventSubject
     ) {
          this.musicEventRepository = musicEventRepository;
          this.eventSubject = eventSubject;
          this.eventStream$ = new Subject<MusicEvent>();
     }

     getEventStream(): Observable<MusicEvent> {
          return this.eventStream$.asObservable();
     }

     async processEvent(eventData: MusicEventInput): Promise<MusicEvent> {
          // Validate event data
          this.validateEventData(eventData);

          // Create event in database
          const musicEvent = await this.musicEventRepository.create({
               userId: eventData.userId,
               trackId: eventData.trackId,
               artist: eventData.artist,
               duration: eventData.duration,
               timestamp: new Date(eventData.timestamp),
          });

          // Emit to RxJS stream
          this.eventStream$.next(musicEvent);

          // Notify observers
          await this.eventSubject.notify(musicEvent);

          return musicEvent;
     }


     private validateEventData(datiEvento: MusicEventInput): void {

     }
}

export default EventProcessingService;