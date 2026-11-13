export class Cache {
    #cache = new Map <string, unknown>();

    add<T>(key: string, val: T): void {
        this.#cache.set(key, val);
    }

    get<T>(key: string): T | undefined {
        return this.#cache.get(key) as T | undefined;
    }
}