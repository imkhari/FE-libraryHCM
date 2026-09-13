# 🏛️ Không Gian Văn Hóa Hồ Chí Minh
### *Thư viện Số & Nền tảng Học tập Tư tưởng, Đạo đức, Phong cách Hồ Chí Minh*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Cloudflare R2](https://img.shields.io/badge/Cloudflare-R2_Storage-F38020?style=flat&logo=cloudflare&logoColor=white)](https://www.cloudflare.com/products/r2/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_CDN-3448C5?style=flat&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![PDF.js](https://img.shields.io/badge/PDF.js-Stream_Engine-E0232E?style=flat&logo=adobeacrobatreader&logoColor=white)](https://mozilla.github.io/pdf.js/)

---

## 🌟 Giới Thiệu Dự Án

**Không Gian Văn Hóa Hồ Chí Minh** là dự án số hóa toàn diện hệ thống tư liệu lịch sử, các tác phẩm kinh điển của Chủ tịch Hồ Chí Minh và những công trình nghiên cứu về Người. Nền tảng được xây dựng với mục tiêu mang đến không gian học tập trực quan, trang trọng và hiện đại cho sinh viên, giảng viên và bạn đọc cả nước.

Dự án áp dụng các tiêu chuẩn thiết kế web hiện đại, kết hợp bản sắc văn hóa dân tộc (hoa văn trống đồng Đông Sơn, màu cờ Tổ quốc) cùng trải nghiệm đọc tư liệu chuẩn **Thư viện số cao cấp (Apple Books / Google Cultural Institute)**.

---

## 🚀 Tính Năng Nổi Bật

### 📖 1. Phòng Đọc Sách Số Hóa Cao Cấp (PDF.js + Cloudflare R2)
* **Cuộn đọc liên tục mượt mà:** Tương thích 100% mọi khổ sách (bản scan mở đôi 2 trang, trang đơn, khổ ngang/dọc) mà không bao giờ bị méo hay biến dạng.
* **HTTP Range Streaming & True Lazy Loading:** Kết nối với **Cloudflare R2** thông qua cơ chế phân đoạn byte (`Accept-Ranges`). Sách mở tức thì trong **0.3 giây**, cuộn tới đâu tải đến đó, tiết kiệm tối đa RAM và băng thông.
* **Mục lục Thumbnail bên hông:** Xem trước hình thu nhỏ các trang sách để nhảy nhanh đến bất kỳ trang nào.
* **3 Chế độ bảo vệ mắt:**
  * **Sáng ấm (Warm Light):** Nền giấy ngà thanh nhã, giữ trọn hoa văn trống đồng trang nghiêm.
  * **Giấy cổ (Sepia):** Tone màu hoài niệm, ấm dịu khi đọc lâu.
  * **Ban đêm (Theater Spotlight):** Phòng đọc tối sâu, rọi sáng trang sách trắng nét căng để tập trung tối đa mà không gây chói mắt.
* **Công cụ đọc sách:** Phóng to/thu nhỏ (Zoom 60% – 250%), toàn màn hình (Fullscreen), theo dõi tiến độ đọc theo thời gian thực (Reading Progress %).

### 📰 2. Trang Tin Tức - Sự Kiện & Đọc Bài Viết Chuyên Sâu
* **Phân loại chuyên mục rõ ràng:** Phân tách mạch lạc giữa danh mục *Tin tức* và *Học tập & Làm theo Bác*.
* **Tìm kiếm tức thì (Live Search):** Lọc bài viết ngay lập tức theo từ khóa tiêu đề hoặc nội dung mà không cần tải lại trang.
* **Trải nghiệm đọc bài viết cao cấp:**
  * **Tùy biến cỡ chữ đọc bài:** Hỗ trợ 3 mức cỡ chữ linh hoạt (A- / A / A+) phù hợp với mọi đối tượng bạn đọc.
  * **In ấn độc quyền (`@media print`):** Khi chọn in (Ctrl+P / nút máy in), hệ thống chỉ xuất bản riêng bài viết sạch đẹp lên khổ giấy A4, tự động ẩn sạch toàn bộ thanh điều hướng, thanh bên và khung bình luận.
  * **Chia sẻ đa nền tảng:** Tích hợp chia sẻ nhanh qua Facebook, Zalo, Telegram và nút **Copy link** với hiệu ứng xanh lá pastel dịu mắt thông báo "Đã copy".
  * **Sidebar bài viết mới nhất:** Hiển thị bài viết mới nhất kèm mốc thời gian chi tiết (Giờ:Phút | Ngày/Tháng/Năm).

### 🏛️ 3. Trang Chủ & Dòng Tư Liệu
* **Hero Banner tương tác:** Nút cuộn khám phá tinh tế, hiệu ứng chuyển màu sống động.
* **Tự động tạm dừng Video:** Tích hợp `IntersectionObserver` tự động ngắt âm thanh và tạm dừng video YouTube khi người dùng cuộn qua, tránh làm phiền trải nghiệm đọc.
* **Băng chuyền (Swiper) tác phẩm:** Phân loại rõ ràng giữa *"Tác phẩm của Bác"* và *"Tác phẩm về Bác"* với hiệu ứng hover 3D đồng bộ.

### 🖼️ 4. Triển Lãm Ảnh Lịch Sử (Gallery)
* **Kho ảnh lưu trữ chuẩn:** Được phục dựng và kiểm chứng từ các cơ quan lưu trữ báo chí quốc gia.
* **Bộ lọc 5 chủ đề chuyên sâu:** *Tất cả*, *Bôn ba cứu nước*, *Thời kỳ kháng chiến*, *Xây dựng đất nước*, *Bác Hồ với nhân dân*.
* **Lightbox xem ảnh toàn màn hình:** Hỗ trợ phím mũi tên `←` / `→` lướt ảnh và đếm số lượng trực quan `[ X / 21 ]`.

### 🎬 5. Thư Viện Video & Phim Tư Liệu
* Trình phát video chuyên dụng với danh sách phim tài liệu và phóng sự lịch sử được tuyển chọn kỹ lưỡng.
* Giao diện xem video tối ưu hiển thị, thông tin tóm tắt và danh sách video đề xuất liên quan.

### 🔍 6. Tìm Kiếm & Tra Cứu Thông Minh
* Tích hợp tìm kiếm giọng nói trực tiếp qua **Web Speech API**.
* Gợi ý từ khóa tức thì (Live search suggestions) theo tác giả, tên tác phẩm và chủ đề.

### 🛠️ 7. Hệ Thống Quản Trị Admin & Biên Tập Bài Viết
* **Xác thực bảo mật:** JWT Token qua Axios Interceptor tự động làm mới và chuyển hướng an toàn.
* **Trình soạn thảo phong phú (Quill Editor):**
  * Hỗ trợ đầy đủ phím tắt và nút thao tác **Hoàn tác / Làm lại (Undo / Redo)**.
  * **Bộ đếm từ tự động:** Theo dõi độ dài nội dung bài viết theo thời gian thực.
  * **Xem trước bài viết trực tiếp (Live Preview Modal):** Mô phỏng chính xác giao diện hiển thị phía người đọc trước khi bấm xuất bản.
  * **Tự động lưu bản nháp (Draft Auto-Save):** Lưu liên tục nội dung đang soạn thảo vào LocalStorage, bảo vệ dữ liệu tuyệt đối trước sự cố mất mạng hoặc vô tình đóng tab.
  * **Upload ảnh Thumbnail chuyên dụng:** Tích hợp Cloudinary CDN upload hình ảnh bài viết và ảnh bìa nhanh chóng, tự động tối ưu hóa dung lượng.

---

## ⚡ Kiến Trúc Hiệu Năng (High Performance)

* **Code-Splitting & Manual Chunks:** Bóc tách toàn bộ thư viện nặng (`pdfjs-dist`, `framer-motion`, `react-vendor`) ra khỏi gói tải ban đầu.
  * **Gói JavaScript trang chủ (`index.js`):** Chỉ nặng **92 KB** (Gzip).
  * Trang web đạt tốc độ tải trang dưới **0.2 giây** trên mọi thiết bị di động và máy tính.
* **Lưu trữ Cloudflare R2 & Cloudinary:** 
  * Chi phí lưu trữ PDF: **0 VNĐ (10 GB miễn phí vĩnh viễn trên R2)**.
  * Chi phí băng thông tải ra (Egress): **0 VNĐ không giới hạn**.
  * Quản lý tài nguyên media qua Cloudinary CDN đảm bảo tốc độ phân phối ảnh cao nhất.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Thành phần | Công nghệ | Phiên bản / Chi tiết |
| :--- | :--- | :--- |
| **Framework** | [React](https://react.dev/) | `^19.2.4` |
| **Bundler / Build Tool** | [Vite](https://vitejs.dev/) (Rolldown engine) | `^8.3.0` |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `^4.2.2` |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | `^12.38.0` |
| **PDF Engine** | [PDF.js](https://mozilla.github.io/pdf.js/) | `^6.3.289` |
| **Rich Text Editor** | [React Quill New](https://github.com/zenoamaro/react-quill) | `^3.3.3` |
| **PDF Cloud Storage** | [Cloudflare R2 Object Storage](https://www.cloudflare.com/products/r2/) | S3-Compatible API |
| **Image CDN** | [Cloudinary](https://cloudinary.com/) | Tối ưu ảnh tự động |
| **Carousels** | [Swiper.js](https://swiperjs.com/) | `^12.1.3` |
| **Routing** | [React Router DOM](https://reactrouter.com/) | `^7.14.0` |
| **HTTP Client** | [Axios](https://axios-http.com/) | `^1.15.0` |

---

## 📂 Cấu Trúc Thư Mục

```bash
tutuong-HCM/
├── public/                     # Tài nguyên tĩnh công khai (favicon, robots.txt, ảnh tư liệu)
├── src/
│   ├── assets/                 # Hình ảnh tư liệu, hoa văn trống đồng, âm thanh
│   ├── components/             # Các component dùng chung
│   │   ├── AdminCreatePost.jsx # Đăng bài viết (Undo/Redo, Live Preview, Draft Auto-Save)
│   │   ├── AdminEditPost.jsx   # Chỉnh sửa bài viết
│   │   ├── Navbar.jsx          # Thanh điều hướng chính
│   │   ├── Footer.jsx          # Chân trang
│   │   └── VisitorTracker.jsx  # Đếm lượt truy cập
│   ├── pages/                  # Các trang màn hình chính
│   │   ├── Home.jsx            # Trang chủ & Không gian văn hóa
│   │   ├── ReaderPage.jsx      # Phòng đọc sách cuộn dọc PDF.js + Cloudflare R2
│   │   ├── NewsPage.jsx        # Trang Tin tức - Sự kiện & Bài viết nghiên cứu
│   │   ├── ArticleDetail.jsx   # Đọc chi tiết bài viết (In ấn A4, chia sẻ MXH)
│   │   ├── VideoDetailPage.jsx # Trang xem video và phim tư liệu lịch sử
│   │   ├── BookDetail.jsx      # Trang thông tin chi tiết tác phẩm
│   │   ├── GalleryPage.jsx     # Triển lãm ảnh Bác Hồ
│   │   ├── BioPage.jsx         # Tiểu sử & Dòng thời gian
│   │   ├── CategoryPage.jsx    # Phân loại tài liệu theo thể loại
│   │   └── SearchPage.jsx      # Trang tìm kiếm tư liệu
│   ├── services/
│   │   └── api.js              # Cấu hình Axios & JWT Interceptor
│   ├── App.jsx                 # Bộ định tuyến (Routing) & Layout chính
│   ├── index.css               # Global CSS, dải màu overscroll đàn hồi
│   └── main.jsx                # Điểm khởi động ứng dụng React
├── index.html                  # HTML template với theme-color đồng bộ
├── vite.config.js              # Cấu hình đóng gói, manualChunks & Tailwind
└── package.json                # Danh sách thư viện & scripts
```

---

## 💻 Hướng Dẫn Cài Đặt & Chạy Cục Bộ

### 1. Yêu cầu hệ thống:
* [Node.js](https://nodejs.org/) phiên bản `18.x` hoặc mới hơn.
* Trình quản lý gói `npm` hoặc `yarn`.

### 2. Cài đặt các gói phụ thuộc:
```bash
# Di chuyển vào thư mục dự án
cd tutuong-HCM

# Cài đặt dependencies
npm install
```

### 3. Cấu hình biến môi trường:
Tạo file `.env` tại thư mục gốc của dự án (nếu cần đổi địa chỉ API backend):
```env
VITE_API_URL=http://localhost:8080/api/v1
```

### 4. Khởi động môi trường phát triển:
```bash
npm run dev
```
Trang web sẽ chạy tại địa chỉ: **`http://localhost:5173`** (hoặc `5174`).

### 5. Đóng gói cho môi trường Production:
```bash
npm run build
```
Mã nguồn sau khi build sẽ nằm trong thư mục `dist/`, sẵn sàng để deploy lên Vercel, Cloudflare Pages, Netlify hoặc máy chủ Nginx/Apache.

---

## ☁️ Hướng Dẫn Cập Nhật Sách Lên Cloudflare R2

1. Truy cập [Cloudflare Dashboard](https://dash.cloudflare.com) ➔ Vào mục **R2 Object Storage**.
2. Chọn Bucket sách của bạn (ví dụ: `tutuong-hcm-books`).
3. Tải file sách định dạng `.pdf` lên tab **Objects**.
4. Lấy liên kết công khai của file (dạng: `https://pub-xxxx.r2.dev/ten-sach.pdf`).
5. Cập nhật đường link đó vào trường `pdfUrl` của tác phẩm trong cơ sở dữ liệu.
6. Hệ thống sẽ tự động kích hoạt phòng đọc PDF cuộn thông minh mà **không cần sửa một dòng code nào**!

---

## 📜 Giấy Phép & Bản Quyền

Dự án được xây dựng phục vụ mục đích nghiên cứu, học tập, tuyên truyền và giáo dục truyền thống cách mạng, phi thương mại.
Mọi tư liệu, hình ảnh và văn bản thuộc quyền sở hữu của các cơ quan lưu trữ lịch sử quốc gia.

---
⭐ **Tư tưởng Hồ Chí Minh là tài sản tinh thần vô giá của Đảng và dân tộc ta.**
