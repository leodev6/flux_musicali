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

               const processedEvents = await this.eventProcessingService.elaboraEvento(events);
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
}

export default EventController;