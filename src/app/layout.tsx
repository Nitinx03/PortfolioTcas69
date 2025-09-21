import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Portfolio TCAS69 — ระบบจัดการ Portfolio",
  description: "ระบบจัดการ Portfolio สำหรับสมัครเข้าศึกษาต่อ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="bg-[#f5f8fa] font-sans">
        <style>{`
          body { outline: none; }
          .nav-link {
            color: #1a237e;
            font-weight: 500;
            transition: color 0.2s;
          }
          .nav-link:hover {
            color: #1976d2;
          }
          .btn-primary {
            background: linear-gradient(90deg, #1976d2 0%, #1565c0 100%);
            color: #fff;
            font-weight: 600;
            border-radius: 6px;
            padding: 0.5rem 1.25rem;
            box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
            transition: background 0.2s;
          }
          .btn-primary:hover {
            background: linear-gradient(90deg, #1565c0 0%, #1976d2 100%);
          }
        `}</style>

        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow-md border-b border-blue-100 sticky top-0 z-10">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                <Link href="/" className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-800 flex items-center justify-center shadow-md">
                    <img
                      src="/image/images.png"
                      alt="TCAS69"
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <span className="text-2xl font-bold text-[#1976d2] tracking-wide drop-shadow-sm">
                    Portfolio
                  </span>
                </Link>

                <div className="flex items-center space-x-8">
                  <Link href="/" className="nav-link">
                    หน้าหลัก
                  </Link>
                  <Link href="/students" className="nav-link">
                    รายชื่อนักศึกษา
                  </Link>
                  <Link href="/login" className="btn-primary ml-4">
                    เข้าสู่ระบบ
                  </Link>
                </div>
              </div>
            </nav>
          </header>

          <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 bg-[#f5f8fa]">
            <div className="max-w-7xl mx-auto rounded-lg bg-white shadow p-8 min-h-[60vh]">
              {children}
            </div>
          </main>

          <footer className="bg-gradient-to-r from-blue-700 to-blue-900 text-white border-t border-blue-900 py-8 mt-auto shadow-inner">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm opacity-80">
                © {new Date().getFullYear()} Portfolio TCAS69 — พัฒนาเพื่อการศึกษา
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
