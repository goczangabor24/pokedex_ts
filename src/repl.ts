import type { State } from "./state.js";

export function startREPL(state: State) {
    const rl = state.rl;

    rl.prompt();

    rl.on('line', async (line) => {
        const words: string[] = cleanInput(line);

        if (words.length === 0) {
            rl.prompt();
            return;
        }

        const command = state.commands[words[0]];

        if (!command) {
            console.log("Unknown command");
        } else {
            try {
                await command.callback(state);
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
