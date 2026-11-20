'use client';

const OPEN_RING_PATH = 'M47.32 19.15A20 20 0 1 0 47.32 44.85';

export function LogoMark({
  className = 'h-9 w-9',
  variant = 'auto',
}: {
  className?: string;
  variant?: 'auto' | 'onInk';
}) {
  const ringClassName = variant === 'onInk'
    ? 'stroke-[#F9FAFB]'
    : 'stroke-[#1E293B] dark:stroke-[#E2E8F0]';
  const seedClassName = variant === 'onInk'
    ? 'fill-[#14B8A6]'
    : 'fill-[#0F766E] dark:fill-[#14B8A6]';

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d={OPEN_RING_PATH}
        className={ringClassName}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="47.5" cy="32" r="5" className={seedClassName} />
    </svg>
  );
}

export function Logo({
  className = '',
  markClassName = 'h-9 w-9',
  textClassName = '',
  descriptor,
  byline,
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  descriptor?: string;
  byline?: string;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className={`shrink-0 ${markClassName}`} />
      <span className="flex min-w-0 flex-col">
        <span className={`font-semibold tracking-tight ${textClassName}`}>
          Concious<span className="text-[#0F766E] dark:text-[#14B8A6]">Livin</span>
        </span>
        {descriptor && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#64748B] dark:text-[#94A3B8]">
            {descriptor}
          </span>
        )}
        {byline && (
          <span className="text-[11px] font-semibold text-[#0F766E] dark:text-[#14B8A6]">
            {byline}
          </span>
        )}
      </span>
    </span>
  );
}
