"use client"

import * as React from "react"
import { Bell, AlertCircle, X, Globe } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export interface EngineError {
  url: string;
  message: string;
  timestamp: string;
}

export function ErrorCenter({ initialErrors }: { initialErrors: EngineError[] }) {
  const [errors, setErrors] = React.useState<EngineError[]>(initialErrors)

  if (errors.length === 0) {
    return <Bell className="h-5 w-5 text-muted-foreground/50" />
  }

  const clearAll = () => setErrors([])
  const removeError = (index: number) => {
    setErrors(errors.filter((_, i) => i !== index))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button  size="icon" className="relative">
          <Bell className="h-5 w-5 text-destructive animate-pulse" />
          <Badge className="absolute -top-1 -right-1 h-4 min-w-4 p-1 flex items-center justify-center text-[10px] font-bold bg-destructive">
            {errors.length}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 shadow-xl border-border">
        <div className="flex items-center justify-between p-3 bg-muted/30">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            System Alerts
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAll}
            className="h-auto py-1 px-2 text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground"
          >
            Dismiss All
          </Button>
        </div>
        <Separator />
        <ScrollArea className="h-full max-h-[300px]">
          {errors.map((error, i) => (
            <div key={i} className="group relative p-4 flex gap-3 hover:bg-muted/20 transition-colors border-b last:border-0">
              <div className="mt-0.5">
                <AlertCircle className="h-4 w-4 text-destructive" />
              </div>
              <div className="flex flex-col gap-1 overflow-hidden pr-6">
                <div className="flex items-center gap-1.5 text-xs font-semibold truncate">
                  <Globe className="h-3 w-3 text-muted-foreground" />
                  {new URL(error.url).hostname}
                </div>
                <span className="text-[11px] text-muted-foreground leading-snug">
                  {error.message}
                </span>
                <span className="text-[9px] text-muted-foreground/50 font-mono italic">
                  {error.timestamp}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeError(i)}
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
