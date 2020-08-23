import React, { Component } from "react";

import "./Node.css";

export default class Node extends Component {
  render() {
    const {
      col,
      isFinish,
      isStart,
      isWall,
      isWeight,
      isBomb,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      row,
    } = this.props;

    var isWallandBomb = false;
    if (isWall & isBomb) {
      isWallandBomb = true;
    }
    var isWeightandBomb = false;
    if (isWeight & isBomb) {
      isWeightandBomb = true;
    }
    const extraClassName = isFinish
      ? "node-finish"
      : isStart
      ? "node-start"
      : isWallandBomb
      ? "node-wall node-bomb"
      : isWeightandBomb
      ? "node-weight node-bomb"
      : isWall
      ? "node-wall"
      : isWeight
      ? "node-weight"
      : isBomb
      ? "node-bomb"
      : "";

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      ></div>
    );
  }
}
