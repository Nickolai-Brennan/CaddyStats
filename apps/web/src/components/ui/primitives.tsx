import { useState, type ReactNode } from "react";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cx } from "./utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-amber-500 text-slate-950 hover:bg-amber-400",
    secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700",
    ghost: "text-slate-200 hover:bg-slate-800",
  };

  return (
    <button
      type={type}
      className={cx(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        "w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cx(
        "w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-amber-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cx(
        "w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-500",
        className
      )}
      {...props}
    />
  );
}

interface BadgeProps {
  children: string;
  tone?: "default" | "success" | "warning";
  className?: string;
}

export function Badge({ children, tone = "default", className }: BadgeProps) {
  const tones = {
    default: "bg-slate-700 text-slate-200",
    success: "bg-green-500/20 text-green-400",
    warning: "bg-amber-500/20 text-amber-400",
  } as const;

  return (
    <span
      className={cx(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cx("animate-pulse rounded bg-slate-800", className)} aria-hidden />;
}

// ---------------------------------------------------------------------------
// Checkbox (DS-8)
// ---------------------------------------------------------------------------
interface CheckboxProps {
  id?: string;
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({
  id,
  label,
  checked,
  defaultChecked,
  disabled,
  indeterminate,
  onChange,
  className,
}: CheckboxProps) {
  const inputRef = (el: HTMLInputElement | null) => {
    if (el) el.indeterminate = indeterminate ?? false;
  };
  return (
    <label
      className={cx(
        "inline-flex items-center gap-2 text-sm text-slate-200",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        <input
          ref={inputRef}
          id={id}
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="peer absolute inset-0 cursor-pointer appearance-none rounded border border-slate-600 bg-slate-800 checked:border-amber-500 checked:bg-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 indeterminate:border-amber-500 indeterminate:bg-amber-500 disabled:cursor-not-allowed"
        />
        <svg
          className="pointer-events-none absolute hidden h-3 w-3 text-slate-950 peer-checked:block peer-indeterminate:block"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
        >
          {indeterminate ? (
            <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <polyline points="2,6 5,9 10,3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      </span>
      {label}
    </label>
  );
}

// ---------------------------------------------------------------------------
// Radio (DS-8)
// ---------------------------------------------------------------------------
interface RadioProps {
  id?: string;
  name?: string;
  value?: string;
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  className?: string;
}

export function Radio({ id, name, value, label, checked, disabled, onChange, className }: RadioProps) {
  return (
    <label
      className={cx(
        "inline-flex items-center gap-2 text-sm text-slate-200",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        <input
          id={id}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className="peer absolute inset-0 cursor-pointer appearance-none rounded-full border border-slate-600 bg-slate-800 checked:border-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed"
        />
        <span className="pointer-events-none absolute hidden h-2 w-2 rounded-full bg-amber-500 peer-checked:block" />
      </span>
      {label}
    </label>
  );
}

// ---------------------------------------------------------------------------
// Switch (DS-8)
// ---------------------------------------------------------------------------
interface SwitchProps {
  id?: string;
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  size?: "sm" | "md";
  className?: string;
}

export function Switch({ id, label, checked, defaultChecked, disabled, onChange, size = "md", className }: SwitchProps) {
  const track = size === "sm"
    ? "h-4 w-7"
    : "h-5 w-9";
  const thumb = size === "sm"
    ? "h-3 w-3 peer-checked:translate-x-3"
    : "h-3.5 w-3.5 peer-checked:translate-x-4";

  return (
    <label
      className={cx(
        "inline-flex cursor-pointer items-center gap-2 text-sm text-slate-200",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <span className={cx("relative inline-flex shrink-0 rounded-full", track)}>
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full bg-slate-700 transition-colors duration-default peer-checked:bg-amber-500" />
        <span
          className={cx(
            "absolute left-0.5 top-1/2 -translate-y-1/2 rounded-full bg-white shadow transition-transform duration-default",
            thumb
          )}
        />
      </span>
      {label}
    </label>
  );
}

// ---------------------------------------------------------------------------
// Tooltip (DS-8)
// ---------------------------------------------------------------------------
interface TooltipProps {
  content: string;
  children: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Tooltip({ content, children, placement = "top", className }: TooltipProps) {
  const positions: Record<string, string> = {
    top:    "bottom-full left-1/2 mb-1.5 -translate-x-1/2",
    bottom: "top-full left-1/2 mt-1.5 -translate-x-1/2",
    left:   "right-full top-1/2 mr-1.5 -translate-y-1/2",
    right:  "left-full top-1/2 ml-1.5 -translate-y-1/2",
  };
  return (
    <span className={cx("group relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cx(
          "pointer-events-none absolute whitespace-nowrap rounded-lg bg-slate-700 px-2 py-1 text-xs text-slate-100 shadow-lg opacity-0 transition-opacity duration-fast group-hover:opacity-100 group-focus-within:opacity-100",
          positions[placement]
        )}
        style={{ zIndex: 70 }}
      >
        {content}
      </span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Avatar (DS-8)
// ---------------------------------------------------------------------------
interface AvatarProps {
  src?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const sizes: Record<string, string> = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };
  const initials = name
    ? name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
    : "?";

  return (
    <span
      className={cx(
        "inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-amber-500/20 font-semibold text-amber-400 ring-1 ring-slate-700",
        sizes[size],
        className
      )}
      aria-label={name}
    >
      {src ? (
        <img src={src} alt={name ?? ""} className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Tabs (DS-8)
// ---------------------------------------------------------------------------

interface Tab {
  id: string;
  label: string;
  badge?: string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  defaultTab?: string;
  onTabChange?: (id: string) => void;
  children?: (activeTab: string) => ReactNode;
  className?: string;
}

export function Tabs({ tabs, activeTab: controlledTab, defaultTab, onTabChange, children, className }: TabsProps) {
  const [internalTab, setInternalTab] = useState(defaultTab ?? tabs[0]?.id ?? "");
  const active = controlledTab ?? internalTab;

  const handleSelect = (id: string) => {
    setInternalTab(id);
    onTabChange?.(id);
  };

  return (
    <div className={cx("space-y-4", className)}>
      <div role="tablist" className="flex items-center gap-1 border-b border-slate-800 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={active === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => handleSelect(tab.id)}
            className={cx(
              "relative inline-flex items-center gap-1.5 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-40",
              active === tab.id
                ? "text-amber-400 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-amber-500"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            {tab.label}
            {tab.badge && (
              <span className="rounded-full bg-slate-700 px-1.5 py-0.5 text-[10px] font-semibold text-slate-300">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      {children && (
        <div
          role="tabpanel"
          id={`tabpanel-${active}`}
          aria-labelledby={`tab-${active}`}
        >
          {children(active)}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Accordion (DS-8)
// ---------------------------------------------------------------------------

interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  defaultOpen?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({ items, allowMultiple = false, className }: AccordionProps) {
  const defaultOpen = items.filter((i) => i.defaultOpen).map((i) => i.id);
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggle = (id: string) => {
    setOpenItems((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      return allowMultiple ? [...prev, id] : [id];
    });
  };

  return (
    <div className={cx("divide-y divide-slate-800 rounded-xl border border-slate-800", className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`accordion-${item.id}`}
              id={`accordion-trigger-${item.id}`}
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-medium text-slate-200 hover:bg-slate-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500"
            >
              {item.title}
              <svg
                className={cx("h-4 w-4 text-slate-400 transition-transform duration-default", isOpen && "rotate-180")}
                viewBox="0 0 16 16" fill="none" aria-hidden
              >
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {isOpen && (
              <div
                id={`accordion-${item.id}`}
                role="region"
                aria-labelledby={`accordion-trigger-${item.id}`}
                className="animate-slide-up px-4 pb-4 text-sm text-slate-400"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
