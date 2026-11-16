export default function BrandMark({ size = 32 }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="16" cy="21.5" rx="7.4" ry="5.8" />
      <ellipse cx="7.4" cy="14.6" rx="3.2" ry="4.2" transform="rotate(-20 7.4 14.6)" />
      <ellipse cx="13" cy="10.2" rx="3.2" ry="4.2" transform="rotate(-7 13 10.2)" />
      <ellipse cx="19" cy="10.2" rx="3.2" ry="4.2" transform="rotate(7 19 10.2)" />
      <ellipse cx="24.6" cy="14.6" rx="3.2" ry="4.2" transform="rotate(20 24.6 14.6)" />
    </svg>
  );
}
