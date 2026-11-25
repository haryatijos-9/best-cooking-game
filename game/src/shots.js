// Burger Blitz — screenshot staging and the scripted self-test.
// These run only when the page is opened with ?shot= or ?selftest=1;
// normal play never touches them.

import { startGame, spawnOrder, grillClick, addTopping, serveOrder, clearPlate, tick } from './state.js';

export function setupShot(state, name) {
  startGame(state);
  if (name === 'cover') {
    // Full kitchen mid-rush: 3 orders, patties at every stage, dish mid-assembly.
    while (state.orders.length < 3) spawnOrder(state);
    state.timeLeft = 118;
    state.score = 42;
    state.combo = 2;
    grillClick(state, 0); state.grill[0].t = 5; state.grill[0].stage = 'done';
    grillClick(state, 1); state.grill[1].t = 2.5; state.grill[1].stage = 'cooking';
    grillClick(state, 2);
    state.plate = ['patty', 'cheese'];
    state.message = 'Served Cheeseburger to Maya! +$16';
    state.messageTimer = 99;
  } else if (name === 'grill') {
    while (state.orders.length < 2) spawnOrder(state);
    state.timeLeft = 96;
    state.score = 18;
    grillClick(state, 0); state.grill[0].t = 0.5;
    grillClick(state, 1); state.grill[1].t = 2.5; state.grill[1].stage = 'cooking';
    grillClick(state, 2); state.grill[2].t = 5; state.grill[2].stage = 'done';
    grillClick(state, 3); state.grill[3].t = 10; state.grill[3].stage = 'burnt';
    state.plate = ['patty', 'cheese', 'bacon'];
    state.message = 'Patty burnt! Click it to trash it.';
    state.messageTimer = 99;
  } else if (name === 'serve') {
    // Plate finished and matching the selected order, ready to serve.
    state.orders[0].recipe = { id: 'cheese', name: 'Cheeseburger', price: 10, layers: ['patty', 'cheese'] };
    state.timeLeft = 134;
    state.score = 26;
    state.combo = 3;
    state.plate = ['patty', 'cheese', 'topbun'];
    state.flash = { kind: 'good', timer: 99 };
    state.message = 'Perfect match — hit SERVE!';
    state.messageTimer = 99;
  }
}

export function runSelfTest(state) {
  const log = [];
  const note = (ok, label) => log.push(`${ok ? 'PASS' : 'FAIL'} ${label}`);
  try {
    startGame(state);
    note(state.phase === 'playing', 'game starts');
    note(state.orders.length === 2, 'two orders spawn');

    // Serve the selected order correctly, patty by patty.
    const order = state.orders[state.selected];
    const needPatties = order.recipe.layers.filter((l) => l === 'patty').length;
    let slot = 0;
    for (let p = 0; p < needPatties; p++) {
      grillClick(state, slot);
      tick(state, 5);
      const res = grillClick(state, slot);
      note(res === 'taken', `cooked patty ${p + 1} taken`);
      slot++;
    }
    for (const l of order.recipe.layers) {
      if (l !== 'patty') addTopping(state, l);
    }
    const before = state.score;
    const served = serveOrder(state);
    note(served === 'good', 'correct burger serves');
    note(state.score > before && state.served === 1, 'score rises on serve');

    // Wrong serve is penalised.
    clearPlate(state);
    addTopping(state, 'cheese');
    const badBefore = state.score;
    const bad = serveOrder(state);
    note(bad === 'bad', 'wrong burger rejected');
    note(state.score < badBefore && state.combo === 0, 'wrong serve penalised, combo reset');

    // An expired order walks out.
    const left = state.orders.length;
    if (state.orders.length > 0) {
      state.orders[0].patience = 0.05;
      tick(state, 0.2);
      note(state.orders.length === left - 1, 'impatient order walks out');
    } else {
      note(false, 'impatient order walks out');
    }

    // Burnt patty can be trashed.
    grillClick(state, 0);
    tick(state, 10);
    const burnt = grillClick(state, 0);
    note(burnt === 'trashed', 'burnt patty trashed');
  } catch (e) {
    log.push(`FAIL exception: ${e.message}`);
  }
  const passed = log.filter((l) => l.startsWith('PASS')).length;
  const total = log.length;
  const summary = `SELFTEST ${passed}/${total} ${passed === total ? 'PASS' : 'FAIL'}`;
  const el = document.getElementById('testlog');
  if (el) el.textContent = [summary, ...log].join('\n');
  document.title = summary;
}

window.addEventListener('error', (ev) => {
  const el = document.getElementById('testlog');
  if (el) el.textContent += `\nJSERROR ${ev.message}`;
});
