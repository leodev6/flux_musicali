/**
 * Route per gli endpoint degli eventi musicali
 * 
 * Questo modulo definisce le route HTTP per la gestione degli eventi musicali,
 * inclusi endpoint per la creazione di eventi singoli e batch.
 * 
 * @module eventRoute
 * @author Lionel Djouaka
 */
import { EventController } from './../controllers/index';
import { Router } from "express";

/**
 * Crea e configura le route per gli eventi musicali
 * 
 * Definisce gli endpoint REST per:
 * - GET / : Recupero di tutti gli eventi musicali
 * - GET /:id : Recupero di un evento musicale per ID
 * - GET /artist/:artist : Recupero di eventi musicali per artista
 * - POST / : Creazione di un singolo evento musicale
 * - POST /batch : Creazione di multipli eventi musicali in batch
 * 
 * @function createEventRoutes
 * @param {EventController} eventController - Controller per la gestione degli eventi
 * @returns {Router} Router Express configurato con le route degli eventi
 */
export function createEventRoutes(eventController: EventController): Router {
     const router = Router();
     router.post('/', (req, res) => eventController.createEvent(req, res));

     router.get('/:id', (req, res) => eventController.getEventById(req, res));

     router.get('/', (req, res) => eventController.getAllEvents(req, res));

     router.get('/artist/:artist', (req, res) => eventController.getEventsByArtist(req, res));

     //Creare più eventi
     router.post('/batch', (req, res) => eventController.creaEventiBatch(req, res));

     return router;
}