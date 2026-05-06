import clsx from "clsx";

type BadgeProps = {
  children: string;
  color?: "blue" | "green" | "red" | "gray";
};

export default function Badge({ children, color = "blue" }: BadgeProps) {
  const colors = {
    blue: "bg-purple-200 text-purple-800",
    green: "bg-green-200 text-green-800",
    red: "bg-red-200 text-red-800",
    gray: "bg-zinc-300 text-zinc-800",
  };

  return (
    <span
      className={clsx(
        "px-3 py-1 rounded-full text-sm font-medium",
        colors[color]
      )}
    >
      {children}
    </span>
  );
}
