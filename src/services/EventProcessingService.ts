import { Subject, Observable } from 'rxjs';
import { MusicEvent } from '../models/MusicEvent';
import MusicEventRepository from '../repositories/MusicEventRepository';
import EventSubject from '../observers/EventSubject';
import { timeStamp } from 'console';



export interface MusicEventInput {
     userId: string,
     trackId: string,
     artist: string,
     duration: number,
     genre?: string;
     country?: string;
     device?: string;
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
          //Convalida i dati degli eventi
          this.validateEventData(eventData);

          // Crea evento nel database
          const musicEvent = await this.musicEventRepository.create({
               userId: eventData.userId,
               trackId: eventData.trackId,
               artist: eventData.artist,
               duration: eventData.duration,
               genre: eventData.genre,
               country: eventData.country,
               device: eventData.device,
               timestamp: new Date(eventData.timestamp),
          });

          // Emetti nel flusso RxJS
          this.eventStream$.next(musicEvent);

          // Informare gli osservatori
          await this.eventSubject.notify(musicEvent);

          return musicEvent;
     }

     async elaboraEvento(events: MusicEventInput[]): Promise<MusicEvent[]> {
          const processedEvents: MusicEvent[] = [];

          for (const eventData of events) {
               try {
                    const event = await this.processEvent(eventData);
                    processedEvents.push(event);
               } catch (error) {
                    console.error('Errore nell\'elaborazione dell\'evento:', error);
                    // Continua a elaborare altri eventi
               }
          }

          return processedEvents;
     }


     private validateEventData(eventData: MusicEventInput): void {
          if (!eventData.userId || !eventData.trackId || !eventData.artist) {
               throw new Error('Campi obligatori mancanti: userId, trackId, artist');
          }

          if (typeof eventData.duration !== 'number' || eventData.duration <= 0) {
               throw new Error('La durata deve essere un possitivo superiore a zero');
          }

          if (!eventData.timestamp || isNaN(Date.parse(eventData.timestamp))) {
               throw new Error('Formato timetemp non valido');
          }
     }
}

export default EventProcessingService;