import clsx from "clsx";

type BadgeProps = {
  children: string;
  color?: "blue" | "green" | "red" | "gray";
};

export default function Badge({ children, color = "blue" }: BadgeProps) {
  const colors = {
    blue: "bg-blue-600 text-white",
    green: "bg-green-600 text-white",
    red: "bg-red-600 text-white",
    gray: "bg-gray-600 text-white",
  };

  return (
    <span className={clsx("px-3 py-1 rounded-full text-sm", colors[color])}>
      {children}
    </span>
  );
}
