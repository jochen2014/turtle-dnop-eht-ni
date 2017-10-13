import React, { Component } from 'react';
import * as CommandEngine from '../common/commandEngine';


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

    // #region hookup window.keydown event
    componentWillMount() {
        document.addEventListener("keydown", this.handleNavigation);
    }

    componentWillUnmount() {
        // NOTE:When the page refreshes react doesn't have the chance to unmount the components as normal.
        // Use the window.onbeforeunload event to set a handler for refresh
        document.removeEventListener("keydown", this.handleNavigation);
    }
    // #endregion

    // user presses left/up/right/down key
    handleNavigation = (e) => {
        const found = CommandEngine.key2CommandMap.find(m => m.key === e.key);
        if (found) {
            CommandEngine.executeCommand(this.state, found.command, this.onCommandExecuted);
        }
    }

    // user presses Enter on command input
    handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            this.handleGoButtonClick();
        }
    }

    // user clicks the 'Go' button
    handleGoButtonClick = () => {
        const { command } = this.state;
        if (command) {
            CommandEngine.executeCommand(this.state, command, this.onCommandExecuted);
            this.setState({
                command: '',
            });
        }
    }

    /**
     * command callback. the Command Execute Engine will call this function with updated state after
     * it executed a valid move or change direction command
     * and an alert message after 
     *      1.it encoutered invalid command,  Or 
     *      2.executed 'REPORT' command
     */
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

    // user clicks a div with coordinate x, y
    onCellClicked = (x, y) => () => {
        this.setState({
            x,
            y,
        });
    }

    // get the css class name for a cell by its coorinate
    getCellClassName = (x, y) => {
        const { x: selectedX, y: selectedY, f } = this.state;
        if (x === selectedX && y === selectedY) {
            return `selected-${f.toLowerCase()[0]}`;
        }
        return '';
    }

    // user updates command
    onCommandValueChanged = (e) => {
        const { target: { value } } = e;
        this.setState({
            command: value,
        });
    }

    render() {
        const { command, reports } = this.state;
        return <div className="main">
            <div className="header">
                <div className="title">
                    <h1>Turtle in the Pond</h1>
                </div>
                <div className="command">
                    <input type="text" value={command} onChange={this.onCommandValueChanged} onKeyPress={this.handleEnterKey} />
                    <button onClick={this.handleGoButtonClick}>Go</button>
                </div>
            </div>

            <div className="content" >
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
                <div className="log">
                    {
                        reports.map((r, index) => (
                            <div key={`key_${index}`}>{r}</div>
                        ))
                    }
                </div>
            </div>
        </div >;
    }
}
export default HomePage;
