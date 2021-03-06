import { getUnvisitedNeighbors } from "./utils.js";

export function bfs(grid, startNode, finishNode) {
  startNode.distance = 0;
  const visitedNodesInOrder = [];
  const queue = [];
  startNode.previousNode = null;
  queue.push(startNode);
  while (queue.length > 0) {
    const currentNode = queue.shift();
    if (currentNode == finishNode) {
      visitedNodesInOrder.push(currentNode);
      return visitedNodesInOrder;
    }

    if (
      (!currentNode.isWall && !currentNode.isVisited) ||
      (currentNode.isBomb && !currentNode.isVisited)
    ) {
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);
      const neighbors = getUnvisitedNeighbors(currentNode, grid);
      for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];
        if (!neighbors.isWall) {
          queue.push(neighbor);
          neighbor.previousNode = currentNode;
          neighbor.distance = currentNode.distance + 1;
        }
      }
    }
  }

  return visitedNodesInOrder;
}
