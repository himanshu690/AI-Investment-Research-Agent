import { Annotation } from "@langchain/langgraph";

export const AgentState = Annotation.Root({
  companyName: Annotation(),
  financialData: Annotation(),
  newsData: Annotation(),
  analystReport: Annotation(),
  finalDecision: Annotation(),
  error: Annotation()
});
