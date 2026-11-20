const fs = require('fs');
const c = fs.readFileSync('src/data/healthData.ts', 'utf8');

// Find actual chapter 1 content
const searchText = 'Your gut contains over 500 million neurons';
const idx = c.indexOf(searchText);

if (idx >= 0) {
  console.log('Found at:', idx);
  const nextChapter = c.indexOf('content:', idx + 100);
  if (nextChapter > 0) {
    const ch1 = c.substring(idx, nextChapter);
    console.log('Chapter 1 content length:', ch1.length, 'chars');
    const words = ch1.split(/\s+/).filter(w => w.length).length;
    console.log('Chapter 1 words:', words);
    console.log('First 300 chars:', ch1.substring(0, 300));
  }
} else {
  console.log('Not found - searching for partial...');
  const idx2 = c.indexOf('Your gut contains');
  console.log('Found text at:', idx2);
}