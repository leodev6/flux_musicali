/**
 * Controller per la gestione degli eventi musicali
 * 
 * Questo controller gestisce tutte le richieste HTTP relative agli eventi musicali,
 * delegando la logica di business al EventProcessingService.
 * 
 * @module EventController
 * @author Lionel Djouaka
 */
import { Request, Response } from "express";
import { EventProcessingService } from "../services/EventProcessingService";

/**
 * Classe controller per gli eventi musicali
 * 
 * Gestisce le operazioni CRUD e l'elaborazione degli eventi musicali,
 * fornendo endpoint REST per la creazione di eventi singoli e batch.
 * 
 * @class EventController
 */
export class EventController {
     private eventProcessingService: EventProcessingService;

     constructor(eventProcessingService: EventProcessingService) {
          this.eventProcessingService = eventProcessingService;
     }

     /**
 * Crea un nuovo evento musicale
 * 
 * Endpoint POST per creare un singolo evento musicale.
 * Valida i dati in ingresso e li processa tramite il servizio.
 * 
 * @async
 * @method createEvent
 * @param {Request} req - Oggetto richiesta Express contenente i dati dell'evento nel body
 * @param {Response} res - Oggetto risposta Express
 * @returns {Promise<void>} Promise che si risolve quando la risposta è inviata
 * 
 */
     async createEvent(req: Request, res: Response): Promise<void> {
          try {
               const event = await this.eventProcessingService.processEvent(req.body);
               res.status(201).json({
                    success: true,
                    data: event,
               });
          } catch (error: any) {
               res.status(401).json({
                    success: false,
                    error: error.message || 'Errore durante la creazione parit',
               });
          }
     }

     /**
 * Crea multipli eventi musicali in batch
 * 
 * Endpoint POST per creare più eventi musicali contemporaneamente.
 * Valida che il body contenga un array di eventi e li processa in sequenza.
 * 
 * @async
 * @method creaEventiBatch
 * @param {Request} req - Oggetto richiesta Express contenente un array di eventi nel body
 * @param {Response} res - Oggetto risposta Express
 * @returns {Promise<void>} Promise che si risolve quando la risposta è inviata
 * 
 */
     async creaEventiBatch(req: Request, res: Response): Promise<void> {
          try {
               const { events } = req.body;
               if (!Array.isArray(events)) {
                    res.status(400).json({
                         success: false,
                         error: 'Gli eventi devono essere un array',
                    });
                    return;
               }

               const processedEvents = await this.eventProcessingService.elaboraEventoBatch(events);
               res.status(201).json({
                    success: true,
                    data: processedEvents,
                    count: processedEvents.length,
               });
          } catch (error: any) {
               res.status(400).json({
                    success: false,
                    error: error.message || 'Errore nell\'elaborazione degli eventi batch',
               });
          }
     }

     /**
   * Recupera tutti gli eventi musicali
   * 
   * Endpoint GET per recuperare tutti gli eventi musicali presenti nel database.
   * 
   * @async
   * @method getAllEvents
   * @param {Request} req - Oggetto richiesta Express
   * @param {Response} res - Oggetto risposta Express
   * @returns {Promise<void>} Promise che si risolve quando la risposta è inviata
   * 
   */
     async getAllEvents(req: Request, res: Response): Promise<void> {
          try {
               const events = await this.eventProcessingService.getAllEvents();
               res.json({
                    success: true,
                    data: events,
                    count: events.length,
               });
          } catch (error: any) {
               res.status(500).json({
                    success: false,
                    error: error.message || 'Errore durante il recupero degli eventi',
               });
          }
     }

     async getEventById(req: Request, res: Response): Promise<void> {
          try {
               const id = parseInt(req.params.id, 10);
               if (isNaN(id)) {
                    res.status(400).json({
                         success: false,
                         error: 'ID non valido',
                    });
                    return;
               }

               const event = await this.eventProcessingService.getEventById(id);
               if (!event) {
                    res.status(404).json({
                         success: false,
                         error: 'Evento non trovato',
                    });
                    return;
               }

               res.json({
                    success: true,
                    data: event,
               });
          } catch (error: any) {
               res.status(500).json({
                    success: false,
                    error: error.message || 'Errore durante il recupero dell\'evento',
               });
          }
     }

     async getEventsByArtist(req: Request, res: Response): Promise<void> {
          try {
               const artist = req.params.artist || req.query.artist as string;
               if (!artist) {
                    res.status(400).json({
                         success: false,
                         error: 'Nome artista richiesto',
                    });
                    return;
               }

               const events = await this.eventProcessingService.getEventsByArtist(artist);
               res.json({
                    success: true,
                    data: events,
                    count: events.length,
               });
          } catch (error: any) {
               res.status(500).json({
                    success: false,
                    error: error.message || 'Errore durante il recupero degli eventi per artista',
               });
          }
     }
}

export default EventController;