import type { ReactNode } from "react";
import clsx from "clsx";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className,
  disabled,
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 " +
    "disabled:opacity-50 disabled:cursor-not-allowed " +
    "focus:outline-none focus:ring-2 focus:ring-purple-500/40";

  const variants = {
    primary:
      "bg-purple-600 text-white hover:bg-purple-500 " +
      "shadow-sm shadow-purple-500/20",

    secondary:
      "bg-zinc-300 text-zinc-800 hover:bg-zinc-400 " +
      "border border-zinc-400",

    danger:
      "bg-red-600 text-white hover:bg-red-500",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(base, variants[variant], className)}
    >
      {children}
    </button>
  );
}
