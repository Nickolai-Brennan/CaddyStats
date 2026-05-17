/**
 * SectionHeader — consistent section heading with optional subtitle + action
 */

import type { ReactNode } from "react";
import { typographyClasses } from "@/styles/typography";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, action, className = "" }: SectionHeaderProps) {
  return (
    <div className={`flex items-end justify-between gap-4 ${className}`}>
      <div>
        <h2 className={`text-2xl text-slate-50 ${typographyClasses.h2}`}>{title}</h2>
        {subtitle && <p className="mt-1 text-body-sm">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
