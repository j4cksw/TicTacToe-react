import { prettyDOM } from '@testing-library/react';
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
            value={this.props.squares[i]} 
            onClick={()=>{this.props.onClick(i, coordinates)}}
        />;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0, Coordinates(0, 0))}
                    {this.renderSquare(1, Coordinates(0, 1))}
                    {this.renderSquare(2, Coordinates(0, 2))}
                </div>
                <div className="board-row">
                    {this.renderSquare(3, Coordinates(1, 0))}
                    {this.renderSquare(4, Coordinates(1, 1))}
                    {this.renderSquare(5, Coordinates(1, 2))}
                </div>
                <div className="board-row">
                    {this.renderSquare(6, Coordinates(2, 0))}
                    {this.renderSquare(7, Coordinates(2, 1))}
                    {this.renderSquare(8, Coordinates(2, 2))}
                </div>
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
            xIsNext: true
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

        const moves = history.map((step, move) => {
            console.log(move)
            const desc = move ? 'Go to turn #' + move + ' (' + step.state + ' at ' + step.coordinates.x + ' ' + step.coordinates.y + ')': 'Go to start';
            return(
                <li key={move}>
                    <button onClick={()=>this.jumpTo(move)}>{desc}</button>
                </li>
            );
        })

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
                    <ol>{moves}</ol>
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