
import { Router } from "express";
import { EventController } from "../controllers/EventController";
import { createEventRoutes } from "./eventRoute";

export function createRoutes(eventController: EventController): Router {
     const router = Router();

     router.use('/events', createEventRoutes(eventController));
     router.get('/health', (req, res) => {
          res.json({
               status: 'ok',
               timeStamp: new Date().toISOString(),
          });
     });
     return router;
}