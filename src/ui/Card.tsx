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
        "bg-white rounded-lg shadow p-4 border border-gray-200",
        className
      )}
    >
      {children}
    </div>
  );
}
