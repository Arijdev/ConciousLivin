import PDFDocument from 'pdfkit';
import { HealthResource } from '@/types/health';

interface TableData {
  headers: string[];
  rows: string[][];
}

function parseMarkdownTable(lines: string[]): TableData | null {
  const tableLines = lines.map(l => l.trim()).filter(l => l.startsWith('|') && l.endsWith('|'));
  if (tableLines.length < 2) return null;

  const headers = tableLines[0].slice(1, -1).split('|').map(c => c.trim().replace(/\*\*(.*?)\*\*/g, '$1'));
  const rows: string[][] = [];

  for (let i = 2; i < tableLines.length; i++) {
    const cells = tableLines[i].slice(1, -1).split('|').map(c => c.trim().replace(/\*\*(.*?)\*\*/g, '$1'));
    if (cells.length > 0) {
      rows.push(cells);
    }
  }

  return { headers, rows };
}

export function generateBookPdf(resource: HealthResource): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 54, // 0.75 in
        size: 'A4',
        bufferPages: true,
        info: {
          Title: resource.title,
          Author: 'Dr. Arif Chowdhury, PhD, M.S.',
          Subject: resource.subtitle,
          Keywords: 'ConciousLivin, Health, Functional Medicine, Longevity',
        },
      });

      const chunks: Buffer[] = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', err => reject(err));

      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

      const checkPageBreak = (neededHeight: number) => {
        if (doc.y + neededHeight > doc.page.height - doc.page.margins.bottom - 20) {
          doc.addPage();
        }
      };

      // ─────────────────────────────────────────────────────────────
      // 1. COVER PAGE
      // ─────────────────────────────────────────────────────────────
      // Header brand
      doc.rect(54, 40, pageWidth, 4).fill('#0f766e');
      doc.moveDown(1.5);

      doc.fontSize(10).font('Helvetica-Bold').fillColor('#0f766e').text('CONCIOUSLIVIN HEALTH ACADEMY', { align: 'center', characterSpacing: 1.5 });
      doc.fontSize(8.5).font('Helvetica').fillColor('#64748b').text('CLINICAL EVIDENCE-BASED MASTERCLASS SERIES', { align: 'center', characterSpacing: 1 });
      doc.moveDown(2);

      // Category Pill
      doc.roundedRect(doc.page.width / 2 - 70, doc.y, 140, 20, 10).fill('#f0fdfa');
      doc.fontSize(8).font('Helvetica-Bold').fillColor('#0f766e').text(resource.category.toUpperCase() + ' MEDICINE', doc.page.width / 2 - 70, doc.y + 5, { width: 140, align: 'center' });
      doc.moveDown(2);

      // Title & Subtitle
      doc.fontSize(24).font('Helvetica-Bold').fillColor('#0f172a').text(resource.title, { align: 'center', lineGap: 4 });
      doc.moveDown(0.8);
      doc.fontSize(12).font('Helvetica').fillColor('#475569').text(resource.subtitle, { align: 'center', lineGap: 3 });
      doc.moveDown(2);

      // Author credentials card
      const authorBoxY = doc.y;
      doc.roundedRect(54, authorBoxY, pageWidth, 60, 8).fillAndStroke('#f8fafc', '#e2e8f0');
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#0f766e').text('Dr. Arif Chowdhury', 64, authorBoxY + 14);
      doc.fontSize(8.5).font('Helvetica').fillColor('#334155').text('PhD, M.S. Clinical Nutrition, Board Certified Lifestyle Medicine Physician', 64, authorBoxY + 28);
      doc.fontSize(8).font('Helvetica-Oblique').fillColor('#64748b').text('ConciousLivin Longevity Institute • 50,000+ Patient Transformations', 64, authorBoxY + 42);

      doc.y = authorBoxY + 75;

      // Table of Contents Box
      doc.moveDown(1);
      doc.fontSize(13).font('Helvetica-Bold').fillColor('#0f766e').text('Comprehensive Table of Contents', { align: 'left' });
      doc.rect(54, doc.y + 2, pageWidth, 1).fill('#cbd5e1');
      doc.moveDown(0.8);

      resource.tableOfContents.forEach((item, index) => {
        checkPageBreak(20);
        doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#0f766e').text(String(index + 1).padStart(2, '0') + '.', 60, doc.y, { continued: true });
        doc.font('Helvetica').fillColor('#1e293b').text('   ' + item, { indent: 15 });
        doc.moveDown(0.3);
      });

      // ─────────────────────────────────────────────────────────────
      // 2. INTRODUCTION PAGE
      // ─────────────────────────────────────────────────────────────
      doc.addPage();
      doc.fontSize(16).font('Helvetica-Bold').fillColor('#0f766e').text("Author's Clinical Introduction", { align: 'left' });
      doc.rect(54, doc.y + 3, pageWidth, 2).fill('#0f766e');
      doc.moveDown(1);

      // Intro callout box
      const introY = doc.y;
      const introText = resource.fullContent.introduction;
      const introHeight = doc.heightOfString(introText, { width: pageWidth - 28, lineGap: 4 }) + 24;
      
      doc.roundedRect(54, introY, pageWidth, introHeight, 8).fill('#f0fdfa');
      doc.rect(54, introY, 4, introHeight).fill('#0f766e');
      doc.fontSize(10).font('Helvetica-Oblique').fillColor('#134e4a').text(introText, 68, introY + 12, { width: pageWidth - 28, align: 'justify', lineGap: 4 });
      
      doc.y = introY + introHeight + 20;

      // ─────────────────────────────────────────────────────────────
      // 3. CHAPTERS
      // ─────────────────────────────────────────────────────────────
      resource.fullContent.chapters.forEach((chapter, chapterIdx) => {
        doc.addPage();

        // Chapter Header Banner
        doc.roundedRect(54, doc.y, pageWidth, 32, 6).fill('#0f766e');
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#ffffff').text(`SECTION ${chapterIdx + 1} OF ${resource.fullContent.chapters.length}`, 64, doc.y + 10);
        doc.moveDown(1.5);

        doc.fontSize(18).font('Helvetica-Bold').fillColor('#0f172a').text(chapter.title, { lineGap: 3 });
        doc.rect(54, doc.y + 4, pageWidth, 1).fill('#cbd5e1');
        doc.moveDown(1.2);

        // Parse content lines
        const lines = chapter.content.split('\n');
        let i = 0;

        while (i < lines.length) {
          const rawLine = lines[i];
          const line = rawLine.trim();

          // 1. Heading 2 (##)
          if (line.startsWith('## ')) {
            const hText = line.replace(/^##\s+/, '').replace(/\*\*/g, '');
            checkPageBreak(40);
            doc.moveDown(0.8);
            doc.fontSize(14).font('Helvetica-Bold').fillColor('#0f766e').text(hText);
            doc.moveDown(0.4);
            i++;
            continue;
          }

          // 2. Heading 3 (###)
          if (line.startsWith('### ')) {
            const hText = line.replace(/^###\s+/, '').replace(/\*\*/g, '');
            checkPageBreak(35);
            doc.moveDown(0.7);
            doc.fontSize(12).font('Helvetica-Bold').fillColor('#1e293b').text(hText);
            doc.moveDown(0.3);
            i++;
            continue;
          }

          // 3. Heading 4 (####)
          if (line.startsWith('#### ')) {
            const hText = line.replace(/^####\s+/, '').replace(/\*\*/g, '');
            checkPageBreak(25);
            doc.moveDown(0.5);
            doc.fontSize(10.5).font('Helvetica-Bold').fillColor('#334155').text(hText);
            doc.moveDown(0.2);
            i++;
            continue;
          }

          // 4. Clinical Diagram Callout (![alt](url))
          if (line.startsWith('![') && line.includes('](')) {
            const match = line.match(/!\[(.*?)\]\((.*?)\)/);
            if (match) {
              const diagramTitle = match[1];
              checkPageBreak(50);
              const diagY = doc.y;
              doc.roundedRect(54, diagY, pageWidth, 42, 6).fillAndStroke('#f8fafc', '#38bdf8');
              doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#0284c7').text('📊 CLINICAL INFOGRAPHIC DIAGRAM REFERENCE', 66, diagY + 8);
              doc.fontSize(10).font('Helvetica-Bold').fillColor('#0f172a').text(diagramTitle, 66, diagY + 22);
              doc.y = diagY + 50;
            }
            i++;
            continue;
          }

          // 5. Code / Flowchart Diagram Block (```diagram ... ```)
          if (line.startsWith('```')) {
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith('```')) {
              codeLines.push(lines[i]);
              i++;
            }
            if (i < lines.length) i++; // consume closing ```

            const diagramText = codeLines.join('\n');
            const boxHeight = Math.min(220, codeLines.length * 12 + 30);
            checkPageBreak(boxHeight + 10);

            const codeBoxY = doc.y;
            doc.roundedRect(54, codeBoxY, pageWidth, boxHeight, 6).fillAndStroke('#0f172a', '#334155');
            doc.fontSize(8).font('Helvetica-Bold').fillColor('#38bdf8').text('CLINICAL MECHANISM & FLOW ARCHITECTURE', 64, codeBoxY + 8);
            
            doc.fontSize(7.5).font('Courier').fillColor('#e2e8f0');
            doc.text(diagramText, 64, codeBoxY + 22, {
              width: pageWidth - 20,
              lineGap: 1.5,
            });
            doc.y = codeBoxY + boxHeight + 12;
            continue;
          }

          // 6. Markdown Table (| Header | Header |)
          if (line.startsWith('|') && line.endsWith('|')) {
            const tableLines: string[] = [];
            while (i < lines.length && lines[i].trim().startsWith('|')) {
              tableLines.push(lines[i].trim());
              i++;
            }

            const table = parseMarkdownTable(tableLines);
            if (table && table.headers.length > 0 && table.rows.length > 0) {
              const numCols = table.headers.length;
              const colWidth = pageWidth / numCols;

              checkPageBreak(40 + table.rows.length * 20);

              // Draw Table Header
              const headerY = doc.y;
              doc.rect(54, headerY, pageWidth, 20).fill('#0f766e');
              
              table.headers.forEach((headerText, cIdx) => {
                doc.fontSize(8).font('Helvetica-Bold').fillColor('#ffffff').text(
                  headerText,
                  54 + cIdx * colWidth + 4,
                  headerY + 5,
                  { width: colWidth - 8, align: 'left', ellipsis: true }
                );
              });

              let currentY = headerY + 20;

              // Draw Rows
              table.rows.forEach((row, rIdx) => {
                // Calculate max row height
                let maxH = 18;
                row.forEach(cellText => {
                  const h = doc.heightOfString(cellText, { width: colWidth - 8 }) + 8;
                  if (h > maxH) maxH = h;
                });

                if (currentY + maxH > doc.page.height - doc.page.margins.bottom - 20) {
                  doc.addPage();
                  currentY = doc.y;
                }

                // Row background (zebra)
                doc.rect(54, currentY, pageWidth, maxH).fill(rIdx % 2 === 0 ? '#ffffff' : '#f8fafc');
                doc.rect(54, currentY, pageWidth, maxH).stroke('#e2e8f0');

                row.forEach((cellText, cIdx) => {
                  doc.fontSize(8).font(cIdx === 0 ? 'Helvetica-Bold' : 'Helvetica').fillColor('#1e293b').text(
                    cellText,
                    54 + cIdx * colWidth + 4,
                    currentY + 4,
                    { width: colWidth - 8, align: 'left', lineGap: 1 }
                  );
                });

                currentY += maxH;
              });

              doc.y = currentY + 12;
            }
            continue;
          }

          // 7. Step Action Items (1. **Step X: ...**)
          if (/^\d+\.\s+\*\*Step/i.test(line) || /^\d+\.\s+\*\*/.test(line)) {
            const stepMatch = line.match(/^(\d+\.)\s+\*\*(.*?)\*\*(.*)/);
            if (stepMatch) {
              const stepNum = stepMatch[1];
              const stepTitle = stepMatch[2];
              const stepBody = stepMatch[3].replace(/^[\s—–:-]+/, '');

              checkPageBreak(35);
              const stepY = doc.y;
              doc.roundedRect(54, stepY, 20, 16, 4).fill('#0f766e');
              doc.fontSize(8).font('Helvetica-Bold').fillColor('#ffffff').text(stepNum, 54, stepY + 3.5, { width: 20, align: 'center' });
              
              doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#0f172a').text(stepTitle, 80, stepY + 2);
              if (stepBody) {
                doc.fontSize(9).font('Helvetica').fillColor('#334155').text(stepBody, 80, doc.y + 2, {
                  width: pageWidth - 30,
                  align: 'justify',
                  lineGap: 2.5,
                });
              }
              doc.moveDown(0.6);
              i++;
              continue;
            }
          }

          // 8. Bullet points (- or *)
          if (/^[-*]\s+/.test(line)) {
            const bulletText = line.replace(/^[-*]\s+/, '').replace(/\*\*(.*?)\*\*/g, '$1');
            checkPageBreak(18);
            doc.fontSize(8).fillColor('#0f766e').text('•', 64, doc.y, { continued: true });
            doc.fontSize(9).font('Helvetica').fillColor('#334155').text('  ' + bulletText, {
              width: pageWidth - 20,
              align: 'left',
              lineGap: 2,
            });
            doc.moveDown(0.2);
            i++;
            continue;
          }

          // 9. Blockquote (> ...)
          if (line.startsWith('> ')) {
            const quoteText = line.replace(/^>\s+/, '').replace(/\*\*(.*?)\*\*/g, '$1');
            checkPageBreak(30);
            const qY = doc.y;
            const qHeight = doc.heightOfString(quoteText, { width: pageWidth - 24, lineGap: 3 }) + 16;
            doc.rect(54, qY, 3, qHeight).fill('#0f766e');
            doc.roundedRect(57, qY, pageWidth - 3, qHeight, 4).fill('#f0fdfa');
            doc.fontSize(9).font('Helvetica-Oblique').fillColor('#134e4a').text(quoteText, 66, qY + 8, {
              width: pageWidth - 24,
              lineGap: 3,
            });
            doc.y = qY + qHeight + 8;
            i++;
            continue;
          }

          // 10. Regular Paragraph
          if (line.length > 0) {
            const cleanText = line
              .replace(/\*\*(.*?)\*\*/g, '$1')
              .replace(/\*(.*?)\*/g, '$1')
              .replace(/`([^`]+)`/g, '$1');

            checkPageBreak(25);
            doc.fontSize(9.5).font('Helvetica').fillColor('#1e293b').text(cleanText, 54, doc.y, {
              width: pageWidth,
              align: 'justify',
              lineGap: 3,
            });
            doc.moveDown(0.5);
          }

          i++;
        }

        // Key Takeaways Box
        if (chapter.keyTakeaways && chapter.keyTakeaways.length > 0) {
          checkPageBreak(80);
          doc.moveDown(1);
          const takeY = doc.y;
          doc.roundedRect(54, takeY, pageWidth, 24, 4).fill('#0f766e');
          doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#ffffff').text('ACTION STEPS & CLINICAL PEARLS:', 64, takeY + 7);
          doc.y = takeY + 30;

          chapter.keyTakeaways.forEach((takeaway) => {
            checkPageBreak(20);
            doc.fontSize(8).fillColor('#0f766e').text('✔', 64, doc.y, { continued: true });
            doc.fontSize(9).font('Helvetica-Bold').fillColor('#1e293b').text('  ' + takeaway, {
              width: pageWidth - 25,
              lineGap: 2,
            });
            doc.moveDown(0.3);
          });
          doc.moveDown(0.8);
        }

        // Doctor's Tip Box
        if (chapter.doctorTip) {
          checkPageBreak(60);
          const tipY = doc.y;
          const tipText = chapter.doctorTip;
          const tipHeight = doc.heightOfString(tipText, { width: pageWidth - 30, lineGap: 3 }) + 34;

          doc.roundedRect(54, tipY, pageWidth, tipHeight, 6).fillAndStroke('#fffbeb', '#f59e0b');
          doc.fontSize(9).font('Helvetica-Bold').fillColor('#b45309').text("💡 Dr. Arif's Practitioner Insight:", 66, tipY + 8);
          doc.fontSize(8.5).font('Helvetica-Oblique').fillColor('#78350f').text(tipText, 66, tipY + 22, {
            width: pageWidth - 24,
            lineGap: 2.5,
          });
          doc.y = tipY + tipHeight + 12;
        }
      });

      // ─────────────────────────────────────────────────────────────
      // 4. CONCLUSION & PROTOCOL SUMMARY
      // ─────────────────────────────────────────────────────────────
      if (resource.fullContent.conclusion) {
        doc.addPage();
        doc.fontSize(16).font('Helvetica-Bold').fillColor('#0f766e').text('Conclusion & Final Remarks');
        doc.rect(54, doc.y + 3, pageWidth, 2).fill('#0f766e');
        doc.moveDown(1);
        doc.fontSize(9.5).font('Helvetica').fillColor('#1e293b').text(resource.fullContent.conclusion, {
          width: pageWidth,
          align: 'justify',
          lineGap: 3,
        });
        doc.moveDown(1.5);
      }

      if (resource.fullContent.protocolSummary && resource.fullContent.protocolSummary.length > 0) {
        checkPageBreak(120);
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#0f766e').text('Quick-Action Protocol Summary');
        doc.rect(54, doc.y + 2, pageWidth, 1).fill('#cbd5e1');
        doc.moveDown(1);

        resource.fullContent.protocolSummary.forEach((step, idx) => {
          checkPageBreak(25);
          doc.fontSize(9).font('Helvetica-Bold').fillColor('#0f766e').text(`Step ${idx + 1}: `, 60, doc.y, { continued: true });
          doc.font('Helvetica').fillColor('#1e293b').text(step, { width: pageWidth - 20, lineGap: 2 });
          doc.moveDown(0.4);
        });
      }

      // Medical Disclaimer Footer
      doc.moveDown(2);
      checkPageBreak(50);
      doc.fontSize(7.5).font('Helvetica-Oblique').fillColor('#94a3b8').text(
        'Medical Disclaimer: The information contained in this guide is for educational and informational purposes only. It does not substitute for personalized medical diagnosis, treatment, or advice from a qualified healthcare practitioner.',
        { width: pageWidth, align: 'center', lineGap: 2 }
      );

      // ─────────────────────────────────────────────────────────────
      // 5. RUNNING HEADERS & FOOTERS (All Pages)
      // ─────────────────────────────────────────────────────────────
      const range = doc.bufferedPageRange();
      for (let p = 0; p < range.count; p++) {
        doc.switchToPage(p);

        // Don't draw header on Cover page (page 0)
        if (p > 0) {
          doc.fontSize(7.5).font('Helvetica').fillColor('#94a3b8').text(
            `${resource.title.toUpperCase()} • DR. ARIF CHOWDHURY`,
            54,
            24,
            { width: pageWidth, align: 'left' }
          );
          doc.rect(54, 34, pageWidth, 0.5).fill('#e2e8f0');
        }

        // Running Footer on all pages
        doc.rect(54, doc.page.height - 35, pageWidth, 0.5).fill('#e2e8f0');
        doc.fontSize(7.5).font('Helvetica').fillColor('#94a3b8').text(
          'ConciousLivin Health Academy • conciouslivin.in',
          54,
          doc.page.height - 26,
          { width: pageWidth / 2, align: 'left' }
        );
        doc.fontSize(7.5).font('Helvetica').fillColor('#94a3b8').text(
          `Page ${p + 1} of ${range.count}`,
          doc.page.width / 2,
          doc.page.height - 26,
          { width: pageWidth / 2, align: 'right' }
        );
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
