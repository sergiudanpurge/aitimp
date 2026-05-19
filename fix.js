const fs = require('fs');

// Verificam API-ul de servicii GET - ce returneaza pentru Admin
const api = fs.readFileSync('./src/app/api/services/route.ts', 'utf8');
const getIdx = api.indexOf('export async function GET');
console.log('GET function:');
console.log(api.substring(getIdx, getIdx + 400));