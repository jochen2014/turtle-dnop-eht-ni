import React, { Component } from 'react';
import * as Commands from '../common/commands';


class HomePage extends Component {
    constructor() {
        super();
        this.state = {
            command: '',
            f: 'NORTH',
            x: 0,
            y: 0,
            reports: [],
        };
    }
    // #region document.addEventListener
    componentWillMount() {
        document.addEventListener("keydown", this.handleNavigation);
    }

    componentWillUnmount() {
        // NOTE:When the page refreshes react doesn't have the chance to unmount the components as normal.
        // Use the window.onbeforeunload event to set a handler for refresh
        document.removeEventListener("keydown", this.handleNavigation);
    }
    // #endregion

    // #region command handling
    onCommandExecuted = (newState, alert) => {
        if (alert) { // we either encounterred an error, or this is a 'REPORT' command;
            const { reports } = this.state;
            const newReports = [...reports].concat([alert]).slice(-5); // we keep 5 maximum logs;
            this.setState({
                reports: newReports,
            });
        } else { // turtle moves to a new location or change its direction
            this.setState(newState); // make sure newState doesn't shallowEqual to this.state!
        }
    }

    handleNavigation = (e) => {
        const found = Commands.key2CommandMap.find(m => m.key === e.key);
        if (found) {
            Commands.executeCommand(this.state, found.command, this.onCommandExecuted);
        }
    }

    handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            this.handleGoButtonClick();
        }
    }

    handleGoButtonClick = () => {
        const { command } = this.state;
        if (command) {
            Commands.executeCommand(this.state, command, this.onCommandExecuted);
            this.setState({
                command: '',
            });
        }
    }
    // #endregion


    onCellClicked = (x, y) => () => {
        this.setState({
            x,
            y,
        });
    }

    getCellClassName = (x, y) => {
        const { x: selectedX, y: selectedY, f } = this.state;
        if (x === selectedX && y === selectedY) {
            return `selected-${f.toLowerCase()[0]}`;
        }
        return '';
    }

    onCommandValueChanged = (e) => {
        const { target: { value } } = e;
        this.setState({
            command: value,
        });
    }

    render() {
        const { command, reports } = this.state;
        return <div className="container">
            <div className="title">
                <h1>Turtle in the Pond</h1>
            </div>
            <div className="command">
                <input type="text" value={command} onChange={this.onCommandValueChanged} onKeyPress={this.handleEnterKey} />
                <button onClick={this.handleGoButtonClick}>Go</button>
            </div>
            <div className="canvas" >
                {
                    Array.from({ length: 5 }).map((e, rowIndex) => (
                        < div className="row" key={`row_${rowIndex}`}>
                            {
                                Array.from({ length: 5 }).map((_, columnIndex) => (
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
        </div >;
    }
}
export default HomePage;
