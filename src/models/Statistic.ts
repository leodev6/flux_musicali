/**
 * Modello Sequelize per le statistiche
 * 
 * Questo modello rappresenta una statistica calcolata e memorizzata nel database.
 * Le statistiche possono essere di diversi tipi (artista più suonato, durata media,
 * tendenza giornaliera, ore di punta) e vengono aggiornate automaticamente quando
 * vengono creati nuovi eventi musicali.
 * 
 * @module Statistic
 * @author Lionel Djouaka
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

/**
 * Interfaccia che definisce gli attributi di una statistica
 * 
 * @interface StatisticAttributes
 * @property {number} [id] - Identificatore univoco della statistica (auto-generato)
 * @property {string} type - Tipo di statistica (es: 'artista_più_suonato', 'durata_media', 'tendenza_giornaliera', 'ore_di_punta')
 * @property {string} value - Valore della statistica serializzato come JSON string
 * @property {Record<string, any>} [metadata] - Metadati aggiuntivi della statistica in formato JSON
 * @property {Date} date - Data della statistica (solo data, senza ora)
 * @property {Date} [createdAt] - Data di creazione del record (auto-generato)
 * @property {Date} [updatedAt] - Data di ultima modifica del record (auto-generato)
 */
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
               comment: 'Tipo di statistica: artista_più_suonato, durata_media, tendenza_giornaliera, ore_di_punta',
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