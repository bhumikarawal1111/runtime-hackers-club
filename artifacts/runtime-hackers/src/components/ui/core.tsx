import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// --- BUTTON ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "neon" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", isLoading, children, ...props }, ref) => {
    const variants = {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      outline: "border-2 border-primary text-primary hover:bg-primary/10",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      neon: "bg-transparent border border-secondary text-secondary shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:shadow-[0_0_20px_rgba(0,255,255,0.6)] hover:bg-secondary/10",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    };
    
    const sizes = {
      sm: "h-9 px-3 text-xs",
      md: "h-11 px-6 py-2",
      lg: "h-14 px-8 text-lg",
      icon: "h-10 w-10 flex items-center justify-center",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-mono font-bold transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// --- INPUT & TEXTAREA ---
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-12 w-full rounded-md border-2 border-border bg-background/50 px-4 py-2 font-mono text-sm shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-md border-2 border-border bg-background/50 px-4 py-3 font-mono text-sm shadow-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-mono text-foreground mb-2 block", className)}
      {...props}
    />
  )
);
Label.displayName = "Label";

// --- CARD ---
export function Card({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={cn("glass-card rounded-xl text-card-foreground overflow-hidden relative neon-border group", className)}>
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
}

// --- BADGE ---
export function Badge({ className, variant = "default", children }: { className?: string, variant?: "default" | "secondary" | "accent", children: React.ReactNode }) {
  const variants = {
    default: "bg-primary/20 text-primary border-primary/50",
    secondary: "bg-secondary/20 text-secondary border-secondary/50",
    accent: "bg-accent/20 text-accent border-accent/50",
  };
  
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-mono", variants[variant], className)}>
      {children}
    </span>
  );
}

// --- MODAL / DIALOG ---
interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-card w-full max-w-lg rounded-2xl pointer-events-auto max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-border/50 flex justify-between items-center bg-card/50">
                <h2 className="text-xl font-mono text-primary font-bold">{title}</h2>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-2">
                  ✕
                </button>
              </div>
              <div className="p-6 bg-background/80">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
