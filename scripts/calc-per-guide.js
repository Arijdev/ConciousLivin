const fs = require('fs');
const c = fs.readFileSync('src/data/healthData.ts', 'utf8');

function countWords(t) {
  return t ? t.split(/\s+/).filter(w => w.length).length : 0;
}

// Extract per-resource word counts
const resourceRegex = /\{\s*id:\s*"([^"]+)"[\s\S]*?fullContent:\s*\{([\s\S]*?)\}\s*\}/g;
let match;

const results = [];

while ((match = resourceRegex.exec(c)) !== null) {
  const id = match[1];
  const fc = match[2];
  
  const introMatch = fc.match(/introduction:\s*"([\s\S]*?)",\s*chapters:/);
  const intro = introMatch ? introMatch[1] : '';
  
  const conclusionMatch = fc.match(/conclusion:\s*"([\s\S]*?)",\s*protocolSummary:/);
  const conclusion = conclusionMatch ? conclusionMatch[1] : '';
  
  const chaptersMatch = fc.match(/chapters:\s*\[([\s\S]*?)\],\s*conclusion:/);
  const chapters = chaptersMatch ? chaptersMatch[1] : '';
  
  const protocolMatch = fc.match(/protocolSummary:\s*\[([\s\S]*?)\]/);
  const protocol = protocolMatch ? protocolMatch[1] : '';
  
  const chapterContentRegex = /content:\s*"([\s\S]*?)",\s*keyTakeaways:/g;
  let chMatch;
  let chapterWords = 0;
  let chapterCount = 0;
  while ((chMatch = chapterContentRegex.exec(chapters)) !== null) {
    chapterWords += countWords(chMatch[1]);
    chapterCount++;
  }
  
  const totalWords = countWords(intro) + countWords(conclusion) + chapterWords + countWords(protocol);
  const pages = Math.round(totalWords / 300);
  const hours = (totalWords / 250 / 60).toFixed(1);
  
  results.push({ id, chapterCount, chapterWords, totalWords, pages, hours });
}

console.log('=== PER-GUIDE BREAKDOWN ===\n');
results.forEach(r => {
  console.log(`${r.id}:`);
  console.log(`  Chapters: ${r.chapterCount}`);
  console.log(`  Chapter words: ${r.chapterWords.toLocaleString()}`);
  console.log(`  Total words: ${r.totalWords.toLocaleString()}`);
  console.log(`  Pages: ${r.pages}`);
  console.log(`  Reading time: ${r.hours} hrs`);
  console.log('');
});