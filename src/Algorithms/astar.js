import { getNeighbors } from "./utils.js";

export function astar(grid, startNode, finishNode) {
  var openSet = [];
  var closedSet = [];

  openSet.push(startNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);

    var closestNode = openSet.shift();

    closedSet.push(closestNode);
    closestNode.isVisited = true;

    if (closestNode === finishNode) return closedSet;

    var nodeNeighbors = getNeighbors(closestNode, grid);
    for (var i = 0; i < nodeNeighbors.length; i++) {
      var neighbor = nodeNeighbors[i];
      if (!neighbor.isVisited && !neighbor.isWall) {
        var tempG = 0;
        if (neighbor.isWeight) {
          tempG = closestNode.g + 500;
        } else {
          tempG = closestNode.g + 1;
        }

        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            neighbor.previousNode = closestNode;
          }
        } else {
          neighbor.g = tempG;
          openSet.push(neighbor);
          neighbor.previousNode = closestNode;
        }
        neighbor.h =
          Math.abs(finishNode.col - neighbor.col) +
          Math.abs(finishNode.row - neighbor.row);
        neighbor.f = neighbor.h + neighbor.g;
      } else continue;
    }
  }

  return closedSet;
}
