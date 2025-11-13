import { Subject, Observable } from 'rxjs';
import { RepositoryEventoMusicale } from '../repositories/RepositoryEventoMusicali';
import { EventoMusicale } from '../models/EventoMusicale';
import { SoggettoEvento } from '../observers/SoggettoEvento';



export interface InputEventoMusicale {
     userId: string,
     trackId: string,
     artist: string,
     duration: number,
     timestamp: string,
}

export class ServiziElaborazioneEventi {
     private repositoryEventoMusicale: RepositoryEventoMusicale;
     private soggettoEvento: SoggettoEvento;
     private flussoEventi$: Subject<EventoMusicale>;

     constructor (
          repositoryEventoMusicale: RepositoryEventoMusicale,
          soggettoEvento: SoggettoEvento
     ){
          this.repositoryEventoMusicale = repositoryEventoMusicale;
          this.soggettoEvento = soggettoEvento;
          this.flussoEventi$ = new Subject<EventoMusicale>;
     }

     ottieniFlussoEvento(): Observable<EventoMusicale> {

          //valide un evento
          return this.flussoEventi$.asObservable();
     }

     async elaboraEvento(datiEvento: InputEventoMusicale): Promise<EventoMusicale> {
          this.validaDatiEvento(datiEvento);

          //Crea un evento ne database
          const eventoMusicale = await this.repositoryEventoMusicale.create({
               idUtente: datiEvento.userId,
               idTraccia: datiEvento.trackId,
               artista: datiEvento.artist,
               durata: datiEvento.duration,
               timestamp: new Date(datiEvento.timestamp),
          });

          //Emetti nello stream RxJS
          this.flussoEventi$.next(eventoMusicale);

          //Notifica osservatori
          await this.soggettoEvento.notifica(eventoMusicale);
          return eventoMusicale;
     }

     private validaDatiEvento(datiEvento: InputEventoMusicale): void {

     }
}