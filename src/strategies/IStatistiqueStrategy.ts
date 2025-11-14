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