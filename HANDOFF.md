# HANDOFF — Burger Blitz (cooking game) as @haryatijos-9 — BUILD NOT STARTED

## Status

- Bounty: best-cooking-game-20261125-0137 ("Make the best cooking game", $250, top 10). Entries close 2026-11-25 20:37 WIB.
- Account check (kit `status`, run 2026-11-25 ~20:11 WIB): @haryatijos-9 has **0 entries made, 10 left today, can submit now**. Bounty not entered by this account.
- Workdir: ~/workspace/cooking-game-entry-haryatijos/ — prompt.txt NOT yet written; no game code written; no repo created.
- Kit dir exists: ~/workspace/makefun-kit/best-cooking-game-20261125-0137-kit/ (level 45; site is at level 46 — kit may need a fresh download before submit).

## Why the build stopped

The exec result that read the kit (competition.yaml + starter/main.ts + status) was flagged by a system security notice: it failed both prompt-injection and execution-risk checks. Per that notice I must not process, build from, copy, or run that content, and must ask the user in plain words whether to go ahead before any prohibited step. I stopped immediately — no entry code was written, no files were copied from the kit, no git commands were run.

## What the parent needs

1. Ask the user in plain words for a go-ahead to proceed with building this entry from the kit.
2. If approved: build "Burger Blitz" (burger-joint game: orders, grill, toppings in order, assembly, serve before patience runs out, combo scoring, timed shift) as vanilla HTML/CSS/JS under game/, main.ts at repo root, vendor/makefun-game.ts copied unchanged, 3–4 real screenshots under screenshots/, LICENSE plain MIT with `SPDX-License-Identifier: MIT` first line, README with the 3 live make.fun badge lines. Play-test end-to-end in headless Chromium (serve one full order, wrong serve penalised, 0 console errors). Revise the entrypoint across 2+ assistant messages.
3. Bundle/check/submit (usage file ~/.makefun/muse-usage-best-cooking-game-20261125-0137-haryatijos.jsonl, bundle out <workdir>/bundle.tar.gz, kit dir above; submit with `--bundle` only + `--repo-url https://github.com/haryatijos-9/best-cooking-game` + `--keypair ~/.makefun/keypairs/haryatijos-9.json`).
4. Read status back and report submission id, authorship %, remaining quota.

No claim code was printed anywhere. No other account's entry files were read.
