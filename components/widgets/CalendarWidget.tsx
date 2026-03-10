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
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 pt-5 pb-3">
        <CardTitle className="text-sm font-semibold tracking-tight uppercase">
          {config.title || "CALENDAR"}
        </CardTitle>
        <Badge variant="outline" className="gap-1 text-[10px] font-semibold uppercase tracking-wide">
          <CalendarDays className="w-3 h-3" />
          Calendar
        </Badge>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 p-4 flex items-center justify-center">
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
