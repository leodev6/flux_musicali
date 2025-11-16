import { Subject, Observable } from 'rxjs';
import { MusicEvent, MusicEventCreationAttributes } from '../models/MusicEvent';
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

          // Debug: log des données reçues
          console.log('Données reçues:', JSON.stringify(eventData, null, 2));

          // Crea evento nel database - passer toutes les valeurs directement
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

          // Debug: log de l'objet créé
          console.log('Objet à créer dans la DB:', JSON.stringify(eventToCreate, null, 2));

          const musicEvent = await this.musicEventRepository.create(eventToCreate);
          
          // Debug: log de l'objet créé
          console.log('Événement créé:', JSON.stringify(musicEvent.toJSON(), null, 2));

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