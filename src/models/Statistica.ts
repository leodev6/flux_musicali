import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface AttributiArtistica {
     id?: number,
     tipo: string,
     valore: string,
     metadati?: Record<string, any>;
     data: Date,
     createdAt?: Date,
     updatedAt?: Date,
}

export interface AttributiCreazioneStatistica
     extends Optional<AttributiArtistica, 'id' | 'createdAt' | 'metadati'> { }

export class Statistica
     extends Model<AttributiArtistica, AttributiCreazioneStatistica> {
     public id!: number;
     public tipo!: string;
     public valore!: string;
     public metadati!: Record<string, any>;
     public data!: Date;
     public readonly createdAt!: Date;
     public readonly updatedAt!: Date;
}

Statistica.init(
     {
          id: {
               type: DataTypes.INTEGER,
               autoIncrement: true,
               primaryKey: true,
          },
          tipo: {
               type: DataTypes.STRING,
               allowNull: false,
               field: 'type',
               comment: 'Tipo di statistica: artista_piu_ascoltato, durata_media, trend_giornaliero',
          },
          valore: {
               type: DataTypes.TEXT,
               allowNull: false,
               field: 'value',
          },
          metadati: {
               type: DataTypes.JSONB,
               allowNull: true,
               field: 'metadati',
          },
          data: {
               type: DataTypes.DATEONLY,
               allowNull: false,
               field: 'type',
          },
     },
     {
          sequelize,
          tableName: 'statistica',
          timestamps: true,
          indexes: [
               {
                    fields: ['type', 'data'],
               }
          ],
     }
);

export default Statistica;