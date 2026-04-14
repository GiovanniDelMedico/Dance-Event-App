import type { SelectHTMLAttributes } from "react";
import clsx from "clsx";

export default function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={clsx(
        "w-full px-3 py-2 border rounded-md bg-white",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
        props.className
      )}
    />
  );
}
