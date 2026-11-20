const fs = require('fs');
const c = fs.readFileSync('src/data/healthData.ts', 'utf8');

function countWords(t) {
  return t ? t.split(/\s+/).filter(w => w.length).length : 0;
}

// Find all resource objects
const resourceRegex = /\{\s*id:\s*"([^"]+)"[\s\S]*?fullContent:\s*\{[\s\S]*?\}\s*\}/g;
const matches = c.matchAll(resourceRegex);

for (const match of matches) {
  const id = match[1];
  const fullResource = match[0];
  
  // Extract fullContent
  const fcMatch = fullResource.match(/fullContent:\s*\{([\s\S]*?)\}\s*\}/);
  if (!fcMatch) continue;
  const fc = fcMatch[1];
  
  const introMatch = fc.match(/introduction:\s*"([\s\S]*?)",\s*chapters:/);
  const intro = introMatch ? introMatch[1] : '';
  
  const conclusionMatch = fc.match(/conclusion:\s*"([\s\S]*?)",\s*protocolSummary:/);
  const conclusion = conclusionMatch ? conclusionMatch[1] : '';
  
  const chaptersMatch = fc.match(/chapters:\s*\[([\s\S]*?)\],\s*conclusion:/);
  const chapters = chaptersMatch ? chaptersMatch[1] : '';
  
  const protocolMatch = fc.match(/protocolSummary:\s*\[([\s\S]*?)\]/);
  const protocol = protocolMatch ? protocolMatch[1] : '';
  
  let words = countWords(intro) + countWords(conclusion) + countWords(chapters) + countWords(protocol);
  const pages = Math.round(words / 300);
  const hours = (words / 250 / 60).toFixed(1);
  
  // Find current pages
  const pagesMatch = fullResource.match(/pages:\s*(\d+)/);
  const readingMatch = fullResource.match(/readingTime:\s*"([^"]+)"/);
  
  console.log(`${id}:`);
  console.log(`  Actual: ${words.toLocaleString()} words = ${pages} pages, ${hours} hrs`);
  console.log(`  Current: ${pagesMatch ? pagesMatch[1] : '?'} pages, ${readingMatch ? readingMatch[1] : '?'}`);
  console.log('');
}