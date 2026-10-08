import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";

type SummaryCardProps = {
  title: string;
  amount: number;
  icon: React.ReactNode;
  label?: string;
  valueColor?: string;
};

const SummaryCard = ({ title, amount, icon, label, valueColor }: SummaryCardProps) => {
  return (
    <Card className="bg-background-muted border-card-foreground/5 p-4">
      <CardHeader className="flex flex-row items-center gap-2">
        {icon}
        <p className={"text-muted-foreground text-sm font-bold"}>{title}</p>
      </CardHeader>

      <CardContent className="flex flex-col justify-between">
        <p className={`text-2xl font-extrabold ${valueColor ?? ""}`}>
          {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
            Number(amount)
          )}
        </p>

        <span className="text-muted-foreground text-xs">{label}</span>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
