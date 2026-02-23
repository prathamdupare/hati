import { cn } from "@/lib/utils";
import { ColumnSize } from "@/lib/hati/types"; // 👈 Import the shared type

interface ColumnProps {
  size: ColumnSize; // 👈 Use the shared type for the prop
  children: React.ReactNode;
}

export function Column({ size, children }: ColumnProps) {
  // Map the abstract sizes to actual Tailwind width classes
  const widthClasses: Record<ColumnSize, string> = {
    small: "lg:w-1/4",   // 25% width
    medium: "lg:w-1/3",  // 33% width
    large: "lg:w-1/2",   // 50% width
    full: "lg:w-full",   // 100% width
  };

  return (
    <div 
      className={cn(
        "flex flex-col gap-6 w-full min-w-0", // min-w-0 prevents flex children from overflowing
        widthClasses[size] || "lg:w-full"
      )}
    >
      {children}
    </div>
  );
}
