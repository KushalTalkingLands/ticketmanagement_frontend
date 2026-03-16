import * as React from "react";
import { cn } from "../../lib/utils";

function Badge({ className, variant = "default", ...props }) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors";

  const variants = {
    default:
      "border-transparent bg-slate-800 text-slate-50 hover:bg-slate-700",
    success:
      "border-transparent bg-emerald-600/80 text-emerald-50 hover:bg-emerald-600",
    warning:
      "border-transparent bg-amber-500/80 text-amber-50 hover:bg-amber-500",
    danger:
      "border-transparent bg-rose-600/80 text-rose-50 hover:bg-rose-600",
  };

  return (
    <span
      className={cn(base, variants[variant] || variants.default, className)}
      {...props}
    />
  );
}

export { Badge };

