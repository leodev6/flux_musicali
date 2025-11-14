import { StatisticAttributes, StatisticCreationAttributes } from './../models/Statistic';
import { IRepository } from "./IRepository";
import Statistic from "../models/Statistic";

export class StatatisticRepository implements IRepository<Statistic> {
     async create(entita: Partial<StatisticCreationAttributes>): Promise<Statistic> {
          return await Statistic.create(entita as StatisticCreationAttributes);
     }

     findById(id: number): Promise<Statistic | null> {
          throw new Error('Method not implemented.');
     }
     findAll(): Promise<Statistic[]> {
          throw new Error('Method not implemented.');
     }
     update(id: number, entita: Partial<Statistic>): Promise<Statistic | null> {
          throw new Error('Method not implemented.');
     }
     delete(id: number): Promise<boolean> {
          throw new Error('Method not implemented.');
     }

}
export default StatatisticRepository;