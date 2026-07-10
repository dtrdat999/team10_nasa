import { useState } from 'react';
import { useGame } from '../game/GameContext';
import { CROPS } from '../data/crops';
import { GEAR_PRICE, UNLOCK_LAND_PRICE, WATERING_UPGRADE_PRICE } from '../game/state';
import { sound } from '../utils/sound';

interface ShopItem {
  id: string;
  icon: string;
  name: string;
  desc: string;
  price: number;
  soldOut?: boolean;
  onBuy: () => void;
}

export function Shop({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useGame();
  const [warn, setWarn] = useState<Record<string, number>>({});

  const tryBuy = (item: ShopItem) => {
    if (state.gold < item.price) {
      sound.wrong();
      setWarn((w) => ({ ...w, [item.id]: item.price - state.gold }));
      window.setTimeout(() => setWarn((w) => ({ ...w, [item.id]: 0 })), 1800);
      return;
    }
    item.onBuy();
    sound.coin();
  };

  const allUnlocked = state.plots.every((p) => p.unlocked);

  const items: ShopItem[] = [
    {
      id: 'carrot',
      icon: '🥕',
      name: 'Carrot Seed',
      desc: `${CROPS.carrot.trait} · 60s · bán ${CROPS.carrot.reward}🪙 (có x${state.inventory.carrotSeeds})`,
      price: CROPS.carrot.seedPrice,
      onBuy: () => dispatch({ type: 'BUY_SEED', cropId: 'carrot' }),
    },
    {
      id: 'tomato',
      icon: '🍅',
      name: 'Tomato Seed',
      desc: `${CROPS.tomato.trait} · 90s · bán ${CROPS.tomato.reward}🪙 (có x${state.inventory.tomatoSeeds})`,
      price: CROPS.tomato.seedPrice,
      onBuy: () => dispatch({ type: 'BUY_SEED', cropId: 'tomato' }),
    },
    {
      id: 'mask',
      icon: '😷',
      name: 'Khẩu trang xịn',
      desc: state.inventory.hasMask
        ? 'Đã sở hữu — thưởng thêm +10🪙 mỗi ngày không khí xấu!'
        : 'Ngày không khí xấu: chuẩn bị đúng được thưởng thêm +10🪙',
      price: GEAR_PRICE,
      soldOut: state.inventory.hasMask,
      onBuy: () => dispatch({ type: 'BUY_GEAR', gear: 'mask' }),
    },
    {
      id: 'hat',
      icon: '👒',
      name: 'Mũ chống nắng',
      desc: state.inventory.hasHat
        ? 'Đã sở hữu — Buddy cũng được đội ké ngày nắng!'
        : 'Ngày UV cao: chuẩn bị đúng được thưởng thêm +10🪙',
      price: GEAR_PRICE,
      soldOut: state.inventory.hasHat,
      onBuy: () => dispatch({ type: 'BUY_GEAR', gear: 'hat' }),
    },
    {
      id: 'watering',
      icon: '🚿',
      name: 'Watering Can Upgrade',
      desc: state.inventory.wateringCanLevel >= 2 ? 'Đã nâng cấp — cây lớn nhanh hơn 10%!' : 'Cây lớn nhanh hơn 10% vĩnh viễn',
      price: WATERING_UPGRADE_PRICE,
      soldOut: state.inventory.wateringCanLevel >= 2,
      onBuy: () => dispatch({ type: 'BUY_WATERING_UPGRADE' }),
    },
    {
      id: 'land',
      icon: '🏞️',
      name: 'Unlock Land',
      desc: allUnlocked ? 'Tất cả ô đất đã được mở khóa!' : 'Mở thêm 1 ô đất để trồng trọt',
      price: UNLOCK_LAND_PRICE,
      soldOut: allUnlocked,
      onBuy: () => dispatch({ type: 'BUY_UNLOCK_LAND' }),
    },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal shop-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shop-head">
          <h2>🛒 FARM SHOP</h2>
          <div className="chip chip-gold">🪙 {state.gold}</div>
        </div>
        <div className="shop-grid">
          {items.map((item) => (
            <div key={item.id} className={`shop-item ${item.soldOut ? 'sold-out' : ''}`}>
              <div className="shop-icon">{item.icon}</div>
              <div className="shop-name">{item.name}</div>
              <div className="shop-desc">{item.desc}</div>
              {item.soldOut ? (
                <div className="shop-owned">✅ Đã sở hữu</div>
              ) : (
                <button className="btn btn-buy" onClick={() => tryBuy(item)}>
                  {item.price} 🪙
                </button>
              )}
              {warn[item.id] > 0 && <div className="need-gold-tip shop-tip">Bạn cần thêm {warn[item.id]} Gold.</div>}
            </div>
          ))}
        </div>
        <button
          className="btn btn-ghost"
          onClick={() => {
            sound.click();
            onClose();
          }}
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
