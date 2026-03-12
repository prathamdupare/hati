import { cn } from "@/lib/utils";
import { ColumnSize } from "@/lib/hati/types";

interface ColumnProps {
  size: ColumnSize;
  children: React.ReactNode;
}

export function Column({ size, children }: ColumnProps) {
  const widthClasses: Record<ColumnSize, string> = {
    small: "flex-[1]",
    medium: "flex-[1.5]",
    large: "flex-[2]",
    full: "flex-[3]",
  };

  return (
    <div 
      className={cn(
        "flex flex-col gap-6 min-w-0",
        widthClasses[size] || "flex-[1]"
      )}
    >
      {children}
    </div>
  );
}
