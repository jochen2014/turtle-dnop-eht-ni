const commands = [/^place\s+(\d)\s*,\s*(\d)\s*,\s*(north|east|south|west)$/i, 'MOVE', 'LEFT', 'RIGHT', 'REPORT'];
const parseCommand = command => {
    let parsedResult;
    commands.some(c => {
        if (typeof c === 'object') { //regex;
            const match = command.match(c);
            if (match) {
                parsedResult = {
                    command: 'PLACE',
                    args: match.slice(1, 4)
                }
                return true; //found! now exit;
            }
        } else { //string
            if (command.toUpperCase() === c) {
                parsedResult = { command: c };
                return true; //found! now exit;
            }
        }
    });
    return parsedResult;
}
export {
    parseCommand,
}