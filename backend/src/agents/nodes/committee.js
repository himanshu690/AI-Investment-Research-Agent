import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { z } from "zod";

const decisionSchema = z.object({
  verdict: z.enum(["INVEST", "PASS"]).describe("The final investment decision."),
  thesis: z.string().describe("A comprehensive markdown-formatted investment thesis explaining the reasoning behind the verdict.")
});

export async function committeeNode(state) {
  console.log(`[Committee] Reaching final verdict for: ${state.companyName}`);

  if (state.error) {
     return { finalDecision: { verdict: "PASS", thesis: `**Error during research:** ${state.error}` } };
  }

  const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.1,
  }).withStructuredOutput(decisionSchema);

  const sysMsg = new SystemMessage(
    "You are the head of the Investment Committee. Review the Analyst's report and the underlying facts. Make a definitive INVEST or PASS decision. Provide a detailed markdown thesis supporting your decision, structured with headers, bullet points, and quantitative highlights."
  );

  const humanMsg = new HumanMessage(
    `Company: ${state.companyName}
     Analyst Report: ${state.analystReport}
    `
  );

  try {
    const decision = await llm.invoke([sysMsg, humanMsg]);
    return { finalDecision: decision };
  } catch (error) {
    return { error: `Committee failed: ${error.message}` };
  }
}
