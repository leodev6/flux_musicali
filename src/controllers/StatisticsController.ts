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

     async getMostPlayedArtist(req: Request, res: Response): Promise<void>{
          try {
               const date = req.query.date ? new Date(req.query.date as string):new Date();
               const events = await this.musicEventRepository.findByDate(date);
               const result = await this.statisticService.getMostPlayedArtist(events);

               res.json({
                    success: true,
                    date: result,
               });
          } catch (error: any) {
               res.status(500).json({
                    success:false,
                    error: error.message || 'Errore durant la ecuperazione dell\'artista più ascoltato',
               });
          }
     }
}
export default StatatisticsController;