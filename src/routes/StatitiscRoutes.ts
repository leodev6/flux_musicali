/**
 * Route per gli endpoint delle statistiche musicali
 * 
 * Questo modulo definisce le route HTTP per il recupero delle statistiche,
 * inclusi endpoint per diverse tipologie di analisi sui dati musicali.
 * 
 * @module StatitiscRoutes
 * @author Lionel Djouaka
 */
import { Router } from "express";
import { StatatisticsController } from "../controllers/StatisticsController";

/**
 * Crea e configura le route per le statistiche musicali
 * 
 * Definisce gli endpoint REST per:
 * - GET /artista_piu_suonato : Recupera l'artista più ascoltato
 * - GET /durata_media : Recupera la durata media degli ascolti
 * - GET /tendenza_giornaliera : Recupera le tendenze giornaliere
 * - GET /ore_di_punta : Recupera le ore di punta
 * - GET /all : Recupera tutte le statistiche in una singola richiesta
 * 
 * @function createStatisticsRoutes
 * @param {StatatisticsController} statatisticsController - Controller per la gestione delle statistiche
 * @returns {Router} Router Express configurato con le route delle statistiche
 */
export function createStatisticsRoutes(statatisticsController: StatatisticsController): Router {
     const router = Router();

     router.get('/artista_piu_suonato', (req, res) =>
          statatisticsController.getMostPlayedArtist(req, res)
     );

     router.get('/durata_media', (req, res) =>
          statatisticsController.getAverageDuration(req, res)
     );

     router.get('/tendenza_giornaliera', (req, res) =>
          statatisticsController.getDailyTrends(req, res)
     );

     router.get('/ore_di_punta', (req, res) =>
          statatisticsController.getPeakHours(req, res));

     router.get('/all', (req, res) =>
          statatisticsController.getAllStatistics(req, res)
     );

     return router;
}

