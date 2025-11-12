import { StringDataType } from './../../node_modules/sequelize/types/data-types.d';
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from '../config/database';

export interface AttributiEventoMusicale {
     id?: number;
     idUtente: string;
     idTraccia: string;
     artista: string;
     durata: number;
     timestamp: Date;
     createdAt?: Date;
     updatedAt?: Date;
}

export interface AttributiCreazioneEventoMusicale
     extends Optional<AttributiEventoMusicale, 'id' | 'createdAt' | 'updatedAt'> { }

export class EventoMusicale 
     extends Model<AttributiEventoMusicale, AttributiCreazioneEventoMusicale>
     implements AttributiEventoMusicale
     {
          public id!: number;
          public idUtente!: string;
          public idTraccia!: string;
          public artista!: string;
          public durata!: number;
          public timestamp!: Date;
          public readonly createdAt!: Date;
          public readonly updatedAt!: Date;
     }
EventoMusicale.init (
     {
          id: {
               type: DataTypes.INTEGER,
               autoIncrement : true,
               primaryKey: true,
          },
          idUtente: {
               type : DataTypes.STRING,
               allowNull: false,
               field: 'user_id',
          },
          idTraccia: {
               type: DataTypes.STRING,
               allowNull: false,
               field: 'track_id',
          },
          artista: {
               type: DataTypes.STRING,
               allowNull: false,
               field: 'artist',
          },
          durata: {
               type: DataTypes.INTEGER,
               allowNull: false,
               field: 'duration',
               comment: 'Durata in secondi',
          },
          timestamp: {
               type: DataTypes.DATE,
               allowNull: false,
          },
     },
     {
          sequelize, 
          tableName: 'evento_musicale',
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


     