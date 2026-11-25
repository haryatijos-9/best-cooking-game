# Burger Blitz

[![make.fun](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/c/best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/haryatijos-9/best-cooking-game/rank.svg)](https://make.fun/c/best-cooking-game-20261125-0137/leaderboard)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/haryatijos-9/best-cooking-game/reward.svg)](https://make.fun/c/best-cooking-game-20261125-0137)

**Burger Blitz** — the lunch rush is on. Grill patties, stack toppings in the
right order, and serve every burger before the customer loses patience. A
complete, original cooking game that runs offline in a desktop browser from
its own static files: vanilla HTML/CSS/JS, no libraries, no network requests,
hand-drawn canvas art and synthesized WebAudio sounds.

## How to play

- **Pick an order** — click a ticket on the order board (or press `1`-`3`).
- **Grill** — click a grill slot (or press `G`) to place a raw patty. It cooks
  in ~4 seconds; grab it when it says READY, before it burns.
- **Stack** — click the topping bins (cheese, lettuce, tomato, onion, bacon,
  top bun) to build the burger on the assembly plate, matching the ticket.
- **Serve** — hit SERVE (or `Space`) when the plate matches. A fast, correct
  serve pays the recipe price plus a patience tip, multiplied by your combo.
  A wrong burger costs $25 and resets the combo. A customer who waits too
  long walks out. Press `T` to trash the plate, `P` to pause.

Six recipes (Classic, Cheeseburger, Double Trouble, BLT Burger, Garden
Veggie, Deluxe Stack), 150-second shifts, patience bars that drain in plain
sight, and a combo multiplier that rewards a clean run.

## Run it

Open `game/index.html` in a desktop browser, or serve the folder with any
static server. `main.ts` hands the entry in: it copies `game/` and
`screenshots/` to `/output` and writes `dossier.json`.

## License

MIT — see [LICENSE](LICENSE).
