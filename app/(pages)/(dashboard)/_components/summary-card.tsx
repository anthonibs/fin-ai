import { memo } from "react";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";

type SummaryCardProps = {
  title: string;
  amount: number;
  icon: React.ReactNode;
  valueColor?: string;
  labelProps?: {
    className?: string;
    label?: string;
    labelColor?: string;
  };
};

const SummaryCard = ({ title, amount, icon, valueColor, labelProps }: SummaryCardProps) => {
  return (
    <Card className="gap-3">
      <CardHeader className="text-muted-foreground flex flex-row items-center gap-2">
        {icon}
        <p className={"text-sm font-bold"}>{title}</p>
      </CardHeader>

      <CardContent className="flex flex-col justify-between">
        <p className={`text-2xl font-extrabold ${valueColor ?? ""}`}>
          {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
            Number(amount)
          )}
        </p>

        <p className={`mt-0.5 text-xs ${labelProps?.labelColor ?? ""}`}>{labelProps?.label}</p>
      </CardContent>
    </Card>
  );
};

export default memo(SummaryCard);
