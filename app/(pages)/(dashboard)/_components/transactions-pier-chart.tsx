"use client";

import { Card, CardContent } from "@/app/_components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import { TransactionTypePercentages } from "@/app/modules/dashboard/types/dashboard.types";
import { TransactionType } from "@prisma/client";
import { TrendingUpIcon, TrendingDownIcon, PiggyBankIcon } from "lucide-react";
import { Pie, PieChart } from "recharts";
import PercentageItem from "./percentage-item";

const chartConfig = {
  [TransactionType.INVESTMENT]: {
    label: "Investido",
    color: "#FFFFFF",
  },
  [TransactionType.DEPOSIT]: {
    label: "Receita",
    color: "#55B02E",
  },
  [TransactionType.EXPENSE]: {
    label: "Despesa",
    color: "#FF4C4C",
  },
} satisfies ChartConfig;

type TransactionsPierChartProps = {
  depositsTotal: number;
  investmentsTotal: number;
  expensesTotal: number;
  typesPercentage: TransactionTypePercentages;
};

const TransactionsPierChart = ({
  depositsTotal,
  investmentsTotal,
  expensesTotal,
  typesPercentage,
}: TransactionsPierChartProps) => {
  const chartData = [
    { type: "Receita", amount: depositsTotal, fill: "#55b02e" },
    { type: "Investido", amount: investmentsTotal, fill: "#fff" },
    { type: "Despesa", amount: expensesTotal, fill: "#ff4c4c" },
  ];

  return (
    <Card className="flex h-full flex-col p-6">
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-52">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="amount" nameKey="type" innerRadius={60} />
          </PieChart>
        </ChartContainer>

        <div className="space-y-3">
          <PercentageItem
            label="Receita"
            percentage={typesPercentage[TransactionType.DEPOSIT]}
            icon={<TrendingUpIcon size={14} className="text-primary" />}
          />

          <PercentageItem
            label="Investido"
            percentage={typesPercentage[TransactionType.INVESTMENT]}
            icon={<PiggyBankIcon size={14} className="text-white" />}
          />
          <PercentageItem
            label="Despesa"
            percentage={typesPercentage[TransactionType.EXPENSE]}
            icon={<TrendingDownIcon size={14} className="text-red-500" />}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsPierChart;
