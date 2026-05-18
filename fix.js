const fs = require('fs');

// Search API
const api = fs.readFileSync('./src/app/api/search/route.ts', 'utf8');
console.log('Search API (primele 60 linii):');
api.split('\n').slice(0, 60).forEach((l, i) => console.log(i+1, l));