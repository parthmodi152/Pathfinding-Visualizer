export function as(grid, startNode, finishNode) {
  var openSet = [];
  var closedSet = [];

  openSet.push(startNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);

    var closestNode = openSet.shift();

    closedSet.push(closestNode);
    closestNode.isVisited = true;

    if (closestNode.isFinish) return closedSet;

    var nodeNeighbors = getNeighbors(closestNode, grid);
    for (var i = 0; i < nodeNeighbors.length; i++) {
      var neighbor = nodeNeighbors[i];
      if (!neighbor.isVisited && !neighbor.isWall) {
        var tempG = closestNode.g + 1;

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

        neighbor.f = neighbor.h + neighbor.g;
      } else continue;
    }
  }

  return closedSet;
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}
