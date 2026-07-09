import http from 'http';

const req = http.get('http://localhost:5000/api/research?companyName=Apple', (res) => {
  res.on('data', (chunk) => {
    console.log(`Received: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});
