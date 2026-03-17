export default function BrandLogo({ className = "" }) {
  return (
    <img
      src="/baniya-dost-logo.svg"
      alt="Baniya Dost logo"
      className={`block h-auto w-auto ${className}`.trim()}
    />
  );
}
