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
  w.setAttribute('node-shape', personUrl)

  updateGraphIfChanged();
});

async function updateGraphIfChanged() {
  const edgeList = await fetchEdgeList();
  const w = document.querySelector("webscape-wanderer");
  if (edgeList.length == w.graphData?.links.length) {
    console.log('no need to prepare more graph data')
  } else {
    const newGraph = prepareGraphData(edgeList);
    w.graphData = newGraph
  }
}

let lastTouchTime = Date.now();
document.addEventListener('touchstart', () => {
  lastTouchTime = Date.now();
});


const REFRESH_TIME = 60*1000 // 60 seconds

setInterval(() => {
  if (Date.now() - lastTouchTime > REFRESH_TIME) {
    updateGraphIfChanged();
  }
}, 5000); // Check every 5 seconds
