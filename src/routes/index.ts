import { Router } from "express";
import { EventController } from "../controllers/EventController";
import { createEventRoutes } from "./eventRoute";
import { StatatisticsController } from "../controllers";
import { createStatisticsRoutes } from "./StatitiscRoutes";

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