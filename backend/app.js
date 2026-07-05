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
  res.json({ status: "healthy", timestamp: new Date() });
});

// Main execution route for the Investment research agent
app.post('/api/research', async (req, res) => {
  const { companyName } = req.body;
  
  if (!companyName) {
    return res.status(400).json({ error: "Company name parameter is mandatory." });
  }

  try {
    // This is where our LangGraph will plug in later
    res.json({
      message: `Successfully received request for ${companyName}`,
      status: "Processing initiation point (LangGraph integration pending in Phase 3)"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export the app instance without calling app.listen()
export default app;