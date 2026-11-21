import { useId } from 'react';

export default function BrandMark({ size = 32, valovi = true }) {
  const id = useId().replace(/:/g, '');

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}t1`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b8ecd2" />
          <stop offset="1" stopColor="#3fae84" />
        </linearGradient>
        <linearGradient id={`${id}t2`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe29a" />
          <stop offset="1" stopColor="#f5a443" />
        </linearGradient>
        <linearGradient id={`${id}t3`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffc49a" />
          <stop offset="1" stopColor="#e9733a" />
        </linearGradient>
        <linearGradient id={`${id}t4`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9adfbd" />
          <stop offset="1" stopColor="#2d8a68" />
        </linearGradient>
        <linearGradient id={`${id}pad`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4cbb8f" />
          <stop offset="0.55" stopColor="#2d8a68" />
          <stop offset="1" stopColor="#1b6449" />
        </linearGradient>
      </defs>

      {/* prsti */}
      <ellipse cx="21" cy="43" rx="11.5" ry="14.5" transform="rotate(-28 21 43)" fill={`url(#${id}t1)`} />
      <ellipse cx="39" cy="20" rx="11.5" ry="15" transform="rotate(-10 39 20)" fill={`url(#${id}t2)`} />
      <ellipse cx="63" cy="20" rx="11.5" ry="15" transform="rotate(10 63 20)" fill={`url(#${id}t3)`} />
      <ellipse cx="81" cy="43" rx="11.5" ry="14.5" transform="rotate(28 81 43)" fill={`url(#${id}t4)`} />

      {/* jastučić */}
      <path
        d="M51 42 C60 42 64 51 71.5 57 C79 63 84 68 82.5 77 C80.5 87.5 69 88.5 60.5 85 C55 82.8 47 82.8 41.5 85 C33 88.5 21.5 87.5 19.5 77 C18 68 23 63 30.5 57 C38 51 42 42 51 42 Z"
        fill={`url(#${id}pad)`}
      />

      {/* valovi signala – na malim veličinama se ne vide pa se mogu isključiti */}
      {valovi && (
        <g fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" opacity="0.95">
          <path d="M38.5 60 Q36 66 38.5 72" />
          <path d="M33.5 57 Q29.5 66 33.5 75" />
          <path d="M63.5 60 Q66 66 63.5 72" />
          <path d="M68.5 57 Q72.5 66 68.5 75" />
        </g>
      )}

      {/* pin lokacije */}
      <path d="M51 79 C48 74 43 70.5 43 64 A8 8 0 0 1 59 64 C59 70.5 54 74 51 79 Z" fill="#fff" />
      <circle cx="51" cy="64" r="3.4" fill="#f08a3e" />
    </svg>
  );
}