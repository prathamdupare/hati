import { CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface WidgetHeaderProps {
  title: string;
}

export function WidgetHeader({ title = "" }: WidgetHeaderProps) {
  return (
    <>
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="text-sm font-semibold tracking-tight uppercase">
          {title}
        </CardTitle>
      </CardHeader>
      <Separator />
    </>
  );
}
