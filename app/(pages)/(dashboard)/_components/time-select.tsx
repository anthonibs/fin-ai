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
        value: monthNumber,
      });
    }

    return options;
  }, []);

  const handleMonthChange = (value: string) => {
    push(`?month=${value}`);
  };

  return (
    <Select onValueChange={handleMonthChange} value={currentMonthParam ?? ""}>
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
