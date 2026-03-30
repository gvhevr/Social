import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "profile";
  className?: string;
};

const px = { xs: 26, sm: 32, md: 40, lg: 48, xl: 72 };

export function Avatar({ src, alt, size = "md", className = "" }: Props) {
  if (size === "profile") {
    return (
      <span
        className={`relative inline-block h-[77px] w-[77px] shrink-0 overflow-hidden rounded-full bg-zinc-200 ring-2 ring-zinc-100 dark:bg-zinc-800 dark:ring-zinc-800 sm:h-[96px] sm:w-[96px] md:h-[148px] md:w-[148px] md:ring-[3px] ${className}`}
      >
        <Image src={src} alt={alt} fill className="object-cover" sizes="148px" unoptimized />
      </span>
    );
  }

  const s = px[size];
  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-full bg-zinc-200 ring-2 ring-white dark:bg-zinc-800 dark:ring-zinc-950 ${className}`}
      style={{ width: s, height: s }}
    >
      <Image src={src} alt={alt} width={s} height={s} className="h-full w-full object-cover" unoptimized />
    </span>
  );
}
