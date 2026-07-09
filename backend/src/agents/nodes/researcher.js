import { getCompanyFinancials } from "../../tools/financialApi.js";
import { searchCompanyNews } from "../../tools/webSearch.js";

export async function researcherNode(state) {
  console.log(`[Researcher] Fetching data for: ${state.companyName}`);
  
  try {
    const financialData = await getCompanyFinancials(state.companyName);
    const newsData = await searchCompanyNews(state.companyName);
    
    if (financialData.error) {
       return { error: financialData.error };
    }
    
    return {
      financialData,
      newsData
    };
  } catch (error) {
    return { error: `Researcher failed: ${error.message}` };
  }
}
