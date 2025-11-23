"use client";

import * as React from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale"; // Turkish locale
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  value: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
}

export function DateRangePicker({
  className,
  value,
  onSelect,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal text-base py-4.5",
              !value && "text-muted-foreground",
              // Added this line for selected state styling
              value && "bg-koli-dark-red/5 text-koli-dark-red hover:bg-koli-dark-red/10",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                (() => {
                  const isToday = (date: Date) => {
                    const today = new Date();
                    return (
                      date.getDate() === today.getDate() &&
                      date.getMonth() === today.getMonth() &&
                      date.getFullYear() === today.getFullYear()
                    );
                  };

                  if (
                    value.from &&
                    value.to &&
                    isToday(value.from) &&
                    isToday(value.to)
                  ) {
                    return "Bugün";
                  }

                  return (
                    <>
                      {format(value.from, "dd LLL, y", { locale: tr })} -{" "}
                      {format(value.to, "dd LLL, y", { locale: tr })}
                    </>
                  );
                })()
              ) : (
                format(value.from, "dd LLL, y", { locale: tr })
              )
            ) : (
              <span>Bir tarih aralığı seçin</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onSelect}
            numberOfMonths={2}
            locale={tr} // Use Turkish locale
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}