import { parseCommand, executeCommand } from "./commandEngine";
// import shallowEqual from './shallowEqual';

describe('test Command Engine', () => {
    it('should parse command correctly', () => {
        const commandPool = [{
            command: 'plAcE 0 , 1       , noRth',
            expectedResult: {
                command: 'PLACE',
                args: ["0", "1", 'NORTH'],
            },
        },
        {
            command: 'left',
            expectedResult: {
                command: 'LEFT',
            },
        },
        {
            command: 'RIGht',
            expectedResult: {
                command: 'RIGHT',
            },
        },
        {
            command: 'MOve',
            expectedResult: {
                command: 'MOVE',
            },
        },
        {
            command: 'ReporT',
            expectedResult: {
                command: 'REPORT',
            },
        },
        {
            command: 'invalid command',
            expectedResult: undefined,
        }];

        commandPool.forEach((cmd) => {
            const parseResult = parseCommand(cmd.command);
            expect(parseResult).toEqual(cmd.expectedResult);
        });
    });
    it('should never mutate state directly', () => {
        const currentState = { x: 0, y: 0, f: 'NORTH' };
        const command1 = 'place 0,0, north';
        const cb = jest.fn();
        executeCommand(currentState, command1, cb);
        expect(cb.mock.calls.length).toBe(1);
        expect(cb.mock.calls[0][0]).not.toBe(currentState);
        expect(cb.mock.calls[0][0]).toEqual(currentState);
    });
    it('should handle invalid command correctly', () => {
        const currentState = { x: 0, y: 0, f: 'NORTH' };
        const command = 'invalid command';
        const cb = jest.fn();
        executeCommand(currentState, command, cb);
        expect(cb.mock.calls.length).toBe(1);
        expect(cb.mock.calls[0][0]).toBe(currentState);
        expect(cb.mock.calls[0][1]).toBe(`invalid command:${command}`);
    });
    it('should execute place command correctly', () => {
        const currentState = { x: 1, y: 2, f: 'WEST' };
        const command1 = 'place 0,0, north';
        const cb = jest.fn();
        executeCommand(currentState, command1, cb);
        expect(cb.mock.calls.length).toBe(1);
        expect(cb.mock.calls[0][0]).toEqual({ x: 0, y: 0, f: 'NORTH' });
        expect(cb.mock.calls[0][1]).toBe(undefined);
        cb.mockReset();

        const command2 = 'place 5,0, north';
        executeCommand(currentState, command2, cb);
        expect(cb.mock.calls.length).toBe(1);
        expect(cb.mock.calls[0][0]).toBe(currentState);
        expect(cb.mock.calls[0][1]).toBe('cannot go outside the pen');
    });
    it('should change direction correctly', () => {
        const currentState = { x: 1, y: 2, f: 'NORTH' };
        const command1 = 'LEFT';
        const cb = jest.fn();
        executeCommand(currentState, command1, cb);
        expect(cb.mock.calls.length).toBe(1);
        expect(cb.mock.calls[0][0]).toEqual({ x: 1, y: 2, f: 'WEST' });
        expect(cb.mock.calls[0][1]).toBe(undefined);
        cb.mockReset();

        const command2 = 'RIGHT';
        executeCommand(currentState, command2, cb);
        expect(cb.mock.calls.length).toBe(1);
        expect(cb.mock.calls[0][0]).toEqual({ x: 1, y: 2, f: 'EAST' });
        expect(cb.mock.calls[0][1]).toBe(undefined);
    });
    it('should move correctly', () => {
        const currentState1 = { x: 1, y: 2, f: 'NORTH' };
        const command1 = 'MOVE';
        const cb = jest.fn();
        executeCommand(currentState1, command1, cb);
        expect(cb.mock.calls.length).toBe(1);
        expect(cb.mock.calls[0][0]).toEqual({ x: 1, y: 3, f: 'NORTH' });
        expect(cb.mock.calls[0][1]).toBe(undefined);
        cb.mockReset();

        const currentState2 = { x: 1, y: 4, f: 'NORTH' };
        const command2 = 'MOVE';
        executeCommand(currentState2, command2, cb);
        expect(cb.mock.calls.length).toBe(1);
        expect(cb.mock.calls[0][0]).toBe(currentState2);
        expect(cb.mock.calls[0][1]).toBe('cannot go north');
    });
    it('should show Report correctly', () => {
        const currentState = { x: 1, y: 2, f: 'NORTH' };
        const command = 'REPORT';
        const cb = jest.fn();
        executeCommand(currentState, command, cb);
        expect(cb.mock.calls.length).toBe(1);
        expect(cb.mock.calls[0][0]).toBe(currentState);
        expect(cb.mock.calls[0][1]).toBe('1, 2, NORTH');
        cb.mockReset();
    });
});
