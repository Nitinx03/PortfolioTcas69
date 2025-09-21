'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useStudents, Student } from '../../lib/useStudents';

export default function StudentsPage() {
  const { students } = useStudents();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'gpa' | 'name' | 'date'>('gpa');
  const [dir, setDir] = useState<'desc' | 'asc'>('desc');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = students.slice();
    if (q) {
      list = list.filter((s) => (`${s.firstName} ${s.lastName}`.toLowerCase().includes(q) || (s.school || '').toLowerCase().includes(q) || (s.university || '').toLowerCase().includes(q)));
    }
    list.sort((a, b) => {
      if (sortBy === 'gpa') return dir === 'desc' ? b.gpa - a.gpa : a.gpa - b.gpa;
      if (sortBy === 'name') {
        const na = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nb = `${b.firstName} ${b.lastName}`.toLowerCase();
        return dir === 'desc' ? nb.localeCompare(na) : na.localeCompare(nb);
      }
      // date
      return dir === 'desc' ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    return list;
  }, [students, query, sortBy, dir]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="container-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-1">รายชื่อนักศึกษา</h1>
            <p className="muted">รายการนักศึกษาที่บันทึก (จาก localStorage)</p>
          </div>

          <div className="flex items-center gap-2">
            <input placeholder="ค้นหา..." value={query} onChange={(e) => setQuery(e.target.value)} className="form-input" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="form-input">
              <option value="gpa">เรียงตาม GPA</option>
              <option value="name">เรียงตามชื่อ</option>
              <option value="date">ล่าสุด</option>
            </select>
            <button className="btn-secondary" onClick={() => setDir((d) => (d === 'desc' ? 'asc' : 'desc'))}>{dir === 'desc' ? 'ลง-มาก' : 'น้อย-ขึ้น'}</button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="card">ยังไม่มีข้อมูล</div>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="table-header">ชื่อ</th>
                  <th className="table-header">ภาพ</th>
                  <th className="table-header">สถาบัน</th>
                  <th className="table-header">สาขา</th>
                  <th className="table-header text-right">GPA</th>
                  <th className="table-header text-center">ผลงาน</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="table-row">
                    <td className="table-cell">
                      <Link href={`/students/${s.id}`} className="student-link">{s.firstName} {s.lastName}</Link>
                    </td>
                    <td className="table-cell">
                      <div className="w-16 h-12 rounded overflow-hidden">
                        <img src={s.profileImage || s.portfolioItems?.find(p => p.image)?.image || '/favicon.ico'} className="w-16 h-12 object-cover" />
                      </div>
                    </td>
                    <td className="table-cell">{s.university || s.school || '—'}</td>
                    <td className="table-cell">{s.major || '—'}</td>
                    <td className="table-cell text-right">{s.gpa.toFixed(2)}</td>
                    <td className="table-cell text-center">{s.portfolioItems?.length || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}