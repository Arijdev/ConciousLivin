import { ImageResponse } from 'next/og';

export const alt = 'ConciousLivin Health Academy — Clinical Health & Longevity';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const markSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M47.32 19.15A20 20 0 1 0 47.32 44.85" fill="none" stroke="#14B8A6" stroke-width="8" stroke-linecap="round"/><circle cx="47.5" cy="32" r="5" fill="#14B8A6"/></svg>';

const markSrc = `data:image/svg+xml;base64,${Buffer.from(markSvg).toString('base64')}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0F172A',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <img src={markSrc} width={92} height={92} alt="" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 52, fontWeight: 700, letterSpacing: -1 }}>
              <span style={{ color: '#E2E8F0' }}>Concious</span>
              <span style={{ color: '#14B8A6' }}>Livin</span>
            </div>
            <div
              style={{
                fontSize: 18,
                letterSpacing: 6,
                textTransform: 'uppercase',
                color: '#94A3B8',
                marginTop: 6,
              }}
            >
              Health Academy
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ width: 96, height: 6, backgroundColor: '#0F766E', borderRadius: 3 }} />
          <div style={{ fontSize: 64, fontWeight: 700, color: '#F9FAFB', lineHeight: 1.1 }}>
            Clinical health guides &amp; longevity protocols
          </div>
          <div style={{ fontSize: 28, color: '#94A3B8', lineHeight: 1.4 }}>
            Evidence-based resources, virtual consultations, and clinical calculators by Dr. Arif
            Chowdhury, MD.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 22, color: '#64748B' }}>conciouslivin.in</div>
          <div style={{ fontSize: 22, color: '#14B8A6' }}>MBBS · M.S. Clinical Nutrition</div>
        </div>
      </div>
    ),
    size
  );
}
