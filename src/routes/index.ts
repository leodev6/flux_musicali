/**
 * File principale per la configurazione delle route API
 * 
 * Questo modulo centralizza la configurazione di tutte le route dell'applicazione,
 * includendo le route per gli eventi, le statistiche e l'health check.
 * 
 * @module routes
 * @author Lionel Djouaka
 */

import { Router } from "express";
import { EventController } from "../controllers/EventController";
import { createEventRoutes } from "./eventRoute";
import { StatatisticsController } from "../controllers";
import { createStatisticsRoutes } from "./StatitiscRoutes";

/**
 * Crea e configura tutte le route dell'API
 * 
 * Combina tutte le route dell'applicazione in un unico router:
 * - /api/events/* : Route per gli eventi musicali
 * - /api/statistics/* : Route per le statistiche
 * - /api/health : Endpoint per il health check del server
 * 
 * @function createRoutes
 * @param {EventController} eventController - Controller per la gestione degli eventi
 * @param {StatatisticsController} statisticsController - Controller per la gestione delle statistiche
 * @returns {Router} Router Express configurato con tutte le route dell'API
 */
export function createRoutes(eventController: EventController, statisticsController: StatatisticsController): Router {
     const router = Router();

     router.use('/events', createEventRoutes(eventController));
     router.use('/statistics', createStatisticsRoutes(statisticsController));
     
     router.get('/health', (req, res) => {
          res.json({
               status: 'ok',
               timeStamp: new Date().toISOString(),
          });
     });
     return router;
}