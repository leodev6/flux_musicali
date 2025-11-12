export interface IRepository<T> {
     create(entita: Partial<T>): Promise<T>;
     findById(id: number): Promise<T | null>;
     findAll(): Promise<T[]>;
     update(id: number, entita: Partial<T>): Promise<T | null>;
     delete(id: number): Promise<boolean>;
}