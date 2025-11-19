/**
 * Repository per gli eventi musicali
 * 
 * Questo repository implementa l'interfaccia IRepository per gestire
 * l'accesso ai dati degli eventi musicali nel database utilizzando Sequelize.
 * Fornisce metodi CRUD standard e metodi specifici per query personalizzate.
 * 
 * @module MusicEventRepository
 * @author Lionel Djouaka
 */
import { IRepository } from './IRepository';
import MusicEvent, { MusicEventAttributes, MusicEventCreationAttributes } from '../models/MusicEvent';
import { Op } from 'sequelize';


/**
 * Classe repository per gli eventi musicali
 * 
 * Implementa il pattern Repository per l'accesso ai dati degli eventi musicali,
 * fornendo operazioni CRUD e metodi di ricerca personalizzati.
 * 
 * @class MusicEventRepository
 * @implements {IRepository<MusicEvent>}
 */
export class MusicEventRepository implements IRepository<MusicEvent> {
     /**
      * Crea un nuovo evento musicale nel database
      * 
      * Sequelize include automaticamente tutte le proprietà definite nell'oggetto.
      * 
      * @async
      * @method create
      * @param {Partial<MusicEventCreationAttributes>} entita - Dati dell'evento da creare
      * @returns {Promise<MusicEvent>} Promise che si risolve con l'evento creato
      */
     async create(entita: Partial<MusicEventCreationAttributes>): Promise<MusicEvent> {
          return await MusicEvent.create(entita as MusicEventCreationAttributes);
     }

     async findById(id: number): Promise<MusicEvent | null> {
          return await MusicEvent.findByPk(id);
     }


     async findAll(): Promise<MusicEvent[]> {
          return await MusicEvent.findAll();
     }

     async update(id: number, entita: Partial <MusicEventAttributes>): Promise<MusicEvent | null> {
          const musicEvent = await MusicEvent.findByPk(id);
          if (!musicEvent) {
               return null;
          }
          await musicEvent.update(entita);
          return musicEvent;
     }

     async delete(id: number): Promise<boolean> {
          const deleted = await MusicEvent.destroy({where: {id}});
          return deleted > 0;
     }

     async findByUserId(userId: string): Promise<MusicEvent[]> {
          return await MusicEvent.findAll({ where: { userId }});
     }

     async findByArtist(artist: string): Promise<MusicEvent[]> {
          return await MusicEvent.findAll({ where: { artist }})
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

     async findByGenre(genre: string): Promise<MusicEvent[]> {
          return await MusicEvent.findAll({ where: { genre } });
     }

     async findByCountry(country: string): Promise<MusicEvent[]> {
          return await MusicEvent.findAll({ where: { country } });
     }

     async findByDevice(device: string): Promise<MusicEvent[]> {
          return await MusicEvent.findAll({ where: { device } });
     }

}

export default MusicEventRepository;