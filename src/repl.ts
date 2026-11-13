import type { State } from "./state.js";

export function startREPL(state: State) {
    const rl = state.rl;
    let queue: Promise<void> = Promise.resolve();

    rl.prompt();

    rl.on('line', (line) => {
        // Run commands one at a time so piped input can't race past an
        // in-flight command (e.g. exit firing before catch finishes).
        queue = queue.then(() => handleLine(state, line));
    });
};

async function handleLine(state: State, line: string): Promise<void> {
    const rl = state.rl;
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
            await command.callback(state, ...words.slice(1));
        } catch (error) {
            console.log(error);
        }
    }

    rl.prompt();
}

export function cleanInput(input: string): string[] {
    let cleanedInput: string[] = input.toLowerCase().split(/\s+/);

    for (let i: number = cleanedInput.length-1; i >= 0; i--) {
        if (cleanedInput[i] === "" || cleanedInput[i] === " ") {
            cleanedInput.splice(i, 1);
        };
    };

    return cleanedInput;
};
