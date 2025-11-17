import { Request, Response } from 'express';
import { StatatisticsController } from '../../controllers/StatisticsController';
import { StatisticService } from '../../services/StatisticService';
import { MusicEventRepository } from '../../repositories/MusicEventRepository';
import { StatisticsResult } from '../../strategies/IStatistiqueStrategy';

// Mock dei servizi
jest.mock('../../services/StatisticService');
jest.mock('../../repositories/MusicEventRepository');

describe('StatatisticsController', () => {
     let statisticsController: StatatisticsController;
     let mockStatisticService: jest.Mocked<StatisticService>;
     let mockMusicEventRepository: jest.Mocked<MusicEventRepository>;
     let mockRequest: Partial<Request>;
     let mockResponse: Partial<Response>;

     beforeEach(() => {
          mockStatisticService = {
               getMostPlayedArtist: jest.fn(),
               getAverageDuration: jest.fn(),
               getDailyTrends: jest.fn(),
               getPeakHours: jest.fn(),
               getStatisticsByDate: jest.fn(),
          } as any;

          mockMusicEventRepository = {
               findAll: jest.fn(),
               findByDate: jest.fn(),
               findByDateRange: jest.fn(),
          } as any;

          statisticsController = new StatatisticsController(mockStatisticService, mockMusicEventRepository);

          mockResponse = {
               status: jest.fn().mockReturnThis(),
               json: jest.fn().mockReturnThis(),
          };

          mockRequest = {
               query: {},
               params: {},
          };
     });

     describe('getMostPlayedArtist', () => {
          it('dovrebbe recuperare l\'artista più ascoltato con successo', async () => {
               const mockResult: StatisticsResult = {
                    type: 'artista_più_suonato',
                    value: 'Ultimo',
                    metadata: { maxCount: 1112, totalEvents: 20000 },
               };

               mockMusicEventRepository.findAll.mockResolvedValue([]);
               mockStatisticService.getMostPlayedArtist.mockResolvedValue(mockResult);

               await statisticsController.getMostPlayedArtist(mockRequest as Request, mockResponse as Response);

               expect(mockResponse.json).toHaveBeenCalledWith({
                    success: true,
                    data: mockResult,
               });
          });

          it('dovrebbe filtrare per data se fornita', async () => {
               const mockResult: StatisticsResult = {
                    type: 'artista_più_suonato',
                    value: 'Negramaro',
               };

               mockRequest.query = { date: '2025-01-01' };
               mockMusicEventRepository.findByDate.mockResolvedValue([]);
               mockStatisticService.getMostPlayedArtist.mockResolvedValue(mockResult);

               await statisticsController.getMostPlayedArtist(mockRequest as Request, mockResponse as Response);

               expect(mockMusicEventRepository.findByDate).toHaveBeenCalled();
          });
     });

     describe('getAverageDuration', () => {
          it('dovrebbe recuperare la durata media con successo', async () => {
               const mockResult: StatisticsResult = {
                    type: 'durata_media',
                    value: 222,
                    metadata: { totalDuration: 4441314, eventCount: 20000 },
               };

               mockMusicEventRepository.findAll.mockResolvedValue([]);
               mockStatisticService.getAverageDuration.mockResolvedValue(mockResult);

               await statisticsController.getAverageDuration(mockRequest as Request, mockResponse as Response);

               expect(mockResponse.json).toHaveBeenCalledWith({
                    success: true,
                    data: mockResult,
               });
          });
     });

     describe('getDailyTrends', () => {
          it('dovrebbe recuperare le tendenze giornaliere con successo', async () => {
               const mockResult: StatisticsResult = {
                    type: 'tendenza_giornaliera',
                    value: [
                         { date: '2025-01-01', eventCount: 75, totalDuration: 20630, uniqueArtists: 18, uniqueUsers: 75 },
                    ],
                    metadata: { totalDays: 1 },
               };

               mockMusicEventRepository.findAll.mockResolvedValue([]);
               mockStatisticService.getDailyTrends.mockResolvedValue(mockResult);

               await statisticsController.getDailyTrends(mockRequest as Request, mockResponse as Response);

               expect(mockResponse.json).toHaveBeenCalledWith({
                    success: true,
                    data: mockResult,
               });
          });

          it('dovrebbe filtrare per range di date se fornito', async () => {
               const mockResult: StatisticsResult = {
                    type: 'tendenza_giornaliera',
                    value: [],
               };

               mockRequest.query = { startDate: '2025-01-01', endDate: '2025-01-31' };
               mockMusicEventRepository.findByDateRange.mockResolvedValue([]);
               mockStatisticService.getDailyTrends.mockResolvedValue(mockResult);

               await statisticsController.getDailyTrends(mockRequest as Request, mockResponse as Response);

               expect(mockMusicEventRepository.findByDateRange).toHaveBeenCalled();
          });
     });

     describe('getPeakHours', () => {
          it('dovrebbe recuperare le ore di punta con successo', async () => {
               const mockResult: StatisticsResult = {
                    type: 'ore_di_punta',
                    value: {
                         peakHours: [{ hour: 0, eventCount: 9, totalDuration: 1549, averageDuration: 172, uniqueUsers: 9, uniqueArtists: 5 }],
                    },
                    metadata: { peakHour: 14 },
               };

               mockMusicEventRepository.findAll.mockResolvedValue([]);
               mockStatisticService.getPeakHours.mockResolvedValue(mockResult);

               await statisticsController.getPeakHours(mockRequest as Request, mockResponse as Response);

               expect(mockResponse.json).toHaveBeenCalledWith({
                    success: true,
                    data: mockResult,
               });
          });
     });

     describe('getAllStatistics', () => {
          it('dovrebbe recuperare tutte le statistiche con successo', async () => {
               const mockResults = {
                    mostPlayedArtist: { type: 'artista_più_suonato', value: 'Ultimo' } as StatisticsResult,
                    averageDuration: { type: 'durata_media', value: 222 } as StatisticsResult,
                    dailyTrend: { type: 'tendenza_giornaliera', value: [] } as StatisticsResult,
                    peakHours: { type: 'ore_di_punta', value: {} } as StatisticsResult,
               };

               mockMusicEventRepository.findAll.mockResolvedValue([]);
               mockStatisticService.getMostPlayedArtist.mockResolvedValue(mockResults.mostPlayedArtist);
               mockStatisticService.getAverageDuration.mockResolvedValue(mockResults.averageDuration);
               mockStatisticService.getDailyTrends.mockResolvedValue(mockResults.dailyTrend);
               mockStatisticService.getPeakHours.mockResolvedValue(mockResults.peakHours);

               await statisticsController.getAllStatistics(mockRequest as Request, mockResponse as Response);

               expect(mockResponse.json).toHaveBeenCalledWith({
                    success: true,
                    data: mockResults,
               });
          });
     });
});

