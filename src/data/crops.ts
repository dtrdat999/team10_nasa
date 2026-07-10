import type { CropDef, CropId } from '../types';

// Prototype-fast growth: full carrot cycle = 60s, tomato = 90s.
// Each crop has a "personality" so the same event affects them differently.
export const CROPS: Record<CropId, CropDef> = {
  carrot: {
    id: 'carrot',
    name: 'Cà rốt',
    emoji: '🥕',
    trait: 'Chịu hạn tốt, nhưng rất sợ ngập úng',
    stageTimes: [15, 30, 50, 60],
    reward: 50,
    xp: 25,
    seedPrice: 20,
  },
  tomato: {
    id: 'tomato',
    name: 'Cà chua',
    emoji: '🍅',
    trait: 'Ưa nắng vừa, nắng gắt là héo trước tiên',
    stageTimes: [22, 45, 75, 90],
    reward: 80,
    xp: 40,
    seedPrice: 35,
  },
};

export const STAGE_NAMES = ['Hạt giống', 'Mầm cây', 'Cây non', 'Cây trưởng thành', 'Sẵn sàng thu hoạch'];
