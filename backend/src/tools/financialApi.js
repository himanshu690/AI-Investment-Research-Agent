import yahooFinance from 'yahoo-finance2';

const yf = new yahooFinance();

export async function getCompanyFinancials(companyName) {
  try {
    // Search for the company ticker
    const searchResult = await yf.search(companyName);
    const ticker = searchResult.quotes.find(q => q.isYahooFinance)?.symbol || searchResult.quotes[0]?.symbol;
    
    if (!ticker) {
        throw new Error(`Could not find ticker for company: ${companyName}`);
    }

    // Fetch quote summary modules (including financial ratios, profile, etc.)
    const quoteSummary = await yf.quoteSummary(ticker, {
      modules: ['assetProfile', 'financialData', 'defaultKeyStatistics', 'summaryDetail']
    });

    const profile = quoteSummary.assetProfile;
    const finData = quoteSummary.financialData;
    const keyStats = quoteSummary.defaultKeyStatistics;

    return {
        ticker: ticker,
        name: companyName,
        sector: profile?.sector,
        industry: profile?.industry,
        summary: profile?.longBusinessSummary,
        currentPrice: finData?.currentPrice,
        revenueGrowth: finData?.revenueGrowth,
        ebitdaMargins: finData?.ebitdaMargins,
        debtToEquity: finData?.debtToEquity,
        returnOnEquity: finData?.returnOnEquity,
        trailingPE: quoteSummary.summaryDetail?.trailingPE,
        forwardPE: quoteSummary.summaryDetail?.forwardPE,
        marketCap: quoteSummary.summaryDetail?.marketCap,
        beta: keyStats?.beta
    };
  } catch (error) {
    console.error("Error fetching financial data:", error);
    return { error: `Failed to retrieve financials for ${companyName}: ${error.message}` };
  }
}
