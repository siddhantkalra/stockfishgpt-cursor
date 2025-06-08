// generate-openings.js
const fs = require('fs');
const path = require('path');

// Path to your tsv files
const basePath = path.resolve(__dirname, '../data');
const outputFile = path.resolve(basePath, 'openings.json');

const files = ['a.tsv', 'b.tsv', 'c.tsv', 'd.tsv', 'e.tsv'];
const allOpenings = [];

files.forEach(file => {
  const filePath = path.join(basePath, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.trim().split('\n');

  const headers = lines[0].split('\t');
  const ecoIndex = headers.indexOf('eco');
  const nameIndex = headers.indexOf('name');
  const pgnIndex = headers.indexOf('pgn');

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split('\t');
    const eco = cols[ecoIndex];
    const name = cols[nameIndex];
    const pgn = cols[pgnIndex];

    if (eco && name && pgn) {
      allOpenings.push({ eco, name, moves: pgn });
    }
  }
});

fs.writeFileSync(outputFile, JSON.stringify(allOpenings, null, 2), 'utf8');
console.log(`✅ Generated openings.json with ${allOpenings.length} entries`);
