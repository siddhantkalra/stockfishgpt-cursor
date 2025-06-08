import { test, expect } from '@playwright/test';

const baseUrl = 'http://127.0.0.1:5500/';

// === PGN Test Cases ===
const pgnTests = [
  { name: "Italian Game", pgn: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5", expected: "Italian Game: Giuoco Piano" },
  { name: "Queen's Gambit Declined", pgn: "1. d4 d5 2. c4 e6 3. Nc3 Nf6", expected: "Queen's Gambit Declined: Normal Defense" },
  { name: "French Winawer", pgn: "1. e4 e6 2. d4 d5 3. Nc3 Bb4", expected: "French Defense: Winawer Variation" },
  { name: "King's Indian Defense", pgn: "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7", expected: "King's Indian Defense" },
  { name: "English Opening", pgn: "1. c4 Nf6 2. Nc3 e6", expected: "English Opening: Anglo-Indian Defense, Queen's Knight Variation" },
  { name: "Ruy Lopez: Berlin", pgn: "1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6", expected: "Ruy Lopez: Berlin Defense" },
  { name: "Anderssen's Opening", pgn: "1. a3", expected: "Anderssen's Opening" },
  { name: "Amar Opening", pgn: "1. Nh3", expected: "Amar Opening" },
  { name: "Transposition QGD", pgn: "1. Nf3 d5 2. d4 e6 3. c4", expected: "Queen's Gambit Declined: Normal Defense" },
  { name: "Partial PGN", pgn: "1. e4 e5", expected: "King's Pawn Game" },
  { name: "Malformed PGN", pgn: "e4 e5 Nf3", expected: "King's Knight Opening" },
  { name: "Extra spacing", pgn: "1. e4   e5 2.  Nf3 Nc6", expected: "King's Knight Opening" },
  { name: "UCI-style moves", pgn: "1. e2e4 e7e5 2. g1f3 b8c6", expected: "Italian Game: Giuoco Piano" },
  { name: "Stockfish compressed", pgn: "1.e4e5 2.Nf3Nc6 3.Bc4Bc5", expected: "Italian Game: Giuoco Piano" },
  { name: "No move numbers", pgn: "e4 e5 Nf3 Nc6 Bc4 Bc5", expected: "Italian Game: Giuoco Piano" },
  { name: "No spacing", pgn: "1.e4e52.Nf3Nc63.Bc4Bc5", expected: "Italian Game: Giuoco Piano" },
  { name: "SAN Figurine style", pgn: "1. ♘f3 d5 2. g3 ♗g4", expected: "King's Fianchetto Opening" },
  { name: "Lowercase only", pgn: "1. e4 e5 2. f4 exf4", expected: "King's Gambit" },
  { name: "King's Gambit with comments", pgn: "1. e4 e5 {standard} 2. f4 {aggressive} exf4", expected: "King's Gambit" },
  { name: "QGD transposition alt", pgn: "1. c4 e6 2. d4 d5 3. Nc3 Nf6", expected: "Queen's Gambit Declined: Normal Defense" },
  { name: "Pirc Defense", pgn: "1. e4 d6 2. d4 Nf6 3. Nc3 g6", expected: "Pirc Defense" },
  { name: "King's Indian vs English", pgn: "1. c4 g6 2. Nc3 Bg7 3. e4 d6", expected: "King's Indian Defense" },
];

// === FEN Test Cases ===
const fenTests = [
  { name: "Starting Position", fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", expected: "—" },
  { name: "Italian Position FEN", fen: "r1bqk1nr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", expected: "Italian Game: Giuoco Piano" },
  { name: "French Defense FEN", fen: "rnbqkbnr/pppp1ppp/8/4p3/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 3", expected: "French Defense" },
  { name: "Ruy Lopez FEN", fen: "r1bqk1nr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 4 4", expected: "Ruy Lopez: Berlin Defense" },
  { name: "Unknown Random FEN", fen: "r3k2r/ppp2ppp/2n5/3p4/3P4/2N2N2/PPP2PPP/R3K2R w KQkq - 0 1", expected: "—" },
  { name: "Stockfish move position", fen: "rnbqkb1r/pppppppp/5n2/8/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 2 3", expected: "Queen's Gambit Declined: Normal Defense" },
  { name: "UCI Pos style", fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1", expected: "King's Pawn Game" },
];

test.describe('Opening Detection – PGN', () => {
  for (const { name, pgn, expected } of pgnTests) {
    test(`should detect: ${name}`, async ({ page }) => {
      await page.goto(baseUrl);

      // Open PGN panel
      await page.locator('.info-header', { hasText: 'PGN Import' }).click();
      await page.waitForSelector('#pgnInput', { state: 'visible' });

      // Fill PGN and trigger
      await page.fill('#pgnInput', pgn);
      await page.click('#loadPGN');
      await page.waitForTimeout(500);

      // Extract and clean output
      const text = await page.textContent('#openingInfo');
      const actual = text.replace('Opening: ', '').replace(/\s*\([A-Z0-9]+\)$/, '').trim();

      console.log(`[PGN] ${name}: ${actual}`);
      expect(actual).toBe(expected);
    });
  }
});

test.describe('Opening Detection – FEN', () => {
  for (const { name, fen, expected } of fenTests) {
    test(`should detect: ${name}`, async ({ page }) => {
      await page.goto(baseUrl);

      // Open FEN panel
      await page.locator('.info-header', { hasText: 'FEN Input' }).click();
      await page.waitForSelector('#fenInput', { state: 'visible' });

      // Fill FEN and trigger
      await page.fill('#fenInput', fen);
      await page.click('#loadFEN');
      await page.waitForTimeout(500);

      // Extract and clean output
      const text = await page.textContent('#openingInfo');
      const actual = text.replace('Opening: ', '').replace(/\s*\([A-Z0-9]+\)$/, '').trim();

      console.log(`[FEN] ${name}: ${actual}`);
      expect(actual).toBe(expected);
    });
  }
});
