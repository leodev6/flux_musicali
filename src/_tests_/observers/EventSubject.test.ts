/**
 * Test suite per EventSubject
 * 
 * Testa l'implementazione del pattern Observer per la gestione degli observer.
 * 
 * @module EventSubject.test
 */
import { EventSubject } from '../../observers/EventSubject';
import { IObserver } from '../../observers/IObserver';
import { MusicEvent } from '../../models/MusicEvent';

/**
 * Suite che verifica l'implementazione del pattern Observer assicurando
 * la corretta gestione di attach, detach e notifiche anche in presenza di errori.
 */
describe('EventSubject', () => {
     let eventSubject: EventSubject;
     let mockObserver1: jest.Mocked<IObserver>;
     let mockObserver2: jest.Mocked<IObserver>;
     let mockEvent: MusicEvent;

     beforeEach(() => {
          eventSubject = new EventSubject();

          mockObserver1 = {
               getName: jest.fn().mockReturnValue('Observer1'),
               update: jest.fn().mockResolvedValue(undefined),
          };

          mockObserver2 = {
               getName: jest.fn().mockReturnValue('Observer2'),
               update: jest.fn().mockResolvedValue(undefined),
          };

          mockEvent = {
               id: 1,
               userId: 'u1',
               trackId: 't001',
               artist: 'Ultimo',
               duration: 832,
               timestamp: new Date(),
          } as MusicEvent;
     });

     it('dovrebbe iniziare con zero observer', () => {
          expect(eventSubject.getObserversCount()).toBe(0);
     });

     it('dovrebbe attaccare un observer', () => {
          eventSubject.attach(mockObserver1);
          expect(eventSubject.getObserversCount()).toBe(1);
     });

     it('dovrebbe attaccare multipli observer', () => {
          eventSubject.attach(mockObserver1);
          eventSubject.attach(mockObserver2);
          expect(eventSubject.getObserversCount()).toBe(2);
     });

     it('non dovrebbe attaccare lo stesso observer due volte', () => {
          eventSubject.attach(mockObserver1);
          eventSubject.attach(mockObserver1);
          expect(eventSubject.getObserversCount()).toBe(1);
     });

     it('dovrebbe staccare un observer', () => {
          eventSubject.attach(mockObserver1);
          eventSubject.attach(mockObserver2);
          eventSubject.detach(mockObserver1);
          expect(eventSubject.getObserversCount()).toBe(1);
     });

     it('dovrebbe notificare tutti gli observer', async () => {
          eventSubject.attach(mockObserver1);
          eventSubject.attach(mockObserver2);

          await eventSubject.notify(mockEvent);

          expect(mockObserver1.update).toHaveBeenCalledWith(mockEvent);
          expect(mockObserver2.update).toHaveBeenCalledWith(mockEvent);
     });

     it('dovrebbe continuare a notificare anche se un observer fallisce', async () => {
          mockObserver1.update.mockRejectedValue(new Error('Observer error'));
          eventSubject.attach(mockObserver1);
          eventSubject.attach(mockObserver2);

          await eventSubject.notify(mockEvent);

          expect(mockObserver1.update).toHaveBeenCalled();
          expect(mockObserver2.update).toHaveBeenCalled();
     });
});

