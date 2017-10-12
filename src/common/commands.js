const commands = [/^place\s+\d,\s*\d,\s*(north|east|south|west)$/i, 'move', 'left', 'right', 'report'];
const isValidCommand = command => {
    return !!commands.find(c => {
        if (typeof c === 'object') { //regex;
            return c.test(command);
        } else {
            return command.toLowerCase() === c;
        }
    });
}
export {
    isValidCommand,
}