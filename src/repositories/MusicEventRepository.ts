import { IRepository } from './IRepository';
import EventoMusicale, { MusicEventAttributes, MusicEventCreationAttributes } from '../models/MusicEvent';



export class MusicEventRepository implements IRepository<EventoMusicale> {
     async create(entita: Partial<MusicEventCreationAttributes>): Promise<EventoMusicale> {
          return await EventoMusicale.create(entita as MusicEventCreationAttributes);
     }

     async findById(id: number): Promise<EventoMusicale | null> {
          return await EventoMusicale.findByPk(id);
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

export default MusicEventRepository;