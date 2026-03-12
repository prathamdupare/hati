import { cn } from "@/lib/utils";
import { ColumnSize } from "@/lib/hati/types";

interface ColumnProps {
  size: ColumnSize;
  children: React.ReactNode;
}

export function Column({ size, children }: ColumnProps) {
  const widthClasses: Record<ColumnSize, string> = {
    small: "w-full lg:w-[25%]",
    medium: "w-full lg:w-[33.333%]",
    large: "w-full lg:w-[50%]",
    full: "w-full",
  };

  return (
    <div 
      className={cn(
        "flex flex-col gap-6 min-w-0",
        widthClasses[size] || "w-full"
      )}
    >
      {children}
    </div>
  );
}
