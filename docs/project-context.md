# Project Context: Vocabulary OS

## Overview
Hệ thống học từ vựng thông minh (Vocabulary OS) giúp người dùng thu thập từ vựng trực tiếp từ trình duyệt, làm giàu dữ liệu bằng AI (LLaMA 3) và quản lý tiến trình học tập thông qua Dashboard.

## Tech Stack
- **Languages**: Python (Backend), TypeScript/JavaScript (Frontend/Extension), HTML/CSS.
- **Frontend (Dashboard)**: **Next.js 16 (App Router)**, React 19, **Tailwind CSS v4**, Lucide React.
- **Extension**: Manifest V3, Vanilla JS, Tailwind CSS (Utility classes).
- **Backend**: FastAPI (Python API).
- **Services**: Supabase (Database/Auth), Hugging Face (LLaMA 3 API).

## Architecture
- **App/frontend/**: Ứng dụng Next.js mới theo mô hình Feature-based architecture.
    - `src/app`: Cấu trúc định tuyến và layout chính.
    - `src/components`: Các thành phần giao diện dùng chung (UI, Layout).
    - `src/features`: Các module tính năng (Dashboard, Auth, Profile).
    - `src/services`: Các hàm gọi API (Supabase).
    - `src/lib`: Thư viện tiện ích và cấu hình dự án.
- **App/extension/**: Chrome Extension dùng để bôi đen và thu thập từ vựng.
- **App/backend/main.py**: FastAPI Server xử lý logic "Enrichment" (AI) và lưu trữ dữ liệu vào Supabase.
- **App/backend/requirements.txt**: Các thư viện Python cần thiết.

## Current Tasks
- [ ] Cấu hình lại Chrome Extension để gửi dữ liệu về Python Backend thay vì gọi trực tiếp API bên ngoài.
- [ ] Triển khai tính năng đăng nhập/xác thực người dùng trên Dashboard Next.js.
- [ ] Tối ưu hóa prompt AI để trả lời bằng tiếng Việt/Anh linh hoạt.

## In Progress
- **Current focus**: Hoàn thiện tích hợp Dashboard Next.js với Supabase và tối ưu hóa luồng Capture.

## Completed
- [x] Khởi tạo kho lưu trữ GitHub và cấu hình Gitignore.
- [x] Tái cấu trúc thư mục dự án thành mô hình `src/`.
- [x] Chuyển đổi Backend từ Node.js sang Python.
- [x] Xây dựng FastAPI Server hỗ trợ tự động làm giàu dữ liệu.
- [x] **Nâng cấp giao diện Dashboard với Tailwind CSS v4 và Lucide Icons.**
- [x] **Tái cấu trúc Frontend sang Next.js 16 và Tailwind 4 theo mô hình Feature-based.**
- [x] Tái cấu trúc thư mục Frontend sang chuẩn `src` directory cho Next.js.
- [x] Cấu hình biến môi trường (`.env.local`) và bảo mật API key cho Frontend.
- [x] Khắc phục lỗi Next.js Hydration Mismatch do tiện ích trình duyệt mở rộng.

## Next Steps
1. Cập nhật `background.js` của Extension để gọi API từ Backend Python (`http://127.0.0.1:8000/api/v1/capture`).
2. Phát triển tính năng "Review Mode" (Spaced Repetition) trên giao diện Next.js Dashboard.
3. Liên kết thực tế dữ liệu giữa Supabase và Giao diện Dashboard (hoàn thiện API List/Delete/Update).

## Notes
- **Deduplication**: Sử dụng `word_context_hash` để tránh lưu trùng lặp.
- **Tailwind v4**: Chuyển sang cấu hình CSS-first với `@theme` trong `globals.css`.
- **Feature-based Structure**: Giúp giảm thiểu sự phụ thuộc lẫn nhau giữa các module và dễ dàng mở rộng.
