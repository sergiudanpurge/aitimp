const fs = require('fs');
let api = fs.readFileSync('./src/app/api/search/route.ts', 'utf8');

// Scoatem _count care nu e in schema
api = api.replace(
  `            rating: true, gallery: true,
            _count: { select: { reviews: true } },`,
  `            rating: true, gallery: true,`
);

api = api.replace(
  `          rating: u.provider?.rating || 0,
          reviewCount: u.provider?._count?.reviews || 0,`,
  `          rating: u.provider?.rating || 0,
          reviewCount: 0,`
);

fs.writeFileSync('./src/app/api/search/route.ts', api);
console.log('Done:', fs.statSync('./src/app/api/search/route.ts').size);