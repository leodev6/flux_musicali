/**
 * Interfaccia generica per i repository
 * 
 * Definisce il contratto base per tutti i repository dell'applicazione,
 * fornendo operazioni CRUD standard (Create, Read, Update, Delete).
 * 
 * @module IRepository
 * @author Lionel Djouaka
 */
/**
 * Interfaccia generica per i repository
 * 
 * Questa interfaccia definisce le operazioni base che tutti i repository
 * devono implementare, seguendo il pattern Repository per l'accesso ai dati.
 * 
 * @interface IRepository
 * @template T - Tipo dell'entità gestita dal repository
 */
export interface IRepository<T> {
     create(entita: Partial<T>): Promise<T>;
     findById(id: number): Promise<T | null>;
     findAll(): Promise<T[]>;
     update(id: number, entita: Partial<T>): Promise<T | null>;
     delete(id: number): Promise<boolean>;
}