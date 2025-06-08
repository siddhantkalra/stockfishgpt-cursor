# 📌 Changelog – StockfishGPT

All notable changes to this project will be documented in this file.

> This changelog is auto-generated using Git. Changes to this file itself are excluded.

---

## [2025-06-08]

- 📚 Add Lichess opening book (TSV → JSON), script to generate openings.json, and prep for PGN-based opening detection (`9658bd8`)
- ✅ Add PGN and FEN input panels with working logic and toggle behavior; verified Stockfish eval unaffected (`997a902`)
- Update: Live Stockfish evaluation panel now includes depth tracking and dropdown-controlled engine depth (`5a3f319`)
- Add: Depth info now shown in Engine Evaluation panel (live parsed from Stockfish output) (`c889de9`)
- feat(eval): add persistent engine evaluation panel with dynamic update on move (`e073787`)
- persistent best move and eval panel based on hardcoded FEN (`8ef83ad`)
- Stockfish integrated: FEN sent, eval + best move parsed and displayed in dialog (`b05b479`)
- Prepare for Stockfish integration: added stockfish.js and .wasm, cleaned up file structure (`52e3a40`)

## [2025-06-07]

- UI/UX Overhaul: Lichess-inspired styling, correct rank/file labels, eval bar redesign, move interaction partially updated (`7ff7678`)
- Test commit to verify changelog automation (`9d0674a`)
- Added README and auto-managed CHANGELOG (`6efb1c4`)
- Initial commit in correct path (`bcb2ecd`)
