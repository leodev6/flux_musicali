import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface StatisticAttributes {
     id?: number;
     type: string;
     value: string;
     metadata?: Record<string, any>;
     date: Date;
     createdAt?: Date;
     updatedAt?: Date;
}

export interface StatisticCreationAttributes
     extends Optional<StatisticAttributes, 'id' | 'createdAt' | 'updatedAt' | 'metadata'> { }

export class Statistic
     extends Model<StatisticAttributes, StatisticCreationAttributes>
     implements StatisticAttributes {
     public id!: number;
     public type!: string;
     public value!: string;
     public metadata!: Record<string, any>;
     public date!: Date;
     public readonly createdAt!: Date;
     public readonly updatedAt!: Date;
}

Statistic.init(
     {
          id: {
               type: DataTypes.INTEGER,
               autoIncrement: true,
               primaryKey: true,
          },
          type: {
               type: DataTypes.STRING,
               allowNull: false,
               comment: 'Type of statistic: most_played_artist, avg_duration, daily_trend',
          },
          value: {
               type: DataTypes.TEXT,
               allowNull: false,
          },
          metadata: {
               type: DataTypes.JSONB,
               allowNull: true,
          },
          date: {
               type: DataTypes.DATEONLY,
               allowNull: false,
          },
     },
     {
          sequelize,
          tableName: 'statistics',
          timestamps: true,
          indexes: [
               {
                    fields: ['type', 'date'],
               },
          ],
     }
);

export default Statistic;