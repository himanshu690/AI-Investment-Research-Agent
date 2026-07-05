import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Investment Agent Server successfully running locally on http://localhost:${PORT}`);
});