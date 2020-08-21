export function astar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const testedNodesInOrder = [];
  startNode.distance = 0;
  startNode.total_distance = startNode.distance + startNode.heuristic;
  const unvisitedNodes = [];
  unvisitedNodes.push(startNode);

  while (unvisitedNodes.length > 0) {
    var c = 0;
    c++;
    console.log(c);
    sortNodesByDistance(unvisitedNodes);

    if (unvisitedNodes.length != 0 && unvisitedNodes[0].isVisited) {
      unvisitedNodes.shift();
    }

    if (unvisitedNodes.length == 0) {
      break;
    }

    var nodeCurrent = unvisitedNodes[0];
    nodeCurrent.isVisited = true;
    visitedNodesInOrder.push(nodeCurrent);

    var nodeNeighbours = getFilteredNeighbors(nodeCurrent, grid);

    for (var i = 0; i < nodeNeighbours.length; i++) {
      unvisitedNodes.push(nodeNeighbours[i]);
      if (nodeCurrent.distance + 1 < nodeNeighbours[i].distance) {
        nodeNeighbours[i].previousNode = nodeCurrent;
        nodeNeighbours[i].distance = nodeCurrent.distance + 1;
        nodeNeighbours[i].total_distance =
          nodeNeighbours[i].distance + nodeNeighbours[i].heuristic;
      }
    }
  }

  return visitedNodesInOrder;
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort(
    (nodeA, nodeB) => nodeA.total_distance - nodeB.total_distance
  );
}

function getFilteredNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(
    (neighbor) => !neighbor.isVisited && !neighbor.isWall
  );
}

export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
