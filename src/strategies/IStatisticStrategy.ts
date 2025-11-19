/**
 * Interfaccia per le strategie di calcolo delle statistiche
 * 
 * Definisce il contratto che tutte le strategie di calcolo delle statistiche
 * devono implementare, seguendo il pattern Strategy.
 * 
 * @module IStatistiqueStrategy
 * @author Lionel Djouaka
 */
import MusicEvent from "../models/MusicEvent";

export interface StatisticsResult {
     type: string;
     value: any;
     metadata?: Record<string, any>;
}

export interface IStatisticsStrategy {
     calculate(events: MusicEvent[]): Promise<StatisticsResult>;
     getType(): string;
}