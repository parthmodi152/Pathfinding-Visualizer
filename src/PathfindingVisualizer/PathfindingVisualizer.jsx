import React, { Component } from "react";
import Node from "./Node/Node";
import "./PathfindingVisualizer.css";
import { dijkstra } from "../Algorithms/dijkstra.js";
import { astar } from "../Algorithms/astar.js";
import { bfs } from "../Algorithms/bfs.js";
import { getNodesInShortestPathOrder } from "../Algorithms/utils.js";

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
      obstacle: "wall",
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        // console.log(node);
        if (nodesInShortestPathOrder.length > 1) {
          if (i === 0) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node start-node-shortest-path";
          } else if (i === nodesInShortestPathOrder.length - 1) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node finish-node-shortest-path";
          } else {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-shortest-path";
          }
        }
      }, 30 * i);
    }
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (i === 0) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node start-node-visited";
        } else if (
          i === visitedNodesInOrder.length - 1 &&
          nodesInShortestPathOrder.length > 1
        ) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node finish-node-visited";
        } else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
        }
      }, 10 * i);
    }
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
      const newGrid = createNewGridWithWallToggled(
        this.state.grid,
        row,
        col,
        this.state.obstacle
      );
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
      const newGrid = createNewGridWithWallToggled(
        this.state.grid,
        row,
        col,
        this.state.obstacle
      );
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
    const visitedNodesInOrder = astar(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  clearGrid(keepWall = false, keepWeight = false, keepBomb = false) {
    const { grid } = this.state;
    for (let row of grid) {
      for (let node of row) {
        if (node.row === START_NODE_ROW && node.col === START_NODE_COL) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-start";
        } else if (
          node.row === FINISH_NODE_ROW &&
          node.col === FINISH_NODE_COL
        ) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-finish";
        } else if (node.isWall && keepWall) {
          continue;
        } else if (node.isWeight && keepWeight) {
          continue;
        } else if (node.isBomb && keepBomb) {
          continue;
        } else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node ";
        }
        this.resetNode(node, keepWall, keepWeight, keepBomb);
      }
    }
  }

  resetNode(node, keepWall = false, keepWeight = false, keepBomb = false) {
    node.distance = Infinity;
    node.isVisited = false;
    node.previousNode = null;
    node.g = 0;
    node.f = 0;
    if (!keepWall) {
      node.isWall = false;
    }
    if (!keepWeight) {
      node.isWeight = false;
    }
    if (!keepBomb) {
      node.isBomb = false;
    }
  }

  changeObstacle(obstacle) {
    this.setState({ obstacle: obstacle });
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <button onClick={() => this.visualizeDJ()}>
          Visualize A Star Algorithm
        </button>
        <button
          onClick={() =>
            this.clearGrid(
              ((this.keepWall = false),
              (this.keepWeight = false),
              (this.keepBomb = false))
            )
          }
        >
          Reset
        </button>
        <button onClick={() => this.changeObstacle("wall")}>Add Wall</button>
        <button onClick={() => this.changeObstacle("weight")}>
          Add Weight
        </button>
        <button onClick={() => this.changeObstacle("bomb")}>Add Bomb</button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className="row">
                {row.map((node, nodeIdx) => {
                  const {
                    row,
                    col,
                    isFinish,
                    isStart,
                    isWall,
                    isWeight,
                    isBomb,
                  } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      isWeight={isWeight}
                      isBomb={isBomb}
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
    isWeight: false,
    isBomb: false,
    previousNode: null,
    h: Math.abs(FINISH_NODE_COL - col) + Math.abs(FINISH_NODE_ROW - row),
    g: 0,
    f: 0,
  };
};

const createNewGridWithWallToggled = (grid, row, col, obstacle) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  var newNode = null;
  if (obstacle === "wall") {
    newNode = {
      ...node,
      isWall: !node.isWall,
    };
  } else if (obstacle === "weight") {
    newNode = {
      ...node,
      isWeight: !node.isWeight,
    };
  } else if (obstacle === "bomb") {
    newNode = {
      ...node,
      isBomb: !node.isBomb,
    };
  }
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
