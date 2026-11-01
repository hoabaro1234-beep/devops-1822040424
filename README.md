# Bài tập cá nhân: CI/CD GitHub Actions

- Sinh viên: **Lê Nhật Hòa**
- MSSV: **1822040424**
- Repository yêu cầu: `devops-1822040424`
- Branch: `main`

## Các tệp
- `index.html`: Website HTML và thẻ `title`, `h1` với MSSV.
- `style.css`: Giao diện đáp ứng.
- `script.js`: Hiển thị phiên bản và năm hiện tại.
- `.github/workflows/deploy.yml`: Hai jobs `check` và `deploy`.

## CI/CD
Khi push lên `main`, job `check` sẽ xác nhận tồn tại cả ba file và `index.html` có thẻ `<title>` không rỗng. Job `deploy` phụ thuộc `check` qua `needs: check`; nếu kiểm tra thất bại, website không được deploy. Khi kiểm tra thành công, `deploy` xuất bản website HTML/CSS/JS qua GitHub Pages.

## Thí nghiệm bắt buộc
1. Push phiên bản có `<title>`: `check` và `deploy` phải thành công.
2. Xóa hoàn toàn dòng `<title>…</title>`, commit và push: `check` thất bại, `deploy` bị bỏ qua.
3. Khôi phục `<title>`, cập nhật nội dung và phiên bản `2.0`, commit và push: pipeline thành công, website được cập nhật.

## Thiết lập GitHub Pages
Settings → Pages → Build and deployment → Source: **GitHub Actions**.

*Không khẳng định đã triển khai thành công nếu chưa có run GitHub Actions và website công khai để kiểm chứng.*