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
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL if available
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: fromParam ? new Date(fromParam) : undefined,
    to: toParam ? new Date(toParam) : undefined,
  });

  const [isOpen, setIsOpen] = React.useState(false);

  const applyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (date?.from) {
      params.set("from", format(date.from, "yyyy-MM-dd"));
    } else {
      params.delete("from");
    }

    if (date?.to) {
      params.set("to", format(date.to, "yyyy-MM-dd"));
    } else {
      params.delete("to");
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
            initialFocus
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
