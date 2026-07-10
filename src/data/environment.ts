import type { EnvironmentSnapshot } from '../types';

/**
 * Mock environment data, one snapshot per in-game Earth Day.
 *
 * Values are curated to look like real Hanoi conditions and are shaped so a
 * RealEnvironmentProvider can later combine e.g. OpenAQ (PM2.5, ground
 * stations), NASA POWER / GPM IMERG (temperature, rainfall) and a UV
 * forecast — without touching game code.
 */
const DAY_SCRIPT: Omit<EnvironmentSnapshot, 'day'>[] = [
  {
    location: 'Hanoi, Vietnam',
    eventId: 'high_uv',
    aqi: 72,
    aqiStatus: 'Moderate',
    pm25: 22,
    uv: 9,
    tempC: 36,
    rainMm: 0,
    highlight: 'uv',
    statusEn: 'Very High UV',
    statusVi: 'Tia UV rất cao',
  },
  {
    location: 'Hanoi, Vietnam',
    eventId: 'poor_air',
    aqi: 168,
    aqiStatus: 'Poor',
    pm25: 78,
    uv: 4,
    tempC: 29,
    rainMm: 0,
    highlight: 'aqi',
    statusEn: 'Poor Air Quality',
    statusVi: 'Không khí xấu',
  },
  {
    location: 'Hanoi, Vietnam',
    eventId: 'heavy_rain',
    aqi: 45,
    aqiStatus: 'Good',
    pm25: 12,
    uv: 2,
    tempC: 26,
    rainMm: 42,
    highlight: 'rain',
    statusEn: 'Heavy Rain',
    statusVi: 'Mưa lớn',
  },
  {
    location: 'Hanoi, Vietnam',
    eventId: 'perfect_day',
    aqi: 38,
    aqiStatus: 'Good',
    pm25: 9,
    uv: 5,
    tempC: 27,
    rainMm: 5,
    highlight: 'none',
    statusEn: 'Perfect Growing Day',
    statusVi: 'Ngày tuyệt đẹp',
  },
];

export interface EnvironmentProvider {
  getSnapshot(day: number): EnvironmentSnapshot;
}

export class MockEnvironmentProvider implements EnvironmentProvider {
  getSnapshot(day: number): EnvironmentSnapshot {
    const base = DAY_SCRIPT[(day - 1) % DAY_SCRIPT.length];
    return { ...base, day };
  }
}

// Future: export class RealEnvironmentProvider implements EnvironmentProvider { ... }

export const environmentProvider: EnvironmentProvider = new MockEnvironmentProvider();

export const DATA_DISCLAIMER =
  'Demo data — dữ liệu mẫu được chuẩn hóa theo cấu trúc dữ liệu quan sát Trái Đất (NASA Earth observation) và trạm đo mặt đất. Không phải dữ liệu thời gian thực.';
