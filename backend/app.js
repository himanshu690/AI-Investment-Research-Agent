import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environmental keys
dotenv.config();

const app = express();

// Standard middleware stack
app.use(cors());
app.use(express.json());

// Base checking route to verify server performance
app.get('/api/health', (req, res) => {
  res.json({ status: "healthy loda", timestamp: new Date() });
});

// Main execution route for the Investment research agent using SSE
app.get('/api/research', async (req, res) => {
  const { companyName } = req.query;
  
  if (!companyName) {
    return res.status(400).json({ error: "Company name parameter is mandatory." });
  }

  // Setup SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (step, data) => {
    res.write(`data: ${JSON.stringify({ step, ...data })}\n\n`);
  };

  sendEvent("INIT", { message: `Starting research for ${companyName}...` });

  try {
    // Dynamic import to prevent circular dependency issues during initialization
    const { investmentAgent } = await import('./src/agents/graph.js');
    const { logAgentRun } = await import('./src/utils/logger.js');

    const config = { configurable: { thread_id: Date.now().toString() } };
    
    // Stream events from LangGraph
    const stream = await investmentAgent.streamEvents({ companyName }, { version: "v2", ...config });
    let finalState = { companyName };

    for await (const event of stream) {
      if (event.event === "on_chain_end" && event.name === "researcher") {
         sendEvent("RESEARCH_COMPLETE", { message: "Gathered financial and news data." });
         if (event.data.output) Object.assign(finalState, event.data.output);
      }
      else if (event.event === "on_chain_end" && event.name === "analyst") {
         sendEvent("ANALYSIS_COMPLETE", { message: "Analyst has completed the review." });
         if (event.data.output) Object.assign(finalState, event.data.output);
      }
      else if (event.event === "on_chain_end" && event.name === "committee") {
         sendEvent("COMMITTEE_VERDICT", { message: "Final decision reached." });
         if (event.data.output) Object.assign(finalState, event.data.output);
      }
    }
    
    // Log the entire state
    logAgentRun(companyName, finalState);

    if (finalState.error) {
      sendEvent("ERROR", { message: finalState.error });
    } else {
      // Send final payload
      sendEvent("DONE", { state: finalState });
    }
    
    res.end();
  } catch (error) {
    console.error("Agent execution error:", error);
    sendEvent("ERROR", { message: error.message });
    res.end();
  }
});

// Export the app instance without calling app.listen()
export default app;