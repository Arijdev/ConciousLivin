const fs = require('fs');
const c = fs.readFileSync('src/data/healthData.ts', 'utf8');

function countWords(t) {
  return t ? t.split(/\s+/).filter(w => w.length).length : 0;
}

// Extract all chapter contents by finding "content: " followed by the actual text
const contentRegex = /content:\s*"([\s\S]*?)",\s*keyTakeaways:/g;
let match;
let totalWords = 0;
let chapterCount = 0;

while ((match = contentRegex.exec(c)) !== null) {
  const words = countWords(match[1]);
  totalWords += words;
  chapterCount++;
  console.log(`Chapter ${chapterCount}: ${words} words (${match[1].length} chars)`);
}

console.log('\nTotal chapter words:', totalWords);
console.log('Average per chapter:', Math.round(totalWords / chapterCount));
console.log('Total chapters found:', chapterCount);

// Also get intro, conclusion, protocol summary
const introMatches = c.matchAll(/introduction:\s*"([\s\S]*?)",\s*chapters:/g);
for (const m of introMatches) {
  console.log('\nIntroduction words:', countWords(m[1]));
}

const conclusionMatches = c.matchAll(/conclusion:\s*"([\s\S]*?)",\s*protocolSummary:/g);
for (const m of conclusionMatches) {
  console.log('Conclusion words:', countWords(m[1]));
}

const protocolMatches = c.matchAll(/protocolSummary:\s*\[([\s\S]*?)\]/g);
for (const m of protocolMatches) {
  console.log('Protocol summary words:', countWords(m[1]));
}

console.log('\n=== SUMMARY ===');
console.log('Total words (chapters + intro + conclusion + protocol):', totalWords);
const estimatedPages = Math.round(totalWords / 300);
console.log('Estimated pages (at 300 words/page):', estimatedPages);
console.log('Reading time (at 250 wpm):', (totalWords / 250 / 60).toFixed(1), 'hours');