import fs from 'fs';
import path from 'path';

export function logAgentRun(companyName, state) {
  try {
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.json`;
    const filepath = path.join(logsDir, filename);

    // Clean up state for logging to ensure it's serializable and clear
    const logData = {
        timestamp: new Date().toISOString(),
        companyName: state.companyName,
        financialData: state.financialData,
        newsData: state.newsData,
        analystReport: state.analystReport,
        finalDecision: state.finalDecision,
        error: state.error
    };

    fs.writeFileSync(filepath, JSON.stringify(logData, null, 2));
    console.log(`[Logger] Saved agent run to ${filepath}`);
  } catch (error) {
    console.error("[Logger] Failed to save log:", error);
  }
}
