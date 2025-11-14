import { IRepository } from './IRepository';
import EventoMusicale, { MusicEvent, MusicEventAttributes, MusicEventCreationAttributes } from '../models/MusicEvent';
import { Op } from 'sequelize';



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
     
     async findByDateRange(starDate: Date, endDate: Date): Promise<MusicEvent[]> {
          return await MusicEvent.findAll({
               where: {
                    timestamp: {
                         [Op.between] : [starDate, endDate],
                    }
               }
          })
     }

     async findByDate(date: Date): Promise<MusicEvent[]> {
          const starOfDay = new Date(date);
          starOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);

          return await this.findByDateRange(starOfDay, endOfDay);
     }

}

export default MusicEventRepository;