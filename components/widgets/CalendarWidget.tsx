"use client"

import * as React from "react"
import { CalendarWidgetConfig } from "@/lib/hati/types"
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { CalendarDays } from "lucide-react"

export function CalendarWidget({ config }: { config: CalendarWidgetConfig }) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  
  const weekStartsOn = config["first-day-of-week"] === "monday" ? 1 : 0
  
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="text-sm font-semibold tracking-tight uppercase">
          {config.title || "CALENDAR"}
        </CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="p-4 flex items-center justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          weekStartsOn={weekStartsOn}
          className="border-0 p-0" 
        />
      </CardContent>
    </Card>
  )
}
