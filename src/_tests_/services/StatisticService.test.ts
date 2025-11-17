import { StatisticService } from '../../services/StatisticService';
import { MusicEventRepository } from '../../repositories/MusicEventRepository';
import { StatisticsStrategyFactory } from '../../strategies/StatistiquStrategyFactory';
import { MusicEvent } from '../../models/MusicEvent';
import { StatisticsResult } from '../../strategies/IStatistiqueStrategy';
// Mock della factory
jest.mock('../../strategies/StatistiquStrategyFactory');

describe('StatisticService', () => {
     let statisticService: StatisticService;
     let mockMusicEventRepository: jest.Mocked<MusicEventRepository>;
     let mockStrategy: jest.Mocked<any>;

     beforeEach(() => {
          mockMusicEventRepository = {
               findAll: jest.fn(),
               findByDate: jest.fn(),
          } as any;

          mockStrategy = {
               getType: jest.fn().mockReturnValue('test_type'),
               calculate: jest.fn(),
          };

          (StatisticsStrategyFactory.getStrategy as jest.Mock) = jest.fn().mockReturnValue(mockStrategy);

          statisticService = new StatisticService(mockMusicEventRepository);
     });

     describe('calculeteStatistics', () => {
          it('dovrebbe calcolare una statistica utilizzando la strategia corretta', async () => {
               const mockEvents: MusicEvent[] = [
                    { id: 1, userId: 'u1', trackId: 't001', artist: 'Ultimo', duration: 832, timestamp: new Date() } as MusicEvent,
               ];

               const mockResult: StatisticsResult = {
                    type: 'test_type',
                    value: 'test_value',
               };

               mockStrategy.calculate.mockResolvedValue(mockResult);
               mockMusicEventRepository.findAll.mockResolvedValue(mockEvents);

               const result = await statisticService.calculeteStatistics('test_type', mockEvents);

               expect(StatisticsStrategyFactory.getStrategy).toHaveBeenCalledWith('test_type');
               expect(mockStrategy.calculate).toHaveBeenCalledWith(mockEvents);
               expect(result).toEqual(mockResult);
          });

          it('dovrebbe recuperare tutti gli eventi se non forniti', async () => {
               const mockEvents: MusicEvent[] = [];
               const mockResult: StatisticsResult = {
                    type: 'test_type',
                    value: 'test_value',
               };

               mockMusicEventRepository.findAll.mockResolvedValue(mockEvents);
               mockStrategy.calculate.mockResolvedValue(mockResult);

               await statisticService.calculeteStatistics('test_type');

               expect(mockMusicEventRepository.findAll).toHaveBeenCalled();
               expect(mockStrategy.calculate).toHaveBeenCalledWith(mockEvents);
          });

          it('dovrebbe restituire null se la strategia non esiste', async () => {
               (StatisticsStrategyFactory.getStrategy as jest.Mock).mockReturnValue(null);

               const result = await statisticService.calculeteStatistics('tipo_non_valido');

               expect(result).toBeNull();
          });
     });

     describe('getMostPlayedArtist', () => {
          it('dovrebbe chiamare calculateStatistics con il tipo corretto', async () => {
               const mockResult :StatisticsResult = {
                    type: 'artista_più_suonato',
                    value: 'Ultimo',
               };

               jest.spyOn(statisticService, 'calculeteStatistics').mockResolvedValue(mockResult);
               const result = await statisticService.getMostPlayedArtist();

               expect(statisticService.calculeteStatistics).toHaveBeenCalledWith('artista_più_suonato', undefined);
               expect(result).toEqual(mockResult);
          });
     });

     describe('getAverageDuration', () => {
          it('dovrebbe chiamare calculateStatistic con il tipo corretto', async () => {
               const mockResult: StatisticsResult = {
                    type: 'durata_media',
                    value: 180,
               };

               jest.spyOn(statisticService, 'calculeteStatistics').mockResolvedValue(mockResult);
               const result = await statisticService.getAverageDuration();

               expect(statisticService.calculeteStatistics).toHaveBeenCalledWith('durata_media', undefined);
               expect(result).toEqual(mockResult);
          });
     });

     describe('getDailyTrends', () => {
          it('dovrebbe chiamare calculeteStatistics con il tipo corretto', async () => {
               const mockResult: StatisticsResult = {
                    type: 'tendenza_giornaliera',
                    value: [],
               };

               jest.spyOn(statisticService, 'calculeteStatistics').mockResolvedValue(mockResult);

               const result = await statisticService.getDailyTrends();

               expect(statisticService.calculeteStatistics).toHaveBeenCalledWith('tendenza_giornaliera', undefined);
               expect(result).toEqual(mockResult);
          });
     });



})