// Burger Blitz — game loop, screens and the hooks the maker uses
// to stage screenshots (?shot=) and run the scripted self-test (?selftest=1).

import { VIEW } from './config.js';
import { createState, tick } from './state.js';
import { render } from './render.js';
import { handleClick, handleKey } from './input.js';
import { setupShot, runSelfTest } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const state = createState();

canvas.addEventListener('click', (ev) => handleClick(state, canvas, ev));
window.addEventListener('keydown', (ev) => handleKey(state, ev));

window.__blitz = { state, canvas };

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
const selftest = params.get('selftest') === '1';

let last = performance.now();
let paused = false;
window.addEventListener('keydown', (ev) => {
  if ((ev.key === 'p' || ev.key === 'P') && state.phase === 'playing') paused = !paused;
});
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (!paused) tick(state, dt);
  render(ctx, state);
  if (paused) {
    ctx.fillStyle = 'rgba(20,12,6,0.7)';
    ctx.fillRect(0, 64, VIEW.w, VIEW.h - 64);
    ctx.fillStyle = '#f7c948';
    ctx.font = '700 48px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PAUSED — press P to resume', VIEW.w / 2, 360);
  }
  if (!shot) requestAnimationFrame(frame);
}
if (shot) {
  setupShot(state, shot);
  render(ctx, state);
  document.title = `Burger Blitz — shot ${shot}`;
} else if (selftest) {
  runSelfTest(state);
  render(ctx, state);
} else {
  requestAnimationFrame(frame);
}
