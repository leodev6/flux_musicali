/**
 * File di esportazione centralizzato per le strategie
 * 
 * Questo modulo esporta tutte le strategie di calcolo delle statistiche
 * e le interfacce correlate per facilitare l'importazione in altri moduli.
 * 
 * @module strategies
 * @author Lionel Djouaka
 */
export { IStatisticsStrategy, StatisticsResult } from './IStatisticStrategy';
export { AverageDurationStrategy } from './AverageDurationStrategy';
export { DailyTrendStrategy } from './DailyTrendStrategy';
export { MostPlayedArtistStrategy } from './MostPlayedArtistStrategy';
export { StatisticsStrategyFactory } from './StatisticsStrategyFactory';
export { PeakHoursStrategy } from './PeakHoursStrategy';

