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
