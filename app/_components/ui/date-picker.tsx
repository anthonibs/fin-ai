"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Calendar } from "./calendar";

import { ptBR } from "date-fns/locale";

type DatePickerProps = {
  date?: Date;
  onDateChange?: (date: Date) => void;
};

export const DatePicker = ({ date: initialDate, onDateChange }: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!initialDate}
          className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal"
        >
          <CalendarIcon />
          {initialDate ? (
            new Date(initialDate).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="bg-background z-100 w-auto p-0">
        <Calendar
          mode="single"
          autoFocus
          locale={ptBR}
          selected={initialDate}
          onSelect={(date: Date | undefined) => {
            if (date && onDateChange) {
              onDateChange(date);
            }
          }}
          today={new Date()}
        />
      </PopoverContent>
    </Popover>
  );
};
