import { createInterface } from "node:readline";
import { CLICommand, getCommands } from "./commands.js";

export function startREPL() {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "Pokedex > ",
    });

    const commands = getCommands();

    rl.prompt();

    rl.on('line', (line) => {
        const words: string[] = cleanInput(line);

        if (words.length === 0) {
            rl.prompt();
            return;
        }

        const command = commands[words[0]];

        if (!command) {
            console.log("Unknown command");
        } else {
            try {
                command.callback(commands);
            } catch (error) {
                console.log(error);
            }
        }

        rl.prompt();
    })
};

export function cleanInput(input: string): string[] {
    let cleanedInput: string[] = input.toLowerCase().split(/\s+/);

    for (let i: number = cleanedInput.length-1; i >= 0; i--) {
        if (cleanedInput[i] === "" || cleanedInput[i] === " ") {
            cleanedInput.splice(i, 1);
        };
    };

    return cleanedInput;
};
