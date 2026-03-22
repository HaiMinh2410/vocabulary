# Project Context: Vocabulary OS

## Overview
Hệ thống học từ vựng thông minh (Vocabulary OS) giúp người dùng thu thập từ vựng trực tiếp từ trình duyệt, làm giàu dữ liệu bằng AI (LLaMA 3) và quản lý tiến trình học tập thông qua Dashboard.

## Tech Stack
- **Languages**: Python (Backend), JavaScript (Frontend/Extension), HTML/CSS.
- **Frameworks**: FastAPI (Python API), Vanilla JS.
- **Services**: Supabase (Database/Auth), Hugging Face (LLaMA 3 API).

## Architecture
- **src/frontend/extension**: Chrome Extension (Manifest V3) dùng để bôi đen và thu thập từ vựng.
- **src/frontend/dashboard**: Giao diện web hiển thị danh sách từ vựng và thống kê.
- **src/backend/main.py**: FastAPI Server xử lý logic "Enrichment" (AI) và lưu trữ dữ liệu vào Supabase.
- **src/backend/tools**: Các bộ script kiểm thử Python cho AI và Database.

## Current Tasks
- [ ] Cấu hình lại Chrome Extension để gửi dữ liệu về Python Backend thay vì gọi trực tiếp API bên ngoài.
- [ ] Triển khai tính năng đăng nhập/xác thực người dùng trên Dashboard.
- [ ] Tối ưu hóa prompt AI để trả về kết cấu JSON ổn định hơn.

## In Progress
- **Current focus**: Chuyển đổi và tối ưu hóa luồng dữ liệu từ Extension sang Backend Python.

## Completed
- [x] Khởi tạo kho lưu trữ GitHub và cấu hình Gitignore (Local/Global).
- [x] Tái cấu trúc thư mục dự án thành mô hình `src/` (Frontend/Backend).
- [x] Chuyển đổi Backend từ Node.js sang Python.
- [x] Xây dựng FastAPI Server hỗ trợ tự động làm giàu dữ liệu và lưu trữ Supabase.
- [x] Dọn dẹp các file meta-data cũ (`task_plan.md`, `findings.md`, `architecture/`).

## Next Steps
1. Cập nhật `background.js` của Extension để `fetch` tới `http://127.0.0.1:8000/api/v1/capture`.
2. Viết thêm script Docker hóa dự án (nếu cần).

## Notes
- **Deduplication**: Sử dụng `word_context_hash` (MD5 của word + context) để tránh lưu trùng lặp.
- **Bảo mật**: File `.env` và thư mục `.agent/` đã được chặn thông qua Gitignore Local và `.git/info/exclude`.
