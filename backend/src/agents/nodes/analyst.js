import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export async function analystNode(state) {
  console.log(`[Analyst] Analyzing financial data and news for: ${state.companyName}`);

  if (state.error) {
      return { analystReport: "Analysis skipped due to prior errors." };
  }

  const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
  });

  const sysMsg = new SystemMessage(
    "You are an expert equity research analyst. Based on the provided financial data and recent news, provide a comprehensive analysis of the company's financial health, growth prospects, and potential risks. Be concise but thorough."
  );

  const humanMsg = new HumanMessage(
    `Company: ${state.companyName}
     Financial Data: ${JSON.stringify(state.financialData, null, 2)}
     Recent News: ${JSON.stringify(state.newsData, null, 2)}
    `
  );

  try {
    const response = await llm.invoke([sysMsg, humanMsg]);
    return { analystReport: response.content };
  } catch (error) {
    return { error: `Analyst failed: ${error.message}` };
  }
}
