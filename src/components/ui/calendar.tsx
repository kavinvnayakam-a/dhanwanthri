"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 w-full",
        caption: "flex justify-between items-center px-2 mb-2",
        caption_label: "text-base font-bold text-primary uppercase tracking-wider",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 transition-all border-primary/10 text-primary rounded-lg"
        ),
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full border-collapse border-spacing-0",
        head_row: "grid grid-cols-7 w-full border-b border-primary/5 pb-2 mb-2",
        head_cell:
          "text-muted-foreground/60 font-bold text-[10px] uppercase text-center",
        row: "grid grid-cols-7 w-full",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 w-full flex justify-center items-center aspect-square"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-full w-full p-0 font-bold aria-selected:opacity-100 rounded-none hover:bg-muted transition-colors text-foreground/80 border-transparent border"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-xl shadow-lg shadow-accent/20",
        day_today: "text-accent border-accent/20 bg-accent/5 rounded-xl",
        day_outside:
          "day-outside text-muted-foreground/20 aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
