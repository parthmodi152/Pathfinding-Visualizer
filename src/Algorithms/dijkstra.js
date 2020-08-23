import {
  getAllNodes,
  getUnvisitedNeighbors,
  sortNodesByDistance,
} from "./utils.js";

export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  startNode.previousNode = null;
  const unvisitedNodes = getAllNodes(grid);
  while (unvisitedNodes.length != 0) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    if (closestNode.isWall && !closestNode.isBomb) continue;
    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    const unvisitedNeighbors = getUnvisitedNeighbors(closestNode, grid);
    for (const neighbor of unvisitedNeighbors) {
      if (closestNode.distance < neighbor.distance) {
        if (neighbor.isWeight && !neighbor.isBomb) {
          neighbor.distance = closestNode.distance + 500;
        } else {
          neighbor.distance = closestNode.distance + 1;
        }

        neighbor.previousNode = closestNode;
      }
    }
  }
}
