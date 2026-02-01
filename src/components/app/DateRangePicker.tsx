// components/DateRangePicker.tsx
"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";

interface DatePickerWithRangeProps {
  className?: string;
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  date,
  onDateChange,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal bg-white hover:bg-gray-50 border-gray-200",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-[#00D0F5]" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span className="text-gray-600">Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-white border-gray-200 shadow-lg"
          align="start"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            className="bg-white rounded-md"
            modifiersStyles={{
              selected: {
                backgroundColor: "#00D0F5",
                color: "white",
                borderRadius: "6px",
              },
              range_start: {
                backgroundColor: "#00D0F5",
                color: "white",
                borderRadius: "6px",
              },
              range_end: {
                backgroundColor: "#00D0F5",
                color: "white",
                borderRadius: "6px",
              },
              range_middle: {
                backgroundColor: "rgba(84, 82, 182, 0.2)",
                color: "#00D0F5",
              },
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
