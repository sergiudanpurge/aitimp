const fs = require('fs');

// 1. Adauga whatsapp si contactEmail in schema
let schema = fs.readFileSync('./prisma/schema.prisma', 'utf8');
if (!schema.includes('whatsapp')) {
  const lines = schema.split('\n');
  const newLines = [];
  for (const line of lines) {
    newLines.push(line);
    if (line.trim() === 'linkedin        String?') {
      newLines.push('    whatsapp        String?');
      newLines.push('    contactEmail    String?');
    }
  }
  fs.writeFileSync('./prisma/schema.prisma', newLines.join('\n'));
  console.log('✅ Schema updated');
}

// 2. Adauga in auth/me select
let me = fs.readFileSync('./src/app/api/auth/me/route.ts', 'utf8');
if (!me.includes('whatsapp')) {
  me = me.replace('        linkedin: true,', '        linkedin: true,\n        whatsapp: true,\n        contactEmail: true,');
  fs.writeFileSync('./src/app/api/auth/me/route.ts', me);
  console.log('✅ auth/me updated');
}

// 3. Adauga in profile PUT
let profile = fs.readFileSync('./src/app/api/profile/route.ts', 'utf8');
if (!profile.includes('whatsapp')) {
  profile = profile.replace(
    'const { name, phone, city, cui, avatar, judet, oras, adresa, description, instagram, facebook, website, tiktok, youtube, linkedin, showEmail, showPhone } = await request.json()',
    'const { name, phone, city, cui, avatar, judet, oras, adresa, description, instagram, facebook, website, tiktok, youtube, linkedin, whatsapp, contactEmail, showEmail, showPhone } = await request.json()'
  );
  profile = profile.replace(
    'if (linkedin !== undefined) data.linkedin = linkedin',
    'if (linkedin !== undefined) data.linkedin = linkedin\n    if (whatsapp !== undefined) data.whatsapp = whatsapp\n    if (contactEmail !== undefined) data.contactEmail = contactEmail'
  );
  fs.writeFileSync('./src/app/api/profile/route.ts', profile);
  console.log('✅ profile route updated');
}

// 4. Update SOCIAL_PLATFORMS in dashboard/user
let page = fs.readFileSync('./src/app/dashboard/user/page.tsx', 'utf8');

// Update profileForm state
page = page.replace(
  `{ name: "", phone: "", description: "", judet: "", oras: "", adresa: "", facebook: "", instagram: "", tiktok: "", website: "", youtube: "", linkedin: "" }`,
  `{ name: "", phone: "", description: "", judet: "", oras: "", adresa: "", facebook: "", instagram: "", tiktok: "", website: "", youtube: "", linkedin: "", whatsapp: "", contactEmail: "" }`
);

// Update setProfileForm in useEffect
page = page.replace(
  `        linkedin: u.linkedin || "",\n      });`,
  `        linkedin: u.linkedin || "",\n        whatsapp: u.whatsapp || "",\n        contactEmail: u.contactEmail || "",\n      });`
);

// Update save body
page = page.replace(
  `website: profileForm.website, youtube: profileForm.youtube, linkedin: profileForm.linkedin })`,
  `website: profileForm.website, youtube: profileForm.youtube, linkedin: profileForm.linkedin, whatsapp: profileForm.whatsapp, contactEmail: profileForm.contactEmail })`
);

// Update SOCIAL_PLATFORMS array - adauga whatsapp si email
page = page.replace(
  `  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@channel", color: "#FF0000", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>' },
];`,
  `  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@channel", color: "#FF0000", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>' },
  { key: "whatsapp", label: "WhatsApp", placeholder: "+40712345678", color: "#25D366", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' },
  { key: "contactEmail", label: "Email contact", placeholder: "contact@example.ro", color: "#c9a96e", icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' },
];`
);

fs.writeFileSync('./src/app/dashboard/user/page.tsx', page);
console.log('✅ dashboard/user updated');
console.log('\n🎉 Done! Ruleaza: npx prisma db push');