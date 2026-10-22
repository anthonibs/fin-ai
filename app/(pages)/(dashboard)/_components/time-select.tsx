"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const TimeSelect = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const currentMonthParam = searchParams.get("month");
  const currentYearParam = searchParams.get("year");

  const availableMonths = useMemo(() => {
    const currentDate = new Date();
    const options = [];

    for (let i = 0; i < 4; i++) {
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);

      const year = targetDate.getFullYear();
      const monthIndex = targetDate.getMonth();
      const monthNumber = String(monthIndex + 1).padStart(2, "0");

      options.push({
        label: `${MONTH_NAMES[monthIndex]} de ${year}`,
        value: `${year}-${monthNumber}`,
      });
    }

    return options;
  }, []);

  const selectedValue =
    currentMonthParam && currentYearParam
      ? `${currentYearParam}-${currentMonthParam.padStart(2, "0")}`
      : (availableMonths[0]?.value ?? "");

  const handleMonthChange = (value: string) => {
    const [year, month] = value.split("-");
    push(`?month=${month}&year=${year}`);
  };

  return (
    <Select onValueChange={handleMonthChange} value={selectedValue}>
      <SelectTrigger className="w-48 rounded-md border">
        <SelectValue placeholder="Selecione um mês" />
      </SelectTrigger>

      <SelectContent className="bg-background">
        {availableMonths.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimeSelect;
