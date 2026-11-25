// Burger Blitz — game state and the rules of the kitchen.
// Pure logic: no drawing, no DOM. The renderer reads this state,
// the input handler calls these actions.

import {
  SHIFT_SECONDS, MAX_ORDERS, ORDER_PATIENCE, ORDER_SPAWN_EVERY,
  PATTY_COOK_TIME, PATTY_BURN_TIME, WRONG_SERVE_PENALTY, EXPIRED_PENALTY,
  RECIPES, CUSTOMERS,
} from './config.js';

let orderSeq = 0;
let customerSeq = 0;

export function createState() {
  return {
    phase: 'title', // title | playing | over
    timeLeft: SHIFT_SECONDS,
    score: 0,
    combo: 0,
    bestCombo: 0,
    served: 0,
    mistakes: 0,
    orders: [],
    grill: [null, null, null, null], // { stage: 'raw'|'cooking'|'done'|'burnt', t }
    plate: [], // topping ids stacked on the bottom bun
    selected: 0,
    spawnTimer: 2.5,
    message: '',
    messageTimer: 0,
    flash: null, // { kind: 'good'|'bad', timer }
  };
}

export function pickRecipe() {
  return RECIPES[Math.floor(Math.random() * RECIPES.length)];
}

export function spawnOrder(state) {
  if (state.orders.length >= MAX_ORDERS) return;
  const recipe = pickRecipe();
  const name = CUSTOMERS[customerSeq++ % CUSTOMERS.length];
  state.orders.push({
    id: ++orderSeq,
    customer: name,
    recipe,
    patience: ORDER_PATIENCE,
    maxPatience: ORDER_PATIENCE,
  });
  if (state.selected >= state.orders.length) state.selected = 0;
}

export function startGame(state) {
  const fresh = createState();
  Object.assign(state, fresh, { phase: 'playing' });
  spawnOrder(state);
  spawnOrder(state);
  state.message = 'Shift started — grill a patty!';
  state.messageTimer = 3;
}

function layersMatch(plate, recipe) {
  if (plate.length !== recipe.layers.length) return false;
  const a = [...plate].sort();
  const b = [...recipe.layers].sort();
  return a.every((v, i) => v === b[i]);
}

export function selectOrder(state, i) {
  if (i >= 0 && i < state.orders.length) state.selected = i;
}

export function placePatty(state, slot) {
  if (state.phase !== 'playing') return false;
  if (state.grill[slot]) return false;
  state.grill[slot] = { stage: 'raw', t: 0 };
  return true;
}

export function grillClick(state, slot) {
  if (state.phase !== 'playing') return 'none';
  const g = state.grill[slot];
  if (!g) { placePatty(state, slot); return 'placed'; }
  if (g.stage === 'done') {
    if (state.plate.filter((l) => l === 'patty').length >= 2) return 'full';
    state.plate.push('patty');
    state.grill[slot] = null;
    return 'taken';
  }
  if (g.stage === 'burnt') { state.grill[slot] = null; return 'trashed'; }
  return 'cooking';
}

export function addTopping(state, topping) {
  if (state.phase !== 'playing') return false;
  if (topping === 'topbun') {
    if (state.plate.includes('topbun')) return false;
    state.plate.push('topbun');
    return true;
  }
  const count = state.plate.filter((l) => l === topping).length;
  const max = topping === 'patty' ? 2 : 1;
  if (count >= max) return false;
  state.plate.push(topping);
  return true;
}

export function clearPlate(state) {
  state.plate = [];
}

export function serveOrder(state) {
  if (state.phase !== 'playing') return 'none';
  const order = state.orders[state.selected];
  if (!order) return 'none';
  const plate = state.plate.filter((l) => l !== 'topbun');
  if (plate.length === 0) return 'empty';
  if (layersMatch(plate, order.recipe)) {
    const patienceBonus = Math.round((order.patience / order.maxPatience) * 6);
    const mult = 1 + Math.min(state.combo, 5) * 0.2;
    const earned = Math.round((order.recipe.price + patienceBonus) * mult);
    state.score += earned;
    state.combo += 1;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    state.served += 1;
    state.orders.splice(state.selected, 1);
    if (state.selected >= state.orders.length) state.selected = Math.max(0, state.orders.length - 1);
    state.plate = [];
    state.message = `Served ${order.recipe.name} to ${order.customer}! +$${earned}`;
    state.messageTimer = 2.5;
    state.flash = { kind: 'good', timer: 0.6 };
    return 'good';
  }
  state.score = Math.max(0, state.score - WRONG_SERVE_PENALTY);
  state.combo = 0;
  state.mistakes += 1;
  state.plate = [];
  state.message = `Wrong burger for ${order.customer}! -$${WRONG_SERVE_PENALTY}`;
  state.messageTimer = 2.5;
  state.flash = { kind: 'bad', timer: 0.6 };
  return 'bad';
}

export function tick(state, dt) {
  if (state.phase !== 'playing') return;
  state.timeLeft -= dt;
  if (state.messageTimer > 0) state.messageTimer -= dt;
  if (state.flash) { state.flash.timer -= dt; if (state.flash.timer <= 0) state.flash = null; }
  for (const g of state.grill) {
    if (!g) continue;
    g.t += dt;
    if (g.stage === 'raw' && g.t >= 1.2) g.stage = 'cooking';
    if (g.stage === 'cooking' && g.t >= PATTY_COOK_TIME) g.stage = 'done';
    if (g.stage === 'done' && g.t >= PATTY_BURN_TIME) g.stage = 'burnt';
  }
  for (let i = state.orders.length - 1; i >= 0; i--) {
    const o = state.orders[i];
    o.patience -= dt;
    if (o.patience <= 0) {
      state.orders.splice(i, 1);
      state.combo = 0;
      state.score = Math.max(0, state.score - EXPIRED_PENALTY);
      state.mistakes += 1;
      state.message = `${o.customer} walked out! -$${EXPIRED_PENALTY}`;
      state.messageTimer = 2.5;
      if (state.selected >= state.orders.length) state.selected = Math.max(0, state.orders.length - 1);
    }
  }
  state.spawnTimer -= dt;
  if (state.spawnTimer <= 0) {
    spawnOrder(state);
    state.spawnTimer = ORDER_SPAWN_EVERY + Math.random() * 3;
  }
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    state.phase = 'over';
    state.message = '';
  }
}
