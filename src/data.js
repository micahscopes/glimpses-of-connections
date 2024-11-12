import { dataFromGraph } from "webscape-wanderer";

export function prepareGraphData(edgeList) {
  const seenNodeIds = new Set();
  const nodes = [];
  const edges = [];

  for (const { source, target, timestamp } of edgeList) {
    if (!seenNodeIds.has(source)) {
      seenNodeIds.add(source);
      nodes.push({ id: source });
    }
    if (!seenNodeIds.has(target)) {
      seenNodeIds.add(target);
      nodes.push({ id: target });
    }
    edges.push({
      source,
      target,
      timestamp,
    });
  }

  return dataFromGraph({ nodes, links: edges });
}

function fakeUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function fetchMockEdgeList(numNodes = 5, numEdges = 7) {
  const generateGraph = (nodes, edges) => {
    const nodeIds = Array.from({ length: nodes }, () => fakeUUID());
    const edgeList = [];

    for (let i = 0; i < edges; i++) {
      const fromIndex = Math.floor(Math.random() * nodes);
      let toIndex;
      toIndex = Math.floor(Math.random() * nodes);
      while (toIndex === fromIndex) {
        toIndex = Math.floor(Math.random() * nodes);
      }

      edgeList.push({
        source: nodeIds[fromIndex],
        target: nodeIds[toIndex],
        timestamp: Date.now() - i * 60000,
      });
    }

    return edgeList;
  };

  return generateGraph(numNodes, numEdges);
  // Returns random data of the format:
  // [
  //   {
  //     source: "123e4567-e89b-12d3-a456-426614174000",
  //     target: "987e6543-e21b-12d3-a456-426614174000",
  //     timestamp: Date.now(),
  //   },
  //   {
  //     source: "456e7890-e12b-34d5-b678-426614174000",
  //     target: "321e9876-e54b-34d5-b678-426614174000",
  //     timestamp: Date.now() - 60000,
  //   },
  //   {
  //     source: "789e0123-e45b-56d7-c890-426614174000",
  //     target: "654e3210-e78b-56d7-c890-426614174000",
  //     timestamp: Date.now() - 120000,
  //   },
  // ];
  //
}

export async function fetchEdgeList() {
  let lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  let fetchUpdatedAtAfter = lastWeek.toISOString();
  try {
    let response = await fetch(`https://api.connections.cursive.team/api/graph/edge?fetchUpdatedAtAfter=${fetchUpdatedAtAfter}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    let edges = await response.json();
    if (edges.length < 4) {
      return fetchMockEdgeList(100, 200);
    }
    console.log(edges);
    return edges;
  } catch (error) {
    console.error('Fetch failed:', error);
    return fetchMockEdgeList(100, 200);
  }
}
