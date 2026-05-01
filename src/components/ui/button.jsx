import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ae-bg disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-brand text-slate-900 hover:bg-brand-light",
        destructive: "bg-ae-red text-white hover:bg-ae-red/80",
        outline: "border border-ae-border bg-transparent text-slate-200 hover:bg-white/5",
        secondary: "bg-white/10 text-slate-200 hover:bg-white/15",
        ghost: "text-slate-300 hover:bg-white/5 hover:text-slate-100",
        link: "text-brand underline-offset-4 hover:underline",
        success: "bg-ae-green text-white hover:bg-ae-green/80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) { // eslint-disable-line no-unused-vars
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
