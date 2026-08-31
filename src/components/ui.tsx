import type { ReactNode } from "react";
import Link from "next/link";

const buttonBase =
  "hh-ui inline-flex items-center justify-center text-[13px] tracking-[.02em] uppercase transition-colors disabled:opacity-40 disabled:pointer-events-none";

const buttonVariants = {
  primary: "bg-[var(--hh-black)] text-white hover:bg-[var(--hh-ink-700)]",
  secondary:
    "border border-[var(--hh-black)] text-[var(--hh-black)] hover:bg-[var(--hh-black)] hover:text-white",
  inverse: "bg-white text-black hover:bg-[var(--hh-bone-100)]",
  "secondary-inverse": "border border-white text-white hover:bg-white hover:text-black",
  ghost: "text-[var(--text-body)] hover:bg-black/[.06]",
};

const buttonSizes = {
  lg: "h-14 px-7",
  md: "h-11 px-5",
  sm: "h-9 px-4",
};

type ButtonSharedProps = {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  full?: boolean;
  children: ReactNode;
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  full,
  children,
}: ButtonSharedProps & { href: string }) {
  return (
    <Link
      href={href}
      className={`${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${full ? "w-full" : ""}`}
    >
      {children}
    </Link>
  );
}

export function ActionButton({
  onClick,
  variant = "primary",
  size = "md",
  full,
  disabled,
  children,
}: ButtonSharedProps & { onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${full ? "w-full" : ""}`}
    >
      {children}
    </button>
  );
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="hh-back-link">
      {children}
    </Link>
  );
}

export function SectionHeading({
  title,
  motto,
  lede,
  action,
  inverse,
}: {
  title: string;
  motto?: string;
  lede?: string | null;
  action?: { label: string; href: string };
  inverse?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <div>
        <h2
          className={`hh-display text-[clamp(30px,9vw,38px)] leading-[.9] uppercase ${inverse ? "text-white" : "text-[var(--hh-black)]"}`}
        >
          {title}
        </h2>
        {motto && <div className="hh-script mt-2 text-2xl text-[var(--hh-black)]">{motto}</div>}
        {lede && (
          <p className="mt-3 max-w-xl text-[15px]" style={{ color: "var(--text-body)" }}>
            {lede}
          </p>
        )}
      </div>
      {action && (
        <Link href={action.href} className="hh-ui shrink-0 whitespace-nowrap text-[11px] tracking-[.04em] uppercase" style={{ color: inverse ? "white" : "var(--hh-black)" }}>
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function ServiceRow({
  name,
  duration,
  price,
  onClick,
  selected,
}: {
  name: string;
  duration?: string | null;
  price?: string | null;
  onClick?: () => void;
  selected?: boolean;
}) {
  const rowClassName = `flex w-full items-center justify-between gap-4 border-t py-4 text-left ${
    selected ? "border-[var(--hh-black)]" : "border-black/[.08]"
  }`;
  const content = (
    <>
      <div>
        <div className="hh-ui text-[14px] uppercase tracking-[.01em]">{name}</div>
        {duration && (
          <div className="mt-1 text-[12px]" style={{ color: "var(--text-muted)" }}>
            {duration}
          </div>
        )}
      </div>
      {price && <div className="hh-ui shrink-0 text-[15px]">{price}</div>}
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${rowClassName} cursor-pointer`}>
        {content}
      </button>
    );
  }
  return <div className={rowClassName}>{content}</div>;
}

export function Tag({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`hh-ui h-8 shrink-0 rounded-full border px-4 text-[12px] tracking-[.02em] uppercase transition-colors ${
        selected
          ? "border-[var(--hh-black)] bg-[var(--hh-black)] text-white"
          : "border-[var(--hh-ink-100)] text-[var(--hh-black)]"
      }`}
    >
      {children}
    </button>
  );
}
