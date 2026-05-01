import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand/20 text-brand",
        secondary: "border-transparent bg-white/10 text-slate-300",
        destructive: "border-transparent bg-ae-red/20 text-ae-red",
        success: "border-transparent bg-ae-green/20 text-ae-green",
        warning: "border-transparent bg-ae-orange/20 text-ae-orange",
        info: "border-transparent bg-ae-blue/20 text-ae-blue",
        outline: "border-ae-border text-slate-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
