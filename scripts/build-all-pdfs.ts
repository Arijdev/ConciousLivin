import fs from 'fs';
import path from 'path';
import { HEALTH_RESOURCES } from '../src/data/healthData';
import { generateBookPdf } from '../src/lib/pdf-generator';

const pdfOutputDir = path.join(__dirname, '../public/pdfs');

if (!fs.existsSync(pdfOutputDir)) {
  fs.mkdirSync(pdfOutputDir, { recursive: true });
}

async function buildAllPdfs() {
  console.log(`Starting PDF compilation for ${HEALTH_RESOURCES.length} books...`);

  for (const resource of HEALTH_RESOURCES) {
    const filename = `${resource.id}.pdf`;
    const outputPath = path.join(pdfOutputDir, filename);
    console.log(`Generating: ${resource.title} ➔ ${filename}...`);

    try {
      const buffer = await generateBookPdf(resource);
      fs.writeFileSync(outputPath, buffer);
      const sizeKb = (buffer.length / 1024).toFixed(1);
      console.log(`✓ Completed: ${filename} (${sizeKb} KB, ${resource.pages} expected pages)`);
    } catch (err) {
      console.error(`❌ Error generating ${filename}:`, err);
    }
  }

  console.log('\nAll PDF books successfully compiled to public/pdfs/!');
}

buildAllPdfs().catch(console.error);
