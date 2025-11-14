import { StatisticAttributes, StatisticCreationAttributes } from './../models/Statistic';
import { IRepository } from "./IRepository";
import Statistic from "../models/Statistic";

export class StatatisticRepository implements IRepository<Statistic> {
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

}
export default StatatisticRepository;