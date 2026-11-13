import type { Cache } from "./cache.js"

export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";
  #cache: Cache;

  constructor(cache: Cache) {
    this.#cache = cache;
  }

  async fetchLocations(pageURL?: string): Promise<ShallowLocations> {
    const url = pageURL ? pageURL : PokeAPI.baseURL+"/location-area"

    const cached = this.#cache.get<ShallowLocations>(url);
    if (cached !== undefined) {
        return cached;
    }

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
    }

    const result: ShallowLocations = await response.json();
    this.#cache.add(url, result);
    return result;
  };
}

//   async fetchLocation(locationName: string): Promise<Location> {
//     // implement this
//   }
// }

export type ShallowLocations = {
  count: number,
  next: string | null,
  previous: string | null,
  results: Result[]
};

// export type Location = {
//   // add properties here
// }

export interface Result {
    name: string,
    url: string,
}