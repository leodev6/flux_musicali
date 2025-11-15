import { Request, Response } from "express";
import { StatisticService } from "../services/StatisticService";
import { MusicEventRepository } from "../repositories/MusicEventRepository";

export class StatatisticsController {
     private statisticService: StatisticService;
     private musicEventRepository: MusicEventRepository;

     constructor(statisticService: StatisticService, musicEventRepository: MusicEventRepository) {
          this.statisticService = statisticService;
          this.musicEventRepository = musicEventRepository;
     }

     async getMostPlayedArtist(req: Request, res: Response): Promise<void> {
          try {
               const events = req.query.date 
                    ? await this.musicEventRepository.findByDate(new Date(req.query.date as string))
                    : await this.musicEventRepository.findAll();
               const result = await this.statisticService.getMostPlayedArtist(events);

               res.json({
                    success: true,
                    data: result,
               });
          } catch (error: any) {
               res.status(500).json({
                    success: false,
                    error: error.message || 'Errore durant la ecuperazione dell\'artista più ascoltato',
               });
          }
     }

     async getAverageDuration(req: Request, res: Response): Promise<void> {
          try {
               const events = req.query.date 
                    ? await this.musicEventRepository.findByDate(new Date(req.query.date as string))
                    : await this.musicEventRepository.findAll();
               const result = await this.statisticService.getAverageDuration(events);

               res.json({
                    success: true,
                    data: result
               });
          } catch (error: any) {
               res.status(500).json({
                    success: false,
                    error: error.message || 'Errore durante il recupero della durate media.',
               });
          }
     }

     async getDailyTrends(req: Request, res: Response): Promise<void> {
          try {
               const events = (req.query.startDate || req.query.endDate)
                    ? await this.musicEventRepository.findByDateRange(
                         req.query.startDate ? new Date(req.query.startDate as string) : new Date(0),
                         req.query.endDate ? new Date(req.query.endDate as string) : new Date()
                    )
                    : await this.musicEventRepository.findAll();
               const result = await this.statisticService.getDailyTrends(events);

               res.json({
                    success: true,
                    data: result,
               });
          } catch (error: any) {
               res.status(500).json({
                    success: false,
                    error: error.message || 'Errore durante il recupero delle tendenze giornaliere.'
               });
          }
     }

     async getPeakHours(req: Request, res: Response): Promise<void> {
          try {
               const events = req.query.date 
                    ? await this.musicEventRepository.findByDate(new Date(req.query.date as string))
                    : await this.musicEventRepository.findAll();
               const result = await this.statisticService.getPeakHours(events);

               res.json({
                    success: true,
                    data: result,
               });
          } catch (error: any) {
               res.status(500).json({
                    success: false,
                    error: error.message || 'Errore durante il recupero delle ore di punta',
               });
          }
     }

     async getAllStatistics(req: Request, res: Response): Promise<void> {
          try {
               const events = req.query.date 
                    ? await this.musicEventRepository.findByDate(new Date(req.query.date as string))
                    : await this.musicEventRepository.findAll();
               
               const stastistics = {
                    mostPlayedArtist: await this.statisticService.getMostPlayedArtist(events),
                    averageDuration: await this.statisticService.getAverageDuration(events),
                    dailyTrend: await this.statisticService.getDailyTrends(events),
                    peakHours: await this.statisticService.getPeakHours(events),
               };

               res.json({
                    success: true,
                    data: stastistics,
               });
          } catch (error: any) {
               res.status(500).json({
                    success: false,
                    error: error.message || 'Errore durante il recupero delle statistiche.'
               });
          }

     }
}
export default StatatisticsController;