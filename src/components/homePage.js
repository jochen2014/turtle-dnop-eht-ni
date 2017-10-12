import React, { Component } from 'react';
import { parseCommand } from '../common/commands';

const directions = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
const keyMap = [{
    key: 'ArrowLeft',
    command: 'LEFT'
}, {
    key: 'ArrowUp',
    command: 'MOVE'
}, {
    key: 'ArrowRight',
    command: 'RIGHT'
}, {
    key: 'ArrowDown',
    command: 'REPORT'
}]
class HomePage extends Component {

    constructor() {
        super();
        this.state = {
            command: '',
            f: 'NORTH',
            x: 0,
            y: 0,
            reports: [],
        }
    }

    componentWillMount() {
        document.addEventListener("keydown", this.handleKeyDown);
    }

    componentWillUnmount() {
        // NOTE:When the page refreshes react doesn't have the chance to unmount the components as normal. 
        // Use the window.onbeforeunload event to set a handler for refresh
        document.removeEventListener("keydown", this.handleKeyDown);
    }

    addReport = newReport => {
        const { reports } = this.state;
        const newReports = [...reports].concat([newReport]).slice(-5); //we keep 5 maximum logs;
        const self = this;
        setTimeout(function() {
            self.setState({
                reports: newReports,
            })
        }, 500);
    }

    executeCommand = (_command, args) => {
        //place 0, 0, north
        console.log(`---------  executing command ${_command} with args ${args}`);
        const command = _command.toUpperCase();
        const { x, y, f: facing } = this.state;
        const directionIndex = directions.indexOf(facing);
        switch (command) {
            case 'PLACE': {
                const [x, y, f] = args;
                if (x > 4 || y > 4) {
                    this.addReport('cannot go outside the pen');
                    return;
                }
                console.log(`---------  set facing => ${f.toUpperCase()}`);
                this.setState({
                    x: Number(x),
                    y: Number(y),
                    f: f.toUpperCase(),
                }, ()=>{
                    console.log(` ==========  ${this.state.f}`);
                })
                break;
            }
            case 'LEFT':
                this.setState({
                    f: directions[(directionIndex + 3) % 4]
                });
                break;
            case 'MOVE':
                switch (directionIndex) {
                    case 0: //north
                        if (y === 4) {
                            this.addReport('cannot go north')
                            return false;
                        }
                        this.setState({
                            y: y + 1,
                        })
                        break;
                    case 1: //east
                        if (x === 4) {
                            this.addReport('cannot go east')
                            return false;
                        }
                        this.setState({
                            x: x + 1,
                        })
                        break;
                    case 2: //south
                        if (y === 0) {
                            this.addReport('cannot go south')
                            return false;
                        }
                        this.setState({
                            y: y - 1,
                        })
                        break;
                    case 3: //west
                        if (x === 0) {
                            this.addReport('cannot go west')
                            return false;
                        }
                        this.setState({
                            x: x - 1,
                        })
                        break;
                }
                break;
            case 'RIGHT':
                this.setState({
                    f: directions[(directionIndex + 1) % 4]
                });
                break;
            case 'REPORT':
                this.addReport(`${x},${y},${facing}`);
                break;
            default:
                break;
        }
    }

    handleKeyDown = e => {
        const result = keyMap.find(m => m.key === e.key);
        if (result) {
            this.executeCommand(result.command);
        }

    }

    onCellClicked = (x, y) => e => {
        this.setState({
            x,
            y
        })
    }

    getCellClassName = (x, y) => {
        const { x: selectedX, y: selectedY, f } = this.state;
        if (x === selectedX && y === selectedY) {
            return 'selected-' + f.toLowerCase()[0];
        }
        return '';
    }

    onCommandChanged = e => {
        const { target: { value } } = e;
        this.setState({
            command: value
        })


    }

    onCommandKeyPressed = e => {
        if (e.key === 'Enter') {
            this.onExecuteCommand();
        }
    }
    onExecuteCommand = e => {
        const { command } = this.state;
        if (!command) {
            return;
        }
        const parsedCommand = parseCommand(command)
        if (parsedCommand) {
            const { command, args } = parsedCommand;
            this.executeCommand(command, args);
        } else {
            this.addReport(`invalid command: ${command}`);
        }
        this.setState({
            command: '',
        })
    }

    render() {
        const { command, reports , f} = this.state;
        console.log(`---------  facing ${f}`);
        return <div className="container">
            <div className="title">
                <h1>Turtle in the Pond</h1>
            </div>
            <div className="command">
                <input type="text" value={command} onChange={this.onCommandChanged} onKeyPress={this.onCommandKeyPressed} />
                <button onClick={this.onExecuteCommand}>Go</button>
            </div>
            <div className="canvas" >
                {
                    Array.from({ length: 5 }).map((e, rowIndex) => (
                        < div className="row" key={`row_${rowIndex}`}>
                            {
                                Array.from({ length: 5 }).map((e, columnIndex) => (
                                    <div key={`${4 - rowIndex}_${columnIndex}`} className={this.getCellClassName(columnIndex, 4 - rowIndex)}
                                        data-x={columnIndex}
                                        data-y={4 - rowIndex}
                                        onClick={this.onCellClicked(columnIndex, 4 - rowIndex)} />))
                            }
                        </div>
                    ))
                }
            </div>
            <div className="log">
                {
                    reports.map((r, index) => (
                        <div key={`key_${index}`}>{r}</div>
                    ))
                }
            </div>
        </div >
    }
}
export default HomePage;