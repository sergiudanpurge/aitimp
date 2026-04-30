const fs = require('fs');

const code = `"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const DAYS = ["Luni", "Mar\u021bi", "Miercuri", "Joi", "Vineri", "S\u00e2mb\u0103t\u0103", "Duminic\u0103"];
const defaultSchedule = DAYS.reduce((acc, day, i) => ({ ...acc, [day]: { active: i < 5, start: "09:00", end: "18:00", open: false } }), {});

export default function EmployeeProfile() {
  const { useRouter: r, useParams: p } = { useRouter, useParams };
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [employee, setEmployee] = useState(null);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState("program");
  const [msg, setMsg] = useState("");
  const [schedule, setSchedule] = useState(defaultSchedule);

  useEffect(() => {
    fetch("/api/employees/" + id).then(r => r.json()).then(d => {
      setEmployee(d.employee);
      if (d.services) setServices(d.services);
    });
  }, [id]);

  if (!employee) return (
    <DashboardLayout title="Se incarca...">
      <div style={{ color: "#777" }}>Se incarca...</div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title={employee.name}>
      <div style={{ color: "#f0ede8" }}>Profil: {employee.name}</div>
    </DashboardLayout>
  );
}`;

fs.writeFileSync('./src/app/dashboard/employees/[id]/page.tsx', code);
console.log('Done:', fs.statSync('./src/app/dashboard/employees/[id]/page.tsx').size);