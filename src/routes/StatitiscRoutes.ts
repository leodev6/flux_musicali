import { Router } from "express";
import { StatatisticsController } from "../controllers/StatisticsController";

export function createStatisticsRoutes(statatisticsController: StatatisticsController): Router {
     const router = Router();

     router.get('/artista_più_suonato', (req, res) => {
          statatisticsController.getMostPlayedArtist(req, res);
     });

     return router;
}

