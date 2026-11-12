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

export async function commandExit(state: State) {
    console.log("Closing the Pokedex... Goodbye!");
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
    };
}
