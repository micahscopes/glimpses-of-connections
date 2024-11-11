import { randomGraphData, startWebscapeWanderer } from "webscape-wanderer";
import { fetchMockEdgeList, prepareGraphData } from "./data";

document.addEventListener("DOMContentLoaded", () => {
  startWebscapeWanderer();
  const w = document.querySelector("webscape-wanderer");
  const edgeList = fetchMockEdgeList(2000, 2000);
  const graph = prepareGraphData(edgeList);
  // const randomGraph = randomGraphData(50, 50);
  w.graphData = graph;
});
