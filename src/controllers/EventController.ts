import { Request, Response } from "express";
import { EventProcessingService } from "../services/EventProcessingService";

export class EventController {
     private eventProcessingService: EventProcessingService;

     constructor(eventProcessingService: EventProcessingService) {
          this.eventProcessingService = eventProcessingService;
     }

     async createEvent(req: Request, res: Response): Promise<void> {
          try {
               const event = await this.eventProcessingService.processEvent(req.body);
               res.status(201).json({
                    success: true,
                    date: event,
               });
          } catch (error: any) {
               res.status(401).json({
                    success: false,
                    error: error.message || 'Errore durante la creazione parit',
               });
          }
     }

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