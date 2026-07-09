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
      modules: ['assetProfile', 'financialData', 'defaultKeyStatistics', 'summaryDetail', 'earnings']
    });

    const profile = quoteSummary.assetProfile;
    const finData = quoteSummary.financialData;
    const keyStats = quoteSummary.defaultKeyStatistics;

    // Extract Quarterly Revenue Data
    const quarterlyEarnings = quoteSummary.earnings?.financialsChart?.quarterly || [];
    const quarterlyData = quarterlyEarnings.map(q => ({
        quarter: q.date,
        revenue: q.revenue,
        earnings: q.earnings
    }));

    // Fetch historical data for 1 Year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const now = new Date();
    let historicalData = [];
    try {
        const hist = await yf.chart(ticker, { period1: oneYearAgo, period2: now, interval: '1wk' });
        if (hist && hist.quotes) {
            historicalData = hist.quotes.map(item => {
                if (!item.close) return null;
                const d = new Date(item.date);
                return { date: d.toISOString().split('T')[0].substring(0,7), price: item.close };
            }).filter(Boolean);
        }
    } catch(e) {
        console.warn("Could not fetch historical data", e);
    }

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
        beta: keyStats?.beta,
        historicalData: historicalData,
        quarterlyData: quarterlyData
    };
  } catch (error) {
    console.error("Error fetching financial data:", error);
    return { error: `Failed to retrieve financials for ${companyName}: ${error.message}` };
  }
}
