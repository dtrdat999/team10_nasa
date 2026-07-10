// Tiny WebAudio synth — zero asset files, all sounds generated.
// Every call is guarded; if audio fails, gameplay continues silently.

class SoundManager {
  private ctx: AudioContext | null = null;
  private rainGain: GainNode | null = null;
  private rainSrc: AudioBufferSourceNode | null = null;
  enabled = true;

  private ensure(): AudioContext | null {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AC) return null;
        this.ctx = new AC();
      }
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return this.ctx;
    } catch {
      return null;
    }
  }

  private tone(freq: number, dur: number, type: OscillatorType, vol: number, delay = 0, slideTo?: number) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    try {
      const t0 = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
    } catch {
      /* silent */
    }
  }

  click() {
    this.tone(700, 0.07, 'triangle', 0.12);
  }

  coin() {
    this.tone(880, 0.09, 'square', 0.06);
    this.tone(1320, 0.16, 'square', 0.06, 0.07);
  }

  success() {
    this.tone(523, 0.12, 'triangle', 0.14);
    this.tone(659, 0.12, 'triangle', 0.14, 0.1);
    this.tone(784, 0.22, 'triangle', 0.14, 0.2);
  }

  wrong() {
    this.tone(220, 0.25, 'sawtooth', 0.08, 0, 130);
  }

  harvest() {
    this.tone(392, 0.1, 'triangle', 0.12);
    this.tone(523, 0.1, 'triangle', 0.12, 0.08);
    this.coin();
  }

  levelUp() {
    this.tone(523, 0.11, 'square', 0.07);
    this.tone(659, 0.11, 'square', 0.07, 0.09);
    this.tone(784, 0.11, 'square', 0.07, 0.18);
    this.tone(1047, 0.3, 'square', 0.07, 0.27);
  }

  alert() {
    this.tone(660, 0.14, 'sine', 0.1);
    this.tone(880, 0.18, 'sine', 0.1, 0.16);
  }

  pop() {
    this.tone(300, 0.08, 'sine', 0.1, 0, 600);
  }

  startRain() {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx || this.rainSrc) return;
    try {
      const seconds = 2;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 900;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 1.2);
      src.connect(filter).connect(gain).connect(ctx.destination);
      src.start();
      this.rainSrc = src;
      this.rainGain = gain;
    } catch {
      /* silent */
    }
  }

  stopRain() {
    try {
      if (this.rainGain && this.ctx) {
        this.rainGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      }
      const src = this.rainSrc;
      this.rainSrc = null;
      this.rainGain = null;
      if (src) setTimeout(() => { try { src.stop(); } catch { /* */ } }, 900);
    } catch {
      /* silent */
    }
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (!on) this.stopRain();
  }
}

export const sound = new SoundManager();
