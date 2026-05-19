const fs = require('fs');
let modal = fs.readFileSync('./src/components/dashboard/AddServiceModal.tsx', 'utf8');

const insertIdx = modal.indexOf('const fileRef = useRef');
console.log('Insert at:', insertIdx);
console.log('Context:', modal.substring(insertIdx - 50, insertIdx + 80));

const effectCode = `\n\n  useEffect(() => {\n    if (editService && open) {\n      setForm({ name: editService.name || "", description: editService.description || "", duration: String(Math.round(editService.duration)), price: String(editService.price) });\n      setImages(editService.gallery || []);\n      setPreviews(editService.gallery || []);\n    } else if (!open) {\n      setForm({ name: "", description: "", duration: "1", price: "" });\n      setImages([]); setPreviews([]);\n    }\n  }, [open, editService]);\n`;

modal = modal.substring(0, insertIdx) + effectCode + modal.substring(insertIdx);
fs.writeFileSync('./src/components/dashboard/AddServiceModal.tsx', modal);
console.log('Done:', modal.includes('editService && open') ? '✅' : '❌');