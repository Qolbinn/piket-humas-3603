"use client";

import * as React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DateRangeFilter({
  className,
  paramFrom = "from",
  paramTo = "to",
  defaultFrom,
  defaultTo,
}: React.HTMLAttributes<HTMLDivElement> & { 
  paramFrom?: string; 
  paramTo?: string;
  defaultFrom?: Date;
  defaultTo?: Date;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL if available
  const fromParam = searchParams.get(paramFrom);
  const toParam = searchParams.get(paramTo);

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: fromParam ? new Date(fromParam) : defaultFrom,
    to: toParam ? new Date(toParam) : defaultTo,
  });

  const [isOpen, setIsOpen] = React.useState(false);

  const applyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (date?.from) {
      params.set(paramFrom, format(date.from, "yyyy-MM-dd"));
    } else {
      params.delete(paramFrom);
    }

    if (date?.to) {
      params.set(paramTo, format(date.to, "yyyy-MM-dd"));
    } else {
      params.delete(paramTo);
    }

    const newQueryString = params.toString();
    if (searchParams.toString() !== newQueryString) {
      router.push(`?${newQueryString}`);
    }
    setIsOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal rounded-xl",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "d LLL y", { locale: id })} -{" "}
                  {format(date.to, "d LLL y", { locale: id })}
                </>
              ) : (
                format(date.from, "d LLL y", { locale: id })
              )
            ) : (
              <span>Pilih rentang waktu</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={id}
          />
          <div className="p-3 border-t bg-muted/20 flex justify-end">
            <Button onClick={applyFilter} size="sm">Terapkan</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
