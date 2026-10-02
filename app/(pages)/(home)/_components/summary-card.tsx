import AddTransactionButton from "@/app/_components/shared/add-transaction-button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";

type SummaryCardProps = {
  title: string;
  amount: number;
  icon: React.ReactNode;
  size?: "small" | "large";
};

const SummaryCard = ({ title, amount, icon, size = "small" }: SummaryCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        {icon}
        <p
          className={
            size === "large"
              ? "text-xl text-white opacity-75"
              : "text-muted-foreground text-sm font-bold"
          }
        >
          {title}
        </p>
      </CardHeader>

      <CardContent className="flex justify-between">
        <p className={size === "large" ? "text-4xl font-bold" : "text-2xl font-bold"}>
          {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
            Number(amount)
          )}
        </p>

        {size === "large" && <AddTransactionButton />}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
