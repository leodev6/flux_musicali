import { EventController } from './../controllers/EventController';
import { Router } from "express";


export function createEventRoutes(eventController: EventController): Router {
     const router = Router();
     router.post('/', (req, res) => eventController.createEvent(req, res));

     router.get('/', (req, res) => eventController.getAllEvents(req, res));

     router.get('/:id', (req, res) => eventController.getEventById(req, res));

     router.get('/artist/:artist', (req, res) => eventController.getEventsByArtist(req, res));

     //Creare più eventi
     router.post('/batch', (req, res) => eventController.creaEventiBatch(req, res));

     return router;
}