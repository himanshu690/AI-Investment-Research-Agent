export async function searchCompanyNews(companyName) {
    try {
        const apiKey = process.env.TAVILY_API_KEY;
        if (!apiKey) {
            console.warn("Tavily API Key is missing. Skipping web search.");
            return { news: "Web search disabled due to missing TAVILY_API_KEY." };
        }

        const query = `${companyName} stock news recent performance risks`;
        
        const response = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                api_key: apiKey,
                query: query,
                search_depth: "basic",
                max_results: 5
            })
        });

        if (!response.ok) {
            throw new Error(`Tavily API responded with status: ${response.status}`);
        }

        const data = await response.json();
        return data.results.map(r => ({ title: r.title, content: r.content }));
    } catch (error) {
        console.error("Error performing web search:", error);
        return { error: `Failed to retrieve news for ${companyName}: ${error.message}` };
    }
}
