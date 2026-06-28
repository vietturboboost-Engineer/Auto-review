# Logo hãng xe (SVG)

Đặt logo SVG của từng hãng tại đây, đặt tên theo `slug` của hãng:

```
public/assets/brands/<slug>.svg
```

Ví dụ:

```
public/assets/brands/toyota.svg
public/assets/brands/honda.svg
public/assets/brands/vinfast.svg
```

## Cách hoạt động

- Đường dẫn logo lấy tập trung từ `src/data/brands.ts` qua hàm `brandLogo(slug)`
  (mặc định `/assets/brands/<slug>.svg`, có thể override bằng field `logo` trong `brands[]`).
- UI dùng chung 1 helper `blogo(slug)` cho: danh sách xe, chi tiết xe, bảng so sánh, thẻ gợi ý AI.
- Logo hiển thị 24px, `object-fit:contain`, không bóp méo, không tăng chiều cao item.
- **Fallback nhẹ nhàng:** nếu file SVG chưa tồn tại (404), logo tự ẩn và chỉ hiển thị tên hãng.

## Lưu ý

- Ưu tiên SVG nền trong suốt để hợp cả Light/Dark mode.
- Tôn trọng bản quyền logo thương hiệu khi sử dụng.
- `slug` xem trong `src/data/brands.ts` (vd: `mercedes-benz`, `alfa-romeo`, `li-auto`).
