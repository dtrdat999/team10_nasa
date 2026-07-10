import type { EventId, FarmMissionDef, MeMissionDef } from '../types';

/**
 * Pre-authored mission content.
 * Each Earth Event has two steps:
 *   ME       — protection mission: pick 2 of 4 preparation cards
 *   MY FARM  — adaptation decision on the farm
 * Prompts come in 3 depths: 1 Beginner · 2 Explorer · 3 Scientist.
 */

export const ME_MISSIONS: Record<Exclude<EventId, 'perfect_day'>, MeMissionDef> = {
  poor_air: {
    prompt: {
      1: 'Chiều nay em muốn ra ngoài chơi với bạn. Trời đang nhiều bụi — em chọn 2 thứ nào?',
      2: 'AQI hôm nay ở mức Xấu (168). Em vẫn có hẹn với bạn chiều nay. Em sẽ chuẩn bị 2 điều gì?',
      3: 'PM2.5 đo được 78 µg/m³ — gấp hơn 5 lần khuyến nghị của WHO. Chiều nay có trận bóng. Lựa chọn nào hợp lý nhất?',
    },
    gear: [
      { id: 'mask', icon: '😷', label: 'Khẩu trang' },
      { id: 'indoor', icon: '🏠', label: 'Đổi sang chơi trong nhà' },
      { id: 'kite', icon: '🪁', label: 'Thả diều ngoài trời' },
      { id: 'fan', icon: '🪭', label: 'Quạt giấy quạt bụi đi' },
    ],
    correct: ['mask', 'indoor'],
    explainCorrect:
      'Chính xác! Ngày bụi mịn cao, tốt nhất là hạn chế hoạt động mạnh ngoài trời. Nếu phải ra ngoài thì khẩu trang đúng chuẩn sẽ chặn được phần lớn bụi mịn.',
    explainWrong:
      'Chưa ổn rồi. Bụi mịn nhỏ đến mức quạt không đuổi được, và chạy nhảy ngoài trời khiến em hít bụi nhiều hơn. Hãy đeo khẩu trang và ưu tiên chơi trong nhà nhé.',
    advice: 'Ngày AQI xấu: hạn chế vận động mạnh ngoài trời, đeo khẩu trang khi ra đường.',
  },

  high_uv: {
    prompt: {
      1: 'Trời nắng gắt lắm! Em chọn 2 thứ mang theo trước khi ra ngoài nhé.',
      2: 'Chỉ số UV hôm nay là 9 (rất cao). Em sắp ra ngoài — chuẩn bị 2 thứ nào là đúng nhất?',
      3: 'UV Index 9 nghĩa là da không được che chắn có thể bị tổn thương chỉ sau ~15 phút. Em chọn 2 phương án chuẩn bị nào?',
    },
    gear: [
      { id: 'hat', icon: '👒', label: 'Mũ rộng vành' },
      { id: 'water', icon: '🧴', label: 'Bình nước' },
      { id: 'raincoat', icon: '🧥', label: 'Áo mưa' },
      { id: 'flashlight', icon: '🔦', label: 'Đèn pin' },
    ],
    correct: ['hat', 'water'],
    explainCorrect:
      'Chuẩn luôn! Mũ rộng vành che được mặt và gáy khỏi tia UV, còn trời nóng thì cơ thể mất nước nhanh — mang nước để uống thường xuyên.',
    explainWrong:
      'Chưa đúng rồi. Tia UV không phải mưa cũng chẳng phải bóng tối — thứ em cần là che chắn da (mũ rộng vành) và bù nước cho cơ thể.',
    advice: 'Ngày UV cao: đội mũ, che da, uống đủ nước, tránh nắng gắt 10h–16h.',
  },

  heavy_rain: {
    prompt: {
      1: 'Mưa to quá! Nếu phải ra ngoài, em chọn 2 thứ nào?',
      2: 'Mưa lớn 42 mm, đường có thể ngập. Em tan học lúc mưa to — 2 lựa chọn nào an toàn?',
      3: 'Mưa cường độ lớn trong thời gian ngắn dễ gây ngập cục bộ. Em chọn 2 phương án nào để về nhà an toàn?',
    },
    gear: [
      { id: 'umbrella', icon: '☂️', label: 'Ô / áo mưa' },
      { id: 'boots', icon: '👢', label: 'Đi ủng, tránh chỗ ngập' },
      { id: 'kite', icon: '🪁', label: 'Thả diều dưới mưa' },
      { id: 'sunglasses', icon: '🕶️', label: 'Kính râm' },
    ],
    correct: ['umbrella', 'boots'],
    explainCorrect:
      'Chính xác! Che mưa cẩn thận và tránh xa chỗ nước ngập — nước ngập có thể che mất hố sâu hoặc dây điện, nguy hiểm lắm.',
    explainWrong:
      'Chưa đúng rồi. Trời mưa to thì diều không bay được còn kính râm chẳng giúp gì. Quan trọng nhất: che mưa và tránh xa chỗ nước ngập.',
    advice: 'Ngày mưa lớn: mang áo mưa, không lội qua chỗ ngập, không trú dưới cây to.',
  },
};

export const FARM_MISSIONS: Record<EventId, FarmMissionDef> = {
  poor_air: {
    question: {
      1: 'Bụi bám lên lá làm cây "thở" kém hơn. Em nên làm gì cho vườn?',
      2: 'Bụi mịn phủ trên lá khiến cây quang hợp kém đi. Em chọn cách nào?',
      3: 'Lớp bụi trên bề mặt lá làm giảm lượng ánh sáng cây hấp thụ để quang hợp. Biện pháp nào hiệu quả nhất?',
    },
    options: [
      'Tưới nhẹ rửa sạch bụi trên lá',
      'Đốt rơm quanh vườn cho ấm cây',
      'Không cần làm gì cả',
    ],
    correct: 0,
    explainCorrect:
      'Chính xác! Tưới nhẹ rửa trôi lớp bụi, lá lại đón được ánh sáng và cây quang hợp bình thường trở lại.',
    explainWrong:
      'Chưa đúng. Đốt rơm còn tạo thêm khói bụi — không khí đang xấu sẽ càng xấu hơn! Cách đúng là tưới nhẹ để rửa sạch bụi trên lá.',
  },

  high_uv: {
    question: {
      1: 'Mái che chỉ đủ cho MỘT luống thôi. Em che luống nào?',
      2: 'Nắng gắt cả ngày mà mái che chỉ đủ cho một luống. Cà chua ưa nắng vừa, cà rốt chịu hạn tốt. Em che luống nào?',
      3: 'Bức xạ mạnh làm đất bốc hơi nước nhanh. Cà chua nhạy cảm với nắng gắt hơn cà rốt (cây rễ củ, chịu hạn). Với một mái che duy nhất, phương án tối ưu là gì?',
    },
    options: [
      'Che luống cà chua 🍅',
      'Che luống cà rốt 🥕',
      'Phủ kín nilon lên cả hai luống',
    ],
    correct: 0,
    explainCorrect:
      'Chính xác! Cà chua sợ nắng gắt nhất nên được ưu tiên che, còn cà rốt chịu hạn tốt hơn. Chọn đúng cây để bảo vệ cũng là một kỹ năng của nhà nông!',
    explainWrong:
      'Chưa tối ưu. Cà rốt là cây rễ củ chịu hạn khá tốt, còn phủ kín nilon làm cây thiếu sáng và bí hơi nóng. Cà chua mới là cây cần che nhất hôm nay.',
  },

  heavy_rain: {
    question: {
      1: 'Mưa to làm nước đọng trong vườn. Em nên làm gì để cứu cây?',
      2: 'Nước mưa đang tích lại quanh gốc. Cà rốt là cây sợ úng nhất vườn. Em ưu tiên việc gì?',
      3: 'Với 42 mm mưa, đất gần bão hòa nước — rễ cây (đặc biệt cây rễ củ như cà rốt) sẽ thiếu oxy. Biện pháp nào giảm nguy cơ úng hiệu quả nhất?',
    },
    options: [
      'Khơi rãnh cho nước thoát ra',
      'Tưới thêm cho đất ẩm đều',
      'Phủ nilon giữ nước lại',
    ],
    correct: 0,
    explainCorrect:
      'Chính xác! Rãnh thoát nước giúp nước không đọng quanh rễ. Rễ ngâm nước lâu sẽ thiếu oxy và thối — cà rốt của em vừa thoát nạn đó!',
    explainWrong:
      'Chưa đúng rồi. Đất đang thừa nước — thêm nước hay giữ nước lại đều làm rễ ngạt. Phải khơi rãnh cho nước thoát ra ngoài.',
  },

  perfect_day: {
    question: {
      1: 'Hôm nay trời đẹp tuyệt! Nhà nông giỏi sẽ làm gì?',
      2: 'Không khí sạch, nắng dịu, mưa nhẹ 5 mm — điều kiện lý tưởng. Em ưu tiên việc gì?',
      3: 'Mọi chỉ số hôm nay đều trong ngưỡng tối ưu cho cây trồng. Chiến lược hợp lý nhất là gì?',
    },
    options: [
      'Gieo thêm cây mới để tận dụng',
      'Bỏ mặc nông trại hôm nay',
      'Nhổ bỏ cây đang lớn trồng lại',
    ],
    correct: 0,
    explainCorrect:
      'Tuyệt vời! Ngày điều kiện tốt là lúc hạt nảy mầm nhanh nhất — nhà nông hiện đại dùng dữ liệu để chọn đúng thời điểm gieo trồng.',
    explainWrong:
      'Tiếc quá! Ngày đẹp trời là cơ hội vàng — dữ liệu tốt là tín hiệu để hành động, đừng bỏ lỡ nhé.',
  },
};
