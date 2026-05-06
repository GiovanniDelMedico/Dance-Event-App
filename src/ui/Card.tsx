import type { ReactNode } from "react";
import clsx from "clsx";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={clsx(
        // Base shape
        "rounded-xl border transition-all duration-200",

        // Light mode (coerente con tutto il sito)
       "bg-[#EDEDF0] border-zinc-300 shadow-sm hover:shadow-md",

        // Dark mode (disattivata per ora)
        "dark:bg-zinc-900 dark:border-zinc-800 dark:hover:shadow-purple-900/10",

        className
      )}
    >
      {children}
    </div>
  );
}
