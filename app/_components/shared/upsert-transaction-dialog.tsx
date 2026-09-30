"use client";
import { useState } from "react";
import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { TransactionDTO } from "@/app/transactions/_columns";

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
      <DialogTrigger asChild></DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isUpdate ? "Editar" : "Adicionar"} Transação</DialogTitle>
          <DialogDescription>
            Insira os detalhes da transação que deseja {isUpdate ? "editar" : "adicionar"}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel htmlFor="field-name">Nome</FieldLabel>
                  <Input id="field-name" placeholder="Digite seu nome" {...field} />

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
                  <FieldLabel htmlFor="field-amount">Valor</FieldLabel>
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

          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="w-full">
                <FieldContent className="w-full">
                  <FieldLabel htmlFor="field-type">Tipo</FieldLabel>

                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="field-type" className="w-full">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>

                    <SelectContent className="bg-background z-60 w-full">
                      <SelectGroup>
                        {TRANSACTION_TYPE_OPTIONS.map((item) => (
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
            name="category"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="w-full">
                <FieldContent className="w-full">
                  <FieldLabel htmlFor="field-category">Categoria</FieldLabel>

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
                  <FieldLabel htmlFor="field-payment-method">Método de Pagamento</FieldLabel>

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

          <Controller
            name="date"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="bg-background z-60 w-full">
                <FieldContent className="bg-background z-60 w-full">
                  <FieldLabel htmlFor="field-date">Data</FieldLabel>

                  <DatePicker date={field.value} onDateChange={field.onChange} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                className="cursor-pointer bg-slate-200/20 transition-colors duration-200 hover:bg-slate-200/30"
              >
                Cancelar
              </Button>
            </DialogClose>

            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 cursor-pointer transition-colors duration-200"
            >
              {isUpdate ? "Editar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertTransactionDialog;
