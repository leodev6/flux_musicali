import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface MusicEventAttributes {
     id?: number;
     userId: string;
     trackId: string;
     artist: string;
     duration: number;
     timestamp: Date;
     createdAt?: Date;
     updatedAt?: Date;
}

export interface MusicEventCreationAttributes
     extends Optional<MusicEventAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

export class MusicEvent
     extends Model<MusicEventAttributes, MusicEventCreationAttributes>
     implements MusicEventAttributes {
     public id!: number;
     public userId!: string;
     public trackId!: string;
     public artist!: string;
     public duration!: number;
     public timestamp!: Date;
     public readonly createdAt!: Date;
     public readonly updatedAt!: Date;
}

MusicEvent.init(
     {
          id: {
               type: DataTypes.INTEGER,
               autoIncrement: true,
               primaryKey: true,
          },
          userId: {
               type: DataTypes.STRING,
               allowNull: false,
               field: 'user_id',
          },
          trackId: {
               type: DataTypes.STRING,
               allowNull: false,
               field: 'track_id',
          },
          artist: {
               type: DataTypes.STRING,
               allowNull: false,
          },
          duration: {
               type: DataTypes.INTEGER,
               allowNull: false,
               comment: 'Duration in seconds',
          },
          timestamp: {
               type: DataTypes.DATE,
               allowNull: false,
          },
     },
     {
          sequelize,
          tableName: 'music_events',
          timestamps: true,
          indexes: [
               {
                    fields: ['user_id'],
               },
               {
                    fields: ['artist'],
               },
               {
                    fields: ['timestamp'],
               },
          ],
     }
);

export default MusicEvent;

