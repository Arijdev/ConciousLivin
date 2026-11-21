const fs = require('fs');
const path = require('path');

const b1 = require('./book_content/book1');
const b2 = require('./book_content/book2');
const b3 = require('./book_content/book3');
const b4 = require('./book_content/book4');
const b4_2 = require('./book_content/book4_part2');
const b5 = require('./book_content/book5');
const b5_2 = require('./book_content/book5_part2');
const b6 = require('./book_content/book6');
const b6_2 = require('./book_content/book6_part2');

const bookUpdates = {
  [b1.id]: [...b1.chapters],
  [b2.id]: [...b2.chapters],
  [b3.id]: [...b3.chapters],
  [b4.id]: [...b4.chapters, ...b4_2.chapters],
  [b5.id]: [...b5.chapters, ...b5_2.chapters],
  [b6.id]: [...b6.chapters, ...b6_2.chapters],
};

const healthDataPath = path.join(__dirname, '../src/data/healthData.ts');
let content = fs.readFileSync(healthDataPath, 'utf8');

function serializeChapter(ch) {
  const title = JSON.stringify(ch.title);
  const contentStr = JSON.stringify(ch.content);
  const keyTakeaways = JSON.stringify(ch.keyTakeaways, null, 12);
  const doctorTip = ch.doctorTip ? `\n          doctorTip: ${JSON.stringify(ch.doctorTip)}` : '';
  return `        {
          title: ${title},
          content: ${contentStr},
          keyTakeaways: ${keyTakeaways},${doctorTip}
        }`;
}

for (const [bookId, updatedChapters] of Object.entries(bookUpdates)) {
  console.log(`Processing updates for: ${bookId}`);
  
  const bookStartIdx = content.indexOf(`id: "${bookId}"`);
  if (bookStartIdx === -1) {
    console.error(`Could not find book with id: ${bookId}`);
    continue;
  }
  
  const nextBookIdx = content.indexOf(`id: "`, bookStartIdx + 15);
  const bookEndIdx = nextBookIdx !== -1 ? nextBookIdx : content.indexOf('export const HEALTH_ARTICLES');
  
  let bookBlock = content.substring(bookStartIdx, bookEndIdx);
  
  for (const updCh of updatedChapters) {
    const titlePrefixMatch = updCh.title.match(/^([^:]+:)/);
    const prefix = titlePrefixMatch ? titlePrefixMatch[1] : updCh.title;
    
    const chTitleIdx = bookBlock.indexOf(`title: "${prefix}`);
    if (chTitleIdx !== -1) {
      const chStart = bookBlock.lastIndexOf('{', chTitleIdx);
      const takeawaysIdx = bookBlock.indexOf('keyTakeaways:', chTitleIdx);
      const closeBracketAfterTakeaways = bookBlock.indexOf(']', takeawaysIdx);
      let chEnd = bookBlock.indexOf('}', closeBracketAfterTakeaways);
      
      const docTipIdx = bookBlock.indexOf('doctorTip:', takeawaysIdx);
      if (docTipIdx !== -1 && docTipIdx < chEnd + 500) {
        chEnd = bookBlock.indexOf('}', docTipIdx);
      }
      
      const serialized = serializeChapter(updCh);
      bookBlock = bookBlock.substring(0, chStart) + serialized + bookBlock.substring(chEnd + 1);
      console.log(`  Updated chapter: ${prefix}`);
    } else {
      console.warn(`  Could not find chapter with prefix "${prefix}" in ${bookId}`);
    }
  }
  
  content = content.substring(0, bookStartIdx) + bookBlock + content.substring(bookEndIdx);
}

fs.writeFileSync(healthDataPath, content, 'utf8');
console.log('Successfully updated all book chapters in healthData.ts!');
