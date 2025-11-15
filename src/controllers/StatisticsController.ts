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
               const date = req.query.date ? new Date(req.query.date as string) : new Date();
               const events = await this.musicEventRepository.findByDate(date);
               const result = await this.statisticService.getMostPlayedArtist(events);

               res.json({
                    success: true,
                    date: result,
               });
          } catch (error: any) {
               res.status(500).json({
                    success: false,
                    error: error.message || 'Errore durant la ecuperazione dell\'artista più ascoltato',
               });
          }
     }

     async getDailyTrends(req: Request, res: Response): Promise<void> {
          try {
               const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 7 * 24 * 60 * 1000); //Ultimi 7 giorni
               const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

               const events = await this.musicEventRepository.findByDateRange(startDate, endDate);
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
}
export default StatatisticsController;