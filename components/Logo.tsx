import Image from 'next/image';

interface LogoProps {
  size?: number;
}

export default function Logo({ size = 32 }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="GhostIndex Logo"
      width={size}
      height={size}
      priority
    />
  );
}
