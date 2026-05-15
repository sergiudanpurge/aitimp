const fs = require('fs');
let code = fs.readFileSync('./src/app/dashboard/employee/page.tsx', 'utf8');

// Adauga alert/console la onChange gallery
code = code.replace(
  `files.forEach(file => {
                          const fd = new FormData();
                          fd.append("file", file);
                          fetch("/api/profile/gallery", { method: "POST", body: fd })
                            .then(r => r.json())
                            .then(d => { if (d.url) setUser((prev: any) => ({ ...prev, gallery: [...(prev.gallery || []), d.url] })); });
                        });`,
  `files.forEach(file => {
                          const fd = new FormData();
                          fd.append("file", file);
                          console.log("Uploading gallery for employee...", file.name);
                          fetch("/api/profile/gallery", { method: "POST", body: fd })
                            .then(r => r.json())
                            .then(d => {
                              console.log("Gallery response:", d);
                              if (d.url) setUser((prev: any) => ({ ...prev, gallery: [...(prev.gallery || []), d.url] }));
                              else alert("Eroare: " + (d.error || "Upload esuat"));
                            })
                            .catch(err => { console.error("Gallery fetch error:", err); alert("Fetch error: " + err); });
                        });`
);

fs.writeFileSync('./src/app/dashboard/employee/page.tsx', code);
console.log('Done');