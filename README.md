# 🌍🌱 EARTH FARM — Team 10

> **Learn from Earth. Grow your world.**

Game nông trại giáo dục cho học sinh lớp 1–12: dữ liệu quan sát Trái Đất (cấu trúc theo dataset NASA)
tạo ra các sự kiện môi trường trong game — người chơi quan sát dữ liệu, ra quyết định và nhìn thấy hậu quả
ngay trên nông trại của mình.

```
NASA Earth Data → Môi trường thay đổi → Buddy thông báo → Mission
     → Người chơi quyết định → Nông trại phản ứng → Thưởng/Hậu quả
     → Cây lớn → Thu hoạch → Vàng → Nâng cấp nông trại → (lặp lại)
```

## Chạy game

```bash
npm install
npm run dev     # mở http://localhost:5173
```

Build production: `npm run build` → thư mục `dist/`.

## Demo nhanh (3 phút)

1. Onboarding → chọn cấp học (câu hỏi đổi theo cấp 1/2/3) → **VÀO NÔNG TRẠI**
2. Cây lớn theo thời gian thật (cà rốt 60s, cà chua 90s) — sau ~8s, **Earth Event đầu tiên tự xuất hiện**
3. Trời đổ mưa → Buddy cảnh báo → Mission mở → chọn đáp án
   - Đúng: confetti, +Gold +XP, cây được bảo vệ
   - Sai: "Almost! Let's learn." — cây tạm dừng 12s (Recovering), vẫn +5 XP
4. **THU HOẠCH** khi cây chín → coin bay → mở **SHOP** mua hạt giống / mở khóa đất
5. Nhận thưởng **TODAY'S MISSION**

**Demo Mode** (nút 🛠️ góc phải dưới hoặc phím `D`): trigger từng event
(Heavy Rain / High Temperature / Vegetation Stress / Perfect Growing Day), Grow Plant, Reset Game.

## Earth Events

| Event | Dataset mẫu theo | Dữ liệu | Tác động visual |
|---|---|---|---|
| 🌧️ Heavy Rain | NASA GPM IMERG | Rainfall 42 mm | Mây đen, mưa rơi, vũng nước, trời tối |
| 🌡️ High Heat | NASA MODIS LST | 39°C | Nắng gắt, heat wave, cây rũ |
| 🥀 Vegetation Stress | NASA MODIS NDVI | 0.31 ↓ | Cây nhạt màu, không khí ảm đạm |
| 🌈 Perfect Day | GPM + LST | 5 mm, 27°C | Cầu vồng, sparkles, +20% tăng trưởng |

## Về dữ liệu NASA

⚠️ **Prototype sử dụng dữ liệu mẫu đã được chuẩn hóa dựa trên cấu trúc dữ liệu quan sát Trái Đất —
KHÔNG phải dữ liệu NASA real-time.**

Data adapter tại [src/services/earthData.ts](src/services/earthData.ts): interface `EarthDataService`
hiện dùng `MockEarthDataService`; khi tích hợp thật chỉ cần thay bằng `RealEarthDataService`
(GPM IMERG / MODIS LST / MODIS NDVI) mà không đổi game code.

## Kiến trúc

```
src/
  components/   # FarmScene, Plot, PlantArt, Buddy, EarthMonitor,
                # MissionModal, Shop, DailyMission, DemoPanel, Onboarding, FxLayer…
  data/         # crops.ts · earthEvents.ts · missions.ts (4 event × 3 cấp học)
  game/         # state.ts (reducer thuần) · GameContext.tsx (tick, scheduler, persistence)
  services/     # earthData.ts (adapter Mock ↔ Real)
  styles/       # base.css (UI/HUD) · scene.css (bầu trời, thời tiết, ruộng)
  utils/        # sound.ts (WebAudio synth — không cần file âm thanh)
```

- **Stack**: Vite + React + TypeScript, không backend — lưu game bằng `localStorage`
- **Art**: 100% SVG + CSS animation vẽ tay (không asset ngoài, không game engine)
- **Âm thanh**: tổng hợp bằng WebAudio (click, coin, success, mưa…), có nút 🔊 tắt/bật
