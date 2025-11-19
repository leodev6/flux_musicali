/**
 * Subject per il pattern Observer
 * 
 * Questa classe implementa il Subject nel pattern Observer, gestendo
 * la registrazione e la notifica degli observer quando si verificano eventi musicali.
 * 
 * @module EventSubject
 * @author Lionel Djouaka
 */

import { IObserver } from './IObserver';
import { MusicEvent } from '../models/MusicEvent';

/**
 * Classe Subject per gli eventi musicali
 * 
 * Gestisce la lista degli observer e notifica tutti gli observer registrati
 * quando viene creato un nuovo evento musicale.
 * 
 * @class EventSubject
 */
export class EventSubject {
     /**
      * Lista degli observer registrati
      * 
      * @private
      * @type {IObserver[]}
      */
     private observers: IObserver[] = [];

     /**
      * Registra un nuovo observer
      * 
      * Aggiunge un observer alla lista se non è già presente
      * (verifica basata sul nome dell'observer).
      * 
      * @method attach
      * @param {IObserver} observer - Observer da registrare
      */
     attach(observer: IObserver): void {
          const exists = this.observers.some((obs) => obs.getName() === observer.getName());
          if (!exists) {
               this.observers.push(observer);
          }
     }

     /**
      * Rimuove un observer dalla lista
      * 
      * @method detach
      * @param {IObserver} observer - Observer da rimuovere
      */
     detach(observer: IObserver): void {
          this.observers = this.observers.filter((obs) => obs.getName() !== observer.getName());
     }

     /**
      * Notifica tutti gli observer registrati
      * 
      * Chiama il metodo update di tutti gli observer registrati in modo asincrono.
      * Utilizza Promise.allSettled per garantire che tutti gli observer vengano
      * notificati anche se uno fallisce.
      * 
      * @async
      * @method notify
      * @param {MusicEvent} event - Evento musicale da notificare agli observer
      * @returns {Promise<void>} Promise che si risolve quando tutte le notifiche sono completate
      */
     async notify(event: MusicEvent): Promise<void> {
          const promises = this.observers.map((observer) => observer.update(event));
          await Promise.allSettled(promises);
     }

     getObserversCount(): number {
          return this.observers.length;
     }
}

export default EventSubject;