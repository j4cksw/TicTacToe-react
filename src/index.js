import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Coordinates(x, y) {
    return {
        x: x,
        y: y
    };
}

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i, coordinates) {
        return <Square 
            key={"sq" + i}
            value={this.props.squares[i]} 
            onClick={()=>{this.props.onClick(i, coordinates)}}
        />;
    }

    render() {

        const coordinates = [
            [ 
                Coordinates(0, 0),
                Coordinates(0, 1),
                Coordinates(0, 2), 
            ],
            [
                Coordinates(1, 0),
                Coordinates(1, 1),
                Coordinates(1, 2),
            ],
            [
                Coordinates(2, 0),
                Coordinates(2, 1),
                Coordinates(2, 2),
            ],
        ]

        const rows = coordinates.map((row, i)=> {
            const columns = row.map((column, j)=>{
                return this.renderSquare(j + (3*i), column)
            });

            return (
                <div key={"row"+i} className="board-row">
                    { columns }
                </div>
            );
        })

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class HistoryItem extends React.Component {

    render() {
        return (
            <li>
                <button
                    className={this.props.styles} 
                    onClick={
                        () => this.props.onClick()}
                >
                    {this.props.desc}
                </button>
            </li>
        );
    }
}

class HistoryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStyles: Array(this.props.history.length).fill("deselected"),
            buttonText: "Old to new"
        };
    }

    selectedOn(index) {
        let selectedStyles = this.state.selectedStyles.map(()=>"deselected");
        selectedStyles[index] = "selected";
        this.setState({
            selectedStyles: selectedStyles
        });
    }

    swapOrder() {
        this.setState({
            buttonText: "New to old"
        })
    }

    render() {
        const history = this.props.history;
        const moves = history.map((step, move) => {
            const desc = move ? 'Go to turn #' + move + ' (' + step.state + ' at ' + step.coordinates.x + ' ' + step.coordinates.y + ')': 'Go to start';
            return(
                <HistoryItem
                    key={move}
                    move={move} 
                    desc={desc}
                    styles={this.state.selectedStyles[move]} 
                    onClick={()=>{
                        this.selectedOn(move);
                        this.props.onClick(move);
                    }}
                />
            );
        })

        return (
            <div>
                <ol>{moves}</ol>
                <button onClick={()=>this.swapOrder()}>
                    {this.state.buttonText}
                </button>
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                coordinates: null,
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            historyItemStyles: ["selected"]
        };
    }

    handleClick(i, cooredinates) {
        console.log(cooredinates);
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X": "O";
        this.setState({ 
            history: history.concat([{
                coordinates: cooredinates,
                state: squares[i],
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step%2)===0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next Player. " + (this.state.xIsNext ? "X": "O");
        }

        return(
            
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i, c)=>this.handleClick(i, c)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <HistoryList
                        history={history}
                        onClick={(i)=>this.jumpTo(i)}
                    />
                </div>
            </div>
        )
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for(let i =0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] == squares[c]) {
            return squares[a];
        }
    }

    return null;
}

ReactDOM.render(
    <Game />,
    document.getElementById("root")
)