// Burger Blitz — canvas renderer: draws the whole kitchen.
// It only reads state, it never changes it.

import { VIEW, ZONES, TOPPINGS, BIN_ORDER, SHIFT_SECONDS, PATTY_COOK_TIME } from './config.js';

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, s, x, y, size, color, align = 'left', bold = true) {
  ctx.fillStyle = color;
  ctx.font = `${bold ? '700' : '400'} ${size}px system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}

// One topping drawn at (x, y, w, h).
export function drawTopping(ctx, kind, x, y, w, h) {
  const t = TOPPINGS[kind];
  if (!t) return;
  ctx.save();
  if (kind === 'patty') {
    ctx.fillStyle = t.color;
    rr(ctx, x, y + h * 0.2, w, h * 0.6, 8); ctx.fill();
    ctx.fillStyle = t.dark;
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(x + w * (0.2 + i * 0.2), y + h * 0.5, 2.5, 0, 7); ctx.fill(); }
  } else if (kind === 'cheese') {
    ctx.fillStyle = t.color;
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.25); ctx.lineTo(x + w, y + h * 0.25);
    ctx.lineTo(x + w * 0.8, y + h * 0.85); ctx.lineTo(x + w * 0.55, y + h * 0.45);
    ctx.lineTo(x + w * 0.3, y + h * 0.85); ctx.closePath(); ctx.fill();
  } else if (kind === 'lettuce') {
    ctx.fillStyle = t.color;
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.6);
    for (let i = 0; i <= 4; i++) ctx.quadraticCurveTo(x + w * (i + 0.5) / 4, y - h * 0.1, x + w * (i + 1) / 4, y + h * 0.6);
    ctx.lineTo(x + w, y + h * 0.8); ctx.lineTo(x, y + h * 0.8); ctx.closePath(); ctx.fill();
  } else if (kind === 'tomato') {
    ctx.fillStyle = t.color;
    ctx.beginPath(); ctx.ellipse(x + w / 2, y + h / 2, w * 0.46, h * 0.36, 0, 0, 7); ctx.fill();
    ctx.fillStyle = t.dark;
    ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, 3, 0, 7); ctx.fill();
  } else if (kind === 'onion') {
    ctx.strokeStyle = t.color; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, w * 0.34, 0, 7); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, w * 0.18, 0, 7); ctx.stroke();
  } else if (kind === 'bacon') {
    ctx.fillStyle = t.color;
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.3);
    for (let i = 0; i <= 3; i++) ctx.quadraticCurveTo(x + w * (i + 0.5) / 3, y + h * (i % 2 ? 0.65 : 0.05), x + w * (i + 1) / 3, y + h * 0.3);
    ctx.lineTo(x + w, y + h * 0.7);
    for (let i = 3; i >= 0; i--) ctx.quadraticCurveTo(x + w * (i + 0.5) / 3, y + h * (i % 2 ? 0.95 : 0.45), x + w * i / 3, y + h * 0.7);
    ctx.closePath(); ctx.fill();
  } else if (kind === 'topbun') {
    ctx.fillStyle = t.color;
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.quadraticCurveTo(x + w / 2, y - h * 0.5, x + w, y + h);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff3d6';
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(x + w * (0.3 + i * 0.2), y + h * 0.35, 3, 2, 0, 0, 7); ctx.fill(); }
  }
  ctx.restore();
}

function drawBurgerStack(ctx, layers, x, y, w) {
  const lh = 15;
  const total = layers.length + 1;
  let cy = y + total * lh;
  // Bottom bun.
  ctx.fillStyle = '#e8b04b';
  ctx.beginPath();
  ctx.moveTo(x, cy); ctx.lineTo(x + w, cy);
  ctx.quadraticCurveTo(x + w / 2, cy + 16, x, cy); ctx.closePath(); ctx.fill();
  cy -= 2;
  for (let i = layers.length - 1; i >= 0; i--) {
    cy -= lh;
    drawTopping(ctx, layers[i], x + 4, cy, w - 8, lh + 4);
  }
}

function drawOrderTicket(ctx, order, x, y, w, h, selected) {
  ctx.fillStyle = selected ? '#3d2c17' : '#2c1e11';
  rr(ctx, x, y, w, h, 10); ctx.fill();
  ctx.strokeStyle = selected ? '#f7c948' : '#5a4026';
  ctx.lineWidth = selected ? 3 : 1.5;
  rr(ctx, x, y, w, h, 10); ctx.stroke();
  text(ctx, order.customer, x + 12, y + 20, 17, '#ffd98a');
  text(ctx, order.recipe.name, x + 12, y + 44, 19, '#ffffff');
  text(ctx, `$${order.recipe.price}`, x + w - 12, y + 20, 17, '#7ee787', 'right');
  // Layer chips.
  let cx = x + 12;
  for (const l of order.recipe.layers) {
    ctx.fillStyle = TOPPINGS[l].color;
    rr(ctx, cx, y + 60, 22, 14, 4); ctx.fill();
    cx += 27;
  }
  // Patience bar.
  const frac = Math.max(0, order.patience / order.maxPatience);
  ctx.fillStyle = '#241608';
  rr(ctx, x + 12, y + h - 20, w - 24, 10, 5); ctx.fill();
  ctx.fillStyle = frac > 0.5 ? '#58b368' : frac > 0.25 ? '#f7c948' : '#e4572e';
  if (frac > 0) { rr(ctx, x + 12, y + h - 20, (w - 24) * frac, 10, 5); ctx.fill(); }
}

export function render(ctx, state) {
  const { w, h } = VIEW;
  ctx.clearRect(0, 0, w, h);
  // Floor and walls.
  ctx.fillStyle = '#2a1a10'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#33200f'; ctx.fillRect(0, 64, w, 8);
  ctx.fillStyle = '#1d130b'; ctx.fillRect(0, 560, w, 160);

  // Top bar.
  ctx.fillStyle = '#17100a'; ctx.fillRect(0, 0, w, 64);
  text(ctx, 'BURGER BLITZ', 20, 32, 30, '#f7c948');
  const mins = Math.floor(Math.max(0, state.timeLeft) / 60);
  const secs = Math.floor(Math.max(0, state.timeLeft) % 60).toString().padStart(2, '0');
  const timeColor = state.timeLeft < 30 ? '#ff6b5e' : '#ffffff';
  text(ctx, `TIME ${mins}:${secs}`, 640, 26, 24, timeColor, 'center');
  ctx.fillStyle = '#241608';
  rr(ctx, 520, 44, 240, 10, 5); ctx.fill();
  ctx.fillStyle = '#f7c948';
  rr(ctx, 520, 44, 240 * Math.max(0, state.timeLeft / SHIFT_SECONDS), 10, 5); ctx.fill();
  text(ctx, `SCORE $${state.score}`, 1260, 22, 22, '#7ee787', 'right');
  text(ctx, state.combo > 1 ? `COMBO x${state.combo}` : 'No combo yet', 1260, 48, 16, '#ffd98a', 'right');

  if (state.phase === 'title') {
    ctx.fillStyle = 'rgba(20,12,6,0.88)'; ctx.fillRect(0, 64, w, h - 64);
    text(ctx, 'BURGER BLITZ', 640, 170, 64, '#f7c948', 'center');
    text(ctx, 'The lunch rush is on. Grill patties, stack toppings in order,', 640, 250, 22, '#ffffff', 'center');
    text(ctx, 'and serve every burger before the customer loses patience.', 640, 282, 22, '#ffffff', 'center');
    text(ctx, 'Click a ticket to pick an order  •  click the grill for a patty', 640, 330, 18, '#ffd98a', 'center', false);
    text(ctx, 'Click topping bins to stack  •  SERVE when the plate matches', 640, 358, 18, '#ffd98a', 'center', false);
    text(ctx, 'Keys: 1-3 orders  •  G grill  •  Space serve  •  T trash', 640, 386, 18, '#ffd98a', 'center', false);
    ctx.fillStyle = '#58b368'; rr(ctx, ZONES.start.x, ZONES.start.y, ZONES.start.w, ZONES.start.h, 12); ctx.fill();
    text(ctx, 'START SHIFT', 640, ZONES.start.y + 36, 26, '#ffffff', 'center');
    text(ctx, '150 seconds  •  6 recipes  •  combos pay more', 640, 540, 16, '#c9a06a', 'center', false);
    return;
  }

  if (state.phase === 'over') {
    ctx.fillStyle = 'rgba(20,12,6,0.88)'; ctx.fillRect(0, 64, w, h - 64);
    text(ctx, 'SHIFT OVER!', 640, 170, 56, '#f7c948', 'center');
    text(ctx, `Final score  $${state.score}`, 640, 260, 34, '#ffffff', 'center');
    text(ctx, `Burgers served: ${state.served}    Best combo: x${state.bestCombo}    Mistakes: ${state.mistakes}`, 640, 320, 20, '#ffd98a', 'center', false);
    const verdict = state.score >= 150 ? 'Head chef material!' : state.score >= 80 ? 'Solid line cook.' : 'The rush ate you alive — run it back!';
    text(ctx, verdict, 640, 380, 22, '#7ee787', 'center');
    ctx.fillStyle = '#58b368'; rr(ctx, ZONES.restart.x, ZONES.restart.y, ZONES.restart.w, ZONES.restart.h, 12); ctx.fill();
    text(ctx, 'PLAY AGAIN', 640, ZONES.restart.y + 36, 26, '#ffffff', 'center');
    return;
  }

  // Order board.
  text(ctx, 'ORDER BOARD', ZONES.orders.x, 74, 15, '#c9a06a');
  const oz = ZONES.orders;
  state.orders.forEach((o, i) => {
    drawOrderTicket(ctx, o, oz.x, oz.y + i * (oz.h + oz.gap), oz.w, oz.h, i === state.selected);
  });
  if (state.orders.length === 0) text(ctx, 'No orders — breathe!', oz.x, 140, 16, '#c9a06a', 'left', false);

  // Grill.
  text(ctx, 'GRILL — click a slot to place a patty', ZONES.grill.x, ZONES.grill.labelY, 15, '#c9a06a');
  const gz = ZONES.grill;
  for (let s = 0; s < 4; s++) {
    const x = gz.x + s * (gz.w + gz.gap), y = gz.y;
    ctx.fillStyle = '#17100a'; rr(ctx, x, y, gz.w, gz.h, 10); ctx.fill();
    ctx.strokeStyle = '#5a4026'; ctx.lineWidth = 2; rr(ctx, x, y, gz.w, gz.h, 10); ctx.stroke();
    const g = state.grill[s];
    if (g) {
      const frac = Math.min(1, g.t / PATTY_COOK_TIME);
      if (g.stage === 'raw') { ctx.fillStyle = '#d98a8a'; rr(ctx, x + 12, y + 22, 52, 32, 8); ctx.fill(); }
      else if (g.stage === 'cooking') {
        ctx.fillStyle = '#a06832'; rr(ctx, x + 12, y + 22, 52, 32, 8); ctx.fill();
        ctx.fillStyle = '#f7c948'; rr(ctx, x + 12, y + 58, 52 * frac, 6, 3); ctx.fill();
      } else if (g.stage === 'done') {
        ctx.fillStyle = '#7a4a21'; rr(ctx, x + 12, y + 22, 52, 32, 8); ctx.fill();
        ctx.strokeStyle = '#7ee787'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(x + gz.w / 2, y + 38, 12, 0, 7); ctx.stroke();
        text(ctx, 'READY', x + gz.w / 2, y + 66, 11, '#7ee787', 'center');
      } else {
        ctx.fillStyle = '#14100c'; rr(ctx, x + 12, y + 22, 52, 32, 8); ctx.fill();
        text(ctx, 'BURNT!', x + gz.w / 2, y + 66, 11, '#ff6b5e', 'center');
      }
    } else {
      text(ctx, '+', x + gz.w / 2, y + 38, 28, '#5a4026', 'center');
    }
  }

  // Topping bins.
  text(ctx, 'TOPPINGS — click to add to the plate', ZONES.bins.x, ZONES.bins.labelY, 15, '#c9a06a');
  const bz = ZONES.bins;
  BIN_ORDER.forEach((id, i) => {
    const x = bz.x + i * (bz.w + bz.gap), y = bz.y;
    ctx.fillStyle = '#241608'; rr(ctx, x, y, bz.w, bz.h, 10); ctx.fill();
    ctx.strokeStyle = '#5a4026'; ctx.lineWidth = 1.5; rr(ctx, x, y, bz.w, bz.h, 10); ctx.stroke();
    drawTopping(ctx, id, x + 12, y + 10, bz.w - 24, 34);
    text(ctx, TOPPINGS[id].label, x + bz.w / 2, y + bz.h - 10, 12, '#ffd98a', 'center');
  });

  // Assembly plate.
  text(ctx, 'ASSEMBLY PLATE', ZONES.plate.x, 96, 15, '#c9a06a');
  const pz = ZONES.plate;
  ctx.fillStyle = '#1d130b'; rr(ctx, pz.x, pz.y, pz.w, pz.h, 12); ctx.fill();
  ctx.strokeStyle = '#5a4026'; ctx.lineWidth = 2; rr(ctx, pz.x, pz.y, pz.w, pz.h, 12); ctx.stroke();
  ctx.fillStyle = '#d8d2c4';
  ctx.beginPath(); ctx.ellipse(pz.x + pz.w / 2, pz.y + pz.h - 28, 120, 16, 0, 0, 7); ctx.fill();
  if (state.plate.length === 0) {
    text(ctx, 'Empty — grill a patty,', pz.x + pz.w / 2, pz.y + 70, 17, '#c9a06a', 'center', false);
    text(ctx, 'then stack toppings here.', pz.x + pz.w / 2, pz.y + 94, 17, '#c9a06a', 'center', false);
  } else {
    drawBurgerStack(ctx, state.plate, pz.x + 58, pz.y + 30, pz.w - 116);
  }
  // Selected order reminder under the plate.
  const sel = state.orders[state.selected];
  if (sel) {
    text(ctx, `Building for ${sel.customer}: ${sel.recipe.name}`, pz.x + pz.w / 2, pz.y + pz.h - 52, 15, '#ffd98a', 'center');
    const need = sel.recipe.layers.join(' + ');
    text(ctx, need, pz.x + pz.w / 2, pz.y + pz.h - 28, 13, '#c9a06a', 'center', false);
  }

  // Serve + trash.
  ctx.fillStyle = '#2e7d32'; rr(ctx, ZONES.serve.x, ZONES.serve.y, ZONES.serve.w, ZONES.serve.h, 12); ctx.fill();
  text(ctx, 'SERVE!', ZONES.serve.x + ZONES.serve.w / 2, ZONES.serve.y + 34, 26, '#ffffff', 'center');
  text(ctx, 'Space', ZONES.serve.x + ZONES.serve.w / 2, ZONES.serve.y + 62, 13, '#c8e6c9', 'center', false);
  ctx.fillStyle = '#4a2c14'; rr(ctx, ZONES.trash.x, ZONES.trash.y, ZONES.trash.w, ZONES.trash.h, 10); ctx.fill();
  text(ctx, 'TRASH PLATE  (T)', ZONES.trash.x + ZONES.trash.w / 2, ZONES.trash.y + 26, 15, '#ffd98a', 'center');

  // Serve flash border.
  if (state.flash) {
    ctx.strokeStyle = state.flash.kind === 'good' ? '#7ee787' : '#ff6b5e';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 68, w - 8, h - 72);
  }

  // Bottom bar: message + help.
  ctx.fillStyle = '#17100a'; ctx.fillRect(0, 640, w, 80);
  if (state.messageTimer > 0 && state.message) text(ctx, state.message, 20, 668, 20, '#7ee787');
  text(ctx, 'Keys: 1-3 pick order  •  G grill a patty  •  Space serve  •  T trash plate', 20, 700, 14, '#c9a06a', 'left', false);
  text(ctx, 'Watch the patience bars — slow service loses the tip!', 1260, 700, 14, '#c9a06a', 'right', false);
}
