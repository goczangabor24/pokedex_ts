import { createInterface, type Interface } from "node:readline";
import { getCommands } from "./commands.js";
import { PokeAPI, type Pokemon } from "./Pokeapi.js"

export type CLICommand = {
    name: string;
    description: string;
    callback: (state: State, ...args: string[]) => Promise<void>;
}

export type State = {
    rl: Interface;
    commands: Record<string, CLICommand>;
    pokeapi: PokeAPI;
    nextLocationsURL: string | null;
    prevLocationsURL: string | null;
    pokedex: Record<string, Pokemon>;
}

export function initState(): State {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "Pokedex > ",
    });
    const commands = getCommands();

    return {
        rl,
        commands,
        pokeapi: new PokeAPI(300_000),
        nextLocationsURL: null,
        prevLocationsURL: null,
        pokedex: {},
    };
}