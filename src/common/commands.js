const commands = [/^place\s+(\d)\s*,\s*(\d)\s*,\s*(north|east|south|west)$/i, 'MOVE', 'LEFT', 'RIGHT', 'REPORT'];
const directions = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
const key2CommandMap = [{
    key: 'ArrowLeft',
    command: 'LEFT',
}, {
    key: 'ArrowUp',
    command: 'MOVE',
}, {
    key: 'ArrowRight',
    command: 'RIGHT',
}, {
    key: 'ArrowDown',
    command: 'REPORT',
}];
const parseCommand = (command) => {
    let parsedResult;
    commands.some((c) => {
        if (typeof c === 'object') { // regex;
            const match = command.match(c);
            if (match) {
                parsedResult = {
                    command: 'PLACE',
                    args: match.slice(1, 4),
                };
                return true; // found! now exit;
            }
        } else if (command.toUpperCase() === c) {
            parsedResult = { command: c };
            return true; // found! now exit;
        }
    });
    return parsedResult;
};


const executeCommand = (currentState, commandRaw, callback) => {
    const { command, args } = parseCommand(commandRaw);
    if (!command) { // invalid command;
        callback(currentState, `invalid command:${commandRaw}`);
    }
    const { x, y, f } = currentState;
    const directionIndex = directions.indexOf(f);
    switch (command) {
        case 'PLACE': {
            const [argX, argY, argF] = args;
            if (argX > 4 || argY > 4) {
                this.addReport('cannot go outside the pen');
                return;
            }
            callback({
                x: Number(argX),
                y: Number(argY),
                f: argF.toUpperCase(),
            });
            break;
        }
        case 'LEFT':
            callback({
                ...currentState,
                f: directions[(directionIndex + 3) % 4],
            });
            break;
        case 'RIGHT':
            callback({
                ...currentState,
                f: directions[(directionIndex + 1) % 4],
            });
            break;
        case 'MOVE':
            switch (f) {
                case 'NORTH':
                    if (y === 4) {
                        callback(currentState, 'cannot go north');
                        break;
                    }
                    callback({
                        ...currentState,
                        y: y + 1,
                    });
                    break;
                case 'EAST':
                    if (x === 4) {
                        callback(currentState, 'cannot go east');
                        break;
                    }
                    callback({
                        ...currentState,
                        x: x + 1,
                    });
                    break;
                case 'SOUTH':
                    if (y === 0) {
                        callback(currentState, 'cannot go south');
                        break;
                    }
                    callback({
                        ...currentState,
                        y: y - 1,
                    });
                    break;
                case 'WEST':
                    if (x === 0) {
                        callback(currentState, 'cannot go west');
                        break;
                    }
                    callback({
                        ...currentState,
                        x: x - 1,
                    });
                    break;
                default:
                    throw 'err';
            }
            break;
        case 'REPORT':
            callback(currentState, `${x}, ${y}, ${f}`);
            break;
        default:
            break;
    }
};

export {
    key2CommandMap,
    executeCommand,
};
