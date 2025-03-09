import { Badge } from "@/app/_components/ui/badge";
import { TransactionType } from "@prisma/client";
import { CircleIcon } from "lucide-react";

const TypeBadge = ({ type }: { type: TransactionType }) => {
  switch (type) {
    case TransactionType.DEPOSIT:
      return (
        <Badge className="bg-primary/10 text-primary rounded-full font-bold">
          <CircleIcon className="fill-primary mr-2" size={10} />
          Depósito
        </Badge>
      );
    case TransactionType.EXPENSE:
      return (
        <Badge className="rounded-full bg-red-500/10 font-bold text-red-700">
          <CircleIcon className="mr-2 fill-red-700" size={10} />
          Despesas
        </Badge>
      );
    default:
      return (
        <Badge className="rounded-full bg-blue-500/10 font-bold text-blue-700">
          <CircleIcon className="mr-2 fill-blue-700" size={10} />
          Investimentos
        </Badge>
      );
  }
};

export default TypeBadge;
