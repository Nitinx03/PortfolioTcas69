'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useStudents, PortfolioItem, PortfolioType, Student } from '../lib/useStudents';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  age: string;
  address: string;
  school: string;
  gpa: string;
  specialSkills: string;
  reason: string;
  university: string;
  major: string;
  profileImage?: string;
  portfolioItems: PortfolioItem[];
}

const emptyForm = (): FormData => ({
  firstName: '',
  lastName: '',
  phone: '',
  age: '',
  address: '',
  school: '',
  gpa: '',
  specialSkills: '',
  reason: '',
  university: '',
  major: '',
  profileImage: undefined,
  portfolioItems: [],
});

export default function HomePage() {
  const { addStudent } = useStudents();

  const [formData, setFormData] = useState<FormData>(emptyForm());
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const handleProfileFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, profileImage: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  }, []);

  const addPortfolioItem = useCallback((item: Omit<PortfolioItem, 'id' | 'createdAt'>) => {
    const newItem: PortfolioItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
      createdAt: new Date().toISOString(),
    };
    setFormData((prev) => ({ ...prev, portfolioItems: [newItem, ...(prev.portfolioItems || [])] }));
  }, []);

  const removePortfolioItem = useCallback((id: string) => {
    setFormData((prev) => ({ ...prev, portfolioItems: prev.portfolioItems.filter((p) => p.id !== id) }));
  }, []);

  const validate = (data: FormData) => {
    const err: Record<string, string> = {};
    if (!data.firstName.trim()) err.firstName = 'กรุณากรอกชื่อ';
    if (!data.lastName.trim()) err.lastName = 'กรุณากรอกนามสกุล';
    const g = Number(data.gpa);
    if (data.gpa.trim() === '' || Number.isNaN(g) || g < 0 || g > 4.0) {
      err.gpa = 'กรุณากรอก GPA ระหว่าง 0.00 - 4.00';
    }
    return err;
  };

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const err = validate(formData);
    if (Object.keys(err).length) {
      setErrors(err);
      setSubmitMessage('');
      return;
    }

    addStudent({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phone: formData.phone.trim() || undefined,
      age: formData.age ? Number(formData.age) : undefined,
      address: formData.address.trim() || undefined,
      school: formData.school.trim() || undefined,
      gpa: Number(formData.gpa),
      specialSkills: formData.specialSkills.trim() || undefined,
      reason: formData.reason.trim() || undefined,
      university: formData.university.trim() || undefined,
      major: formData.major.trim() || undefined,
      profileImage: formData.profileImage,
      portfolioItems: formData.portfolioItems,
    } as Omit<Student, 'id' | 'createdAt'>);

    setFormData(emptyForm());
    setSubmitMessage('บันทึกข้อมูลเรียบร้อย');
    setErrors({});
  }, [formData, addStudent]);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <section className="container-card">
        <h1 className="text-2xl font-semibold mb-2">สร้าง Portfolio</h1>
        <p className="muted mb-4">กรอกข้อมูลส่วนตัวและเพิ่มผลงาน/รูปกิจกรรม/รางวัล</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid form-grid form-grid-cols-2">
            <div>
              <label className="form-label">ชื่อ *</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} className="form-input" />
              {errors.firstName && <div className="error-text">{errors.firstName}</div>}
            </div>
            <div>
              <label className="form-label">นามสกุล *</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} className="form-input" />
              {errors.lastName && <div className="error-text">{errors.lastName}</div>}
            </div>
          </div>

          <div className="grid form-grid form-grid-cols-2">
            <div>
              <label className="form-label">GPA *</label>
              <input name="gpa" value={formData.gpa} onChange={handleChange} className="form-input" placeholder="0.00 - 4.00" />
              {errors.gpa && <div className="error-text">{errors.gpa}</div>}
            </div>
            <div>
              <label className="form-label">โทรศัพท์</label>
              <input name="phone" value={formData.phone} onChange={handleChange} className="form-input" />
            </div>
          </div>

          <div>
            <label className="form-label">โรงเรียน</label>
            <input name="school" value={formData.school} onChange={handleChange} className="form-input" />
          </div>

          <div className="grid form-grid form-grid-cols-2">
            <div>
              <label className="form-label">มหาวิทยาลัยที่สมัคร</label>
              <input name="university" value={formData.university} onChange={handleChange} className="form-input" />
            </div>
            <div>
              <label className="form-label">สาขา</label>
              <input name="major" value={formData.major} onChange={handleChange} className="form-input" />
            </div>
          </div>

          <div>
            <label className="form-label">ทักษะพิเศษ / ผลงานสั้น ๆ</label>
            <textarea name="specialSkills" value={formData.specialSkills} onChange={handleChange} className="form-textarea" />
          </div>

          <div>
            <label className="form-label">เหตุผลในการสมัคร</label>
            <textarea name="reason" value={formData.reason} onChange={handleChange} className="form-textarea" />
          </div>

          <div>
            <label className="form-label">รูปโปรไฟล์</label>
            <input type="file" accept="image/*" onChange={handleProfileFile} />
            {formData.profileImage && (
              <img src={formData.profileImage} alt="preview" className="mt-2 w-28 h-28 object-cover rounded-md" />
            )}
          </div>

          <PortfolioEditor addItem={addPortfolioItem} items={formData.portfolioItems} removeItem={removePortfolioItem} />

          <div className="flex items-center gap-3">
            <button type="submit" className="btn-primary">บันทึก</button>
            <button type="button" onClick={() => setFormData(emptyForm())} className="btn-secondary">รีเซ็ต</button>
            {submitMessage && <span className="muted ml-2">{submitMessage}</span>}
          </div>
        </form>
      </section>
    </div>
  );
}

/* small inline component to add portfolio items */
function PortfolioEditor({
  addItem,
  items,
  removeItem,
}: {
  addItem: (i: Omit<PortfolioItem, 'id' | 'createdAt'>) => void;
  items: PortfolioItem[];
  removeItem: (id: string) => void;
}) {
  const [type, setType] = useState<PortfolioType>('photo');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageData, setImageData] = useState<string | undefined>(undefined);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setImageData(String(r.result));
    r.readAsDataURL(f);
  }, []);

  const onAdd = useCallback(() => {
    if (!title.trim() && type !== 'photo') return;
    addItem({ type, title: title.trim() || (imageData ? 'รูปภาพ' : ''), description: description.trim() || undefined, image: imageData });
    setTitle('');
    setDescription('');
    setImageData(undefined);
    setType('photo');
  }, [addItem, type, title, description, imageData]);

  return (
    <div className="mt-4 card">
      <h3 className="text-lg font-medium mb-2">เพิ่มผลงาน / รูปกิจกรรม / รางวัล</h3>

      <div className="grid form-grid form-grid-cols-2">
        <div>
          <label className="form-label">ประเภท</label>
          <select value={type} onChange={(e) => setType(e.target.value as PortfolioType)} className="form-input">
            <option value="photo">รูปภาพ</option>
            <option value="activity">กิจกรรม</option>
            <option value="award">รางวัล</option>
            <option value="work">ผลงาน</option>
          </select>
        </div>

        <div>
          <label className="form-label">หัวเรื่อง</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" />
        </div>
      </div>

      <div className="mt-3">
        <label className="form-label">คำอธิบาย (ไม่บังคับ)</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-textarea" />
      </div>

      <div className="mt-3">
        <label className="form-label">รูปภาพประกอบ (ไม่บังคับ)</label>
        <input type="file" accept="image/*" onChange={handleFile} />
        {imageData && <img src={imageData} alt="preview" className="mt-2 w-32 h-20 object-cover rounded-md" />}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button type="button" className="btn-secondary" onClick={onAdd}>เพิ่มผลงาน</button>
        <span className="muted">{items.length} รายการ</span>
      </div>

      {items.length > 0 && (
        <div className="mt-4 space-y-2">
          {items.map((it) => (
            <div key={it.id} className="flex items-center justify-between gap-3 bg-gray-50 p-2 rounded-md">
              <div className="flex items-center gap-3">
                {it.image ? <img src={it.image} className="w-16 h-12 object-cover rounded" /> : <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-sm muted">no image</div>}
                <div>
                  <div className="font-medium">{it.title || it.type}</div>
                  <div className="muted text-sm">{it.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="btn-secondary" onClick={() => removeItem(it.id)}>ลบ</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}