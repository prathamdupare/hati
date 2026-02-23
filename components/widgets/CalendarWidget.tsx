"use client"

import * as React from "react"
import { CalendarWidgetConfig } from "@/lib/hati/types"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"

export function CalendarWidget({ config }: { config: CalendarWidgetConfig }) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  
  const weekStartsOn = config["first-day-of-week"] === "monday" ? 1 : 0
  
  return (
    <Card className="h-fit flex items-center justify-center">
      <CardContent className="p-4">
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
