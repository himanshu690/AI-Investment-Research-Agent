import { StateGraph, END, START } from "@langchain/langgraph";
import { AgentState } from "./state.js";
import { researcherNode } from "./nodes/researcher.js";
import { analystNode } from "./nodes/analyst.js";
import { committeeNode } from "./nodes/committee.js";

// Routing logic based on errors
function routeAfterResearch(state) {
  if (state.error) return END;
  return "analyst";
}

function routeAfterAnalyst(state) {
  if (state.error) return END;
  return "committee";
}

// Build the graph
const workflow = new StateGraph(AgentState)
  .addNode("researcher", researcherNode)
  .addNode("analyst", analystNode)
  .addNode("committee", committeeNode)
  
  .addEdge(START, "researcher")
  .addConditionalEdges("researcher", routeAfterResearch)
  .addConditionalEdges("analyst", routeAfterAnalyst)
  .addEdge("committee", END);

// Compile into a runnable
export const investmentAgent = workflow.compile();
