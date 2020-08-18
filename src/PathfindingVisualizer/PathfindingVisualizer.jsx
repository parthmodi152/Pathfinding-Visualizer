import React, { Component } from "react";
import Node from "./Node/Node";
import "./PathfindingVisualizer.css";
import { dj, getNodesInShortestPathOrder } from "../Algorithms/dj.js";
import { as } from "../Algorithms/as.js";

var START_NODE_ROW = 5;
var START_NODE_COL = 10;
var FINISH_NODE_ROW = 5;
var FINISH_NODE_COL = 40;

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
      specialNodePressed: "none",
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const node = this.state.grid[row][col];
    if (node.isStart) {
      const newGrid = createNewGridWithStartNodeToggled(
        this.state.grid,
        row,
        col
      );
      this.setState({
        grid: newGrid,
        mouseIsPressed: true,
        specialNodePressed: "start",
      });
    } else if (node.isFinish) {
      const newGrid = createNewGridWithFinishNodeToggled(
        this.state.grid,
        row,
        col
      );
      this.setState({
        grid: newGrid,
        mouseIsPressed: true,
        specialNodePressed: "finish",
      });
    } else {
      const newGrid = createNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    if (this.state.specialNodePressed === "start") {
      const newGrid = createNewGridWithStartNodeToggled(
        this.state.grid,
        row,
        col
      );
      this.setState({ grid: newGrid });
    } else if (this.state.specialNodePressed === "finish") {
      const newGrid = createNewGridWithFinishNodeToggled(
        this.state.grid,
        row,
        col
      );
      this.setState({ grid: newGrid });
    } else {
      const newGrid = createNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    }
  }

  handleMouseUp(row, col) {
    this.setState({ mouseIsPressed: false, specialNodePressed: "none" });
  }

  visualizeDJ() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = as(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    console.log(nodesInShortestPathOrder);
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <button onClick={() => this.visualizeDJ()}>
          Visualize A Star Algorithm
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className="row">
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 10; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
    h: Math.abs(FINISH_NODE_COL - col) + Math.abs(FINISH_NODE_ROW - row),
    g: 0,
    f: 0,
  };
};

const createNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const createNewGridWithStartNodeToggled = (grid, row, col) => {
  const newGrid = grid.slice();

  const oldStartNode = newGrid[START_NODE_ROW][START_NODE_COL];
  oldStartNode.isStart = false;

  START_NODE_ROW = row;
  START_NODE_COL = col;
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isStart: true,
  };
  newGrid[row][col] = newNode;

  return newGrid;
};

const createNewGridWithFinishNodeToggled = (grid, row, col) => {
  const newGrid = grid.slice();

  const oldFinishNode = newGrid[FINISH_NODE_ROW][FINISH_NODE_COL];
  oldFinishNode.isFinish = false;

  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isFinish: true,
  };
  newGrid[row][col] = newNode;
  FINISH_NODE_ROW = row;
  FINISH_NODE_COL = col;
  return newGrid;
};
