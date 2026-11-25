// Burger Blitz — mouse and keyboard input.
// Hit-tests against the same zone rects the renderer draws,
// then calls the matching state action and plays its sound.

import { ZONES, BIN_ORDER } from './config.js';
import { selectOrder, grillClick, addTopping, clearPlate, serveOrder, startGame } from './state.js';
import { sfx, ensureAudio } from './audio.js';

function inRect(x, y, r) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

function toCanvas(canvas, ev) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (ev.clientX - rect.left) * (canvas.width / rect.width),
    y: (ev.clientY - rect.top) * (canvas.height / rect.height),
  };
}

export function handleClick(state, canvas, ev) {
  ensureAudio();
  const { x, y } = toCanvas(canvas, ev);

  if (state.phase === 'title') {
    if (inRect(x, y, ZONES.start)) { startGame(state); sfx.ding(); }
    return;
  }
  if (state.phase === 'over') {
    if (inRect(x, y, ZONES.restart)) { startGame(state); sfx.ding(); }
    return;
  }

  // Order tickets.
  const oz = ZONES.orders;
  for (let i = 0; i < state.orders.length; i++) {
    const r = { x: oz.x, y: oz.y + i * (oz.h + oz.gap), w: oz.w, h: oz.h };
    if (inRect(x, y, r)) { selectOrder(state, i); sfx.click(); return; }
  }

  // Grill slots.
  const gz = ZONES.grill;
  for (let s = 0; s < 4; s++) {
    const r = { x: gz.x + s * (gz.w + gz.gap), y: gz.y, w: gz.w, h: gz.h };
    if (inRect(x, y, r)) {
      const res = grillClick(state, s);
      if (res === 'placed') sfx.sizzle();
      else if (res === 'taken') sfx.place();
      else if (res === 'trashed') sfx.buzz();
      else sfx.click();
      return;
    }
  }

  // Topping bins.
  const bz = ZONES.bins;
  for (let b = 0; b < BIN_ORDER.length; b++) {
    const r = { x: bz.x + b * (bz.w + bz.gap), y: bz.y, w: bz.w, h: bz.h };
    if (inRect(x, y, r)) {
      if (addTopping(state, BIN_ORDER[b])) sfx.pop();
      else sfx.buzz();
      return;
    }
  }

  if (inRect(x, y, ZONES.serve)) {
    const res = serveOrder(state);
    if (res === 'good') sfx.ding();
    else if (res === 'bad') sfx.buzz();
    else sfx.click();
    return;
  }
  if (inRect(x, y, ZONES.trash)) { clearPlate(state); sfx.buzz(); }
}

export function handleKey(state, ev) {
  if (state.phase !== 'playing') {
    if ((ev.key === 'Enter' || ev.key === ' ') && (state.phase === 'title' || state.phase === 'over')) {
      ensureAudio();
      startGame(state);
      sfx.ding();
    }
    return;
  }
  if (ev.key >= '1' && ev.key <= '3') selectOrder(state, Number(ev.key) - 1);
  else if (ev.key === 'g' || ev.key === 'G') {
    const slot = state.grill.findIndex((g) => !g);
    if (slot >= 0) { grillClick(state, slot); sfx.sizzle(); }
  } else if (ev.key === ' ') { const r = serveOrder(state); if (r === 'good') sfx.ding(); else if (r === 'bad') sfx.buzz(); ev.preventDefault(); }
  else if (ev.key === 't' || ev.key === 'T' || ev.key === 'Backspace') clearPlate(state);
}
