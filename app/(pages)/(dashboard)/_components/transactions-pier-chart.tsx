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
import { formatCurrency } from "@/app/_components/_utils/currency";

const chartConfig = {
  [TransactionType.INVESTMENT]: {
    label: "Investido",
    color: "#FFFFFF",
  },
  [TransactionType.DEPOSIT]: {
    label: "Receita",
    color: "#00BA7B",
  },
  [TransactionType.EXPENSE]: {
    label: "Despesa",
    color: "#FF637E",
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
    { type: "Receita", amount: depositsTotal, fill: "#00BA7B" },
    { type: "Investido", amount: investmentsTotal, fill: "#ffffff" },
    { type: "Despesa", amount: expensesTotal, fill: "#ff6363" },
  ];

  const activeSlices = chartData.filter((item) => item.amount > 0);

  return (
    <Card className="flex h-full flex-col p-6">
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="relative mx-auto aspect-square max-h-44">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, item) => (
                    <div className="text-muted-foreground flex min-w-35 items-center gap-2 text-xs">
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: item.payload.fill || item.color }}
                      />
                      <span>{chartConfig[name as keyof typeof chartConfig]?.label || name}</span>
                      <span className="text-foreground ml-auto font-mono font-medium tabular-nums">
                        {formatCurrency(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="type"
              innerRadius={56}
              outerRadius={80}
              paddingAngle={activeSlices.length > 1 ? 3 : 0}
              cornerRadius={6}
              stroke="none"
              strokeWidth={0}
              animationEasing="ease-out"
              animationDuration={400}
            />
          </PieChart>

          <div className="absolute top-1/2 left-1/2 flex w-15 -translate-x-1/2 -translate-y-1/2 transform flex-col items-center gap-1">
            <span className="text-muted-foreground text-xs">Balanço</span>
            <span className="text-foreground font-mono text-sm font-bold capitalize">
              {new Date().toLocaleDateString("pt-BR", {
                month: "long",
              })}
            </span>
          </div>
        </ChartContainer>

        <div className="border-muted-foreground/8 mt-4 space-y-3 border-t pt-4">
          <PercentageItem
            label="Investido"
            percentage={typesPercentage[TransactionType.INVESTMENT]}
            icon={<PiggyBankIcon size={14} className="text-muted-foreground" />}
          />
          <PercentageItem
            label="Receita"
            percentage={typesPercentage[TransactionType.DEPOSIT]}
            icon={<TrendingUpIcon size={14} className="text-primary" />}
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
