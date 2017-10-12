import React, { Component } from 'react';

class HomePage extends Component {
    constructor() {
        super();
        this.state = {
            x: 0,
            y: 0,
        }
    }
    onCellClicked = (x, y) => e => {
        this.setState({
            x,
            y
        })
    }
    getCellClassName = (x, y) => {
        const { x: selectedX, y: selectedY } = this.state;
        if (x === selectedX && y === selectedY) {
            return 'selected'
        }
        return '';
    }

    render() {
        return <div className="container">
            <div className="title">
                <h1>Turtle in the Pond</h1>
            </div>
            <div className="command">
                <input type="text" />
                <button>Go</button>
            </div>
            <div className="canvas">
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
        </div >
    }
}
export default HomePage;