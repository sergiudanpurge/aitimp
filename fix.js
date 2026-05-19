const fs = require('fs');

// 1. Update AddServiceModal - adaugam employees prop si dropdown
let modal = fs.readFileSync('./src/components/dashboard/AddServiceModal.tsx', 'utf8');

// Adaugam employees in interface Props
modal = modal.replace(
  `interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  employeeId?: string;
}`,
  `interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  employeeId?: string;
  employees?: { id: string; name: string }[];
  showAssign?: boolean;
}`
);

// Adaugam state pentru atribuire
modal = modal.replace(
  `export default function AddServiceModal({ open, onClose, onSaved, employeeId }: Props) {
  const [form, setForm] = useState({ name: "", description: "", duration: "1", price: "" });`,
  `export default function AddServiceModal({ open, onClose, onSaved, employeeId, employees = [], showAssign = false }: Props) {
  const [form, setForm] = useState({ name: "", description: "", duration: "1", price: "" });
  const [assignTo, setAssignTo] = useState("company");`
);

// Adaugam dropdown de atribuire in JSX - dupa titlu
modal = modal.replace(
  `        {error && (`,
  `        {showAssign && employees.length > 0 && (
          <div>
            <div style={{ fontSize: 11, color: s.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Atribuie la</div>
            <select value={assignTo} onChange={e => setAssignTo(e.target.value)}
              style={{ width: "100%", padding: "11px 14px", background: s.surface2, border: "1px solid " + s.border, borderRadius: 10, color: "#f0ede8", fontSize: 14, outline: "none", fontFamily: "var(--font-outfit)", cursor: "pointer" }}>
              <option value="company">🏢 Companie</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>👤 {emp.name}</option>
              ))}
            </select>
          </div>
        )}
        {error && (`
);

// Update save function sa foloseasca assignTo
modal = modal.replace(
  `        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          duration: parseInt(form.duration),
          price: parseFloat(form.price),
          gallery: images,
          ...(employeeId ? { employeeId } : {}),
        }),`,
  `        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          duration: parseInt(form.duration),
          price: parseFloat(form.price),
          gallery: images,
          ...(employeeId ? { employeeId } : {}),
          ...(showAssign && assignTo !== "company" ? { employeeId: assignTo } : {}),
        }),`
);

fs.writeFileSync('./src/components/dashboard/AddServiceModal.tsx', modal);
console.log('✅ AddServiceModal updated!');

// 2. Trecem employees in Admin modal
let admin = fs.readFileSync('./src/app/dashboard/page.tsx', 'utf8');

admin = admin.replace(
  `<AddServiceModal open={showAddSvcNew} onClose={() => setShowAddSvcNew(false)} onSaved={() => fetch("/api/services").then(r=>r.json()).then(d=>setServices(d.services||[]))} />`,
  `<AddServiceModal open={showAddSvcNew} onClose={() => setShowAddSvcNew(false)} onSaved={() => fetch("/api/services").then(r=>r.json()).then(d=>setServices(d.services||[]))} showAssign={true} employees={(employees||[]).map((e:any) => ({ id: e.id, name: e.name }))} />`
);

fs.writeFileSync('./src/app/dashboard/page.tsx', admin);
console.log('✅ Admin modal updated! Size:', fs.statSync('./src/app/dashboard/page.tsx').size);