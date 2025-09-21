'use client';

import { useCallback, useEffect, useState } from 'react';

export type PortfolioType = 'photo' | 'activity' | 'award' | 'work';

export interface PortfolioItem {
  id: string;
  type: PortfolioType;
  title: string;
  description?: string;
  image?: string; // base64 data URL
  createdAt: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  age?: number;
  address?: string;
  school?: string;
  gpa: number;
  specialSkills?: string;
  reason?: string;
  university?: string;
  major?: string;
  profileImage?: string; // base64 data URL
  portfolioItems?: PortfolioItem[];
  createdAt: string;
}

const STORAGE_KEY = 'students_v1';

function readStorage(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Student[];
  } catch {
    return [];
  }
}

function writeStorage(students: Student[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch {
    // ignore
  }
}

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    setStudents(readStorage());
  }, []);

  const addStudent = useCallback((s: Omit<Student, 'id' | 'createdAt'>) => {
    const newStudent: Student = {
      ...s,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setStudents((prev) => {
      const next = [newStudent, ...prev];
      writeStorage(next);
      return next;
    });
    return newStudent;
  }, []);

  const updateStudent = useCallback((id: string, patch: Partial<Student>) => {
    setStudents((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...patch } : p));
      writeStorage(next);
      return next;
    });
  }, []);

  const getById = useCallback(
    (id: string) => {
      return students.find((s) => s.id === id);
    },
    [students]
  );

  const removeAll = useCallback(() => {
    writeStorage([]);
    setStudents([]);
  }, []);

  return { students, addStudent, updateStudent, getById, removeAll };
}