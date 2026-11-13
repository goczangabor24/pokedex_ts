import type { CLICommand, State } from "./state.js";

export async function commandMap(state: State) {
    const page = await state.pokeapi.fetchLocations(
        state.nextLocationsURL ?? undefined
    );

    for (const location of page.results) {
        console.log(location.name);
    }

    state.nextLocationsURL = page.next;
    state.prevLocationsURL = page.previous;
}

export async function commandMapb(state: State) {
    if (!state.prevLocationsURL) {
        console.log("You're on the first page");
        return;
    }

    const page = await state.pokeapi.fetchLocations(
        state.prevLocationsURL
    );

    for (const location of page.results) {
        console.log(location.name);
    }

    state.nextLocationsURL = page.next;
    state.prevLocationsURL = page.previous;
}

export async function commandExplore(state: State, ...args: string[]) {
    if (args.length === 0) {
        console.log("Please provide a location area name");
        return;
    }

    const locationName = args[0];
    console.log(`Exploring ${locationName}...`);

    const location = await state.pokeapi.fetchLocation(locationName);

    console.log("Found Pokemon:");
    for (const encounter of location.pokemon_encounters) {
        console.log(` - ${encounter.pokemon.name}`);
    }
}

export async function commandCatch(state: State, ...args: string[]) {
    if (args.length === 0) {
        console.log("Please provide a Pokemon name");
        return;
    }

    const pokemonName = args[0];
    console.log(`Throwing a Pokeball at ${pokemonName}...`);

    const pokemon = await state.pokeapi.fetchPokemon(pokemonName);

    // The higher the base experience, the lower the chance of catching it.
    const catchChance = Math.min(
        0.95,
        Math.max(0.05, 1 - pokemon.base_experience / 500)
    );

    if (Math.random() < catchChance) {
        console.log(`${pokemon.name} was caught!`);
        state.pokedex[pokemon.name] = pokemon;
        console.log("You may now inspect it with the inspect command.");
    } else {
        console.log(`${pokemon.name} escaped!`);
    }
}

export async function commandPokedex(state: State) {
    const names = Object.keys(state.pokedex);

    console.log("Your Pokedex:");
    for (const name of names) {
        console.log(` - ${name}`);
    }
}

export async function commandExit(state: State) {
    console.log("Closing the Pokedex... Goodbye!");
    state.pokeapi.closeCache();
    state.rl.close();
    process.exit(0);
}

export async function commandHelp(state: State) {
    console.log("Welcome to the Pokedex!");
    console.log("Usage:\n");

    for (const command of Object.values(state.commands)) {
        console.log(`${command.name}: ${command.description}`);
    };
}


export function getCommands(): Record<string, CLICommand> {
    return {
        exit: {
            name: "exit",
            description: "Exit the Pokedex",
            callback: commandExit,
        },
        help: {
            name: "help",
            description: "Displays a help message",
            callback: commandHelp,
        },
        map: {
            name: "map",
            description: "Displays the next 20 location areas",
            callback: commandMap,
        },
        mapb: {
            name: "mapb",
            description: "Displays the previous 20 location areas",
            callback: commandMapb,
        },
        explore: {
            name: "explore",
            description: "Explore a location area",
            callback: commandExplore,
        },
        catch: {
            name: "catch",
            description: "Catch a Pokemon and add it to your Pokedex",
            callback: commandCatch,
        },
        pokedex: {
            name: "pokedex",
            description: "List all the Pokemon you have caught",
            callback: commandPokedex,
        },
    };
}
