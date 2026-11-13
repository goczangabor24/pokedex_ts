import { Cache } from "./cache.js"

export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";
  #cache: Cache;

  constructor(cacheInterval: number) {
    this.#cache = new Cache(cacheInterval);
  }

  closeCache(): void {
    this.#cache.stopReapLoop();
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

  async fetchLocation(locationName: string): Promise<Location> {
    const url = `${PokeAPI.baseURL}/location-area/${encodeURIComponent(locationName)}`;

    const cached = this.#cache.get<Location>(url);
    if (cached !== undefined) {
        return cached;
    }

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
    }

    const result: Location = await response.json();
    this.#cache.add(url, result);
    return result;
  };

  async fetchPokemon(pokemonName: string): Promise<Pokemon> {
    const url = `${PokeAPI.baseURL}/pokemon/${encodeURIComponent(pokemonName)}`;

    const cached = this.#cache.get<Pokemon>(url);
    if (cached !== undefined) {
        return cached;
    }

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
    }

    const result: Pokemon = await response.json();
    this.#cache.add(url, result);
    return result;
  };
}

export type ShallowLocations = {
  count: number,
  next: string | null,
  previous: string | null,
  results: Result[]
};

export type Location = {
  pokemon_encounters: PokemonEncounter[];
}

export type PokemonEncounter = {
  pokemon: Result;
}

export type Pokemon = {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  types: PokemonType[];
}

export type PokemonType = {
  slot: number;
  type: Result;
}

export interface Result {
    name: string,
    url: string,
}