import { dataFromGraph } from "webscape-wanderer";
import { openDB } from 'idb';

const DB_NAME = 'GraphEdgesDB';
const STORE_NAME = 'edges';

async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      const store = db.createObjectStore(STORE_NAME, { keyPath: ['tapSenderId', 'tapReceiverId'] });
      store.createIndex('updatedAt', 'updatedAt');
    },
  });
}

async function getMostRecentTimestamp() {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const cursor = await store.index('updatedAt').openCursor(null, 'prev');
  if (cursor) {
    return new Date(cursor.value.updatedAt);
  }
  return new Date(0); // Return epoch if no entries
}

async function storeEdges(edges) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  for (const edge of edges) {
    await store.put(edge);
  }
  await tx.done;
}

async function getAllEdges() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function countAllEdges() {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  return store.count();
}

export function prepareGraphData(edgeList) {
  const seenNodeIds = new Set();
  const nodes = [];
  const edges = [];

  for (const { tapSenderId: source, tapReceiverId: target, updatedAt: timestamp } of edgeList) {
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

  const graph = dataFromGraph({ nodes, links: edges });
  return graph
}

function fakeUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function fetchMockEdgeList(numNodes = 5, numEdges = 7) {
  const nodeIds = Array.from({ length: numNodes }, () => fakeUUID());
  const edgeList = [];

  for (let i = 0; i < numEdges; i++) {
    const fromIndex = Math.floor(Math.random() * numNodes);
    let toIndex;
    do {
      toIndex = Math.floor(Math.random() * numNodes);
    } while (toIndex === fromIndex);

    edgeList.push({
      tapSenderId: nodeIds[fromIndex],
      tapReceiverId: nodeIds[toIndex],
      updatedAt: new Date(Date.now() - i * 60000).toISOString(),
      fake: true  // Add this field to easily identify mock data
    });
  }

  return edgeList;
}

export async function fetchEdgeList() {
  async function fetchNewEdges() {
    const lastUpdatedAt = await getMostRecentTimestamp();
    const response = await fetch(`https://api.connections.cursive.team/api/graph/edge?fetchUpdatedAtAfter=${lastUpdatedAt.toISOString()}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  }

  async function handleEdges(edges) {
    if (edges.length > 0) {
      await storeEdges(edges);
      console.log(`Stored ${edges.length} new edges`);
    } else {
      console.log('No new edges to store');
    }
    return getAllEdges();
  }

  async function edgesOrMock() {
    const allEdges = await getAllEdges();
    const edgeCount = allEdges.length;
    console.log(`Total edges in DB: ${edgeCount}`);
    return edgeCount < 10 ? fetchMockEdgeList(100, 200) : allEdges;
  }

  try {
    const newEdges = await fetchNewEdges();
    await handleEdges(newEdges);
    return edgesOrMock();
  } catch (error) {
    console.error('Fetch failed:', error);
    return edgesOrMock();
  }
}
