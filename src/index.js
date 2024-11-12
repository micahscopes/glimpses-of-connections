import { randomGraphData, startWebscapeWanderer } from "webscape-wanderer";
import { fetchEdgeList, prepareGraphData } from "./data";

import personUrl from '../abstract-person.obj?url';

document.addEventListener("DOMContentLoaded", async () => {
  startWebscapeWanderer({
    powerPreference: 'high-performance',
    preserveDrawingBuffer: 'true',
    antialias: true
  });
  const w = document.querySelector("webscape-wanderer");
  const edgeList = await fetchEdgeList();
  const graph = prepareGraphData(edgeList);
  // const randomGraph = randomGraphData(50, 50);
  w.graphData = graph;
  w.setAttribute('node-shape', personUrl)
});

let lastTouchTime = Date.now();

document.addEventListener('touchstart', () => {
  lastTouchTime = Date.now();
});

setInterval(() => {
  if (Date.now() - lastTouchTime > 2*60*1000) { // 2 minutes in milliseconds
    location.reload();
  }
}, 10000); // Check every 10 seconds
