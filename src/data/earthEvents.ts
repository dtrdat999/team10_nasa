import type { EarthEventDef, EventId } from '../types';

export const EARTH_EVENTS: Record<EventId, EarthEventDef> = {
  poor_air: {
    id: 'poor_air',
    banner: 'POOR AIR QUALITY',
    bannerVi: 'Không khí hôm nay nhiều bụi mịn!',
    icon: '😷',
    weather: 'haze',
    danger: true,
    hasMe: true,
    buddyIntro: [
      'Trạm đo cho thấy bụi mịn PM2.5 hôm nay rất cao. Em nhìn xem, bầu trời mờ hẳn đi!',
      'Trước tiên, mình phải bảo vệ bản thân đã nhé!',
    ],
  },

  high_uv: {
    id: 'high_uv',
    banner: 'VERY HIGH UV',
    bannerVi: 'Tia UV hôm nay rất cao!',
    icon: '☀️',
    weather: 'heat',
    danger: true,
    hasMe: true,
    buddyIntro: [
      'Chỉ số UV hôm nay lên tới 9 — rất cao! Tia UV vô hình nhưng có thể làm bỏng da đó.',
      'Em định ra ngoài đúng không? Chuẩn bị đồ bảo vệ trước đã!',
    ],
  },

  heavy_rain: {
    id: 'heavy_rain',
    banner: 'HEAVY RAIN DETECTED',
    bannerVi: 'Vệ tinh phát hiện mưa lớn tại Hà Nội!',
    icon: '🌧️',
    weather: 'rain',
    danger: true,
    hasMe: true,
    buddyIntro: [
      'Vệ tinh đo được lượng mưa 42 mm — mưa rất to! Đường phố có thể ngập đó.',
      'Nếu phải ra ngoài, em cần chuẩn bị gì nhỉ?',
    ],
  },

  perfect_day: {
    id: 'perfect_day',
    banner: 'PERFECT GROWING DAY',
    bannerVi: 'Hôm nay là một ngày tuyệt đẹp!',
    icon: '🌈',
    weather: 'perfect',
    danger: false,
    hasMe: false,
    buddyIntro: [
      'Tuyệt vời! Không khí sạch, nắng dịu, mưa nhẹ — một ngày hoàn hảo cho nông trại!',
      'Nhà nông giỏi sẽ tận dụng ngày đẹp trời thế nào nhỉ?',
    ],
  },
};
