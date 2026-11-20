const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/healthData.ts');
const content = fs.readFileSync(filePath, 'utf-8');

// Extract each resource object
const resourceRegex = /\{\s*id:\s*"([^"]+)"[\s\S]*?(?=\n  \{\s*id:|\n\];)/g;

function countWords(text) {
  if (!text) return 0;
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

function estimatePages(words) {
  return Math.round(words / 300);
}

function extractContent(fullContentStr) {
  const introMatch = fullContentStr.match(/introduction:\s*"([\s\S]*?)(?=",\s*chapters:)/);
  const conclusionMatch = fullContentStr.match(/conclusion:\s*"([\s\S]*?)(?=",\s*protocolSummary:)/);
  const protocolMatch = fullContentStr.match(/protocolSummary:\s*\[([\s\S]*?)\]/);
  
  let chaptersContent = '';
  const chaptersMatch = fullContentStr.match(/chapters:\s*\[([\s\S]*?)\]/);
  if (chaptersMatch) {
    chaptersContent = chaptersMatch[1];
  }
  
  return {
    introduction: introMatch ? introMatch[1] : '',
    conclusion: conclusionMatch ? conclusionMatch[1] : '',
    protocolSummary: protocolMatch ? protocolMatch[1] : '',
    chapters: chaptersContent
  };
}

let match;
while ((match = resourceRegex.exec(content)) !== null) {
  const id = match[1];
  const resourceStr = match[0];
  
  // Extract fullContent
  const fullContentMatch = resourceStr.match(/fullContent:\s*\{[\s\S]*?\}/);
  if (!fullContentMatch) continue;
  
  const extracted = extractContent(fullContentMatch[0]);
  
  let totalWords = 0;
  totalWords += countWords(extracted.introduction);
  totalWords += countWords(extracted.conclusion);
  totalWords += countWords(extracted.protocolSummary);
  totalWords += countWords(extracted.chapters);
  
  const pages = estimatePages(totalWords);
  const readingHours = (totalWords / 250 / 60).toFixed(1);
  
  // Find current pages from resourceStr
  const pagesMatch = resourceStr.match(/pages:\s*(\d+)/);
  const readingTimeMatch = resourceStr.match(/readingTime:\s*"([^"]+)"/);
  
  console.log(`${id}:`);
  console.log(`  Words: ${totalWords.toLocaleString()}`);
  console.log(`  Estimated Pages: ${pages}`);
  console.log(`  Reading Time: ${readingHours} hours`);
  console.log(`  Current Pages: ${pagesMatch ? pagesMatch[1] : 'N/A'}`);
  console.log(`  Current Reading Time: ${readingTimeMatch ? readingTimeMatch[1] : 'N/A'}`);
  console.log('');
}