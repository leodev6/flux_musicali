import { Request, Response } from "express";
import { EventProcessingService } from "../services/EventProcessingService";

export class EventController  {
     private eventProcessingService: EventProcessingService;

     constructor(eventProcessingService: EventProcessingService) {
          this.eventProcessingService = eventProcessingService;
     }

     async createEvent(req: Request, res: Response): Promise<void> {
          try {
               const event = await this.eventProcessingService.processEvent(req.body);
               res.status(200).json({
                    success: true,
                    date: event,
               });
          } catch (error: any) {
               res.status(400).json({
                    success: false,
                    error: error.message || 'Error creating event',
               }); 
          }
     }


}

export default  EventController;