import yahooFinance from 'yahoo-finance2';
const yf = new yahooFinance();
yf.search('Apple').then(r => console.log(r.quotes.length)).catch(console.error);
