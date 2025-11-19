/**
 * Interfaccia per gli observer nel pattern Observer
 * 
 * Definisce il contratto che tutti gli observer devono implementare
 * per essere notificati quando si verifica un evento musicale.
 * 
 * @module IObserver
 * @author Lionel Djouaka
 */

import MusicEvent from '../models/MusicEvent';

/**
 * Interfaccia per gli observer
 * 
 * Implementa il pattern Observer, permettendo agli observer di essere
 * notificati quando viene creato un nuovo evento musicale.
 * 
 * @interface IObserver
 */
export interface IObserver {
     getName(): string;

     /**
      * Metodo chiamato quando viene notificato un evento
      * 
      * Questo metodo viene invocato dal subject quando si verifica un evento.
      * L'observer può quindi eseguire azioni in risposta all'evento.
      * 
      * @async
      * @method update
      * @param {MusicEvent} event - L'evento musicale che ha scatenato la notifica
      * @returns {Promise<void>} Promise che si risolve quando l'elaborazione è completata
      */
     update(event: MusicEvent): Promise<void>;
}