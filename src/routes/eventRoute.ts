import { EventController } from './../controllers/EventController';
import { Router } from "express";


export function createEventRoutes(eventController: EventController): Router {
     const router = Router();
     router.post('/', (req, res) => eventController.createEvent(req, res));
     router.post('/batch', (req, res) => eventController.creaEventiBatch(req, res));

     return router;
}