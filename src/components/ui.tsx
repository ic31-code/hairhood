import type { ReactNode } from "react";

const buttonBase =
  "hh-ui inline-flex items-center justify-center text-[13px] tracking-[.02em] uppercase transition-colors";

const buttonVariants = {
  primary: "bg-[var(--hh-black)] text-white hover:bg-[var(--hh-ink-700)]",
  secondary:
    "border border-[var(--hh-black)] text-[var(--hh-black)] hover:bg-[var(--hh-black)] hover:text-white",
  inverse: "bg-white text-black hover:bg-[var(--hh-bone-100)]",
  "secondary-inverse":
    "border border-white text-white hover:bg-white hover:text-black",
};

const buttonSizes = {
  lg: "h-14 px-7",
  md: "h-11 px-5",
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  children,
}: {
  href: string;
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={`${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]}`}
    >
      {children}
    </a>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  motto,
  lede,
}: {
  eyebrow?: string;
  title: string;
  motto?: string;
  lede?: string | null;
}) {
  return (
    <div>
      {eyebrow && <span className="hh-eyebrow">{eyebrow}</span>}
      <h2 className="hh-display mt-3 text-[clamp(32px,6vw,56px)] leading-[.9] uppercase text-[var(--text-strong,inherit)]">
        {title}
      </h2>
      {motto && <div className="hh-script mt-2 text-2xl text-[var(--hh-brass-500)]">{motto}</div>}
      {lede && <p className="mt-3 max-w-xl text-[15px]" style={{ color: "var(--text-body)" }}>{lede}</p>}
    </div>
  );
}

export function ServiceRow({
  name,
  duration,
  price,
}: {
  name: string;
  duration?: string | null;
  price?: string | null;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-black/[.08] py-4">
      <div>
        <div className="hh-ui text-[15px] uppercase tracking-[.01em]">{name}</div>
        {duration && (
          <div className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>
            {duration}
          </div>
        )}
      </div>
      {price && <div className="hh-ui shrink-0 text-[15px]">{price}</div>}
    </div>
  );
}
