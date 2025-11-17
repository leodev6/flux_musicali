import { IObserver } from "./IObserver";
import { StatisticService } from "../services/StatisticService";
import MusicEvent from "../models/MusicEvent";
import StatatisticRepository from "../repositories/StatisticsRepository";

export class StatisticsObserver implements IObserver {
     private statisticService: StatisticService;
     private statatisticRepository: StatatisticRepository;

     constructor(statisticService: StatisticService, statatisticRepository: StatatisticRepository) {
          this.statisticService = statisticService;
          this.statatisticRepository = statatisticRepository;
     }

     getName(): string {
          return 'StatisticsObserver';
     }

     async update(event: MusicEvent): Promise<void> {
          try {
               //Racolta le statistiche per il giorno dell'evento
               const eventDate = new Date(event.timestamp);
               eventDate.setHours(0, 0, 0, 0);

               //Ottieni tutti gli eventi di questa giornata
               const musicEventRepository = this.statisticService.getMusicEventRepository();
               const dayEvents = await musicEventRepository.findByDate(eventDate);

               //Calcola tutte le statistiche
               const strategies = ['artista_più_suonato, durata_media, tendenza_giornaliera, ore_di_punta'];

               for(const strategyType of strategies) {
                    const result = await this.statisticService.calculeteStatistics(
                         strategyType,
                         dayEvents
                    );

                    if (result) {
                         //Salva o aggiorna la statistica
                         const existingStat = await this.statatisticRepository.findByTypeAndDate(
                              strategyType,
                              eventDate,
                         );
                         if (existingStat) {
                              await existingStat.update({
                                   value: JSON.stringify(result.value),
                                   metadata: result.metadata,
                              });
                         } else {
                              await this.statatisticRepository.create({
                                   type: strategyType,
                                   value: JSON.stringify(result.value),
                                   metadata: result.metadata,
                                   date: eventDate,
                              });
                         }
                    }
               }
          } catch (error) {
               console.error('Errore durante l\'aggiornamento delle statistiche: ', error);
          }
     }
}
export default StatisticsObserver;