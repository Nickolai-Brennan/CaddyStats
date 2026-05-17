/**
 * DS-6 Icon System
 *
 * Thin wrapper around lucide-react that:
 * 1. Enforces the project sizing scale  (xs | sm | md | lg | xl)
 * 2. Provides typed re-exports for every domain category
 * 3. Adds a generic <Icon> component for data-driven rendering
 *
 * Categories
 *  navigation  — dashboard shells and wayfinding
 *  golf        — sport-specific glyphs
 *  analytics   — charts and data indicators
 *  betting     — odds and wagering
 *  admin       — management and config
 *  state       — loading, empty, error feedback
 */

import type { LucideIcon, LucideProps } from "lucide-react";
export type { LucideIcon };

// ---------------------------------------------------------------------------
// Sizing scale
// ---------------------------------------------------------------------------
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeMap: Record<IconSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

// ---------------------------------------------------------------------------
// Base wrapper
// ---------------------------------------------------------------------------
export interface IconProps extends Omit<LucideProps, "size"> {
  size?: IconSize | number;
}

export function Icon({
  icon: IconComponent,
  size = "md",
  "aria-label": ariaLabel,
  ...props
}: IconProps & { icon: LucideIcon }) {
  const px = typeof size === "number" ? size : sizeMap[size];
  return (
    <IconComponent
      size={px}
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel}
      focusable={false}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Navigation icons
// ---------------------------------------------------------------------------
export {
  LayoutDashboard  as IconDashboard,
  Search           as IconSearch,
  BarChart3        as IconModels,
  FileText         as IconContent,
  TrendingUp       as IconTrends,
  Menu             as IconMenu,
  X                as IconClose,
  ChevronLeft      as IconChevronLeft,
  ChevronRight     as IconChevronRight,
  ChevronDown      as IconChevronDown,
  ChevronUp        as IconChevronUp,
  Home             as IconHome,
  ArrowLeft        as IconArrowLeft,
  ArrowRight       as IconArrowRight,
  ExternalLink     as IconExternalLink,
  Sidebar          as IconSidebar,
  PanelLeft        as IconPanelLeft,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Golf icons
// ---------------------------------------------------------------------------
export {
  Flag             as IconFlag,
  Trophy           as IconTrophy,
  MapPin           as IconCourse,
  Target           as IconTarget,
  Wind             as IconWind,
  Sun              as IconSun,
  Dices            as IconTee,
  Award            as IconAward,
  Star             as IconStar,
  Users            as IconField,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Analytics icons
// ---------------------------------------------------------------------------
export {
  LineChart        as IconLineChart,
  BarChart2        as IconBarChart,
  PieChart         as IconPieChart,
  Activity         as IconActivity,
  TrendingDown     as IconTrendingDown,
  TrendingUp       as IconTrendingUp,
  Gauge            as IconGauge,
  Sigma            as IconSigma,
  Percent          as IconPercent,
  Zap              as IconZap,
  Sparkles         as IconAI,
  BrainCircuit     as IconBrain,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Betting icons
// ---------------------------------------------------------------------------
export {
  DollarSign       as IconDollar,
  CircleDollarSign as IconMoney,
  Shuffle          as IconOdds,
  ShieldAlert      as IconRisk,
  Flame            as IconEdge,
  BadgePercent     as IconValue,
  Calculator       as IconCalculator,
  Lock             as IconLocked,
  Unlock           as IconUnlocked,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Admin icons
// ---------------------------------------------------------------------------
export {
  Users2           as IconUsers,
  Settings         as IconSettings,
  Settings2        as IconSettingsAdvanced,
  Shield           as IconShield,
  ScrollText       as IconAudit,
  Database         as IconDatabase,
  Key              as IconKey,
  Bell             as IconBell,
  BellOff          as IconBellOff,
  Eye              as IconEye,
  EyeOff           as IconEyeOff,
  LogOut           as IconLogOut,
  LogIn            as IconLogIn,
  UserCircle       as IconUser,
  UserCog          as IconUserCog,
  Mail             as IconMail,
} from "lucide-react";

// ---------------------------------------------------------------------------
// State / feedback icons
// ---------------------------------------------------------------------------
export {
  Loader2          as IconLoading,
  AlertCircle      as IconError,
  AlertTriangle    as IconWarning,
  CheckCircle2     as IconSuccess,
  Info             as IconInfo,
  XCircle          as IconXCircle,
  HelpCircle       as IconHelp,
  RefreshCw        as IconRefresh,
  WifiOff          as IconOffline,
  PackageOpen      as IconEmpty,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Convenience re-export map for data-driven icon rendering
// ---------------------------------------------------------------------------
export {
  // command palette trigger
  Command          as IconCommand,
  // misc
  Copy             as IconCopy,
  Check            as IconCheck,
  Plus             as IconPlus,
  Minus            as IconMinus,
  MoreHorizontal   as IconMore,
  MoreVertical     as IconMoreVertical,
  Filter           as IconFilter,
  SortAsc          as IconSortAsc,
  SortDesc         as IconSortDesc,
  Download         as IconDownload,
  Upload           as IconUpload,
} from "lucide-react";
