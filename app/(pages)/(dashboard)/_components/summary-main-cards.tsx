import { Badge } from "@/app/_components/ui/badge";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";

type SummaryCardProps = {
  title: string;
  amount: number;
  icon: React.ReactNode;
};

const SummaryMainCard = ({ title, amount, icon }: SummaryCardProps) => {
  return (
    <Card className="relative overflow-hidden rounded-2xl border border-emerald-900/30 bg-linear-to-br from-emerald-950 via-slate-900 to-slate-950 p-8 text-white shadow-2xl">
      <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

      <CardHeader className="flex flex-row items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
        {icon}
        <p>{title}</p>
      </CardHeader>

      <Badge className="absolute top-8 right-8 inline-flex items-center rounded-full border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
        Conta Principal
      </Badge>

      <CardContent className="flex justify-between">
        <div>
          <p className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
              Number(amount)
            )}
          </p>

          <p className="text-foreground/80 mt-1 flex items-center text-sm">
            <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Sincronizado via Open Banking agora mesmo
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryMainCard;
