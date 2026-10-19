"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { TransactionCategory, TransactionPaymentMethod, TransactionType } from "@prisma/client";
import { Input } from "../ui/input";
import InputMaskMoney from "./money-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  PAYMENT_METHOD_OPTIONS,
  TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
} from "@/app/_constants/transactions";
import { DatePicker } from "../ui/date-picker";
import { upsertTransaction } from "@/app/_actions/upsert-transaction";
import { TransactionDTO } from "@/app/(pages)/transactions/_columns";
import { PlusIcon } from "lucide-react";

const TRANSACTION_STYLES: Record<
  string,
  { activeBg: string; activeBorder: string; activeText: string; dot: string }
> = {
  DEPOSIT: {
    activeBg: "bg-emerald-500/12",
    activeBorder: "border-emerald-500/50",
    activeText: "text-emerald-500",
    dot: "bg-emerald-500",
  },
  EXPENSE: {
    activeBg: "bg-rose-500/12",
    activeBorder: "border-rose-500/50",
    activeText: "text-rose-500",
    dot: "bg-rose-500",
  },
  INVESTMENT: {
    activeBg: "bg-blue-500/12",
    activeBorder: "border-blue-500/50",
    activeText: "text-blue-500",
    dot: "bg-blue-500",
  },
};

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Nome é obrigatório",
  }),
  amount: z
    .number({
      message: "Valor é obrigatório",
    })
    .positive({
      message: "Valor deve ser positivo",
    }),
  type: z.enum(TransactionType, {
    message: "Tipo é obrigatório",
  }),
  category: z.enum(TransactionCategory, {
    message: "Categoria é obrigatória",
  }),
  paymentMethod: z.enum(TransactionPaymentMethod, {
    message: "Método de pagamento é obrigatório",
  }),
  date: z.date({
    message: "Data é obrigatória",
  }),
});

type FormData = z.infer<typeof formSchema>;

type UpsertTransactionDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  defaultValues?: TransactionDTO;
  transactionId?: string;
};

const UpsertTransactionDialog = ({
  isOpen,
  setIsOpen,
  defaultValues,
  transactionId,
}: UpsertTransactionDialogProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      amount: defaultValues?.amount ?? 0,
      name: defaultValues?.name ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await upsertTransaction({ ...data, id: transactionId });
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const isUpdate = Boolean(transactionId);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogContent className="bg-background-muted p-0 sm:max-w-lg">
        <DialogHeader className="border-b p-5">
          <DialogTitle>{isUpdate ? "Editar" : "Adicionar"} Transação</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Insira as informações abaixo para registrar um novo lançamento ou editar um existente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8 px-5">
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="w-full">
                <FieldContent className="w-full">
                  <FieldLabel id="label-transaction-type" className="text-xs font-bold uppercase">
                    Tipo de Transação
                  </FieldLabel>

                  <div
                    role="radiogroup"
                    aria-labelledby="label-transaction-type"
                    className="bg-background flex justify-between gap-1 overflow-hidden rounded-lg p-1"
                  >
                    {TRANSACTION_TYPE_OPTIONS.map((item) => {
                      const isSelected = field.value === item.value;
                      const style = TRANSACTION_STYLES[item.value];
                      const inputId = `field-type-${item.value.toLowerCase()}`;

                      return (
                        <label
                          key={item.value}
                          htmlFor={inputId}
                          className={`/* Acessibilidade de Foco via Teclado */ has-focus-visible:ring-ring has-focus-visible:ring-offset-background relative flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-sm border px-2 py-1 text-sm font-semibold transition-all select-none has-focus-visible:ring-2 has-focus-visible:ring-offset-2 ${
                            isSelected
                              ? `${style?.activeBorder ?? "border-primary"} ${style?.activeBg ?? "bg-primary/10"} ${style?.activeText ?? "text-primary"}`
                              : "text-muted-foreground hover:bg-muted/50 border-transparent"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`block h-2 w-2 rounded-full transition-colors ${
                              isSelected ? (style?.dot ?? "bg-primary") : "bg-muted-foreground/40"
                            }`}
                          />

                          <span>{item.label}</span>

                          <Input
                            type="radio"
                            id={inputId}
                            name={field.name}
                            value={item.value}
                            checked={isSelected}
                            onChange={() => field.onChange(item.value)}
                            className="sr-only"
                            aria-checked={isSelected}
                          />
                        </label>
                      );
                    })}
                  </div>

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="field-name" className="text-xs font-bold">
                    Nome / Descrição
                  </FieldLabel>
                  <Input id="field-name" placeholder="Digite a descrição" {...field} />

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="field-amount" className="text-xs font-bold">
                    Valor
                  </FieldLabel>
                  <InputMaskMoney
                    id="field-amount"
                    placeholder="R$ 0,00"
                    value={field.value ?? ""}
                    onValueChange={(values) => {
                      field.onChange(values.floatValue ?? 0);
                    }}
                    onBlur={field.onBlur}
                  />

                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />

          <div className="grid grid-cols-2 gap-2">
            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="w-full">
                  <FieldContent className="w-full">
                    <FieldLabel htmlFor="field-category" className="text-xs font-bold">
                      Categoria
                    </FieldLabel>

                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="field-category" className="w-full">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>

                      <SelectContent className="bg-background z-60 w-full">
                        <SelectGroup>
                          {TRANSACTION_CATEGORY_OPTIONS.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              name="paymentMethod"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="w-full">
                  <FieldContent className="w-full">
                    <FieldLabel htmlFor="field-payment-method" className="text-xs font-bold">
                      Método de Pagamento
                    </FieldLabel>

                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="field-payment-method" className="w-full">
                        <SelectValue placeholder="Selecione o método de pagamento" />
                      </SelectTrigger>

                      <SelectContent className="bg-background z-60 w-full">
                        <SelectGroup>
                          {PAYMENT_METHOD_OPTIONS.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />
          </div>

          <Controller
            name="date"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="z-60 w-full">
                <FieldContent className="z-60 w-full">
                  <FieldLabel htmlFor="field-date" className="text-xs font-bold">
                    Data da Transação
                  </FieldLabel>

                  <DatePicker date={field.value} onDateChange={field.onChange} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />

          <DialogFooter className="border-t py-6">
            <DialogClose asChild>
              <Button
                type="button"
                variant={"outline"}
                className="cursor-pointer rounded-md transition-colors duration-200"
              >
                Cancelar
              </Button>
            </DialogClose>

            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 cursor-pointer rounded-md transition-colors duration-200"
            >
              {!isUpdate && <PlusIcon size={14} className="-mr-1" />}
              {isUpdate ? "Editar" : "Adicionar"} Transação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertTransactionDialog;
