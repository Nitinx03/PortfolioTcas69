'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudents, PortfolioItem } from '../../../lib/useStudents';

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { students } = useStudents();
  const router = useRouter();

  const student = useMemo(() => students.find((s) => s.id === id), [students, id]);
  const [preview, setPreview] = useState<string | null>(null);

  if (!student) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card">ไม่พบข้อมูลนักศึกษา</div>
        <div className="mt-4">
          <button className="btn-secondary" onClick={() => router.back()}>
            ย้อนกลับ
          </button>
        </div>
      </div>
    );
  }

  const grouped = (student.portfolioItems || []).reduce<Record<string, PortfolioItem[]>>((acc, it) => {
    (acc[it.type] = acc[it.type] || []).push(it);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="container-card">
        <div className="flex items-start gap-4">
          {student.profileImage ? (
            <img src={student.profileImage} alt="profile" className="w-28 h-28 object-cover rounded-md" />
          ) : (
            <div className="w-28 h-28 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">รูป</div>
          )}
          <div className="flex-1">
            <h2 className="text-xl font-semibold">
              {student.firstName} {student.lastName}
            </h2>
            <div className="muted">{student.university || student.school}</div>
            <div className="text-sm text-gray-600">สาขา: {student.major || '—'}</div>
            <div className="text-sm text-gray-600">GPA: {student.gpa.toFixed(2)}</div>
            <div className="mt-2 text-sm text-gray-600">โทร: {student.phone || '—'}</div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">คำอธิบาย / เหตุผล</h3>
          <p className="muted">{student.reason || '—'}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">ผลงาน / กิจกรรม / รางวัล</h3>
          {Object.keys(grouped).length === 0 ? (
            <div className="card">ยังไม่มีผลงาน</div>
          ) : (
            Object.entries(grouped).map(([type, items]) => (
              <section key={type} className="mb-4">
                <h4 className="font-semibold capitalize mb-2">{type}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {items.map((it) => (
                    <div key={it.id} className="bg-white rounded-md overflow-hidden shadow-sm p-2">
                      {it.image ? (
                        <img
                          src={it.image}
                          alt={it.title || it.type}
                          className="w-full h-40 object-cover rounded-md cursor-pointer"
                          onClick={() => setPreview(it.image ?? null)}
                        />
                      ) : (
                        <div className="w-full h-40 bg-gray-50 rounded-md flex items-center justify-center muted">ไม่มีรูป</div>
                      )}
                      <div className="mt-2">
                        <div className="font-medium">{it.title}</div>
                        {it.description && <div className="muted text-sm">{it.description}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button className="btn-secondary" onClick={() => router.back()}>
            กลับ
          </button>
        </div>
      </div>

      {preview && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
          onClick={() => setPreview(null)}
        >
          <img src={preview} className="max-h-[90vh] max-w-[90vw] rounded-md shadow-lg" />
        </div>
      )}
    </div>
  );
}