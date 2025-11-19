/**
 * Repository per le statistiche
 * 
 * Questo repository implementa l'interfaccia IRepository per gestire
 * l'accesso ai dati delle statistiche nel database utilizzando Sequelize.
 * Fornisce metodi CRUD standard e metodi specifici per query sulle statistiche.
 * 
 * @module StatistiqueRepository
 * @author Lionel Djouaka
 */
import { StatisticAttributes, StatisticCreationAttributes } from '../models/Statistic';
import { IRepository } from "./IRepository";
import Statistic from "../models/Statistic";
import { Op } from 'sequelize';

/**
 * Classe repository per le statistiche
 * 
 * Implementa il pattern Repository per l'accesso ai dati delle statistiche,
 * fornendo operazioni CRUD e metodi di ricerca personalizzati per tipo e data.
 * 
 * @class StatatisticRepository
 * @implements {IRepository<Statistic>}
 */
export class StatatisticRepository implements IRepository<Statistic> {
     /**
      * Crea una nuova statistica nel database
      * 
      * @async
      * @method create
      * @param {Partial<StatisticCreationAttributes>} entita - Dati della statistica da creare
      * @returns {Promise<Statistic>} Promise che si risolve con la statistica creata
      */
     async create(entita: Partial<StatisticCreationAttributes>): Promise<Statistic> {
          return await Statistic.create(entita as StatisticCreationAttributes);
     }

     async findById(id: number): Promise<Statistic | null> {
          return await Statistic.findByPk(id);
     }

     async findAll(): Promise<Statistic[]> {
          return await Statistic.findAll();
     }

     async update(id: number, entita: Partial<StatisticAttributes>): Promise<Statistic | null> {
          const statistic = await Statistic.findByPk(id);
          if (!statistic) {
               return null;
          }
          await statistic.update(entita);
          return statistic;
     }


     async delete(id: number): Promise<boolean> {
          const deleted = await Statistic.destroy({ where: { id }});
          return deleted > 0;
     }

     //Metodi specifici per la Statistica
     async findByType(type: string): Promise<Statistic[]>{
          return await Statistic.findAll({ where: { type }});
     }

     async findByTypeAndDate(type: string, date: Date): Promise<Statistic | null> {
          return await Statistic.findOne({
               where: {
                    type, date,
               },
          });
     }

     async findByDateRange(startDate: Date, endDate: Date): Promise<Statistic[]>{
          return await Statistic.findAll({
               where: {
                    date: {
                         [Op.between]: [startDate, endDate],
                    },
               },
          });
     }

     async findLatestByType(type: string): Promise<Statistic | null> {
          return await Statistic.findOne({
               where: { type },
               order: [['date', 'DESC']],
          });
     }
}
export default StatatisticRepository;