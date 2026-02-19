import { ReactNode } from "react";

export function Column({ 
  size, 
  children 
}: { 
  size: "small" | "medium" | "full"; 
  children: ReactNode 
}) {
  // Map YAML sizes to Tailwind widths
  // small = 25% on desktop
  // medium = 33% on desktop
  // full = 50% on desktop (typically used for the main center column)
  const sizeClasses = {
    small: "w-full lg:w-1/4", 
    medium: "w-full lg:w-1/3",
    full: "w-full lg:w-1/2",   
  };

  return (
    <div className={`flex flex-col gap-6 ${sizeClasses[size] ?? "w-full"}`}>
      {children}
    </div>
  );
}
