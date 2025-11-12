import { IRepository } from './IRepository';
import EventoMusicale, { AttributiEventoMusicale, AttributiCreazioneEventoMusicale } from '../models/EventoMusicale';


export class RepositoryEventoMusicale implements IRepository<EventoMusicale> {
     async create(entita: Partial<AttributiCreazioneEventoMusicale>): Promise<EventoMusicale> {
          return await EventoMusicale.create(entita as AttributiCreazioneEventoMusicale);
     }

     async findById(id: number): Promise<EventoMusicale | null> {
          return await EventoMusicale.findById(id);
     }


     findAll(): Promise<EventoMusicale[]> {
          throw new Error("Method not implemented.");
     }
     update(id: number, entita: EventoMusicale): Promise<any> {
          throw new Error("Method not implemented.");
     }
     delete(id: number): Promise<boolean> {
          throw new Error("Method not implemented.");
     }

}
export default RepositoryEventoMusicale;