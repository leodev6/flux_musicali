/**
 * Controller per la gestione delle statistiche musicali
 * 
 * Questo controller gestisce tutte le richieste HTTP relative alle statistiche,
 * fornendo endpoint per recuperare diverse tipologie di analisi sui dati musicali.
 * 
 * @module StatisticsController
 * @author Lionel Djouaka
 */
import { Request, Response } from "express";
import { StatisticService } from "../services/StatisticService";
import { MusicEventRepository } from "../repositories/MusicEventRepository";

/**
 * Classe controller per le statistiche musicali
 * 
 * Gestisce le operazioni di recupero e calcolo delle statistiche sugli eventi musicali,
 * fornendo endpoint REST per diverse tipologie di analisi.
 * 
 * @class StatatisticsController
 */
export class StatatisticsController {
     /**
     * Servizio per il calcolo delle statistiche
     * 
     * @private
     * @type {StatisticService}
     */
     private statisticService: StatisticService;

     /**
      * Repository per l'accesso agli eventi musicali
      * 
      * @private
      * @type {MusicEventRepository}
      */
     private musicEventRepository: MusicEventRepository;

     constructor(statisticService: StatisticService, musicEventRepository: MusicEventRepository) {
          this.statisticService = statisticService;
          this.musicEventRepository = musicEventRepository;
     }

     /**
      * Recupera l'artista più ascoltato
      * 
      * Endpoint GET per ottenere l'artista con il maggior numero di ascolti.
      * Supporta un parametro opzionale 'date' per filtrare per data specifica.
      * 
      * @async
      * @method getMostPlayedArtist
      * @param {Request} req - Oggetto richiesta Express (può contenere query param 'date')
      * @param {Response} res - Oggetto risposta Express
      * @returns {Promise<void>} Promise che si risolve quando la risposta è inviata
      *
      */
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