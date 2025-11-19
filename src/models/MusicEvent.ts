/**
 * Modello Sequelize per gli eventi musicali
 * 
 * Questo modello rappresenta un evento musicale nel database, contenente informazioni
 * su un brano ascoltato da un utente, inclusi dettagli come artista, genere, paese,
 * dispositivo utilizzato e durata dell'ascolto.
 * 
 * @module MusicEvent
 * @author Lionel Djouaka
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

/**
 * Interfaccia che definisce gli attributi di un evento musicale
 * 
 * @interface MusicEventAttributes
 * @property {number} [id] - Identificatore univoco dell'evento (auto-generato)
 * @property {string} userId - Identificatore dell'utente che ha ascoltato il brano
 * @property {string} trackId - Identificatore univoco del brano musicale
 * @property {string} artist - Nome dell'artista del brano
 * @property {string} [genre] - Genere musicale del brano (opzionale)
 * @property {string} [country] - Codice paese dell'utente (opzionale)
 * @property {string} [device] - Tipo di dispositivo utilizzato (mobile, desktop, tablet, ecc.) (opzionale)
 * @property {number} duration - Durata dell'ascolto in secondi
 * @property {Date} timestamp - Data e ora dell'evento di ascolto
 * @property {Date} [createdAt] - Data di creazione del record (auto-generato)
 * @property {Date} [updatedAt] - Data di ultima modifica del record (auto-generato)
 */
export interface MusicEventAttributes {
     id?: number;
     userId: string;
     trackId: string;
     artist: string;
     genre?: string;
     country?: string;
     device?: string;
     duration: number;
     timestamp: Date;
     createdAt?: Date;
     updatedAt?: Date;
}

/**
 * Interfaccia per la creazione di un nuovo evento musicale
 * 
 * Estende MusicEventAttributes rendendo opzionali i campi id, createdAt e updatedAt
 * che vengono gestiti automaticamente dal database.
 * 
 * @interface MusicEventCreationAttributes
 */
export interface MusicEventCreationAttributes
     extends Optional<MusicEventAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

export class MusicEvent
     extends Model<MusicEventAttributes, MusicEventCreationAttributes>
     implements MusicEventAttributes {
     public id!: number;
     public userId!: string;
     public trackId!: string;
     public artist!: string;
     public genre?: string;
     public country?: string;
     public device?: string;
     public duration!: number;
     public timestamp!: Date;
     public readonly createdAt!: Date;
     public readonly updatedAt!: Date;
}

/**
 * Inizializzazione del modello MusicEvent nel database
 * 
 * Configura la struttura della tabella 'music_events' con tutti i campi,
 * i vincoli e gli indici necessari per ottimizzare le query.
 * 
 * Indici creati per migliorare le performance delle query:
 * - user_id: per ricerche rapide per utente
 * - artist: per ricerche rapide per artista
 * - genre: per filtri per genere musicale
 * - country: per analisi geografiche
 * - device: per analisi per dispositivo
 * - timestamp: per query temporali e ordinamenti
 */
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
          genre: {
               type: DataTypes.STRING,
               allowNull: true,
               comment: 'Musical genre',
          },
          country: {
               type: DataTypes.STRING,
               allowNull: true,
               comment: 'Country code',
          },
          device: {
               type: DataTypes.STRING,
               allowNull: true,
               comment: 'Device type (mobile, desktop, tablet, etc.)',
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
                    fields: ['genre'],
               },
               {
                    fields: ['country'],
               },
               {
                    fields: ['device'],
               },
               {
                    fields: ['timestamp'],
               },
          ],
     }
);

console.log('Modello MusicEvent inizializzato');
export default MusicEvent;

