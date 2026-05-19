const fs = require('fs');
let c = fs.readFileSync('./src/app/search/page.tsx', 'utf8');

c = c.replace(
  `  const [loading, setLoading] = useState(false);`,
  `  const [loading, setLoading] = useState(false);
  const [searchFavorites, setSearchFavorites] = useState<string[]>([]);`
);

fs.writeFileSync('./src/app/search/page.tsx', c);
console.log('Done:', fs.statSync('./src/app/search/page.tsx').size);