import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useGame } from '../game/GameContext';
import { DATA_DISCLAIMER, environmentProvider } from '../data/environment';
import { sound } from '../utils/sound';

function aqiClass(aqi: number): string {
  if (aqi <= 50) return 'v-good';
  if (aqi <= 100) return 'v-mid';
  return 'v-bad';
}

export function EarthMonitor() {
  const { state } = useGame();
  const [showInfo, setShowInfo] = useState(false);
  const snap = environmentProvider.getSnapshot(state.day);
  const eventActive = state.currentEvent !== null;
  const alerting = eventActive && state.weather !== 'clear' && state.weather !== 'perfect';
  const nice = state.weather === 'perfect';

  const rows: { key: string; icon: string; label: string; value: string; cls?: string }[] = [
    { key: 'aqi', icon: '🌫️', label: 'Air Quality', value: `${snap.aqiStatus} (${snap.aqi})`, cls: aqiClass(snap.aqi) },
    { key: 'aqi2', icon: '⚛️', label: 'PM2.5', value: `${snap.pm25} µg/m³` },
    { key: 'uv', icon: '☀️', label: 'UV Index', value: `${snap.uv}${snap.uv >= 8 ? ' (Very High)' : ''}`, cls: snap.uv >= 8 ? 'v-bad' : snap.uv >= 6 ? 'v-mid' : 'v-good' },
    { key: 'temp', icon: '🌡️', label: 'Temperature', value: `${snap.tempC}°C` },
    { key: 'rain', icon: '🌧️', label: 'Rainfall', value: `${snap.rainMm} mm`, cls: snap.rainMm >= 30 ? 'v-bad' : undefined },
  ];

  return (
    <>
      <aside className={`monitor ${alerting ? 'monitor-alert' : ''} ${nice ? 'monitor-nice' : ''}`}>
        <div className="monitor-head">
          <span className="monitor-title">🛰️ EARTH MONITOR</span>
          <span className="day-chip">Ngày {state.day}</span>
          <span className={`monitor-dot ${alerting ? 'red' : 'green'}`} />
        </div>

        <div className="monitor-body">
          <div className="radar">
            <div className="radar-sweep" />
            <div className="radar-rings" />
            <span className="radar-blip" />
          </div>
          <div className="monitor-data">
            <div className="mrow">
              <span className="mlabel">📍 Location</span>
              <span className="mvalue">{snap.location}</span>
            </div>
            {rows.map((r) => {
              const hot =
                eventActive &&
                ((snap.highlight === 'aqi' && (r.key === 'aqi' || r.key === 'aqi2')) ||
                  (snap.highlight === r.key && r.key !== 'aqi'));
              return (
                <div className={`mrow ${hot ? 'mrow-hot' : ''}`} key={r.key}>
                  <span className="mlabel">
                    {r.icon} {r.label}
                  </span>
                  <span className={`mvalue ${r.cls ?? ''}`}>{r.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`monitor-status s-${state.weather}`}>
          {eventActive ? `${snap.statusEn} · ${snap.statusVi}` : 'Monitoring · Đang quan sát'}
        </div>

        <div className="monitor-foot">
          <span className="monitor-src">Mock data · NASA Earth obs + ground stations (structure)</span>
          <button
            className="btn-mini"
            onClick={() => {
              sound.click();
              setShowInfo(true);
            }}
          >
            Xem dữ liệu
          </button>
        </div>
      </aside>

      {showInfo &&
        createPortal(
          <div className="modal-backdrop" onClick={() => setShowInfo(false)}>
            <div className="modal data-modal" onClick={(e) => e.stopPropagation()}>
              <h2>🛰️ Dữ liệu môi trường đến từ đâu?</h2>
              <p>
                <b>Vệ tinh</b> bay quanh Trái Đất đo <b>lượng mưa</b>, <b>nhiệt độ bề mặt</b> và <b>tia UV</b> từ không
                gian. Còn <b>bụi mịn PM2.5</b> thường được đo bởi các <b>trạm quan trắc mặt đất</b> ngay trong thành
                phố. Kết hợp cả hai, ta biết được hôm nay môi trường quanh mình thế nào!
              </p>
              <pre className="data-json">
{JSON.stringify(
  {
    day: snap.day,
    location: snap.location,
    aqi: snap.aqi,
    pm25_ugm3: snap.pm25,
    uv_index: snap.uv,
    temperature_c: snap.tempC,
    rainfall_mm: snap.rainMm,
    status: snap.statusEn.toLowerCase().replace(/ /g, '_'),
  },
  null,
  2,
)}
              </pre>
              <p className="data-disclaimer">{DATA_DISCLAIMER}</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  sound.click();
                  setShowInfo(false);
                }}
              >
                Đã hiểu!
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
