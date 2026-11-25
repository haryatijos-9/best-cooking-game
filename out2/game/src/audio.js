// Burger Blitz — tiny WebAudio sounds, no audio files needed.
// Everything is synthesized with oscillators so the game stays offline
// and loads nothing over the network.

let ctx = null;

export function ensureAudio() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function beep(freq, dur, type, vol, when = 0) {
  const ac = ensureAudio();
  if (!ac) return;
  const t = ac.currentTime + when;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(vol, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sfx = {
  click()  { beep(660, 0.06, 'square', 0.05); },
  place()  { beep(300, 0.08, 'triangle', 0.08); beep(180, 0.1, 'triangle', 0.06, 0.05); },
  sizzle() { beep(1200, 0.12, 'sawtooth', 0.03); beep(900, 0.1, 'sawtooth', 0.02, 0.06); },
  ding()   { beep(880, 0.12, 'sine', 0.12); beep(1318, 0.22, 'sine', 0.12, 0.1); },
  buzz()   { beep(140, 0.25, 'sawtooth', 0.1); beep(110, 0.3, 'sawtooth', 0.08, 0.08); },
  pop()    { beep(520, 0.05, 'square', 0.06); },
  end()    { [523, 659, 784, 1046].forEach((f, i) => beep(f, 0.18, 'sine', 0.1, i * 0.12)); },
};
