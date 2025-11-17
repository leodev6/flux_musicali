import { Subject, Observable } from 'rxjs';
import { MusicEvent, MusicEventCreationAttributes } from '../models/MusicEvent';
import MusicEventRepository from '../repositories/MusicEventRepository';
import EventSubject from '../observers/EventSubject';



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

          console.log('Dati ricevuti:', JSON.stringify(eventData, null, 2));

          // Crea evento nel database
          const eventToCreate: MusicEventCreationAttributes = {
               userId: eventData.userId,
               trackId: eventData.trackId,
               artist: eventData.artist,
               duration: eventData.duration,
               timestamp: new Date(eventData.timestamp),
               genre: eventData.genre,
               country: eventData.country,
               device: eventData.device,
          };

          console.log('Objet creato nel DB:', JSON.stringify(eventToCreate, null, 2));

          const musicEvent = await this.musicEventRepository.create(eventToCreate);
          
          const serializedEvent =
               typeof (musicEvent as any)?.toJSON === 'function'
                    ? (musicEvent as any).toJSON()
                    : musicEvent;
          console.log('Evento creato:', JSON.stringify(serializedEvent, null, 2));

          // Emetti nel flusso RxJS
          this.eventStream$.next(musicEvent);

          // Informare gli osservatori
          await this.eventSubject.notify(musicEvent);

          return musicEvent;
     }

     async elaboraEventoBatch(events: MusicEventInput[]): Promise<MusicEvent[]> {
          const processedEvents: MusicEvent[] = [];

          for (const eventData of events) {
               try {
                    const event = await this.processEvent(eventData);
                    processedEvents.push(event);
               } catch (error) {
                    console.error('Errore nell\'elaborazione dell\'evento:', error);
                    // Continua a elaborare gli altri eventi anche se uno fallisce
               }
          }

          return processedEvents;
     }

     async getAllEvents(): Promise<MusicEvent[]> {
          return await this.musicEventRepository.findAll();
     }


     async getEventById(id: number): Promise<MusicEvent | null> {
          return await this.musicEventRepository.findById(id);
     }

     async getEventsByArtist(artist: string): Promise<MusicEvent[]> {
          return await this.musicEventRepository.findByArtist(artist);
     }


     private validateEventData(eventData: MusicEventInput): void {
          if (!eventData.userId || !eventData.trackId || !eventData.artist) {
               throw new Error('Campi obbligatori mancanti: userId, trackId, artist');
          }

          if (typeof eventData.duration !== 'number' || eventData.duration <= 0) {
               throw new Error('La durata deve essere un numero positivo superiore a zero');
          }

          if (!eventData.timestamp || isNaN(Date.parse(eventData.timestamp))) {
               throw new Error('Formato timestamp non valido');
          }
     }
}

export default EventProcessingService;